def classify_property_deal(asking_price_lakhs, fair_value_lakhs):
    """
    Classify asking price vs ML fair value estimate.
    Returns status, percentage_diff, summary, and legal disclaimer.
    """
    asking = float(asking_price_lakhs)
    fair = float(fair_value_lakhs)
    
    if fair <= 0:
        diff_pct = 0.0
    else:
        diff_pct = ((asking - fair) / fair) * 100.0
        
    diff_pct = round(diff_pct, 2)
    
    if diff_pct < -7.0:
        status = "Potentially Undervalued"
        color = "#10B981" # Emerald Green
        badge_type = "success"
        explanation = f"Asking price is {abs(diff_pct)}% below the ML-estimated fair value of ₹{fair:,.2f} Lakhs."
    elif diff_pct > 7.0:
        status = "Potentially Overpriced"
        color = "#EF4444" # Crimson Red
        badge_type = "danger"
        explanation = f"Asking price is {diff_pct}% above the ML-estimated fair value of ₹{fair:,.2f} Lakhs."
    else:
        status = "Fairly Priced"
        color = "#38BDF8" # Sky Blue
        badge_type = "info"
        explanation = f"Asking price is within expected market tolerance (±7%) of the estimated fair value (₹{fair:,.2f} Lakhs)."
        
    disclaimer = "Analytical estimate derived from trained ML models on historical market data. Does not constitute a certified appraisal or guaranteed transaction value."
    
    return {
        'status': status,
        'diff_pct': diff_pct,
        'color': color,
        'badge_type': badge_type,
        'explanation': explanation,
        'disclaimer': disclaimer,
        'asking_price_lakhs': asking,
        'fair_value_lakhs': fair
    }
