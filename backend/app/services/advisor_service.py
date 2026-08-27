import os
import re
import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from backend.app.models.property import PropertyModel
from backend.app.models.comparison import ComparisonModel
from backend.app.services.prediction_service import prediction_service

logger = logging.getLogger("advisor_service")

class AdvisorService:
    @classmethod
    def generate_reply(cls, db: Session, message: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        msg = message.strip().lower()
        context = context or {}
        sources: List[str] = ["RealVest Bengaluru Housing Dataset"]
        context_used: Dict[str, Any] = {}

        # 1. Check if comparison context was passed
        comparison_obj = None
        if "comparison_id" in context:
            cmp_id = context["comparison_id"]
            comparison_obj = db.query(ComparisonModel).filter(ComparisonModel.id == cmp_id).first()
            if comparison_obj:
                sources.append(f"MySQL Comparison ({comparison_obj.id})")
                context_used["comparison"] = {
                    "id": comparison_obj.id,
                    "title": comparison_obj.title,
                    "top_pick": comparison_obj.top_pick,
                    "recommendation": comparison_obj.recommendation
                }

        # 2. Check if selected property context was passed
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

        # 3. Handle specific contextual queries
        # (A) Comparison context questions
        if comparison_obj and any(k in msg for k in ["why did", "winner", "top pick", "recommend", "compare"]):
            reply = (
                f"In your saved scenario **'{comparison_obj.title}'**, RealVest selected **{comparison_obj.top_pick}** as the top pick.\n\n"
                f"**Why:**\n"
            )
            for r in (comparison_obj.reasoning or [])[:3]:
                reply += f"• {r}\n"
            reply += f"\n**Verdict:** {comparison_obj.recommendation}"
            return {"reply": reply, "sources": sources, "context_used": context_used}

        # (B) Property-specific analysis questions
        if property_obj and any(k in msg for k in ["is this", "worth", "buy", "risk", "fair value", "rent"]):
            diff = property_obj.deal_diff_pct
            deal_desc = f"{abs(diff):.1f}% below ML fair value" if diff < 0 else (f"{diff:.1f}% above ML fair value" if diff > 0 else "at fair market value")
            
            reply = (
                f"**{property_obj.title}** ({property_obj.location}) analysis:\n\n"
                f"• **Asking Price:** ₹{property_obj.asking_price_lakhs:.1f} Lakhs\n"
                f"• **ML Fair Value:** ₹{property_obj.fair_value_lakhs:.1f} Lakhs ({deal_desc})\n"
                f"• **Expected Rent:** ₹{int(property_obj.monthly_rent):,}/month ({property_obj.annual_yield:.2f}% gross yield)\n"
                f"• **Investment Score:** {property_obj.investment_score}/100 — **{property_obj.recommendation}**\n\n"
            )
            if "risk" in msg:
                reply += "**Key Considerations & Risks:**\n"
                for risk_item in (property_obj.risks or ["Liquidity depends on holding horizon of 3+ years."])[:2]:
                    reply += f"• {risk_item}\n"
            else:
                reply += f"**Verdict:** Priced {deal_desc} with a {property_obj.confidence_score}% model confidence score."
            
            return {"reply": reply, "sources": sources, "context_used": context_used}

        # (C) "Buy vs Rent"
        if "buy vs rent" in msg or "buy or rent" in msg or "rent vs buy" in msg:
            reply = (
                "Deciding between buying and renting in Bengaluru depends on your investment horizon and capital cost:\n\n"
                "**Buy if:**\n"
                "• Your investment horizon is **5+ years** (offsets Karnataka 6.6% stamp duty/registration).\n"
                "• You want capital appreciation in high-growth corridors (e.g. Whitefield, Sarjapur, Hebbal).\n"
                "• Your expected rental yield + capital growth exceeds home loan interest (~8.5%).\n\n"
                "**Rent if:**\n"
                "• Horizon is less than 3 years.\n"
                "• High mobility is required across tech corridors.\n"
                "• Current rental yields in prime societies are ~3.8%–5.5%, allowing surplus capital to generate higher financial market returns."
            )
            return {"reply": reply, "sources": sources, "context_used": context_used}

        # (D) Locality-specific: Whitefield
        if "whitefield" in msg:
            # Query dataset stats for Whitefield
            props = db.query(PropertyModel).filter(PropertyModel.location.ilike("%whitefield%")).all()
            avg_price = round(sum(p.asking_price_lakhs for p in props) / len(props), 1) if props else 62.5
            avg_yield = round(sum(p.annualYield if hasattr(p, 'annualYield') else p.annual_yield for p in props) / len(props), 2) if props else 5.2

            reply = (
                f"Whitefield is one of Bengaluru's most resilient investment corridors, offering an average gross rental yield of **{avg_yield}% p.a.**\n\n"
                "**Why:**\n"
                "• High tech workforce density (ITPL, EPIP zone, Kadugodi).\n"
                "• Metro Purple Line connectivity has significantly stabilized rental occupancy.\n"
                "• Strong tenant pool for 2 & 3 BHK configurations.\n\n"
                "**Considerations:**\n"
                "• Older developments may have slower appreciation compared to Peripheral Ring Road expansions.\n"
                f"• Average benchmark entry: ~₹{avg_price} Lakhs.\n\n"
                "Tell me your budget and holding period if you'd like matched properties in Whitefield."
            )
            sources.append("Whitefield Dataset Analysis")
            return {"reply": reply, "sources": sources, "context_used": context_used}

        # (E) Locality comparison: Whitefield vs Electronic City
        if "electronic city" in msg and ("whitefield" in msg or "compare" in msg):
            reply = (
                "**Whitefield vs Electronic City Comparison:**\n\n"
                "• **Whitefield:** Higher capital appreciation potential, premium residential amenities, and higher average ticket sizes (~₹60L–₹1.2Cr).\n"
                "• **Electronic City:** Lower entry threshold (~₹30L–₹55L), strong rental yield (~5.6%–6.4%), and continuous entry-level tech worker tenant demand.\n\n"
                "**Recommendation:**\n"
                "• Choose **Whitefield** for long-term capital wealth.\n"
                "• Choose **Electronic City** for immediate cash-flow yield and lower budget entry."
            )
            return {"reply": reply, "sources": sources, "context_used": context_used}

        # (F) Budget queries: e.g. "What can I buy with ₹50 lakh?"
        budget_match = re.search(r'(\d+)\s*(?:lakh|lakhs|l|lac|cr|crore)', msg)
        if budget_match or "budget" in msg or "50" in msg:
            budget_val = 50.0
            if budget_match:
                val = float(budget_match.group(1))
                if "cr" in msg or "crore" in msg:
                    budget_val = val * 100.0
                else:
                    budget_val = val

            matching = db.query(PropertyModel).filter(
                PropertyModel.asking_price_lakhs <= budget_val * 1.15
            ).order_by(PropertyModel.investment_score.desc()).limit(3).all()

            if matching:
                reply = f"With a budget of **₹{budget_val:.0f} Lakhs**, here are top-ranked options from our Bengaluru dataset:\n\n"
                for p in matching:
                    reply += f"• **{p.title}** ({p.location}) — ₹{p.asking_price_lakhs:.1f}L | Yield: {p.annual_yield}% | Score: {p.investment_score}/100\n"
                reply += "\nWould you like to compare these in the Compare tab or check their detailed cash flow analysis?"
            else:
                reply = f"For a budget of ₹{budget_val:.0f} Lakhs, consider micro-markets like Electronic City, Chandapura, or Sarjapur Road for optimal entry price and rental yield."
            return {"reply": reply, "sources": sources, "context_used": context_used}

        # (G) "Which area is good for investment?"
        if any(k in msg for k in ["which area", "where to invest", "best area", "good for investment"]):
            reply = (
                "Based on Bengaluru municipal growth and rental transaction data, top corridors by investment goal:\n\n"
                "• **Capital Growth:** Hebbal, North Bengaluru (Yelahanka / Airport corridor), Whitefield extensions.\n"
                "• **Rental Yield:** Electronic City (5.6%–6.4%), Sarjapur Road (5.2%–5.8%), Bellandur.\n"
                "• **Balanced Wealth:** Indiranagar / Koramangala (High liquidity & low downside risk).\n\n"
                "What is your target budget and investment horizon (e.g. 3-5 years)?"
            )
            return {"reply": reply, "sources": sources, "context_used": context_used}

        # (H) Default helpful response
        reply = (
            "I can help you evaluate properties, analyze market valuations, or compare investments in Bengaluru.\n\n"
            "**You can ask me about:**\n"
            "• Locality investment potential (e.g. *'Is Whitefield good for rental income?'*)\n"
            "• Budget exploration (e.g. *'What can I buy with ₹50 lakh?'*)\n"
            "• Buy vs Rent strategies (*'Should I buy or rent in Bengaluru?'*)\n"
            "• Property valuation & risk breakdown for any listed asset."
        )
        return {"reply": reply, "sources": sources, "context_used": context_used}

advisor_service = AdvisorService()
