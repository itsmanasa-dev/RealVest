import streamlit as st
from app.translations import t
from src.models.predict import predict_property_price, predict_rent_price, get_price_model
from src.analytics.yield_calculator import calculate_rental_yield
from src.analytics.deal_classifier import classify_property_deal
from src.analytics.investment_scorer import calculate_investment_score
from src.models.explain import get_property_price_explanation
from src.utils.formatting import format_currency_lakhs, format_rent, format_percentage, format_number
from src.utils.validation import safe_float, safe_int
from src.utils.errors import handle_user_errors

@handle_user_errors("Unable to analyze property details. Please verify input numbers and try again.")
def render_property_analyzer(lang='English'):
    st.markdown(f"""
    <div>
        <div class="page-head">{t('analyzer_title', lang)}</div>
        <div class="page-subhead">{t('analyzer_sub', lang)}</div>
    </div>
    """, unsafe_allow_html=True)
    
    m_data = get_price_model()
    top_locations = m_data['top_locations']
    
    # Multilingual property type mapping
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
            asking_price_in = st.number_input(t('lbl_asking_price_in', lang), min_value=5.0, max_value=3000.0, value=62.0, step=1.0)
        with c8:
            rent_in = st.number_input(t('lbl_expected_rent_in', lang), min_value=0, max_value=500000, value=0, step=1000)
            
        submitted = st.form_submit_button(t('btn_analyze_submit', lang), use_container_width=True)
        
    if submitted or 'analyzed_data' in st.session_state:
        asking_price = safe_float(asking_price_in, default=62.0)
        sqft_val = safe_float(sqft, default=1250.0)
        bhk_val = safe_int(bhk, default=2)
        bath_val = safe_int(bath, default=2)
        
        # 1. Predictions
        val_res = predict_property_price(location, sqft_val, bhk_val, bath_val, 1, 'Super built-up Area', 1)
        fair_val = safe_float(val_res.get('estimated_price_lakhs', 0.0))
        
        rent_res = predict_rent_price(location, sqft_val, bhk_val, bath_val, 1, 'Semi-Furnished')
        user_rent = safe_float(rent_in)
        monthly_rent = user_rent if user_rent > 0 else safe_float(rent_res.get('estimated_rent_monthly', 0.0))
        
        # 2. Analytics
        yield_res = calculate_rental_yield(monthly_rent, asking_price)
        deal_res = classify_property_deal(asking_price, fair_val)
        score_res = calculate_investment_score(asking_price, fair_val, yield_res['rental_yield_pct'])
        
        # Verdict Badges (Fully Multilingual)
        deal_status = deal_res.get('status', '')
        if deal_status == "Potentially Undervalued":
            verdict_text = t('verdict_good', lang)
            badge_text = t('badge_good_deal', lang)
            badge_class = "badge-good"
        elif deal_status == "Potentially Overpriced":
            verdict_text = t('verdict_overpriced', lang)
            badge_text = t('badge_overpriced', lang)
            badge_class = "badge-overpriced"
        else:
            verdict_text = t('verdict_fair', lang)
            badge_text = t('badge_fair_price', lang)
            badge_class = "badge-fair"
            
        st.markdown("<hr style='border-color: #E2E8F0; margin: 32px 0;'>", unsafe_allow_html=True)
        
        # Verdict Banner
        st.markdown(f"""
        <div class="rv-card">
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #64748B; letter-spacing: 0.5px;">
                {t('verdict_head', lang)}
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px; flex-wrap: wrap; gap: 12px;">
                <div style="font-size: 28px; font-weight: 800; color: #0F172A;">{verdict_text}</div>
                <span class="badge {badge_class}">{badge_text}</span>
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
        
        # WHY THIS RESULT Section
        st.markdown(f'<div class="section-head">{t("why_result_head", lang)}</div>', unsafe_allow_html=True)
        
        why_bullets = []
        if asking_price <= fair_val:
            diff_str = format_currency_lakhs(fair_val - asking_price)
            why_bullets.append(("✓", t('why_asking_below', lang, diff=diff_str)))
        else:
            diff_str = format_currency_lakhs(asking_price - fair_val)
            why_bullets.append(("⚠", t('why_asking_above', lang, diff=diff_str)))
            
        yield_str = format_percentage(yield_res['rental_yield_pct'])
        if yield_res['rental_yield_pct'] >= 4.0:
            why_bullets.append(("✓", t('why_yield_attractive', lang, yield_pct=yield_str)))
        else:
            why_bullets.append(("⚠", t('why_yield_modest', lang, yield_pct=yield_str)))
            
        why_bullets.append(("✓", t('why_location_indicators', lang, location=location)))
        
        if user_rent == 0:
            why_bullets.append(("⚠", t('why_rent_benchmark', lang)))
            
        for icon, text_msg in why_bullets:
            color = "#15803D" if icon == "✓" else "#B45309"
            st.markdown(f"""
            <div class="why-line">
                <span style="font-weight: 800; color: {color}; font-size: 16px;">{icon}</span>
                <div>{text_msg}</div>
            </div>
            """, unsafe_allow_html=True)
            
        # Optional Model Details Toggle
        with st.expander(f"⚙️ {t('toggle_model_details', lang)}"):
            st.markdown(f"#### {t('model_details_head', lang)}")
            st.write(f"• **{t('fair_range_lbl', lang)}** {format_currency_lakhs(val_res.get('price_range_lower', 0))} – {format_currency_lakhs(val_res.get('price_range_upper', 0))}")
            st.write(f"• **{t('rent_range_lbl', lang)}** {format_rent(rent_res.get('rent_range_lower', 0))} – {format_rent(rent_res.get('rent_range_upper', 0))}")
            
            price_expl = get_property_price_explanation(location, sqft_val, bhk_val, bath_val, 1, 'Super built-up Area', 1)
            st.markdown(f"**{t('key_drivers_lbl', lang)}**")
            for exp_item in price_expl.get('explanations', []):
                st.write(f"- {exp_item}")
