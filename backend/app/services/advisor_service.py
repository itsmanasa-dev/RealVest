import os
import re
import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
import httpx

from backend.app.core.config import settings
from backend.app.models.property import PropertyModel
from backend.app.models.comparison import ComparisonModel

logger = logging.getLogger("advisor_service")

# Official System Instructions for RealVest Grok Advisor
REALVEST_SYSTEM_PROMPT = """You are RealVest Advisor, an AI-powered property and investment decision-support assistant focused strictly on Bengaluru real estate.

Your responsibilities:
- Help users understand Bengaluru property opportunities
- Explain property valuations and fair market estimates
- Explain rental yield and rental potential
- Explain investment suitability and risk factors
- Compare properties side-by-side
- Explain market trends across Bengaluru micro-markets (Whitefield, Sarjapur, Electronic City, Hebbal, Indiranagar, etc.)
- Help users understand buy-vs-rent decisions
- Help users evaluate options according to their budget and requirements

Strict Guidelines & Rules:
1. Never guarantee investment returns.
2. Never claim certainty about future property prices.
3. Never fabricate property information or listings.
4. Never fabricate ROI.
5. Never fabricate rental yields.
6. Never fabricate market statistics.
7. Never fabricate investment scores.
8. ALWAYS ground your answers in the supplied RealVest database context when provided.
9. Clearly distinguish RealVest empirical data from general real estate guidance.
10. If required data is unavailable in the context, explicitly state so.
11. Keep answers concise, clear, structured, and actionable using bullet points and markdown.
12. Ask brief follow-up questions when important user information (budget, goal, horizon) is missing.
13. NEVER mention internal implementation details such as MySQL, FastAPI, API endpoints, database schemas, Pydantic, SQLAlchemy, model filenames, or backend architecture.
14. Always present user-facing metrics as: "Property Analysis", "Market Data", "Investment Analysis", "Rental Potential", "Risk Factor", "Investment Fit", or "Recommendation".
"""

