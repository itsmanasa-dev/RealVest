import re

def parse_natural_language_query(query_str):
    """
    Parse a user query into structured search filters.
    Example input: "Find me a 2 BHK property under 60 lakh in Whitefield with good rental yield"
    Returns dict of structured filters.
    """
    query_lower = query_str.lower()
    filters = {
        'max_price': None,
        'min_bhk': None,
        'location': None,
        'min_yield': None,
        'only_undervalued': False,
        'raw_query': query_str
    }
    
    # 1. Extract Max Price in Lakhs
    # Matches patterns like "under 60 lakh", "under 60l", "below 80 lakhs", "budget 50 lakhs", "60 lakh"
    price_match = re.search(r'(?:under|below|budget|less than|within|around|\<)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|l|cr|crore)', query_lower)
    if price_match:
        val = float(price_match.group(1))
        # Handle "crore" or "cr"
        if 'cr' in query_lower or 'crore' in query_lower:
            val = val * 100.0
        filters['max_price'] = val
        
    # 2. Extract BHK count
    bhk_match = re.search(r'(\d+)\s*(?:bhk|bedroom|bed|room)', query_lower)
    if bhk_match:
        filters['min_bhk'] = int(bhk_match.group(1))
        
    # 3. Detect key Bengaluru Locations
    popular_locations = [
        'whitefield', 'sarjapur road', 'sarjapur', 'electronic city', 'kanakpura road', 
        'thanisandra', 'yelahanka', 'uttarahalli', 'hebbal', 'marathahalli', 
        'raja rajeshwari nagar', 'hennur road', 'bannerghatta road', 'jp nagar', 
        'haralur road', 'koramangala', 'hsr layout', 'hsr', 'indiranagar', 'bellandur',
        'devenahalli', 'kaggadasapura', 'kr puram'
    ]
    for loc in popular_locations:
        if loc in query_lower:
            filters['location'] = loc.title()
            break
            
    # 4. Detect Yield preference
    if 'yield' in query_lower or 'rental return' in query_lower or 'cash flow' in query_lower:
        filters['min_yield'] = 3.5
        
    # 5. Detect Undervalued / Deal preference
    if 'undervalued' in query_lower or 'bargain' in query_lower or 'discount' in query_lower or 'cheap' in query_lower:
        filters['only_undervalued'] = True
        
    return filters
