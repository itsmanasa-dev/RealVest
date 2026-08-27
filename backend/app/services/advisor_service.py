import os
import re
import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from backend.app.models.property import PropertyModel
from backend.app.models.comparison import ComparisonModel

logger = logging.getLogger("advisor_service")

class AdvisorService:
    @classmethod
    def generate_reply(cls, db: Session, message: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        msg = message.strip().lower()
        context = context or {}
        sources: List[str] = ["RealVest Bengaluru Housing Database"]
        context_used: Dict[str, Any] = {}

        # 1. Fetch comparison context if passed
        comparison_obj = None
        if "comparison_id" in context:
            cmp_id = context["comparison_id"]
            comparison_obj = db.query(ComparisonModel).filter(ComparisonModel.id == cmp_id).first()
            if comparison_obj:
                sources.append(f"Saved Comparison ({comparison_obj.id})")
                context_used["comparison"] = {
                    "id": comparison_obj.id,
                    "title": comparison_obj.title,
                    "top_pick": comparison_obj.top_pick,
                    "recommendation": comparison_obj.recommendation
                }

        # 2. Fetch property context if passed
        property_obj = None
        prop_id = context.get("property_id") or context.get("id")
        if prop_id:
            property_obj = db.query(PropertyModel).filter(PropertyModel.id == prop_id).first()
            if property_obj:
                sources.append(f"Property Analysis: {property_obj.title}")
                context_used["property"] = {
                    "id": property_obj.id,
                    "title": property_obj.title,
                    "location": property_obj.location,
                    "asking_price": property_obj.asking_price_lakhs,
                    "fair_value": property_obj.fair_value_lakhs,
                    "annual_yield": property_obj.annual_yield,
                    "score": property_obj.investment_score
                }

        # 3. Intent Routing & Response Generation

        # (A) Specific Comparison Context Questions
        if comparison_obj and any(k in msg for k in ["why did", "winner", "top pick", "recommend", "compare"]):
            reply = (
                f"In your saved scenario **'{comparison_obj.title}'**, RealVest selected **{comparison_obj.top_pick}** as the top pick.\n\n"
                f"**Key Decision Rationale:**\n"
            )
            for r in (comparison_obj.reasoning or [])[:3]:
                reply += f"• {r}\n"
            reply += f"\n**Verdict:** {comparison_obj.recommendation}\n"
            reply += "\n*Note: RealVest provides data-grounded decision support based on Bengaluru market records.*"
            return {"reply": reply, "sources": sources, "context_used": context_used}

        # (B) "Why was this property recommended?" / Property Details
        is_prop_query = any(k in msg for k in [
            "why was this property recommended", "why recommended", "why this property",
            "is this property good", "tell me about this property", "worth buying", "property analysis"
        ])
        if is_prop_query or (property_obj and any(k in msg for k in ["is this", "worth", "buy", "fair value", "rent", "why"])):
            target_prop = property_obj
            if not target_prop:
                # Pick top-ranked property from database
                target_prop = db.query(PropertyModel).order_by(PropertyModel.investment_score.desc()).first()

            if target_prop:
                sources.append(f"Property Intelligence: {target_prop.title}")
                diff = target_prop.deal_diff_pct
                if diff < 0:
                    deal_desc = f"{abs(diff):.1f}% below estimated fair value (Discount buffer)"
                elif diff > 0:
                    deal_desc = f"{diff:.1f}% above estimated fair value (Premium)"
                else:
                    deal_desc = "At fair market benchmark"

                reasons_list = target_prop.reasons or [
                    f"Strong rental demand in {target_prop.location} IT corridor.",
                    f"Solid gross rental yield of {target_prop.annual_yield:.2f}% p.a.",
                    f"High transaction volume with {target_prop.confidence_score}% data confidence."
                ]
                risks_list = target_prop.risks or [
                    "Capital growth requires a minimum recommended holding period of 3–5 years.",
                    "Tenant occupancy depends on IT corridor employment momentum."
                ]

                reply = (
                    f"**{target_prop.title}** ({target_prop.location})\n\n"
                    f"• **Asking Price:** ₹{target_prop.asking_price_lakhs:.1f} Lakhs\n"
                    f"• **Estimated Value:** ₹{target_prop.fair_value_lakhs:.1f} Lakhs ({deal_desc})\n"
                    f"• **Expected Rent:** ₹{int(target_prop.monthly_rent):,}/month ({target_prop.annual_yield:.2f}% gross yield)\n"
                    f"• **Investment Score:** {target_prop.investment_score}/100 — **{target_prop.recommendation}** ({target_prop.confidence_score}% Confidence)\n\n"
                    f"**Why Recommended:**\n"
                )
                for r in reasons_list[:3]:
                    reply += f"• {r}\n"
                reply += "\n**Key Risk Factors to Monitor:**\n"
                for rk in risks_list[:2]:
                    reply += f"• {rk}\n"
                reply += "\n*Note: RealVest recommendations are decision support based on empirical market data, not guaranteed returns.*"
                return {"reply": reply, "sources": sources, "context_used": context_used}

        # (C) "What are the biggest risks?" / Risk Analysis
        if any(k in msg for k in ["biggest risks", "what are the risks", "risks", "risk factors", "downside", "drawbacks"]):
            if property_obj and property_obj.risks:
                reply = (
                    f"**Key Risk Factors for {property_obj.title} ({property_obj.location}):**\n\n"
                )
                for rk in property_obj.risks:
                    reply += f"• {rk}\n"
                reply += (
                    f"\n**General Bengaluru Real Estate Risk Dimensions:**\n"
                    f"• **Valuation Risk:** Avoid buying at steep premiums relative to sub-market benchmarks.\n"
                    f"• **Liquidity Horizon:** Real estate requires a 3–5 year investment horizon to absorb transaction costs.\n"
                    f"• **Interest Rate Sensitivity:** Floating-rate home loans (~8.5% p.a.) directly impact net yield."
                )
            else:
                reply = (
                    "**The 5 Biggest Real Estate Risks in Bengaluru:**\n\n"
                    "• **1. Valuation & Premium Risk:** Buying above the sub-market benchmark reduces downside cushion. RealVest calculates the estimated fair value to verify whether you have a discount buffer.\n"
                    "• **2. Rental Yield & Vacancy Risk:** Tech corridor tenant turnover and vacancy periods can depress net cash flows below expectations.\n"
                    "• **3. Liquidity & Holding Period Risk:** Real estate is an illiquid asset. A minimum 3–5 year holding period is recommended to amortize Karnataka's 6.6% stamp duty/registration fees.\n"
                    "• **4. Infrastructure & Civic Amenities:** Suburbs in peripheral Bengaluru may face delayed transit timelines or private water tanker reliance.\n"
                    "• **5. Interest Rate Volatility:** Fluctuations in floating-rate home loans (~8.5%) can erode monthly rental cash flows.\n\n"
                    "*Tip: You can stress-test these variables directly in the Decision Simulator tab.*"
                )
            sources.append("RealVest Risk Radar Framework")
            return {"reply": reply, "sources": sources, "context_used": context_used}

        # (D) "Buy vs Rent"
        if any(k in msg for k in ["buy vs rent", "buy or rent", "rent vs buy", "should i buy", "should i rent", "is it better to buy"]):
            reply = (
                "**Buy vs. Rent Decision Analysis for Bengaluru:**\n\n"
                "**When Buying Makes Sense:**\n"
                "• **Holding Horizon of 5+ Years:** Amortizes the Karnataka 6.6% stamp duty/registration and brokerage fees.\n"
                "• **Capital Appreciation Corridors:** High-growth sub-markets (e.g. Whitefield, Sarjapur Road, Hebbal) where capital growth historically outperforms inflation.\n"
                "• **Equity Accumulation:** Converting monthly housing expenditure into asset equity with tax deductions under Sec 24 & 80C.\n\n"
                "**When Renting Makes Sense:**\n"
                "• **Horizon Under 3 Years:** High job or location mobility across distant IT hubs (e.g. Electronic City vs Manyata).\n"
                "• **Low Rental Yield Entry:** Premium residential properties offer ~3.8%–5.5% rental yield, allowing surplus capital to remain invested in liquid financial assets.\n"
                "• **High Interest Rate Climate:** If home loan interest (~8.5%) substantially exceeds net rental yield.\n\n"
                "*Tip: You can model your exact down payment, loan EMI, and 5-year ROI in the **Decision Simulator** tab.*"
            )
            sources.append("RealVest Buy vs Rent Decision Matrix")
            return {"reply": reply, "sources": sources, "context_used": context_used}

        # (E) Budget Exploration Queries (e.g. "Where should I invest ₹50L?", "I have ₹30L, what can I do?", "budget 50 lakh")
        budget_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|l|lac|cr|crore|k|thousand)?', msg)
        is_budget_query = any(k in msg for k in ["where should i invest", "what can i do", "what can i buy", "budget", "invest ₹", "have ₹", "options for ₹", "under ₹", "within ₹"])
        
        if is_budget_query or ("invest" in msg and any(c.isdigit() for c in msg)):
            budget_val = 50.0
            # Extract number
            nums = re.findall(r'(\d+(?:\.\d+)?)', msg)
            if nums:
                val = float(nums[0])
                if "cr" in msg or "crore" in msg:
                    budget_val = val * 100.0
                elif "k" in msg and val > 100:
                    budget_val = val / 100.0
                else:
                    budget_val = val

            matching = db.query(PropertyModel).filter(
                PropertyModel.asking_price_lakhs <= budget_val * 1.25
            ).order_by(PropertyModel.investment_score.desc()).limit(3).all()

            if not matching:
                matching = db.query(PropertyModel).order_by(PropertyModel.asking_price_lakhs.asc()).limit(3).all()

            reply = (
                f"**Investment Options for a Budget of ₹{budget_val:.0f} Lakhs in Bengaluru:**\n\n"
                f"**1. Recommended Micro-Markets:**\n"
            )
            if budget_val <= 40:
                reply += "• **Electronic City & Chandapura:** Best entry point for high rental yield (5.6%–6.4%) and tech worker tenant demand.\n"
            elif budget_val <= 75:
                reply += "• **Whitefield & Sarjapur Road:** Balanced mix of steady capital appreciation (+12% YoY) and solid rental demand (5.0%–5.5% yield).\n"
            else:
                reply += "• **Hebbal & Indiranagar:** Premium residential corridors with institutional liquidity and low downside risk.\n"

            reply += "\n**2. Top Matching Properties from Bengaluru Dataset:**\n"
            for p in matching:
                reply += f"• **{p.title}** ({p.location}) — Asking: ₹{p.asking_price_lakhs:.1f}L | Est. Value: ₹{p.fair_value_lakhs:.1f}L | Rent: ₹{int(p.monthly_rent):,}/mo (Yield: {p.annual_yield}%) | Score: {p.investment_score}/100 (**{p.recommendation}**)\n"

            reply += (
                f"\n**3. Strategy Recommendation:**\n"
                f"• Focus on 2 BHK configurations with Ready-to-Move status for immediate rental cash flow.\n"
                f"• Target a minimum holding period of 3–5 years.\n\n"
                f"*Note: RealVest recommendations are data-grounded decision support based on Bengaluru market records, not guaranteed financial advice.*"
            )
            sources.append("Bengaluru Market Budget Analysis")
            return {"reply": reply, "sources": sources, "context_used": context_used}

        # (F) Locality-Specific Questions (Whitefield, Sarjapur, Electronic City, Indiranagar, etc.)
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

        matched_loc_key = None
        for key in localities_map:
            if key in msg:
                matched_loc_key = key
                break

        if matched_loc_key:
            loc_name = localities_map[matched_loc_key]
            props = db.query(PropertyModel).filter(PropertyModel.location.ilike(f"%{matched_loc_key}%")).all()
            if not props:
                props = db.query(PropertyModel).all()

            avg_price = round(sum(p.asking_price_lakhs for p in props) / len(props), 1) if props else 65.0
            avg_yield = round(sum(p.annual_yield for p in props) / len(props), 2) if props else 5.2

            reply = (
                f"**{loc_name} Investment & Rental Market Analysis:**\n\n"
                f"• **Average Benchmark Price:** ~₹{avg_price:.1f} Lakhs\n"
                f"• **Average Gross Rental Yield:** **{avg_yield:.2f}% p.a.** (vs Bengaluru median of 4.1%)\n"
                f"• **Tenant Profile:** High-density IT/tech professionals seeking 2 BHK & 3 BHK units.\n\n"
                f"**Key Growth Drivers:**\n"
                f"• High employment density with major tech parks and commercial campuses.\n"
                f"• Metro and arterial road connectivity ensuring high occupancy rates.\n\n"
                f"**Considerations & Risks:**\n"
                f"• Traffic congestion during peak hours along main arterial routes.\n"
                f"• Premium asking prices in prime societies require careful valuation verification.\n\n"
                f"**Top Listings in this Corridor:**\n"
            )
            for p in props[:2]:
                reply += f"• **{p.title}** — ₹{p.asking_price_lakhs:.1f}L (Yield: {p.annual_yield}%, Score: {p.investment_score}/100)\n"

            reply += "\n*Note: RealVest recommendations are decision support based on empirical market records.*"
            sources.append(f"{loc_name} Market Intelligence")
            return {"reply": reply, "sources": sources, "context_used": context_used}

        # (G) Options for Rental Income / High Yield Queries
        if any(k in msg for k in ["rental income", "options for rental", "high yield", "cash flow", "rental options", "best rent"]):
            top_yield_props = db.query(PropertyModel).order_by(PropertyModel.annual_yield.desc()).limit(3).all()
            reply = (
                "**Top Rental Income & High-Yield Property Options in Bengaluru:**\n\n"
            )
            for p in top_yield_props:
                reply += (
                    f"• **{p.title}** ({p.location})\n"
                    f"  - **Asking Price:** ₹{p.asking_price_lakhs:.1f} Lakhs | **Expected Rent:** ₹{int(p.monthly_rent):,}/mo\n"
                    f"  - **Rental Yield:** **{p.annual_yield:.2f}% p.a.** | **Score:** {p.investment_score}/100 (**{p.recommendation}**)\n"
                )
            reply += (
                "\n**Key Takeaways for Rental Investors:**\n"
                "• Proximity to Outer Ring Road and Electronic City tech campuses generates maximum tenant velocity.\n"
                "• 2 BHK configurations yield the highest rent-to-price ratio in the current Bengaluru market.\n\n"
                "*Tip: You can compare these properties side-by-side in the Compare tab.*"
            )
            sources.append("Rental Yield Intelligence Engine")
            return {"reply": reply, "sources": sources, "context_used": context_used}

        # (H) "What areas are good for investment?" / General Area Recommendations
        if any(k in msg for k in ["what areas", "which area", "where to invest", "best area", "good for investment", "corridors"]):
            reply = (
                "**Top Bengaluru Investment Corridors by Goal:**\n\n"
                "• **1. High Rental Yield:**\n"
                "  - **Electronic City & Sarjapur Road:** Gross yields of **5.2%–6.4% p.a.** driven by continuous tech employee occupancy.\n"
                "• **2. High Capital Appreciation:**\n"
                "  - **Hebbal & North Bengaluru (Airport Corridor):** Rapid commercial and transit infrastructure expansion.\n"
                "  - **Whitefield & ORR:** Steady appreciation (+12% YoY) supported by the Purple Line Metro.\n"
                "• **3. Capital Preservation & Liquidity:**\n"
                "  - **Indiranagar & Koramangala:** Established central micro-markets with high resale liquidity and minimal downside volatility.\n\n"
                "Tell me your budget (e.g. *'Where to invest ₹60 lakh?'*) to see personalized property recommendations."
            )
            sources.append("Bengaluru Sub-Market Overview")
            return {"reply": reply, "sources": sources, "context_used": context_used}

        # (I) Default Helpful Response
        reply = (
            "I can help you evaluate properties, compare investment options, and assess market valuations in Bengaluru.\n\n"
            "**Common Questions You Can Ask:**\n"
            "• **Budget Exploration:** *\"Where should I invest ₹50L?\"* or *\"I have ₹30L, what can I do?\"*\n"
            "• **Locality Potential:** *\"Is Whitefield good for rental income?\"* or *\"What about Sarjapur Road?\"*\n"
            "• **Strategy:** *\"Buy vs rent?\"* or *\"Show me options for rental income.\"*\n"
            "• **Risk Analysis:** *\"What are the biggest risks?\"* or *\"Why was this property recommended?\"*\n\n"
            "*RealVest analysis is data-grounded and based on actual Bengaluru housing and rental records.*"
        )
        return {"reply": reply, "sources": sources, "context_used": context_used}

advisor_service = AdvisorService()
