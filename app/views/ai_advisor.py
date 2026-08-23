import streamlit as st
from app.translations import get_text
from src.ai.recommendation_engine import recommend_properties

def render_ai_advisor(lang='English'):
    st.markdown(f"""
    <div style="margin-bottom: 24px;">
        <h2 style="font-size: 26px; font-weight: 700; color: #F8FAFC;">{get_text('nav_advisor', lang)}</h2>
        <p style="color: #94A3B8; font-size: 14px;">Ask REALVEST AI in plain natural language. The system translates your prompt into structured filters and ranks real verified dataset properties using trained ML models.</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Pre-built quick queries
    st.markdown("<b>Quick Preset Prompts:</b>", unsafe_allow_html=True)
    preset_col1, preset_col2, preset_col3 = st.columns(3)
    
    selected_query = None
    with preset_col1:
        if st.button("2 BHK under 60 lakh in Whitefield"):
            selected_query = "Find me a 2 BHK property under 60 lakh in Whitefield with good rental yield"
    with preset_col2:
        if st.button("Undervalued 3 BHK in Sarjapur Road"):
            selected_query = "Find me an undervalued 3 BHK property in Sarjapur Road"
    with preset_col3:
        if st.button("High yield property in Electronic City"):
            selected_query = "Find me a property in Electronic City with high rental return"
            
    # Text input
    query_input = st.text_input(
        "Enter your investment requirement:",
        value=selected_query if selected_query else "",
        placeholder=get_text('ai_placeholder', lang)
    )
    
    if st.button(get_text('btn_ask_ai', lang), use_container_width=True) or query_input:
        if not query_input:
            query_input = "Find me a 2 BHK property under 75 lakh with good rental yield"
            
        with st.spinner("Parsing query & analyzing candidate dataset pool with ML models..."):
            res = recommend_properties(query_input, top_n=5)
            filters = res['parsed_filters']
            recs = res['recommendations']
            
        st.markdown("<hr style='border-color: #1E293B; margin: 24px 0;'>", unsafe_allow_html=True)
        
        # Parsed filters feedback badge
        st.markdown("#### Structured Query Translation")
        f_cols = st.columns(4)
        with f_cols[0]:
            st.info(f"Max Budget: ₹{filters['max_price']} Lakhs" if filters['max_price'] else "Max Budget: Any")
        with f_cols[1]:
            st.info(f"BHK: {filters['min_bhk']} BHK" if filters['min_bhk'] else "BHK: Any")
        with f_cols[2]:
            st.info(f"Location: {filters['location']}" if filters['location'] else "Location: Any")
        with f_cols[3]:
            st.info("Filter: Undervalued Only" if filters['only_undervalued'] else "Filter: All Market Deals")
            
        st.markdown(f'<div class="section-title">{get_text("ai_rec_title", lang)}</div>', unsafe_allow_html=True)
        
        if not recs:
            st.warning("No candidate properties matched the strict filter criteria. Try adjusting the query parameters.")
        else:
            for idx, item in enumerate(recs):
                badge_class = "badge-undervalued" if item['deal_status'] == "Potentially Undervalued" else "badge-fair"
                
                st.markdown(f"""
                <div class="realvest-card" style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h3 style="font-size: 18px; font-weight: 700; color: #F8FAFC; margin: 0;">
                                #{idx+1}. {item['bhk']} BHK in {item['location']}
                            </h3>
                            <div style="font-size: 13px; color: #94A3B8; margin-top: 4px;">
                                {item['sqft']:,.0f} sqft • {item['area_type']} • {item['bath']:.0f} Bathrooms
                            </div>
                        </div>
                        <span class="{badge_class}">{item['deal_status']}</span>
                    </div>
                    
                    <div style="display: flex; gap: 32px; margin-top: 16px; padding-top: 14px; border-top: 1px solid #334155;">
                        <div>
                            <div style="font-size: 11px; color: #64748B; text-transform: uppercase;">Asking Price</div>
                            <div style="font-size: 18px; font-weight: 700; color: #F8FAFC;">₹{item['asking_price_lakhs']:,.2f} Lakhs</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; color: #64748B; text-transform: uppercase;">ML Fair Value</div>
                            <div style="font-size: 18px; font-weight: 700; color: #38BDF8;">₹{item['fair_value_lakhs']:,.2f} Lakhs</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; color: #64748B; text-transform: uppercase;">Est. Monthly Rent</div>
                            <div style="font-size: 18px; font-weight: 700; color: #10B981;">₹{item['monthly_rent']:,.0f}</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; color: #64748B; text-transform: uppercase;">Rental Yield</div>
                            <div style="font-size: 18px; font-weight: 700; color: #F59E0B;">{item['rental_yield_pct']}%</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; color: #64748B; text-transform: uppercase;">Investment Score</div>
                            <div style="font-size: 18px; font-weight: 700; color: {item['color']};">{item['investment_score']}/100</div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 14px; background-color: #0F172A; padding: 12px 16px; border-radius: 8px; border-left: 3px solid #38BDF8;">
                        <div style="font-size: 12px; font-weight: 700; color: #38BDF8; margin-bottom: 4px;">🤖 {get_text("ai_why_rec", lang)}</div>
                        <div style="font-size: 13px; color: #F1F5F9; line-height: 1.5;">{item['why_recommended']}</div>
                    </div>
                </div>
                """, unsafe_allow_html=True)
                
        st.markdown("""
        <div class="disclaimer-box">
            🤖 <b>Strict AI Engineering Rule:</b> All recommended property details, values, rents, yields, and scores are evaluated directly from the underlying processed dataset and trained Scikit-learn models. The AI engine does NOT hallucinate or synthesize fake properties.
        </div>
        """, unsafe_allow_html=True)
