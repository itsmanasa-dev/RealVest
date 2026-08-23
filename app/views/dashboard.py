import streamlit as st
import pandas as pd
import plotly.express as px
from app.translations import get_text
from src.analytics.hpi_analytics import get_hpi_trend_analysis
from src.ai.recommendation_engine import recommend_properties

def render_dashboard(lang='English'):
    # Hero Title & Desc
    st.markdown(f"""
    <div style="margin-bottom: 28px;">
        <h1 style="font-size: 32px; font-weight: 800; color: #F8FAFC; margin-bottom: 8px;">
            {get_text('hero_title', lang)}
        </h1>
        <p style="font-size: 15px; color: #94A3B8; max-width: 850px; line-height: 1.6;">
            {get_text('hero_desc', lang)}
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Hero Stats Bar
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown("""
        <div class="realvest-card">
            <div class="card-label">Sale Properties</div>
            <div class="card-value">12,918</div>
            <div class="card-subtext">Verified Bengaluru Listings</div>
        </div>
        """, unsafe_allow_html=True)
        
    with col2:
        st.markdown("""
        <div class="realvest-card">
            <div class="card-label">Rental Database</div>
            <div class="card-value">1,775</div>
            <div class="card-subtext">Active Rental Benchmarks</div>
        </div>
        """, unsafe_allow_html=True)
        
    with col3:
        st.markdown("""
        <div class="realvest-card">
            <div class="card-label">Avg Price / Sqft</div>
            <div class="card-value">₹5,580</div>
            <div class="card-subtext">Bengaluru Urban Average</div>
        </div>
        """, unsafe_allow_html=True)
        
    with col4:
        st.markdown("""
        <div class="realvest-card">
            <div class="card-label">HPI Index Growth</div>
            <div class="card-value">+34.3%</div>
            <div class="card-subtext">NHB Residex Trajectory</div>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Main Content Columns
    col_left, col_right = st.columns([7, 5])
    
    with col_left:
        st.markdown('<div class="section-title">Top Investment Opportunities</div>', unsafe_allow_html=True)
        recs = recommend_properties("Top 3 BHK undervalued under 100 lakh in Whitefield", top_n=4)
        
        for item in recs['recommendations']:
            badge_class = "badge-undervalued" if item['deal_status'] == "Potentially Undervalued" else "badge-fair"
            st.markdown(f"""
            <div class="realvest-card" style="margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h4 style="font-size: 16px; font-weight: 700; color: #F8FAFC; margin: 0;">{item['bhk']} BHK in {item['location']}</h4>
                        <div style="font-size: 13px; color: #94A3B8; margin-top: 4px;">{item['sqft']:,.0f} sqft • {item['area_type']}</div>
                    </div>
                    <span class="{badge_class}">{item['deal_status']}</span>
                </div>
                <div style="display: flex; gap: 24px; margin-top: 14px; padding-top: 12px; border-top: 1px solid #334155;">
                    <div>
                        <div style="font-size: 11px; color: #64748B; text-transform: uppercase;">Asking Price</div>
                        <div style="font-size: 16px; font-weight: 700; color: #F8FAFC;">₹{item['asking_price_lakhs']} Lakhs</div>
                    </div>
                    <div>
                        <div style="font-size: 11px; color: #64748B; text-transform: uppercase;">Fair Value</div>
                        <div style="font-size: 16px; font-weight: 700; color: #38BDF8;">₹{item['fair_value_lakhs']} Lakhs</div>
                    </div>
                    <div>
                        <div style="font-size: 11px; color: #64748B; text-transform: uppercase;">Est. Rent</div>
                        <div style="font-size: 16px; font-weight: 700; color: #10B981;">₹{item['monthly_rent']:,.0f}/mo</div>
                    </div>
                    <div>
                        <div style="font-size: 11px; color: #64748B; text-transform: uppercase;">Yield</div>
                        <div style="font-size: 16px; font-weight: 700; color: #F59E0B;">{item['rental_yield_pct']}%</div>
                    </div>
                </div>
                <div style="font-size: 12px; color: #94A3B8; margin-top: 10px; font-style: italic;">
                    💡 {item['why_recommended']}
                </div>
            </div>
            """, unsafe_allow_html=True)
            
    with col_right:
        st.markdown('<div class="section-title">Market HPI Trajectory</div>', unsafe_allow_html=True)
        hpi_res = get_hpi_trend_analysis()
        df_hpi = hpi_res['hpi_table']
        
        fig = px.line(
            df_hpi, 
            x='Quarter', 
            y='HPI@Assessment Prices',
            markers=True,
            line_shape='spline',
            color_discrete_sequence=['#38BDF8']
        )
        fig.update_layout(
            template='plotly_dark',
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            margin=dict(l=20, r=20, t=30, b=20),
            height=320,
            xaxis=dict(showgrid=False),
            yaxis=dict(showgrid=True, gridcolor='#1E293B', title='HPI Index (2013=100)')
        )
        st.plotly_chart(fig, use_container_width=True)
        
        st.markdown(f"""
        <div class="disclaimer-box">
            📌 <b>Official Index Context:</b> {hpi_res['disclaimer']}
        </div>
        """, unsafe_allow_html=True)
