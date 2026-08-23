import streamlit as st
import plotly.express as px
import pandas as pd
from app.translations import get_text
from src.analytics.comparison import compare_properties
from src.models.predict import get_price_model

def render_compare_properties(lang='English'):
    st.markdown(f"""
    <div style="margin-bottom: 24px;">
        <h2 style="font-size: 26px; font-weight: 700; color: #F8FAFC;">{get_text('nav_compare', lang)}</h2>
        <p style="color: #94A3B8; font-size: 14px;">Compare multiple properties side-by-side across valuation, expected rent, rental yield, and investment scores.</p>
    </div>
    """, unsafe_allow_html=True)
    
    m_data = get_price_model()
    top_locations = m_data['top_locations']
    
    num_props = st.slider("Number of Properties to Compare", min_value=2, max_value=4, value=3)
    
    props_input = []
    cols = st.columns(num_props)
    
    default_configs = [
        {'name': 'Property A (Whitefield)', 'loc': 'Whitefield', 'sqft': 1350, 'bhk': 2, 'asking': 78.0},
        {'name': 'Property B (Electronic City)', 'loc': 'Electronic City', 'sqft': 1100, 'bhk': 2, 'asking': 52.0},
        {'name': 'Property C (Sarjapur Road)', 'loc': 'Sarjapur Road', 'sqft': 1600, 'bhk': 3, 'asking': 95.0},
        {'name': 'Property D (Hebbal)', 'loc': 'Hebbal', 'sqft': 1800, 'bhk': 3, 'asking': 130.0},
    ]
    
    for idx in range(num_props):
        cfg = default_configs[idx]
        with cols[idx]:
            st.markdown(f"#### Property {idx + 1}")
            p_name = st.text_input(f"Name #{idx+1}", value=cfg['name'], key=f"pname_{idx}")
            p_loc = st.selectbox(f"Location #{idx+1}", top_locations, index=top_locations.index(cfg['loc']) if cfg['loc'] in top_locations else 0, key=f"ploc_{idx}")
            p_sqft = st.number_input(f"Area (Sqft) #{idx+1}", min_value=300, max_value=15000, value=cfg['sqft'], step=50, key=f"psqft_{idx}")
            p_bhk = st.number_input(f"BHK #{idx+1}", min_value=1, max_value=8, value=cfg['bhk'], step=1, key=f"pbhk_{idx}")
            p_asking = st.number_input(f"Asking Price (₹L) #{idx+1}", min_value=5.0, max_value=3000.0, value=cfg['asking'], step=1.0, key=f"pask_{idx}")
            
            props_input.append({
                'name': p_name,
                'location': p_loc,
                'total_sqft': p_sqft,
                'bhk': p_bhk,
                'bath': p_bhk,
                'asking_price_lakhs': p_asking
            })
            
    if st.button(get_text('btn_compare', lang), use_container_width=True):
        res = compare_properties(props_input)
        df_comp = res['comparison_df']
        
        st.markdown("<hr style='border-color: #1E293B; margin: 30px 0;'>", unsafe_allow_html=True)
        st.markdown(f"""
        <div class="realvest-card" style="margin-bottom: 24px; border-left: 4px solid #10B981;">
            <div style="font-size: 16px; font-weight: 700; color: #10B981;">🏆 Best Comparative Pick: {res['best_property_name']}</div>
            <div style="font-size: 14px; color: #F8FAFC; margin-top: 4px;">{res['best_summary']}</div>
        </div>
        """, unsafe_allow_html=True)
        
        # Display Comparative Data Table
        display_cols = [
            'Property Name', 'Location', 'Area (Sqft)', 'BHK', 
            'Asking Price (₹ Lakhs)', 'ML Estimated Value (₹ Lakhs)', 
            'Monthly Rent (₹)', 'Rental Yield (%)', 'Deal Status', 'Investment Score'
        ]
        st.dataframe(df_comp[display_cols], use_container_width=True)
        
        # Chart Comparison
        col_c1, col_c2 = st.columns(2)
        
        with col_c1:
            st.markdown('<div class="section-title">Investment Score Comparison</div>', unsafe_allow_html=True)
            fig_score = px.bar(
                df_comp, 
                x='Property Name', 
                y='Investment Score', 
                color='Investment Score',
                color_continuous_scale='Blues',
                text='Investment Score'
            )
            fig_score.update_layout(
                template='plotly_dark',
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                margin=dict(l=20, r=20, t=30, b=20),
                height=300,
                yaxis=dict(range=[0, 100], gridcolor='#1E293B')
            )
            st.plotly_chart(fig_score, use_container_width=True)
            
        with col_c2:
            st.markdown('<div class="section-title">Rental Yield (%) Comparison</div>', unsafe_allow_html=True)
            fig_yield = px.bar(
                df_comp, 
                x='Property Name', 
                y='Rental Yield (%)', 
                color='Rental Yield (%)',
                color_continuous_scale='Greens',
                text='Rental Yield (%)'
            )
            fig_yield.update_layout(
                template='plotly_dark',
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                margin=dict(l=20, r=20, t=30, b=20),
                height=300,
                yaxis=dict(gridcolor='#1E293B')
            )
            st.plotly_chart(fig_yield, use_container_width=True)
