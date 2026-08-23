import os
import pandas as pd
import numpy as np
from src.ai.query_parser import parse_natural_language_query
from src.models.predict import predict_property_price, predict_rent_price
from src.analytics.yield_calculator import calculate_rental_yield
from src.analytics.deal_classifier import classify_property_deal
from src.analytics.investment_scorer import calculate_investment_score
from src.models.explain import get_property_price_explanation

PROCESSED_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'processed_data')

def recommend_properties(query_str, top_n=5):
    """
    Translate NL query to filters, filter real dataset, run predictions & scores, rank top_n.
    Returns parsed filters, candidate count, top recommended properties with AI explanations.
    """
    filters = parse_natural_language_query(query_str)
    
    parquet_path = os.path.join(PROCESSED_DIR, 'cleaned_bengaluru_house_prices.parquet')
    if not os.path.exists(parquet_path):
        from src.preprocessing.clean_house_prices import preprocess_house_prices
        df = preprocess_house_prices()
    else:
        df = pd.read_parquet(parquet_path)
        
    filtered = df.copy()
    
    # Filter by location if specified
    if filters['location']:
        loc_term = filters['location'].lower()
        filtered = filtered[filtered['location'].str.lower().str.contains(loc_term, na=False)]
        if len(filtered) == 0:
            # Fallback to general dataset if strict match yields 0
            filtered = df.copy()
            
    # Filter by BHK
    if filters['min_bhk']:
        filtered = filtered[filtered['bhk'] == filters['min_bhk']]
        
    # Filter by Max Price
    if filters['max_price']:
        filtered = filtered[filtered['price'] <= filters['max_price']]
        
    if len(filtered) == 0:
        # Fallback to closest price range
        filtered = df.sort_values(by='price').head(50)
        
    # Sample candidate pool (max 100) to keep analytics fast and responsive
    candidate_pool = filtered.sample(n=min(100, len(filtered)), random_state=42).copy()
    
    results = []
    for _, row in candidate_pool.iterrows():
        loc = str(row['location'])
        sqft = float(row['total_sqft_num'])
        bhk = int(row['bhk'])
        bath = float(row['bath'])
        asking = float(row['price'])
        area_type = str(row['area_type'])
        
        val_res = predict_property_price(loc, sqft, bhk, bath=bath, area_type=area_type)
        fair_val = val_res['estimated_price_lakhs']
        
        rent_res = predict_rent_price(loc, sqft, bhk, bathrooms=bath)
        monthly_rent = rent_res['estimated_rent_monthly']
        
        yield_res = calculate_rental_yield(monthly_rent, asking)
        deal_res = classify_property_deal(asking, fair_val)
        score_res = calculate_investment_score(asking, fair_val, yield_res['rental_yield_pct'])
        
        # Filter by yield or deal if required
        if filters['min_yield'] and yield_res['rental_yield_pct'] < filters['min_yield']:
            continue
        if filters['only_undervalued'] and deal_res['status'] != 'Potentially Undervalued':
            continue
            
        # Explanations
        expl = get_property_price_explanation(loc, sqft, bhk, bath, float(row['balcony']), area_type)
        why_text = f"Recommended because asking price of ₹{asking:,.2f} Lakhs is "
        if deal_res['status'] == 'Potentially Undervalued':
            why_text += f"{abs(deal_res['diff_pct'])}% below estimated fair value (₹{fair_val:,.2f} Lakhs) with a strong rental yield of {yield_res['rental_yield_pct']}%."
        else:
            why_text += f"fairly benchmarked to ML valuation (₹{fair_val:,.2f} Lakhs) with an estimated monthly rent of ₹{monthly_rent:,.0f}."
            
        results.append({
            'location': loc,
            'bhk': bhk,
            'sqft': sqft,
            'bath': bath,
            'area_type': area_type,
            'asking_price_lakhs': asking,
            'fair_value_lakhs': fair_val,
            'monthly_rent': monthly_rent,
            'rental_yield_pct': yield_res['rental_yield_pct'],
            'deal_status': deal_res['status'],
            'investment_score': score_res['total_score'],
            'rating': score_res['rating'],
            'color': score_res['color'],
            'why_recommended': why_text,
            'details': expl['explanations']
        })
        
    if not results:
        # If filters were too strict, return top scored from filtered
        for _, row in candidate_pool.head(top_n).iterrows():
            loc = str(row['location'])
            sqft = float(row['total_sqft_num'])
            bhk = int(row['bhk'])
            bath = float(row['bath'])
            asking = float(row['price'])
            val_res = predict_property_price(loc, sqft, bhk, bath=bath)
            fair_val = val_res['estimated_price_lakhs']
            rent_res = predict_rent_price(loc, sqft, bhk, bathrooms=bath)
            monthly_rent = rent_res['estimated_rent_monthly']
            yield_res = calculate_rental_yield(monthly_rent, asking)
            deal_res = classify_property_deal(asking, fair_val)
            score_res = calculate_investment_score(asking, fair_val, yield_res['rental_yield_pct'])
            results.append({
                'location': loc,
                'bhk': bhk,
                'sqft': sqft,
                'bath': bath,
                'area_type': str(row['area_type']),
                'asking_price_lakhs': asking,
                'fair_value_lakhs': fair_val,
                'monthly_rent': monthly_rent,
                'rental_yield_pct': yield_res['rental_yield_pct'],
                'deal_status': deal_res['status'],
                'investment_score': score_res['total_score'],
                'rating': score_res['rating'],
                'color': score_res['color'],
                'why_recommended': f"Best available match in {loc} with {yield_res['rental_yield_pct']}% estimated rental yield.",
                'details': []
            })
            
    res_df = pd.DataFrame(results).sort_values(by='investment_score', ascending=False).head(top_n)
    
    return {
        'parsed_filters': filters,
        'recommendations': res_df.to_dict(orient='records')
    }
