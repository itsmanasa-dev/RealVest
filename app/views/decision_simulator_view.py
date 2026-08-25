import streamlit as st
from app.translations import t
from src.analytics.decision_simulator import simulate_investment_scenario, compare_base_vs_scenario
from src.analytics.decision_flip import calculate_decision_flip_boundaries
from src.models.predict import get_price_model, predict_property_price
from src.utils.formatting import format_currency_lakhs, format_rent, format_percentage, format_number
from src.utils.validation import safe_float, safe_int
from src.utils.errors import handle_user_errors

@handle_user_errors("Unable to run decision simulation. Please check inputs.")
def render_decision_simulator(lang='English'):
    st.markdown(f"""
    <div>
        <div class="page-head">Decision Simulator & What-If Engine</div>
        <div class="page-subhead">Simulate cash flows, ROI, and decision boundary sensitivity under customized financial scenarios.</div>
    </div>
    """, unsafe_allow_html=True)
    
    m_data = get_price_model()
    top_locations = m_data['top_locations']
    
    st.markdown("### BASE CASE PROPERTY PARAMETERS")
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        location = st.selectbox("Micro-Market Location", top_locations, index=0)
    with c2:
        sqft = st.number_input("Property Size (Sqft)", min_value=300, max_value=15000, value=1250, step=50)
    with c3:
        bhk = st.number_input("BHK Configuration", min_value=1, max_value=8, value=2, step=1)
    with c4:
        base_asking = st.number_input("Base Asking Price (₹ Lakhs)", min_value=10.0, max_value=2000.0, value=75.0, step=1.0)
        
    val_res = predict_property_price(location, sqft, bhk)
    fair_val = val_res['estimated_price_lakhs']
    
    st.markdown("<hr style='border-color: #E2E8F0; margin: 24px 0;'>", unsafe_allow_html=True)
    st.markdown("### WHAT-IF SCENARIO VARIABLES")
    
    sc1, sc2, sc3, sc4 = st.columns(4)
    with sc1:
        scen_price = st.number_input("Scenario Purchase Price (₹ Lakhs)", min_value=10.0, max_value=2000.0, value=base_asking, step=1.0)
        down_payment_pct = st.slider("Down Payment (%)", min_value=10, max_value=50, value=20, step=5)
    with sc2:
        interest_rate = st.slider("Home Loan Interest Rate (%)", min_value=6.0, max_value=15.0, value=8.5, step=0.25)
        tenure_years = st.selectbox("Loan Tenure (Years)", [10, 15, 20, 25, 30], index=2)
    with sc3:
        monthly_rent = st.number_input("Monthly Rent (₹)", min_value=5000, max_value=500000, value=25000, step=1000)
        vacancy_pct = st.slider("Expected Vacancy Rate (%)", min_value=0, max_value=25, value=5, step=1)
    with sc4:
        appreciation_pct = st.slider("Annual Appreciation (%)", min_value=0.0, max_value=15.0, value=5.0, step=0.5)
        holding_years = st.selectbox("Holding Period (Years)", [3, 5, 7, 10], index=1)
        
    base_params = {
        'purchase_price_lakhs': base_asking,
        'down_payment_pct': 20.0,
        'interest_rate_pct': 8.5,
        'tenure_years': 20,
        'monthly_rent_inr': 25000.0,
        'vacancy_rate_pct': 5.0,
        'appreciation_rate_pct': 5.0,
        'holding_period_years': 5,
        'fair_value_lakhs': fair_val,
        'location': location
    }
    
    scen_params = {
        'purchase_price_lakhs': scen_price,
        'down_payment_pct': float(down_payment_pct),
        'interest_rate_pct': float(interest_rate),
        'tenure_years': int(tenure_years),
        'monthly_rent_inr': float(monthly_rent),
        'vacancy_rate_pct': float(vacancy_pct),
        'appreciation_rate_pct': float(appreciation_pct),
        'holding_period_years': int(holding_years),
        'fair_value_lakhs': fair_val,
        'location': location
    }
    
    comp_res = compare_base_vs_scenario(base_params, scen_params)
    base_sim = comp_res['base']
    scen_sim = comp_res['scenario']
    
    st.markdown("<hr style='border-color: #E2E8F0; margin: 32px 0;'>", unsafe_allow_html=True)
    st.markdown('<div class="section-head">BASE CASE vs USER SCENARIO COMPARISON</div>', unsafe_allow_html=True)
    
    # Comparison table
    comp_matrix = {
        'Financial Metric': [
            'Recommendation',
            'Monthly Home Loan EMI',
            'Net Monthly Cash Flow',
            'Net Annual Cash Flow',
            'Rental Yield (%)',
            'Projected Property Value (5 Yr)',
            'Total Profit over Holding Period',
            'Total ROI (%)',
            'Annualized ROI (%)'
        ],
        'BASE CASE': [
            base_sim['decision'],
            format_rent(base_sim['monthly_emi_inr']),
            format_rent(base_sim['net_monthly_cash_flow']),
            format_rent(base_sim['net_annual_cash_flow']),
            format_percentage(base_sim['rental_yield_pct']),
            format_currency_lakhs(base_sim['projected_future_val_lakhs']),
            format_rent(base_sim['total_profit_inr']),
            format_percentage(base_sim['total_roi_pct']),
            format_percentage(base_sim['annualized_roi_pct'])
        ],
        'USER SCENARIO': [
            scen_sim['decision'],
            format_rent(scen_sim['monthly_emi_inr']),
            format_rent(scen_sim['net_monthly_cash_flow']),
            format_rent(scen_sim['net_annual_cash_flow']),
            format_percentage(scen_sim['rental_yield_pct']),
            format_currency_lakhs(scen_sim['projected_future_val_lakhs']),
            format_rent(scen_sim['total_profit_inr']),
            format_percentage(scen_sim['total_roi_pct']),
            format_percentage(scen_sim['annualized_roi_pct'])
        ]
    }
    
    st.table(pd.DataFrame(comp_matrix).set_index('Financial Metric'))
    
    st.markdown(f"""
    <div class="rv-card">
        <div style="font-size: 15px; font-weight: 700; color: #0F172A;">
            💡 SCENARIO IMPACT EXPLANATION
        </div>
        <div style="font-size: 14px; color: #334155; margin-top: 6px;">
            {comp_res['explanation']}
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # DECISION FLIP BOUNDARY ANALYSIS
    st.markdown('<div class="section-head">DECISION FLIP BOUNDARY ANALYSIS</div>', unsafe_allow_html=True)
    st.markdown("What would need to change for this recommendation to flip?")
    
    flip_res = calculate_decision_flip_boundaries(
        current_price_lakhs=scen_price,
        fair_value_lakhs=fair_val,
        current_rent_inr=monthly_rent,
        down_payment_pct=down_payment_pct,
        interest_rate_pct=interest_rate,
        location=location
    )
    
    f1, f2, f3 = st.columns(3)
    with f1:
        st.markdown(f"""
        <div class="rv-card">
            <div style="font-size: 12px; font-weight: 800; color: #64748B; text-transform: uppercase;">PRICE FLIP THRESHOLD</div>
            <div style="font-size: 16px; font-weight: 800; color: #0F172A; margin-top: 6px;">
                {flip_res['price_flip_text']}
            </div>
        </div>
        """, unsafe_allow_html=True)
    with f2:
        st.markdown(f"""
        <div class="rv-card">
            <div style="font-size: 12px; font-weight: 800; color: #64748B; text-transform: uppercase;">RENT FLIP THRESHOLD</div>
            <div style="font-size: 16px; font-weight: 800; color: #0F172A; margin-top: 6px;">
                {flip_res['rent_flip_text']}
            </div>
        </div>
        """, unsafe_allow_html=True)
    with f3:
        st.markdown(f"""
        <div class="rv-card">
            <div style="font-size: 12px; font-weight: 800; color: #64748B; text-transform: uppercase;">INTEREST RATE THRESHOLD</div>
            <div style="font-size: 16px; font-weight: 800; color: #0F172A; margin-top: 6px;">
                {flip_res['rate_flip_text']}
            </div>
        </div>
        """, unsafe_allow_html=True)
