def calculate_rental_yield(monthly_rent, property_price_lakhs):
    """
    Calculate annual rent, property price in INR, rental yield %, and interpretation.
    """
    annual_rent = float(monthly_rent) * 12.0
    price_inr = float(property_price_lakhs) * 100000.0
    
    if price_inr <= 0:
        yield_pct = 0.0
    else:
        yield_pct = (annual_rent / price_inr) * 100.0
        
    yield_pct = round(yield_pct, 2)
    
    if yield_pct >= 5.0:
        interpretation = "High Yield — Excellent cash-flow property exceeding urban benchmark (3.5–4.5%)."
        tier = "High"
        color = "#10B981" # Green
    elif yield_pct >= 3.5:
        interpretation = "Moderate Yield — Strong, stable rental return consistent with prime Bengaluru residential hubs."
        tier = "Moderate"
        color = "#38BDF8" # Blue
    else:
        interpretation = "Low Yield — Appreciation-focused investment with lower immediate cash-flow payout."
        tier = "Low"
        color = "#F59E0B" # Amber
        
    return {
        'monthly_rent': round(monthly_rent, 0),
        'annual_rent': round(annual_rent, 0),
        'property_price_lakhs': round(property_price_lakhs, 2),
        'property_price_inr': round(price_inr, 0),
        'rental_yield_pct': yield_pct,
        'interpretation': interpretation,
        'tier': tier,
        'color': color
    }
