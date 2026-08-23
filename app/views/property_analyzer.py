import streamlit as st
import plotly.graph_objects as go
from app.translations import get_text
from src.models.predict import predict_property_price, predict_rent_price, get_price_model
from src.analytics.yield_calculator import calculate_rental_yield
from src.analytics.deal_classifier import classify_property_deal
from src.analytics.investment_scorer import calculate_investment_score
from src.models.explain import get_property_price_explanation, get_rent_explanation

def render_property_analyzer(lang='English'):
    st.markdown(f"""
    <div style="margin-bottom: 24px;">
        <h2 style="font-size: 26px; font-weight: 700; color: #F8FAFC;">{get_text('nav_analyzer', lang)}</h2>
        <p style="color: #94A3B8; font-size: 14px;">Enter property specifications to compute ML Fair Value, Rent estimate, Rental Yield, and Investment Deal Rating.</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Load top locations list from trained model
    m_data = get_price_model()
    top_locations = m_data['top_locations']
    
    # Form layout
    with st.form("analyzer_form"):
        col_a, col_b, col_c = st.columns(3)
        
        with col_a:
            location = st.selectbox(get_text('lbl_location', lang), top_locations, index=0)
            sqft = st.number_input(get_text('lbl_area', lang), min_value=300, max_value=20000, value=1350, step=50)
            bhk = st.number_input(get_text('lbl_bhk', lang), min_value=1, max_value=10, value=2, step=1)
            
        with col_b:
            bath = st.number_input(get_text('lbl_bathrooms', lang), min_value=1, max_value=10, value=2, step=1)
            balcony = st.number_input(get_text('lbl_balconies', lang), min_value=0, max_value=5, value=1, step=1)
            furnishing = st.selectbox(get_text('lbl_furnishing', lang), ['Semi-Furnished', 'Furnished', 'Unfurnished'], index=0)
            
        with col_c:
            area_type = st.selectbox("Area Type", ['Super built-up Area', 'Plot Area', 'Built-up Area', 'Carpet Area'], index=0)
            is_ready = st.selectbox("Availability", ['Ready To Move', 'Under Construction'], index=0)
            asking_price = st.number_input(f"{get_text('lbl_asking_price', lang)} (₹ Lakhs)", min_value=5.0, max_value=5000.0, value=72.0, step=1.0)
            
        submitted = st.form_submit_button(get_text('btn_analyze', lang), use_container_width=True)
        
    if submitted or 'analyzed_data' in st.session_state:
        # Save or process
        is_ready_val = 1 if is_ready == 'Ready To Move' else 0
        
        # 1. Predictions
        val_res = predict_property_price(location, sqft, bhk, bath, balcony, area_type, is_ready_val)
        fair_val = val_res['estimated_price_lakhs']
        
        rent_res = predict_rent_price(location, sqft, bhk, bath, balcony, furnishing)
        monthly_rent = rent_res['estimated_rent_monthly']
        
        # 2. Analytics
        yield_res = calculate_rental_yield(monthly_rent, asking_price)
        deal_res = classify_property_deal(asking_price, fair_val)
        score_res = calculate_investment_score(asking_price, fair_val, yield_res['rental_yield_pct'])
        
        # 3. Explanations
        price_expl = get_property_price_explanation(location, sqft, bhk, bath, balcony, area_type, is_ready_val)
        
        st.markdown("<hr style='border-color: #1E293B; margin: 30px 0;'>", unsafe_allow_html=True)
        st.markdown('<h3 style="font-size: 20px; font-weight: 700; color: #F8FAFC;">Valuation & Analytics Summary</h3>', unsafe_allow_html=True)
        
        # Prominent Result KPI Cards
        kpi1, kpi2, kpi3, kpi4, kpi5, kpi6 = st.columns(6)
        
        with kpi1:
            st.markdown(f"""
            <div class="realvest-card">
                <div class="card-label">Fair Value</div>
                <div class="card-value" style="color: #38BDF8;">₹{fair_val:,.1f}L</div>
                <div class="card-subtext">Range: ₹{val_res['price_range_lower']}L–{val_res['price_range_upper']}L</div>
            </div>
            """, unsafe_allow_html=True)
            
        with kpi2:
            st.markdown(f"""
            <div class="realvest-card">
                <div class="card-label">Asking Price</div>
                <div class="card-value">₹{asking_price:,.1f}L</div>
                <div class="card-subtext">₹{val_res['price_per_sqft']:,.0f}/sqft</div>
            </div>
            """, unsafe_allow_html=True)
            
        with kpi3:
            st.markdown(f"""
            <div class="realvest-card">
                <div class="card-label">Expected Rent</div>
                <div class="card-value" style="color: #10B981;">₹{monthly_rent:,.0f}</div>
                <div class="card-subtext">Range: ₹{rent_res['rent_range_lower']:,.0f}–{rent_res['rent_range_upper']:,.0f}</div>
            </div>
            """, unsafe_allow_html=True)
            
        with kpi4:
            st.markdown(f"""
            <div class="realvest-card">
                <div class="card-label">Rental Yield</div>
                <div class="card-value" style="color: {yield_res['color']};">{yield_res['rental_yield_pct']}%</div>
                <div class="card-subtext">{yield_res['tier']} Return</div>
            </div>
            """, unsafe_allow_html=True)
            
        with kpi5:
            st.markdown(f"""
            <div class="realvest-card">
                <div class="card-label">Score</div>
                <div class="card-value" style="color: {score_res['color']};">{score_res['total_score']}/100</div>
                <div class="card-subtext">{score_res['rating']}</div>
            </div>
            """, unsafe_allow_html=True)
            
        with kpi6:
            badge_class = "badge-undervalued" if deal_res['status'] == "Potentially Undervalued" else ("badge-overpriced" if deal_res['status'] == "Potentially Overpriced" else "badge-fair")
            st.markdown(f"""
            <div class="realvest-card">
                <div class="card-label">Deal Status</div>
                <div style="margin-top: 8px;"><span class="{badge_class}">{deal_res['status']}</span></div>
                <div class="card-subtext" style="margin-top: 10px;">{deal_res['diff_pct']:+}% vs Fair</div>
            </div>
            """, unsafe_allow_html=True)
            
        st.markdown("<br>", unsafe_allow_html=True)
        
        col_left, col_right = st.columns([6, 6])
        
        with col_left:
            st.markdown(f'<div class="section-title">{get_text("sec_why_result", lang)}</div>', unsafe_allow_html=True)
            st.markdown(f"**Deal Assessment:** {deal_res['explanation']}")
            st.markdown(f"**Yield Interpretation:** {yield_res['interpretation']}")
            
            st.markdown("<br><b>Model Attribution Factors:</b>", unsafe_allow_html=True)
            for item in price_expl['explanations']:
                st.markdown(f"- {item}")
                
        with col_right:
            st.markdown('<div class="section-title">Asking Price vs Fair Value Comparison</div>', unsafe_allow_html=True)
            fig = go.Figure(data=[
                go.Bar(name='Asking Price', x=['Property'], y=[asking_price], marker_color='#94A3B8'),
                go.Bar(name='ML Fair Value', x=['Property'], y=[fair_val], marker_color='#38BDF8'),
                go.Bar(name='Lower Bound', x=['Property'], y=[val_res['price_range_lower']], marker_color='#334155'),
                go.Bar(name='Upper Bound', x=['Property'], y=[val_res['price_range_upper']], marker_color='#0284C7')
            ])
            fig.update_layout(
                barmode='group',
                template='plotly_dark',
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                margin=dict(l=20, r=20, t=30, b=20),
                height=260,
                yaxis=dict(title='Price (₹ Lakhs)', gridcolor='#1E293B')
            )
            st.plotly_chart(fig, use_container_width=True)
            
        st.markdown(f"""
        <div class="disclaimer-box">
            🛡️ <b>Analytical Guarantee Disclaimer:</b> {deal_res['disclaimer']}
        </div>
        """, unsafe_allow_html=True)