class AdvisorService:
    @classmethod
    def generate_reply(
        cls,
        db: Session,
        message: str,
        context: Optional[Dict[str, Any]] = None,
        history: Optional[List[Any]] = None
    ) -> Dict[str, Any]:
        msg_str = message.strip()
        msg_lower = msg_str.lower()
        context = context or {}
        history = history or []
        sources: List[str] = ["RealVest Bengaluru Housing Database"]
        context_used: Dict[str, Any] = {}

        # ----------------------------------------------------
        # 1. Retrieve Data Context from RealVest MySQL Database
        # ----------------------------------------------------
        db_context_text = ""

        # (A) Property Context
        property_obj = None
        prop_id = context.get("property_id") or context.get("id")
        if prop_id:
            try:
                property_obj = db.query(PropertyModel).filter(PropertyModel.id == prop_id).first()
            except Exception as e:
                logger.warning(f"Error querying property id {prop_id}: {e}")

        if not property_obj and any(k in msg_lower for k in ["this property", "current property", "why recommended", "is this property"]):
            try:
                property_obj = db.query(PropertyModel).order_by(PropertyModel.investment_score.desc()).first()
            except Exception as e:
                logger.warning(f"Error querying top property: {e}")

        if property_obj:
            sources.append(f"Property Analysis: {property_obj.title}")
            context_used["property"] = {
                "id": property_obj.id,
                "title": property_obj.title,
                "location": property_obj.location,
                "asking_price": property_obj.asking_price_lakhs,
                "fair_value": property_obj.fair_value_lakhs,
                "annual_yield": property_obj.annual_yield,
                "monthly_rent": property_obj.monthly_rent,
                "score": property_obj.investment_score,
                "recommendation": property_obj.recommendation
            }
            diff = property_obj.deal_diff_pct
            valuation_status = f"{abs(diff):.1f}% below fair value" if diff < 0 else (f"{diff:.1f}% above fair value" if diff > 0 else "At fair benchmark")
            db_context_text += (
                f"\n[ACTIVE PROPERTY CONTEXT]\n"
                f"Title: {property_obj.title}\n"
                f"Location: {property_obj.location}\n"
                f"Asking Price: ₹{property_obj.asking_price_lakhs:.1f} Lakhs\n"
                f"Estimated Fair Value: ₹{property_obj.fair_value_lakhs:.1f} Lakhs ({valuation_status})\n"
                f"Monthly Rent: ₹{int(property_obj.monthly_rent):,}\n"
                f"Gross Rental Yield: {property_obj.annual_yield:.2f}% p.a.\n"
                f"Investment Score: {property_obj.investment_score}/100 ({property_obj.recommendation})\n"
                f"Confidence Score: {property_obj.confidence_score}%\n"
                f"Key Reasons: {', '.join(property_obj.reasons or [])}\n"
                f"Key Risks: {', '.join(property_obj.risks or [])}\n"
            )

        # (B) Comparison Context
        comparison_obj = None
        cmp_id = context.get("comparison_id")
        if cmp_id:
            try:
                comparison_obj = db.query(ComparisonModel).filter(ComparisonModel.id == cmp_id).first()
            except Exception as e:
                logger.warning(f"Error querying comparison id {cmp_id}: {e}")

        if comparison_obj:
            sources.append(f"Saved Comparison ({comparison_obj.id})")
            context_used["comparison"] = {
                "id": comparison_obj.id,
                "title": comparison_obj.title,
                "top_pick": comparison_obj.top_pick,
                "recommendation": comparison_obj.recommendation
            }
            db_context_text += (
                f"\n[ACTIVE COMPARISON CONTEXT]\n"
                f"Comparison Scenario: {comparison_obj.title}\n"
                f"Top Pick: {comparison_obj.top_pick}\n"
                f"Recommendation Verdict: {comparison_obj.recommendation}\n"
                f"Decision Rationale: {', '.join(comparison_obj.reasoning or [])}\n"
            )

        # (C) Budget Query Data Retrieval
        nums = re.findall(r'(\d+(?:\.\d+)?)', msg_lower)
        is_budget = any(k in msg_lower for k in ["invest", "budget", "have ₹", "options for ₹", "under ₹", "within ₹", "lakh", "lakhs", "crore"])
        if is_budget and nums:
            try:
                val = float(nums[0])
                if "cr" in msg_lower or "crore" in msg_lower:
                    budget_val = val * 100.0
                elif "k" in msg_lower and val > 100:
                    budget_val = val / 100.0
                else:
                    budget_val = val

                matching = db.query(PropertyModel).filter(
                    PropertyModel.asking_price_lakhs <= budget_val * 1.25
                ).order_by(PropertyModel.investment_score.desc()).limit(3).all()

                if matching:
                    sources.append("Bengaluru Budget Matching Engine")
                    db_context_text += f"\n[BENCHMARK LISTINGS FOR BUDGET ~₹{budget_val:.0f} LAKHS]\n"
                    for p in matching:
                        db_context_text += (
                            f"• {p.title} ({p.location}): Asking ₹{p.asking_price_lakhs:.1f}L | "
                            f"Est. Value ₹{p.fair_value_lakhs:.1f}L | Rent ₹{int(p.monthly_rent):,}/mo | "
                            f"Yield {p.annual_yield:.2f}% | Score {p.investment_score}/100 ({p.recommendation})\n"
                        )
            except Exception as e:
                logger.warning(f"Error executing budget query: {e}")

        # (D) Micro-Market Data Retrieval
        localities_map = {
            "whitefield": "Whitefield",
            "electronic city": "Electronic City",
            "sarjapur": "Sarjapur Road",
            "hebbal": "Hebbal",
            "indiranagar": "Indiranagar",
            "hsr": "HSR Layout",
            "koramangala": "Koramangala",
            "bellandur": "Bellandur",
            "thanisandra": "Thanisandra",
            "yelahanka": "Yelahanka",
            "kanakpura": "Kanakapura Road"
        }
        for loc_key, loc_name in localities_map.items():
            if loc_key in msg_lower:
                try:
                    props = db.query(PropertyModel).filter(PropertyModel.location.ilike(f"%{loc_key}%")).all()
                    if props:
                        avg_p = sum(p.asking_price_lakhs for p in props) / len(props)
                        avg_y = sum(p.annual_yield for p in props) / len(props)
                        sources.append(f"{loc_name} Market Intelligence")
                        db_context_text += (
                            f"\n[{loc_name.upper()} MICRO-MARKET DATA]\n"
                            f"Average Benchmark Price: ~₹{avg_p:.1f} Lakhs\n"
                            f"Average Gross Yield: {avg_y:.2f}% p.a.\n"
                            f"Featured Properties: {', '.join(p.title for p in props[:2])}\n"
                        )
                except Exception as e:
                    logger.warning(f"Error querying location {loc_name}: {e}")
                break

        # ----------------------------------------------------
        # 2. Try Calling Official xAI Grok API (grok-4.6)
        # ----------------------------------------------------
        api_key = settings.XAI_API_KEY or os.getenv("XAI_API_KEY", "")
        grok_model = settings.GROK_MODEL or "grok-4.6"

        if api_key:
            grok_response = cls._call_grok_api(
                api_key=api_key,
                model=grok_model,
                user_message=msg_str,
                db_context=db_context_text,
                history=history
            )
            if grok_response:
                sources.append("xAI Grok Intelligence Engine")
                return {
                    "success": True,
                    "reply": grok_response,
                    "sources": list(dict.fromkeys(sources)),
                    "context_used": context_used
                }

        # ----------------------------------------------------
        # 3. Deterministic RealVest Fallback Engine
        # ----------------------------------------------------
        logger.info("Using RealVest deterministic data fallback engine.")
        fallback_reply = cls._generate_fallback_reply(
            db=db,
            msg_lower=msg_lower,
            property_obj=property_obj,
            comparison_obj=comparison_obj,
            sources=sources,
            context_used=context_used
        )
        return {
            "success": True,
            "reply": fallback_reply,
            "sources": list(dict.fromkeys(sources)),
            "context_used": context_used
        }

    @classmethod
    def _call_grok_api(
        cls,
        api_key: str,
        model: str,
        user_message: str,
        db_context: str,
        history: List[Any]
    ) -> Optional[str]:
        """Calls xAI Grok API using OpenAI SDK or httpx client."""
        # 1. Format conversation history
        messages_payload = [{"role": "system", "content": REALVEST_SYSTEM_PROMPT}]

        # Include up to 6 recent conversation history messages
        for item in history[-6:]:
            if isinstance(item, dict):
                role = item.get("role", "user")
                content = item.get("content", "")
            else:
                role = getattr(item, "role", "user")
                content = getattr(item, "content", "")

            if role in ["user", "assistant"] and content:
                messages_payload.append({"role": role, "content": content})

        # Final prompt with database context
        final_user_prompt = user_message
        if db_context.strip():
            final_user_prompt += f"\n\n--- REALVEST DATABASE CONTEXT ---\n{db_context.strip()}\n--- END CONTEXT ---"

        messages_payload.append({"role": "user", "content": final_user_prompt})

        # Try OpenAI SDK client
        try:
            from openai import OpenAI
            client = OpenAI(api_key=api_key, base_url="https://api.x.ai/v1")
            response = client.chat.completions.create(
                model=model,
                messages=messages_payload,
                temperature=0.3,
                max_tokens=650
            )
            if response.choices and response.choices[0].message.content:
                return response.choices[0].message.content.strip()
        except Exception as e:
            logger.warning(f"OpenAI SDK call to xAI failed: {e}. Trying direct HTTP request...")

        # Fallback to direct HTTP request with httpx
        try:
            url = "https://api.x.ai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": model,
                "messages": messages_payload,
                "temperature": 0.3,
                "max_tokens": 650
            }
            with httpx.Client(timeout=25.0) as http_client:
                res = http_client.post(url, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    return data["choices"][0]["message"]["content"].strip()
                else:
                    logger.error(f"xAI API returned status {res.status_code}: {res.text}")
        except Exception as e:
            logger.error(f"HTTP call to xAI API failed: {e}")

        return None

    @classmethod
    def _generate_fallback_reply(
        cls,
        db: Session,
        msg_lower: str,
        property_obj: Optional[PropertyModel],
        comparison_obj: Optional[ComparisonModel],
        sources: List[str],
        context_used: Dict[str, Any]
    ) -> str:
        """Deterministic data-grounded answers for Bengaluru real estate questions."""
        # 1. Comparison context questions
        if comparison_obj and any(k in msg_lower for k in ["why did", "winner", "top pick", "recommend", "compare"]):
            reply = (
                f"In your saved scenario **'{comparison_obj.title}'**, RealVest selected **{comparison_obj.top_pick}** as the top pick.\n\n"
                f"**Key Decision Rationale:**\n"
            )
            for r in (comparison_obj.reasoning or [])[:3]:
                reply += f"• {r}\n"
            reply += f"\n**Verdict:** {comparison_obj.recommendation}\n"
            return reply

        # 2. Property context / Why recommended
        if property_obj and any(k in msg_lower for k in ["why", "recommended", "this property", "fair value", "buy", "good"]):
            diff = property_obj.deal_diff_pct
            deal_desc = f"{abs(diff):.1f}% below fair value" if diff < 0 else (f"{diff:.1f}% above fair value" if diff > 0 else "At fair benchmark")
            reasons = property_obj.reasons or [
                f"High rental demand in {property_obj.location} IT corridor.",
                f"Gross yield of {property_obj.annual_yield:.2f}% p.a."
            ]
            risks = property_obj.risks or ["Minimum 3-5 year holding horizon recommended."]
            reply = (
                f"**{property_obj.title}** ({property_obj.location})\n\n"
                f"• **Asking Price:** ₹{property_obj.asking_price_lakhs:.1f} Lakhs\n"
                f"• **Estimated Value:** ₹{property_obj.fair_value_lakhs:.1f} Lakhs ({deal_desc})\n"
                f"• **Expected Rent:** ₹{int(property_obj.monthly_rent):,}/mo ({property_obj.annual_yield:.2f}% yield)\n"
                f"• **Investment Score:** {property_obj.investment_score}/100 (**{property_obj.recommendation}**)\n\n"
                f"**Why Recommended:**\n"
            )
            for r in reasons[:3]:
                reply += f"• {r}\n"
            reply += "\n**Key Risks:**\n"
            for rk in risks[:2]:
                reply += f"• {rk}\n"
            return reply

        # 3. What is RealVest?
        if any(k in msg_lower for k in ["what is realvest", "about realvest"]):
            sources.append("RealVest Architecture Overview")
            return (
                "**RealVest** is an AI-powered property and investment decision-support platform designed specifically for Bengaluru real estate.\n\n"
                "**Core Capabilities:**\n"
                "• **Data-Grounded Fair Valuation:** Calculates fair market value and discount buffers for property listings.\n"
                "• **Rental Yield Analysis:** Models monthly rental potential and gross yield across IT corridors.\n"
                "• **Investment Scoring:** Rates properties out of 100 based on price, yield, liquidity, and location risks.\n"
                "• **Side-by-Side Comparison:** Ranks multiple properties side-by-side to determine the optimal buy."
            )

        # 4. How does RealVest work?
        if any(k in msg_lower for k in ["how does realvest work", "how it works"]):
            sources.append("RealVest Engine Documentation")
            return (
                "**How RealVest Works:**\n\n"
                "• **1. Market Data Aggregation:** RealVest ingests localized Bengaluru housing and rental metrics.\n"
                "• **2. ML Valuation Engine:** Analyzes price-per-sqft benchmarks, historical growth rates, and society amenities to project fair estimated value.\n"
                "• **3. Decision Analysis:** Evaluates gross rental yield, holding horizon risks, and down payment scenarios.\n"
                "• **4. AI Advisor:** Grounded strictly in RealVest's dataset to answer questions, recommend micro-markets, and analyze property scenarios."
            )

        # 5. Buy vs Rent
        if any(k in msg_lower for k in ["buy vs rent", "buy or rent", "should i buy", "should i rent"]):
            sources.append("RealVest Buy vs Rent Decision Framework")
            return (
                "**Buy vs. Rent Analysis for Bengaluru:**\n\n"
                "**When Buying Makes Sense:**\n"
                "• **Holding Horizon > 5 Years:** Amortizes Karnataka's 6.6% stamp duty/registration and brokerage.\n"
                "• **Capital Growth Corridors:** Whitefield, Sarjapur Road, and Hebbal where appreciation historically outperforms inflation.\n"
                "• **Tax Efficiency:** Build equity while claiming deductions under Sec 24 & 80C.\n\n"
                "**When Renting Makes Sense:**\n"
                "• **Short Horizon (<3 Years):** Frequent job relocations between distant IT parks.\n"
                "• **High EMI relative to Rent:** When home loan interest (~8.5%) substantially exceeds gross rental yield (~3.8%–5.5%)."
            )

        # 6. Biggest Risks
        if any(k in msg_lower for k in ["risks", "drawbacks", "downside"]):
            sources.append("RealVest Risk Radar")
            return (
                "**Key Real Estate Investment Risks in Bengaluru:**\n\n"
                "• **1. Valuation Premium:** Purchasing significantly above sub-market benchmark value.\n"
                "• **2. Rental Occupancy & Vacancy:** IT corridor employment shifts affecting tenant retention.\n"
                "• **3. Liquidity Horizon:** Real estate requires 3–5 years to absorb 6.6% transaction stamp duties.\n"
                "• **4. Infrastructure Timelines:** Civic water tanker dependence or metro construction delays in peripheral suburbs.\n"
                "• **5. Floating Interest Rates:** Interest rate spikes (~8.5% p.a.) reducing net rental yield."
            )

        # 7. Explanation of Rental Yield
        if any(k in msg_lower for k in ["rental yield", "explain rental yield", "calculate rental yield"]):
            sources.append("RealVest Financial Metrics")
            return (
                "**Rental Yield Explanation:**\n\n"
                "**Gross Rental Yield** measures annual rental income relative to total property purchase price.\n\n"
                "**Formula:**\n"
                "$$\\text{Gross Rental Yield (\\%)} = \\frac{\\text{Annual Rental Income}}{\\text{Total Property Price}} \\times 100$$\n\n"
                "**Example:**\n"
                "• Property Price: ₹60 Lakhs\n"
                "• Monthly Rent: ₹25,000 (Annual: ₹3.0 Lakhs)\n"
                "• Gross Yield: $$\\frac{3.0}{60} \\times 100 = 5.0\\%\\ \\text{p.a.}$$"
            )

        # 8. Budget / Locality fallback
        nums = re.findall(r'(\d+(?:\.\d+)?)', msg_lower)
        if nums:
            val = float(nums[0])
            budget_val = val * 100.0 if ("cr" in msg_lower or "crore" in msg_lower) else val
            sources.append("Bengaluru Market Budget Guide")
            return (
                f"**Investment Options for a Budget of ~₹{budget_val:.0f} Lakhs:**\n\n"
                f"• **Recommended Micro-Markets:** Electronic City (High Yield), Sarjapur Road (Growth), Whitefield (Established IT Hub).\n"
                f"• **Target Property Profile:** 2 BHK configurations with high tenant demand.\n"
                f"• **Strategy:** Seek ready-to-move units with a minimum 3-5 year investment horizon to maximize net appreciation."
            )

        # 9. Default Fallback
        return (
            "I am your **RealVest AI Property & Investment Assistant**.\n\n"
            "**Questions you can ask:**\n"
            "• *\"Where should I invest ₹50L in Bengaluru?\"*\n"
            "• *\"Is Whitefield good for rental income?\"*\n"
            "• *\"Should I buy or rent?\"*\n"
            "• *\"What is rental yield and how is it calculated?\"*\n"
            "• *\"What are the main risks of buying property?\"*"
        )

advisor_service = AdvisorService()
