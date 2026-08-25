import numpy as np

def calculate_monthly_emi(loan_amount_lakhs, interest_rate_pct, tenure_years=20):
    """Calculate monthly home loan EMI in INR."""
    loan_inr = loan_amount_lakhs * 100000.0
    if loan_inr <= 0 or interest_rate_pct <= 0:
        return 0.0
    r = (interest_rate_pct / 100.0) / 12.0
    n = tenure_years * 12
    emi = loan_inr * r * ((1 + r)**n) / (((1 + r)**n) - 1)
    return round(emi, 2)

def simulate_investment_scenario(
    purchase_price_lakhs=75.0,
    down_payment_pct=20.0,
    interest_rate_pct=8.5,
    tenure_years=20,
    monthly_rent_inr=25000.0,
    vacancy_rate_pct=5.0,
    appreciation_rate_pct=5.0,
    holding_period_years=5,
    fair_value_lakhs=75.0,
    location='Whitefield'
):
    """
    Run full financial investment simulation and compute cash flows, ROI, and metrics.
    """
    price_lakhs = float(purchase_price_lakhs)
    price_inr = price_lakhs * 100000.0
    
    down_payment_inr = price_inr * (down_payment_pct / 100.0)
    loan_lakhs = price_lakhs * (1.0 - down_payment_pct / 100.0)
    
    emi = calculate_monthly_emi(loan_lakhs, interest_rate_pct, tenure_years)
    
    effective_monthly_rent = monthly_rent_inr * (1.0 - vacancy_rate_pct / 100.0)
    net_monthly_cash_flow = effective_monthly_rent - emi
    net_annual_cash_flow = net_monthly_cash_flow * 12.0
    
    # Capital appreciation over holding period
    projected_future_val_lakhs = price_lakhs * ((1.0 + appreciation_rate_pct / 100.0)**holding_period_years)
    capital_gain_lakhs = projected_future_val_lakhs - price_lakhs
    capital_gain_inr = capital_gain_lakhs * 100000.0
    
    # Cumulative cash flow during holding period
    total_cash_flow_inr = net_annual_cash_flow * holding_period_years
    
    # Total Profit and ROI %
    total_profit_inr = capital_gain_inr + total_cash_flow_inr
    roi_pct = (total_profit_inr / down_payment_inr) * 100.0 if down_payment_inr > 0 else 0.0
    annualized_roi_pct = (roi_pct / holding_period_years) if holding_period_years > 0 else 0.0
    
    rental_yield_pct = ((monthly_rent_inr * 12.0) / price_inr) * 100.0 if price_inr > 0 else 0.0
    
    from src.analytics.decision_engine import generate_property_decision
    decision_res = generate_property_decision(
        price_lakhs,
        fair_value_lakhs,
        rental_yield_pct,
        location_used=location
    )
    
    return {
        'purchase_price_lakhs': round(price_lakhs, 2),
        'down_payment_lakhs': round(down_payment_inr / 100000.0, 2),
        'loan_amount_lakhs': round(loan_lakhs, 2),
        'monthly_emi_inr': round(emi, 0),
        'effective_monthly_rent': round(effective_monthly_rent, 0),
        'net_monthly_cash_flow': round(net_monthly_cash_flow, 0),
        'net_annual_cash_flow': round(net_annual_cash_flow, 0),
        'rental_yield_pct': round(rental_yield_pct, 2),
        'projected_future_val_lakhs': round(projected_future_val_lakhs, 2),
        'total_profit_inr': round(total_profit_inr, 0),
        'total_roi_pct': round(roi_pct, 1),
        'annualized_roi_pct': round(annualized_roi_pct, 1),
        'decision': decision_res['decision'],
        'decision_color': decision_res['color'],
        'confidence_pct': decision_res['confidence_pct'],
        'reasons': decision_res['reasons'],
        'risks': decision_res['risks']
    }

def compare_base_vs_scenario(base_params, scenario_params):
    """
    Compare BASE CASE vs USER SCENARIO side by side and explain why recommendation changed.
    """
    base_res = simulate_investment_scenario(**base_params)
    scen_res = simulate_investment_scenario(**scenario_params)
    
    decision_changed = base_res['decision'] != scen_res['decision']
    explanation = ""
    
    if decision_changed:
        if base_res['decision'] == 'BUY' and scen_res['decision'] in ['HOLD', 'AVOID']:
            explanation = f"Recommendation changed from **{base_res['decision']}** to **{scen_res['decision']}** because the scenario changes reduced net monthly cash flow from ₹{base_res['net_monthly_cash_flow']:,.0f} to ₹{scen_res['net_monthly_cash_flow']:,.0f}."
        else:
            explanation = f"Recommendation changed from **{base_res['decision']}** to **{scen_res['decision']}** due to improved pricing or return metrics."
    else:
        explanation = f"Recommendation remains **{scen_res['decision']}**. Net monthly cash flow adjusted from ₹{base_res['net_monthly_cash_flow']:,.0f} to ₹{scen_res['net_monthly_cash_flow']:,.0f}."
        
    return {
        'base': base_res,
        'scenario': scen_res,
        'decision_changed': decision_changed,
        'explanation': explanation
    }
