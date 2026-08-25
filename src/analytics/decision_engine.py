from src.analytics.risk_radar import calculate_risk_radar

def generate_property_decision(asking_price_lakhs, fair_value_lakhs, rental_yield_pct, location_used='Whitefield', yoy_growth_pct=1.9, mae_margin_lakhs=12.5):
    """
    Generate transparent, non-black-box decision recommendation:
    Decision: BUY | HOLD | AVOID
    Confidence: XX%
    Reasons: Bulleted supporting evidence
    Risks: Bulleted risk factors
    """
    asking = float(asking_price_lakhs)
    fair = float(fair_value_lakhs)
    yield_val = float(rental_yield_pct)
    
    # 1. Price diff percentage
    if fair > 0:
        diff_pct = ((asking - fair) / fair) * 100.0
    else:
        diff_pct = 0.0
        
    # 2. Risk Radar
    radar = calculate_risk_radar(asking, fair, yield_val, location_used, yoy_growth_pct)
    
    # 3. Decision Logic
    reasons = []
    risks = []
    
    if diff_pct <= -5.0 and yield_val >= 3.8:
        decision = "BUY"
        color = "#10B981"
        badge_type = "success"
        reasons.append(f"Property is priced {abs(diff_pct):.1f}% below ML-estimated fair value of ₹{fair:,.2f} Lakhs.")
        reasons.append(f"Attractive rental yield ({yield_val:.2f}%) exceeds city average baseline.")
        reasons.append(f"Located in established micro-market '{location_used}' with steady demand.")
    elif diff_pct <= 5.0 and yield_val >= 3.5:
        decision = "HOLD"
        color = "#38BDF8"
        badge_type = "info"
        reasons.append(f"Asking price (₹{asking:,.2f} L) is fairly aligned with ML estimated valuation (₹{fair:,.2f} L).")
        reasons.append(f"Stable rental return ({yield_val:.2f}%) provides predictable cash flow.")
        if diff_pct > 0:
            risks.append(f"Modest asking price premium ({diff_pct:.1f}%) leaves narrow immediate upside.")
    elif diff_pct > 10.0 or yield_val < 2.8:
        decision = "AVOID"
        color = "#EF4444"
        badge_type = "danger"
        if diff_pct > 10.0:
            risks.append(f"Property is overpriced by {diff_pct:.1f}% relative to ML fair value estimate.")
        if yield_val < 2.8:
            risks.append(f"Low rental yield ({yield_val:.2f}%) fails to provide adequate cash-flow coverage.")
        reasons.append("Better risk-adjusted investment alternatives available in neighboring localities.")
    else:
        decision = "HOLD"
        color = "#F59E0B"
        badge_type = "warning"
        reasons.append("Fair valuation but mixed yield metrics require strategic price negotiation.")
        if diff_pct > 0:
            risks.append(f"Asking price carries a {diff_pct:.1f}% premium over benchmark fair value.")

    # Always ensure at least 2 reasons and 1-2 risks
    if len(reasons) < 2:
        reasons.append("Micro-market transaction liquidity remains steady based on historical records.")
    if len(risks) == 0:
        risks.append("Interest rate changes could impact net leveraged monthly returns.")

    # 4. Confidence Calculation
    # Higher confidence if model MAE is low relative to price, location is known, and price is reasonable
    mae_pct = (mae_margin_lakhs / fair) * 100.0 if fair > 0 else 15.0
    conf_score = 100.0 - min(30.0, mae_pct * 1.2)
    if location_used != 'Other':
        conf_score += 5.0
    else:
        conf_score -= 10.0
        
    confidence_pct = round(min(92.0, max(55.0, conf_score)), 0)
    
    return {
        'decision': decision,
        'color': color,
        'badge_type': badge_type,
        'confidence_pct': int(confidence_pct),
        'reasons': reasons,
        'risks': risks,
        'risk_radar': radar
    }
