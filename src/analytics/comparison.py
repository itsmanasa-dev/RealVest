import pandas as pd
from src.models.predict import predict_property_price, predict_rent_price
from src.analytics.yield_calculator import calculate_rental_yield
from src.analytics.deal_classifier import classify_property_deal
from src.analytics.investment_scorer import calculate_investment_score

def compare_properties(properties_list):
    """
    Given a list of dicts with keys: name, location, total_sqft, bhk, bath, asking_price_lakhs, area_type, is_ready
    Returns comparative DataFrame, summary, and best property pick.
    """
    results = []
    
    for idx, p in enumerate(properties_list):
        name = p.get('name', f"Property {idx + 1}")
        loc = p.get('location', 'Whitefield')
        sqft = float(p.get('total_sqft', 1200))
        bhk = int(p.get('bhk', 2))
        bath = float(p.get('bath', 2))
        asking = float(p.get('asking_price_lakhs', 75.0))
        
        # Valuation prediction
        val_res = predict_property_price(loc, sqft, bhk, bath=bath)
        fair_val = val_res['estimated_price_lakhs']
        
        # Rent prediction
        rent_res = predict_rent_price(loc, sqft, bhk, bathrooms=bath)
        monthly_rent = rent_res['estimated_rent_monthly']
        
        # Yield
        yield_res = calculate_rental_yield(monthly_rent, asking)
        
        # Deal
        deal_res = classify_property_deal(asking, fair_val)
        
        # Investment score
        score_res = calculate_investment_score(asking, fair_val, yield_res['rental_yield_pct'])
        
        results.append({
            'Property Name': name,
            'Location': loc,
            'Area (Sqft)': f"{sqft:,.0f}",
            'BHK': bhk,
            'Asking Price (₹ Lakhs)': asking,
            'ML Estimated Value (₹ Lakhs)': fair_val,
            'Monthly Rent (₹)': f"{monthly_rent:,.0f}",
            'Annual Rent (₹)': f"{yield_res['annual_rent']:,.0f}",
            'Rental Yield (%)': yield_res['rental_yield_pct'],
            'Deal Status': deal_res['status'],
            'Investment Score': score_res['total_score'],
            'Score Rating': score_res['rating'],
            'raw_score': score_res['total_score'],
            'raw_fair_val': fair_val,
            'raw_yield': yield_res['rental_yield_pct']
        })
        
    df_comp = pd.DataFrame(results)
    
    # Identify top property by score
    best_prop = df_comp.loc[df_comp['raw_score'].idxmax()]
    
    return {
        'comparison_df': df_comp,
        'best_property_name': best_prop['Property Name'],
        'best_score': best_prop['Investment Score'],
        'best_summary': f"{best_prop['Property Name']} in {best_prop['Location']} leads with an Investment Score of {best_prop['Investment Score']}/100 and {best_prop['Rental Yield (%)']}% rental yield."
    }
