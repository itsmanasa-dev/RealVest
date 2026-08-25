import pandas as pd
import numpy as np

def calculate_risk_radar(asking_price_lakhs, fair_value_lakhs, rental_yield_pct, location_used='Whitefield', yoy_growth_pct=1.9, data_points_count=25):
    """
    Calculate comprehensive Risk Radar metrics across 5 key dimensions:
    1. Price Risk
    2. Rental Risk
    3. Market Risk
    4. Location Risk
    5. Data Confidence Risk
    
    Returns structured dictionary with overall risk tier, score, and breakdown per category.
    """
    asking = float(asking_price_lakhs)
    fair = float(fair_value_lakhs)
    yield_val = float(rental_yield_pct)
    yoy_val = float(yoy_growth_pct)
    
    risks = []
    
    # 1. Price Risk
    if fair > 0:
        overprice_pct = ((asking - fair) / fair) * 100.0
    else:
        overprice_pct = 0.0
        
    if overprice_pct > 12.0:
        price_level = "HIGH"
        price_color = "#EF4444"
        price_why = f"Asking price is {overprice_pct:.1f}% above estimated ML fair value (₹{fair:,.2f} L). Premium valuation risk."
    elif overprice_pct > 4.0:
        price_level = "MEDIUM"
        price_color = "#F59E0B"
        price_why = f"Asking price is slightly above fair value ({overprice_pct:.1f}% premium). Modest negotiation room."
    else:
        price_level = "LOW"
        price_color = "#10B981"
        price_why = f"Asking price is well-aligned or discounted relative to ML fair value (₹{fair:,.2f} L)."
        
    risks.append({
        'category': 'Price Risk',
        'level': price_level,
        'color': price_color,
        'why': price_why,
        'metric_label': 'Price Premium',
        'metric_value': f"{overprice_pct:+.1f}%"
    })
    
    # 2. Rental Risk
    if yield_val < 3.0:
        rent_level = "HIGH"
        rent_color = "#EF4444"
        rent_why = f"Rental yield of {yield_val:.2f}% is below Bengaluru urban benchmark (3.5–4.5%). Low cash-flow protection."
    elif yield_val < 4.0:
        rent_level = "MEDIUM"
        rent_color = "#F59E0B"
        rent_why = f"Rental yield of {yield_val:.2f}% is healthy and inline with city averages."
    else:
        rent_level = "LOW"
        rent_color = "#10B981"
        rent_why = f"High rental yield of {yield_val:.2f}% provides strong cash-flow downside buffer."
        
    risks.append({
        'category': 'Rental Risk',
        'level': rent_level,
        'color': rent_color,
        'why': rent_why,
        'metric_label': 'Rental Yield',
        'metric_value': f"{yield_val:.2f}%"
    })
    
    # 3. Market Risk
    if yoy_val < 0.0:
        mkt_level = "HIGH"
        mkt_color = "#EF4444"
        mkt_why = f"Negative HPI YoY index trend ({yoy_val:.1f}%) indicates cooling price momentum across city sector."
    elif yoy_val < 3.0:
        mkt_level = "MEDIUM"
        mkt_color = "#F59E0B"
        mkt_why = f"Moderate YoY HPI index growth ({yoy_val:.1f}%) indicates stable, non-speculative price appreciation."
    else:
        mkt_level = "LOW"
        mkt_color = "#10B981"
        mkt_why = f"Strong YoY HPI index momentum ({yoy_val:.1f}%) supports steady macro capital appreciation."
        
    risks.append({
        'category': 'Market Risk',
        'level': mkt_level,
        'color': mkt_color,
        'why': mkt_why,
        'metric_label': 'HPI Growth YoY',
        'metric_value': f"{yoy_val:+.1f}%"
    })
    
    # 4. Location Risk
    is_prime = location_used != 'Other'
    if is_prime:
        loc_level = "LOW"
        loc_color = "#10B981"
        loc_why = f"Micro-market '{location_used}' has proven historical transaction liquidity and established infrastructure."
    else:
        loc_level = "MEDIUM"
        loc_color = "#F59E0B"
        loc_why = f"Location '{location_used}' is benchmarked to general regional sub-market cluster."
        
    risks.append({
        'category': 'Location Risk',
        'level': loc_level,
        'color': loc_color,
        'why': loc_why,
        'metric_label': 'Micro-Market Tier',
        'metric_value': 'Established' if is_prime else 'General'
    })
    
    # 5. Data Confidence
    if data_points_count >= 15:
        data_level = "HIGH CONFIDENCE"
        data_color = "#10B981"
        data_why = f"Valuation backed by strong local transaction sample density ({data_points_count}+ records)."
    elif data_points_count >= 5:
        data_level = "MEDIUM CONFIDENCE"
        data_color = "#F59E0B"
        data_why = f"Valuation backed by moderate sample density ({data_points_count} records) in target zone."
    else:
        data_level = "LIMITED DATA"
        data_color = "#EF4444"
        data_why = "Limited comparable records in immediate vicinity. Broader cluster benchmarks applied."
        
    risks.append({
        'category': 'Data Confidence',
        'level': data_level,
        'color': data_color,
        'why': data_why,
        'metric_label': 'Sample Count',
        'metric_value': f"{data_points_count} listings"
    })
    
    # Calculate aggregate risk score (0 = Highest Risk, 100 = Lowest Risk)
    level_weights = {'LOW': 100, 'HIGH CONFIDENCE': 100, 'MEDIUM': 65, 'MEDIUM CONFIDENCE': 65, 'HIGH': 30, 'LIMITED DATA': 30}
    total_score = sum(level_weights.get(r['level'], 65) for r in risks) / len(risks)
    
    if total_score >= 80:
        overall_risk = "LOW RISK"
        overall_color = "#10B981"
    elif total_score >= 60:
        overall_risk = "MODERATE RISK"
        overall_color = "#F59E0B"
    else:
        overall_risk = "HIGH RISK"
        overall_color = "#EF4444"
        
    return {
        'overall_risk': overall_risk,
        'overall_color': overall_color,
        'risk_score': round(total_score, 1),
        'breakdown': risks
    }
