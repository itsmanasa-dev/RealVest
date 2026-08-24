import streamlit as st
from app.translations import get_text
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
        <div class="page-head">{get_text('analyzer_title', lang)}</div>
        <div class="page-subhead">{get_text('analyzer_sub', lang)}</div>
    </div>
    """, unsafe_allow_html=True)
    
    m_data = get_price_model()
    top_locations = m_data['top_locations']
    
    with st.form("property_check_form"):
        st.markdown(f'### {get_text("step1_title", lang)}')
        c1, c2 = st.columns(2)
        with c1:
            city = st.text_input("City", value="Bengaluru", disabled=True)
        with c2:
            location = st.selectbox("Locality", top_locations, index=0)
            
        st.markdown(f'### {get_text("step2_title", lang)}')
        c3, c4, c5, c6 = st.columns(4)
        with c3:
            prop_type = st.selectbox("Property Type", ["Apartment", "Independent House", "Villa"], index=0)
        with c4:
            bhk = st.number_input("BHK Configuration", min_value=1, max_value=8, value=2, step=1)
        with c5:
            sqft = st.number_input("Area (Sqft)", min_value=300, max_value=15000, value=1250, step=50)
        with c6:
            bath = st.number_input("Bathrooms", min_value=1, max_value=8, value=2, step=1)
            
        st.markdown(f'### {get_text("step3_title", lang)}')
        c7, c8 = st.columns(2)
        with c7:
            asking_price_in = st.number_input("Asking price (₹ Lakhs)", min_value=5.0, max_value=3000.0, value=62.0, step=1.0)
        with c8:
            rent_in = st.number_input("Expected monthly rent (₹, optional)", min_value=0, max_value=500000, value=0, step=1000)
            
        submitted = st.form_submit_button(get_text('btn_analyze_submit', lang), use_container_width=True)
        
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
        
        # Verdict Badges
        deal_status = deal_res.get('status', '')
        if deal_status == "Potentially Undervalued":
            verdict_text = get_text('verdict_good', lang)
            badge_class = "badge-good"
        elif deal_status == "Potentially Overpriced":
            verdict_text = get_text('verdict_overpriced', lang)
            badge_class = "badge-overpriced"
        else:
            verdict_text = get_text('verdict_fair', lang)
            badge_class = "badge-fair"
            
        st.markdown("<hr style='border-color: #E2E8F0; margin: 32px 0;'>", unsafe_allow_html=True)
        
        # Verdict Header Banner
        st.markdown(f"""
        <div class="rv-card">
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #64748B; letter-spacing: 0.5px;">
                {get_text('verdict_head', lang)}
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px; flex-wrap: wrap; gap: 12px;">
                <div style="font-size: 28px; font-weight: 800; color: #0F172A;">{verdict_text}</div>
                <span class="badge {badge_class}">{deal_status}</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # Visually Clean Metrics Row using native st.metric
        m1, m2, m3, m4, m5 = st.columns(5)
        with m1:
            st.metric(label=get_text('lbl_asking_price', lang), value=format_currency_lakhs(asking_price))
        with m2:
            st.metric(label=get_text('lbl_fair_value', lang), value=format_currency_lakhs(fair_val))
        with m3:
            st.metric(label=get_text('lbl_rent', lang), value=format_rent(monthly_rent))
        with m4:
            st.metric(label=get_text('lbl_yield', lang), value=format_percentage(yield_res['rental_yield_pct']))
        with m5:
            st.metric(label=get_text('lbl_score', lang), value=f"{safe_int(score_res['total_score'])}/100")
            
        st.markdown("<br>", unsafe_allow_html=True)
        
        # WHY THIS RESULT Section
        st.markdown(f'<div class="section-head">{get_text("why_result_head", lang)}</div>', unsafe_allow_html=True)
        
        why_bullets = []
        if asking_price <= fair_val:
            diff = fair_val - asking_price
            why_bullets.append(("✓", f"Asking price is {format_currency_lakhs(diff)} below the estimated fair value"))
        else:
            diff = asking_price - fair_val
            why_bullets.append(("⚠", f"Asking price is {format_currency_lakhs(diff)} higher than estimated fair value"))
            
        if yield_res['rental_yield_pct'] >= 4.0:
            why_bullets.append(("✓", f"Estimated rental return of {format_percentage(yield_res['rental_yield_pct'])} is attractive"))
        else:
            why_bullets.append(("⚠", f"Estimated rental yield of {format_percentage(yield_res['rental_yield_pct'])} is modest"))
            
        why_bullets.append(("✓", f"Location in {location} has strong available market indicators"))
        
        if user_rent == 0:
            why_bullets.append(("⚠", "Rental estimate uses micro-market benchmark model data"))
            
        for icon, text_msg in why_bullets:
            color = "#15803D" if icon == "✓" else "#B45309"
            st.markdown(f"""
            <div class="why-line">
                <span style="font-weight: 800; color: {color}; font-size: 16px;">{icon}</span>
                <div>{text_msg}</div>
            </div>
            """, unsafe_allow_html=True)
            
        # Optional Model Details Toggle
        with st.expander(f"⚙️ {get_text('toggle_model_details', lang)}"):
            st.markdown("#### Model Details")
            st.write(f"• **Fair Value Estimate Range:** {format_currency_lakhs(val_res.get('price_range_lower', 0))} – {format_currency_lakhs(val_res.get('price_range_upper', 0))}")
            st.write(f"• **Expected Rent Range:** {format_rent(rent_res.get('rent_range_lower', 0))} – {format_rent(rent_res.get('rent_range_upper', 0))}")
            
            price_expl = get_property_price_explanation(location, sqft_val, bhk_val, bath_val, 1, 'Super built-up Area', 1)
            st.markdown("**Key Model Drivers:**")
            for exp_item in price_expl.get('explanations', []):
                st.write(f"- {exp_item}")
