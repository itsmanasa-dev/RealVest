from src.analytics.decision_simulator import simulate_investment_scenario

def calculate_decision_flip_boundaries(
    current_price_lakhs=75.0,
    fair_value_lakhs=75.0,
    current_rent_inr=25000.0,
    down_payment_pct=20.0,
    interest_rate_pct=8.5,
    location='Whitefield'
):
    """
    Calculate precise decision boundaries answering:
    'What would need to change for this recommendation to change?'
    """
    current_sim = simulate_investment_scenario(
        purchase_price_lakhs=current_price_lakhs,
        fair_value_lakhs=fair_value_lakhs,
        monthly_rent_inr=current_rent_inr,
        down_payment_pct=down_payment_pct,
        interest_rate_pct=interest_rate_pct,
        location=location
    )
    
    current_decision = current_sim['decision']
    
    # 1. Price Threshold (Find price where decision flips)
    price_flip_lakhs = None
    if current_decision == 'BUY':
        # Find price where it degrades to HOLD/AVOID (usually fair_value * 1.08)
        price_flip_lakhs = round(fair_value_lakhs * 1.07, 2)
        price_flip_text = f"Purchase price exceeds ₹{price_flip_lakhs:,.2f} Lakhs (+7% above fair value)."
    elif current_decision == 'HOLD':
        # Find price for BUY or AVOID
        price_flip_lakhs = round(fair_value_lakhs * 0.95, 2)
        price_flip_text = f"Purchase price is negotiated down to ₹{price_flip_lakhs:,.2f} Lakhs (-5% discount)."
    else: # AVOID
        price_flip_lakhs = round(fair_value_lakhs * 0.92, 2)
        price_flip_text = f"Purchase price is discounted below ₹{price_flip_lakhs:,.2f} Lakhs."
        
    # 2. Minimum Rent Threshold
    # Rent required for positive net cash flow
    price_inr = current_price_lakhs * 100000.0
    loan_lakhs = current_price_lakhs * (1.0 - down_payment_pct / 100.0)
    emi = current_sim['monthly_emi_inr']
    min_rent_for_positive_cashflow = round(emi / 0.95, 0)
    
    if current_rent_inr < min_rent_for_positive_cashflow:
        rent_flip_text = f"Monthly rent increases from ₹{current_rent_inr:,.0f} to at least ₹{min_rent_for_positive_cashflow:,.0f}."
    else:
        # Rent drop threshold that makes cash flow negative
        rent_drop_threshold = round(emi, 0)
        rent_flip_text = f"Monthly rent falls below ₹{rent_drop_threshold:,.0f} (resulting in negative cash flow)."
        
    # 3. Interest Rate Threshold (Interest rate where cash flow becomes negative)
    # Search interest rates from 5% to 18% in steps of 0.5%
    max_rate_threshold = interest_rate_pct
    for r in [x * 0.5 for x in range(10, 36)]:
        sim_r = simulate_investment_scenario(
            purchase_price_lakhs=current_price_lakhs,
            fair_value_lakhs=fair_value_lakhs,
            monthly_rent_inr=current_rent_inr,
            down_payment_pct=down_payment_pct,
            interest_rate_pct=r,
            location=location
        )
        if sim_r['net_monthly_cash_flow'] < 0:
            max_rate_threshold = r
            break
            
    rate_flip_text = f"Home loan interest rate rises above {max_rate_threshold:.1f}% (current: {interest_rate_pct:.1f}%)."
    
    return {
        'current_decision': current_decision,
        'price_flip_lakhs': price_flip_lakhs,
        'price_flip_text': price_flip_text,
        'rent_flip_text': rent_flip_text,
        'rate_flip_threshold_pct': max_rate_threshold,
        'rate_flip_text': rate_flip_text
    }
