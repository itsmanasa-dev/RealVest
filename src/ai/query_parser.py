import re

def parse_natural_language_query(query_str):
    """
    Parse a user query (English, Hindi, Kannada) into structured search filters.
    Example input: "Find me a 2 BHK property under 60 lakh in Whitefield with good rental yield"
    Hindi input: "₹60 लाख के अंदर अच्छी rental वाली property दिखाओ"
    Kannada input: "₹60 ಲಕ್ಷದ ಒಳಗೆ ಉತ್ತಮ rental income ಇರುವ property ತೋರಿಸಿ"
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
    
    # 1. Extract Max Price in Lakhs (supports lakh, lakhs, l, cr, crore, लाख, ಲಕ್ಷ, ₹)
    price_match = re.search(r'(?:under|below|budget|less than|within|around|\<|अंदर|के अंदर|ಒಳಗೆ)?\s*₹?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|l|cr|crore|लाख|लक्ष|ಲಕ್ಷ|ಲಕ್ಷದ)', query_lower)
    if price_match:
        val = float(price_match.group(1))
        if 'cr' in query_lower or 'crore' in query_lower or 'करोड़' in query_lower:
            val = val * 100.0
        filters['max_price'] = val
    else:
        # Secondary fallback regex for price numbers standing next to currency or words
        price_match_fallback = re.search(r'₹?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|l|लाख|ಲಕ್ಷ)', query_lower)
        if price_match_fallback:
            filters['max_price'] = float(price_match_fallback.group(1))
        
    # 2. Extract BHK count (supports bhk, bedroom, bed, room, बीएचके)
    bhk_match = re.search(r'(\d+)\s*(?:bhk|bedroom|bed|room|b.h.k|बीएचके)', query_lower)
    if bhk_match:
        filters['min_bhk'] = int(bhk_match.group(1))
        
    # 3. Detect key Bengaluru Locations
    popular_locations = [
        'whitefield', 'sarjapur road', 'sarjapur', 'electronic city', 'kanakpura road', 
        'thanisandra', 'yelahanka', 'uttarahalli', 'hebbal', 'marathahalli', 
        'raja rajeshwari nagar', 'hennur road', 'bannerghatta road', 'jp nagar', 
        'haralur road', 'koramangala', 'hsr layout', 'hsr', 'indiranagar', 'bellandur',
        'devenahalli', 'kaggadasapura', 'kr puram', 'व्हाइटफील्ड', 'इलेक्ट्रॉनिक सिटी'
    ]
    for loc in popular_locations:
        if loc in query_lower:
            if loc == 'व्हाइटफील्ड':
                filters['location'] = 'Whitefield'
            elif loc == 'इलेक्ट्रॉनिक सिटी':
                filters['location'] = 'Electronic City'
            else:
                filters['location'] = loc.title()
            break
            
    # 4. Detect Yield preference
    if any(k in query_lower for k in ['yield', 'rental', 'return', 'income', 'cash flow', 'किराया', 'रेंटल', 'ಬಾಡಿಗೆ']):
        filters['min_yield'] = 3.5
        
    # 5. Detect Undervalued / Deal preference
    if any(k in query_lower for k in ['undervalued', 'bargain', 'discount', 'cheap', 'अच्छी', 'ಉತ್ತಮ']):
        filters['only_undervalued'] = True
        
    return filters
