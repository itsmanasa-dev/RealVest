import streamlit as st
from app.translations import t
from src.models.predict import predict_property_price, predict_rent_price, get_price_model
from src.analytics.yield_calculator import calculate_rental_yield
from src.analytics.deal_classifier import classify_property_deal
from src.analytics.investment_scorer import calculate_investment_score
from src.analytics.risk_radar import calculate_risk_radar
from src.analytics.decision_engine import generate_property_decision
from src.models.explain import get_property_price_explanation
from src.utils.formatting import format_currency_lakhs, format_rent, format_percentage, format_number
from src.utils.validation import safe_float, safe_int
from src.utils.errors import handle_user_errors

@handle_user_errors("Unable to analyze property details. Please verify input numbers and try again.")
def render_property_analyzer(lang='English'):
    st.markdown(f"""
    <div>
        <div class="page-head">Property Analysis & Decision Engine</div>
        <div class="page-subhead">Evaluate fair value estimates, risk radar indicators, explainable factor contributions, and clear decision recommendations.</div>
    </div>
    """, unsafe_allow_html=True)
    
    m_data = get_price_model()
    top_locations = m_data['top_locations']
    
    prop_type_opts = [
        t('opt_apartment', lang),
        t('opt_house', lang),
        t('opt_villa', lang)
    ]
    
    with st.form("property_check_form"):
        st.markdown(f'### {t("step1_title", lang)}')
        c1, c2 = st.columns(2)
        with c1:
            city = st.text_input(t('lbl_city', lang), value="Bengaluru", disabled=True)
        with c2:
            location = st.selectbox(t('lbl_locality', lang), top_locations, index=0)
            
        st.markdown(f'### {t("step2_title", lang)}')
        c3, c4, c5, c6 = st.columns(4)
        with c3:
            prop_type = st.selectbox(t('lbl_prop_type', lang), prop_type_opts, index=0)
        with c4:
            bhk = st.number_input(t('lbl_bhk', lang), min_value=1, max_value=8, value=2, step=1)
        with c5:
            sqft = st.number_input(t('lbl_area', lang), min_value=300, max_value=15000, value=1250, step=50)
        with c6:
            bath = st.number_input(t('lbl_bathrooms', lang), min_value=1, max_value=8, value=2, step=1)
            
        st.markdown(f'### {t("step3_title", lang)}')
        c7, c8 = st.columns(2)
        with c7:
            asking_price_in = st.number_input(t('lbl_asking_price_in', lang), min_value=5.0, max_value=3000.0, value=65.0, step=1.0)
        with c8:
            rent_in = st.number_input(t('lbl_expected_rent_in', lang), min_value=0, max_value=500000, value=0, step=1000)
            
        submitted = st.form_submit_button(t('btn_analyze_submit', lang), use_container_width=True)
        
    if submitted or 'analyzed_data' in st.session_state:
        asking_price = safe_float(asking_price_in, default=65.0)
        sqft_val = safe_float(sqft, default=1250.0)
        bhk_val = safe_int(bhk, default=2)
        bath_val = safe_int(bath, default=2)
        
        # 1. Predictions
        val_res = predict_property_price(location, sqft_val, bhk_val, bath_val, 1, 'Super built-up Area', 1)
        fair_val = safe_float(val_res.get('estimated_price_lakhs', 0.0))
        
        rent_res = predict_rent_price(location, sqft_val, bhk_val, bath_val, 1, 'Semi-Furnished')
        user_rent = safe_float(rent_in)
        monthly_rent = user_rent if user_rent > 0 else safe_float(rent_res.get('estimated_rent_monthly', 0.0))
        
        # 2. Analytics & Decision Engine
        yield_res = calculate_rental_yield(monthly_rent, asking_price)
        deal_res = classify_property_deal(asking_price, fair_val)
        score_res = calculate_investment_score(asking_price, fair_val, yield_res['rental_yield_pct'])
        
        dec_engine = generate_property_decision(
            asking_price,
            fair_val,
            yield_res['rental_yield_pct'],
            location_used=location,
            mae_margin_lakhs=val_res.get('mae_margin', 12.5)
        )
        
        risk_radar = dec_engine['risk_radar']
        
        st.markdown("<hr style='border-color: #E2E8F0; margin: 32px 0;'>", unsafe_allow_html=True)
        
        # DECISION ENGINE BANNER
        st.markdown(f"""
        <div class="rv-card rv-card-winner">
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #1E40AF; letter-spacing: 0.5px;">
                REALVEST DECISION ENGINE RECOMMENDATION
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px; flex-wrap: wrap; gap: 12px;">
                <div>
                    <span style="font-size: 36px; font-weight: 800; color: {dec_engine['color']}; margin-right: 12px;">
                        {dec_engine['decision']}
                    </span>
                    <span style="font-size: 16px; font-weight: 700; color: #475569;">
                        (Confidence: {dec_engine['confidence_pct']}%)
                    </span>
                </div>
                <span class="badge badge-good">{deal_res['status']}</span>
            </div>
            
            <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid #DBEAFE; display: flex; gap: 24px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 250px;">
                    <div style="font-size: 14px; font-weight: 700; color: #15803D; margin-bottom: 6px;">✓ KEY SUPPORTING REASONS</div>
                    {"".join(f'<div class="why-line"><span style="color: #15803D; font-weight: 800;">✓</span> {r}</div>' for r in dec_engine['reasons'])}
                </div>
                <div style="flex: 1; min-width: 250px;">
                    <div style="font-size: 14px; font-weight: 700; color: #B91C1C; margin-bottom: 6px;">⚠ RISK SIGNALS</div>
                    {"".join(f'<div class="why-line"><span style="color: #B91C1C; font-weight: 800;">⚠</span> {r}</div>' for r in dec_engine['risks'])}
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # Metrics Row
        m1, m2, m3, m4, m5 = st.columns(5)
        with m1:
            st.metric(label=t('lbl_asking_price', lang), value=format_currency_lakhs(asking_price))
        with m2:
            st.metric(label=t('lbl_fair_value', lang), value=format_currency_lakhs(fair_val))
        with m3:
            st.metric(label=t('lbl_rent', lang), value=format_rent(monthly_rent))
        with m4:
            st.metric(label=t('lbl_yield', lang), value=format_percentage(yield_res['rental_yield_pct']))
        with m5:
            st.metric(label=t('lbl_score', lang), value=f"{safe_int(score_res['total_score'])}/100")
            
        st.markdown("<br>", unsafe_allow_html=True)
        
        # EXPLAINABLE VALUATION WATERFALL
        st.markdown('<div class="section-head">EXPLAINABLE VALUATION BREAKDOWN</div>', unsafe_allow_html=True)
        st.markdown("Quantified factor contributions explaining how the ML fair value estimate was derived:")
        
        price_expl = get_property_price_explanation(location, sqft_val, bhk_val, bath_val, 1, 'Super built-up Area', 1)
        
        for factor in price_expl['waterfall_factors']:
            val_str = f"₹{abs(factor['contribution_lakhs']):,.2f} Lakhs"
            if factor['sign'] == 'base':
                icon = "📌"
                color = "#2563EB"
            elif factor['sign'] == '+':
                icon = "▲ +"
                color = "#15803D"
            else:
                icon = "▼ -"
                color = "#B91C1C"
                
            st.markdown(f"""
            <div class="why-line" style="justify-content: space-between;">
                <div>
                    <span style="font-weight: 800; color: {color}; margin-right: 8px;">{icon}</span>
                    <b>{factor['factor']}</b>
                </div>
                <div style="font-weight: 800; color: {color};">{val_str}</div>
            </div>
            """, unsafe_allow_html=True)
            
        st.markdown("<br>", unsafe_allow_html=True)
        
        # RISK RADAR SECTION
        st.markdown('<div class="section-head">PROPERTY RISK RADAR</div>', unsafe_allow_html=True)
        st.markdown(f"Overall Risk Profile: <b style='color: {risk_radar['overall_color']};'>{risk_radar['overall_risk']}</b> (Score: {risk_radar['risk_score']}/100)", unsafe_allow_html=True)
        
        for item in risk_radar['breakdown']:
            st.markdown(f"""
            <div class="rv-card" style="margin-bottom: 12px; padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                    <div style="font-size: 16px; font-weight: 800; color: #0F172A;">
                        {item['category']}
                    </div>
                    <div>
                        <span style="font-size: 12px; font-weight: 700; color: #64748B; margin-right: 12px;">{item['metric_label']}: {item['metric_value']}</span>
                        <span style="background-color: {item['color']}; color: #FFFFFF; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 12px;">
                            {item['level']}
                        </span>
                    </div>
                </div>
                <div style="font-size: 13px; color: #475569; margin-top: 8px;">
                    <b>Why?</b> {item['why']}
                </div>
            </div>
            """, unsafe_allow_html=True)
