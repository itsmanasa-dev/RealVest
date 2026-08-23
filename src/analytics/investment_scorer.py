def calculate_investment_score(asking_price_lakhs, fair_value_lakhs, rental_yield_pct, location_tier='Prime'):
    """
    Calculate transparent Investment Score out of 100 with clear breakdown.
    Weights:
    - 35% Valuation Ratio (Fair Value / Asking Price)
    - 35% Rental Yield Score
    - 15% Location & Infrastructure Tier
    - 15% Market Trend Benchmark
    """
    asking = float(asking_price_lakhs)
    fair = float(fair_value_lakhs)
    
    # 1. Valuation Ratio Score (35%)
    val_ratio = (fair / asking) if asking > 0 else 1.0
    if val_ratio >= 1.15:
        val_score = 100.0
    elif val_ratio <= 0.85:
        val_score = 30.0
    else:
        val_score = 30.0 + ((val_ratio - 0.85) / 0.30) * 70.0
    val_weighted = val_score * 0.35
    
    # 2. Rental Yield Score (35%)
    yield_val = float(rental_yield_pct)
    if yield_val >= 5.5:
        yield_score = 100.0
    elif yield_val <= 2.0:
        yield_score = 30.0
    else:
        yield_score = 30.0 + ((yield_val - 2.0) / 3.5) * 70.0
    yield_weighted = yield_score * 0.35
    
    # 3. Location Tier Score (15%)
    tier_map = {
        'Prime': 90.0,
        'Established': 80.0,
        'Emerging': 70.0,
        'General Suburb': 60.0
    }
    loc_score = tier_map.get(location_tier, 75.0)
    loc_weighted = loc_score * 0.15
    
    # 4. Market Trend Benchmark (15%)
    trend_score = 80.0 # Benchmark HPI growth for Bengaluru urban zone
    trend_weighted = trend_score * 0.15
    
    total_score = round(val_weighted + yield_weighted + loc_weighted + trend_weighted, 1)
    total_score = min(100.0, max(0.0, total_score))
    
    if total_score >= 80:
        rating = "Strong Buy Opportunity"
        color = "#10B981"
    elif total_score >= 65:
        rating = "Moderate Investment Potential"
        color = "#38BDF8"
    else:
        rating = "Cautious / Low Yield Potential"
        color = "#F59E0B"
        
    breakdown = [
        {"metric": "Valuation Ratio (Fair / Asking)", "weight": "35%", "score": round(val_score, 1), "contribution": round(val_weighted, 1)},
        {"metric": "Rental Yield Return", "weight": "35%", "score": round(yield_score, 1), "contribution": round(yield_weighted, 1)},
        {"metric": "Location Micro-Market Tier", "weight": "15%", "score": round(loc_score, 1), "contribution": round(loc_weighted, 1)},
        {"metric": "Market Trend (HPI Index)", "weight": "15%", "score": round(trend_score, 1), "contribution": round(trend_weighted, 1)},
    ]
    
    return {
        'total_score': total_score,
        'rating': rating,
        'color': color,
        'breakdown': breakdown
    }
