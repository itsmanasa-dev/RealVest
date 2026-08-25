import streamlit as st
from app.translations import t
from src.ai.query_parser import parse_natural_language_query
from src.ai.recommendation_engine import recommend_properties
from src.models.predict import predict_property_price, predict_rent_price, get_price_model
from src.analytics.yield_calculator import calculate_rental_yield
from src.analytics.deal_classifier import classify_property_deal
from src.analytics.investment_scorer import calculate_investment_score
from src.analytics.decision_engine import generate_property_decision
from src.analytics.risk_radar import calculate_risk_radar
from src.utils.formatting import format_currency_lakhs, format_rent, format_percentage, format_number
from src.utils.validation import safe_float, safe_int
from src.utils.errors import handle_user_errors

@handle_user_errors("Unable to process AI advisor query. Please try again.")
def render_ai_advisor(lang='English'):
    st.markdown(f"""
    <div>
        <div class="page-head">AI Decision Advisor</div>
        <div class="page-subhead">Ask questions about property valuation, risks, rental returns, or specific Bengaluru localities in natural language. Answers are strictly grounded in RealVest's dataset and ML analytics.</div>
    </div>
    """, unsafe_allow_html=True)
    
    m_data = get_price_model()
    top_locations = m_data['top_locations']
    
    default_prompt = "Why is Whitefield a good buy for a 2 BHK under 80 lakhs?"
    
    user_query = st.text_input(
        "Ask AI Advisor a question",
        value=default_prompt,
        placeholder="e.g. Is 2 BHK in Sarjapur Road under 70 lakhs risky?"
    )
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    if st.button("Get AI Analysis →", use_container_width=True) or user_query:
        query_text = user_query if user_query else default_prompt
        filters = parse_natural_language_query(query_text)
        
        target_loc = filters['location'] if filters['location'] else 'Whitefield'
        target_bhk = filters['min_bhk'] if filters['min_bhk'] else 2
        target_price = filters['max_price'] if filters['max_price'] else 75.0
        
        # Grounded analytics call
        val_res = predict_property_price(target_loc, 1200.0, target_bhk)
        fair_val = val_res['estimated_price_lakhs']
        rent_res = predict_rent_price(target_loc, 1200.0, target_bhk)
        monthly_rent = rent_res['estimated_rent_monthly']
        yield_res = calculate_rental_yield(monthly_rent, target_price)
        
        dec_engine = generate_property_decision(
            target_price,
            fair_val,
            yield_res['rental_yield_pct'],
            location_used=target_loc
        )
        
        risk_radar = dec_engine['risk_radar']
        
        # Structure grounded answer
        answer_paragraphs = []
        answer_paragraphs.append(f"Based on RealVest's ML dataset for **{target_loc}** ({target_bhk} BHK baseline):")
        answer_paragraphs.append(f"• **ML Fair Value Estimate**: {format_currency_lakhs(fair_val)} (Asking benchmark: {format_currency_lakhs(target_price)}).")
        answer_paragraphs.append(f"• **Expected Monthly Rent**: {format_rent(monthly_rent)} (Rental Yield: {format_percentage(yield_res['rental_yield_pct'])}).")
        answer_paragraphs.append(f"• **Decision Verdict**: <b style='color:{dec_engine['color']};'>{dec_engine['decision']}</b> (Confidence: {dec_engine['confidence_pct']}%).")
        answer_paragraphs.append(f"• **Overall Risk Rating**: {risk_radar['overall_risk']} (Score: {risk_radar['risk_score']}/100).")
        
        st.markdown(f"""
        <div class="rv-card rv-card-winner">
            <div style="font-size: 13px; font-weight: 800; color: #1E40AF; text-transform: uppercase;">GROUNDED AI ADVISOR RESPONSE</div>
            <div style="font-size: 15px; color: #0F172A; margin-top: 10px; line-height: 1.6;">
                {"<br>".join(answer_paragraphs)}
            </div>
            
            <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #DBEAFE;">
                <b>Key Rationale & Risks:</b>
                <ul style="margin-top: 6px; padding-left: 20px; color: #334155;">
                    {"".join(f"<li>{r}</li>" for r in dec_engine['reasons'])}
                    {"".join(f"<li>{r}</li>" for r in dec_engine['risks'])}
                </ul>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # Matching listings search
        res = recommend_properties(query_text, top_n=3)
        recs = res.get('recommendations', [])
        
        st.markdown('<div class="section-head">TOP MATCHING MARKET LISTINGS</div>', unsafe_allow_html=True)
        
        if not recs:
            st.info("Insufficient data to determine specific individual property matches for this custom filter.")
        else:
            for idx, item in enumerate(recs):
                asking_val = safe_float(item.get('asking_price_lakhs', 0))
                fair_val_item = safe_float(item.get('fair_value_lakhs', 0))
                rent_val_item = safe_float(item.get('monthly_rent', 0))
                yield_val_item = safe_float(item.get('rental_yield_pct', 0))
                
                st.markdown(f"""
                <div class="rv-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                        <div style="font-size: 16px; font-weight: 800; color: #0F172A;">
                            #{idx+1}. {item.get('bhk', 2)} BHK in {item.get('location', '')} ({format_number(item.get('sqft', 0), decimals=0)} sqft)
                        </div>
                        <span class="badge badge-good">{item.get('deal_status', 'Fair Deal')}</span>
                    </div>
                    
                    <div style="margin-top: 12px; display: flex; gap: 24px; flex-wrap: wrap;">
                        <div><span style="color: #64748B; font-size: 11px;">ASKING:</span> <b>{format_currency_lakhs(asking_val)}</b></div>
                        <div><span style="color: #64748B; font-size: 11px;">FAIR VALUE:</span> <b>{format_currency_lakhs(fair_val_item)}</b></div>
                        <div><span style="color: #64748B; font-size: 11px;">RENT:</span> <b>{format_rent(rent_val_item)}</b></div>
                        <div><span style="color: #64748B; font-size: 11px;">YIELD:</span> <b>{format_percentage(yield_val_item)}</b></div>
                    </div>
                </div>
                """, unsafe_allow_html=True)
