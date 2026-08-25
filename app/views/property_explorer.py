import os
import streamlit as st
import pandas as pd
from app.translations import t
from src.models.predict import get_price_model, predict_property_price, predict_rent_price
from src.analytics.yield_calculator import calculate_rental_yield
from src.analytics.deal_classifier import classify_property_deal
from src.analytics.investment_scorer import calculate_investment_score
from src.utils.formatting import format_currency_lakhs, format_rent, format_percentage, format_number
from src.utils.validation import safe_float, safe_int
from src.utils.errors import handle_user_errors

PROCESSED_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'processed_data')

@handle_user_errors("Unable to search properties. Please try again.")
def render_property_explorer(lang='English'):
    st.markdown(f"""
    <div>
        <div class="page-head">Property Explorer</div>
        <div class="page-subhead">Explore verified real-estate market listings across Bengaluru with instant ML valuations and yield scores.</div>
    </div>
    """, unsafe_allow_html=True)
    
    m_data = get_price_model()
    top_locations = ['All Locations'] + m_data['top_locations']
    
    parquet_path = os.path.join(PROCESSED_DIR, 'cleaned_bengaluru_house_prices.parquet')
    if not os.path.exists(parquet_path):
        from src.preprocessing.clean_house_prices import preprocess_house_prices
        df = preprocess_house_prices()
    else:
        df = pd.read_parquet(parquet_path)
        
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        sel_loc = st.selectbox("Location", top_locations, index=0)
    with c2:
        bhk_filter = st.selectbox("BHK Configuration", ["All BHK", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"], index=2)
    with c3:
        max_price = st.slider("Max Budget (₹ Lakhs)", min_value=20, max_value=500, value=120, step=10)
    with c4:
        sort_by = st.selectbox("Sort By", ["Investment Score (High to Low)", "Rental Yield (High to Low)", "Price (Low to High)"], index=0)
        
    filtered = df.copy()
    if sel_loc != 'All Locations':
        filtered = filtered[filtered['location'].str.lower() == sel_loc.lower()]
        
    if bhk_filter != 'All BHK':
        if bhk_filter == "1 BHK":
            filtered = filtered[filtered['bhk'] == 1]
        elif bhk_filter == "2 BHK":
            filtered = filtered[filtered['bhk'] == 2]
        elif bhk_filter == "3 BHK":
            filtered = filtered[filtered['bhk'] == 3]
        else:
            filtered = filtered[filtered['bhk'] >= 4]
            
    filtered = filtered[filtered['price'] <= max_price]
    
    st.markdown(f"**Showing {len(filtered):,} properties matching your filters.**")
    st.markdown("<hr style='border-color: #E2E8F0; margin: 16px 0 24px 0;'>", unsafe_allow_html=True)
    
    # Process top 10 matching properties
    sample_pool = filtered.head(15).copy()
    
    items = []
    for idx, row in sample_pool.iterrows():
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
        
        items.append({
            'row_id': idx,
            'location': loc,
            'bhk': bhk,
            'sqft': sqft,
            'asking': asking,
            'fair_val': fair_val,
            'rent': monthly_rent,
            'yield': yield_res['rental_yield_pct'],
            'score': score_res['total_score'],
            'deal_status': deal_res['status'],
            'badge_type': deal_res['badge_type']
        })
        
    df_items = pd.DataFrame(items)
    if not df_items.empty:
        if sort_by == "Investment Score (High to Low)":
            df_items = df_items.sort_values(by='score', ascending=False)
        elif sort_by == "Rental Yield (High to Low)":
            df_items = df_items.sort_values(by='yield', ascending=False)
        else:
            df_items = df_items.sort_values(by='asking', ascending=True)
            
        for _, item in df_items.iterrows():
            st.markdown(f"""
            <div class="rv-card">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <div style="font-size: 18px; font-weight: 800; color: #0F172A;">
                            {item['bhk']} BHK in {item['location']}
                        </div>
                        <div style="font-size: 13px; color: #64748B; margin-top: 2px;">
                            {format_number(item['sqft'], decimals=0)} sqft
                        </div>
                    </div>
                    <span class="badge badge-good">{item['deal_status']}</span>
                </div>
                
                <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #F1F5F9; display: flex; gap: 32px; flex-wrap: wrap;">
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">Asking Price</div>
                        <div style="font-size: 17px; font-weight: 800; color: #0F172A;">{format_currency_lakhs(item['asking'])}</div>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">ML Fair Value</div>
                        <div style="font-size: 17px; font-weight: 800; color: #2563EB;">{format_currency_lakhs(item['fair_val'])}</div>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">Monthly Rent</div>
                        <div style="font-size: 17px; font-weight: 800; color: #15803D;">{format_rent(item['rent'])}</div>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">Rental Yield</div>
                        <div style="font-size: 17px; font-weight: 800; color: #B45309;">{format_percentage(item['yield'])}</div>
                    </div>
                    <div>
                        <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">Score</div>
                        <div style="font-size: 17px; font-weight: 800; color: #0F172A;">{safe_int(item['score'])}/100</div>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            if st.button(f"Analyze {item['bhk']} BHK in {item['location']} (#{item['row_id']})", key=f"exp_btn_{item['row_id']}"):
                st.session_state['active_nav'] = 'Analysis'
                st.rerun()
