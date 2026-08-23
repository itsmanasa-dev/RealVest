import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
from app.translations import get_text
from src.analytics.hpi_analytics import get_hpi_trend_analysis

def render_market_trends(lang='English'):
    st.markdown(f"""
    <div style="margin-bottom: 24px;">
        <h2 style="font-size: 26px; font-weight: 700; color: #F8FAFC;">{get_text('nav_trends', lang)}</h2>
        <p style="color: #94A3B8; font-size: 14px;">Explore historical Housing Price Index (HPI) growth trajectories, quarterly rate dynamics, and official index benchmarks for Bengaluru.</p>
    </div>
    """, unsafe_allow_html=True)
    
    hpi_data = get_hpi_trend_analysis()
    df_hpi = hpi_data['hpi_table']
    
    # KPI Cards
    k1, k2, k3, k4 = st.columns(4)
    with k1:
        st.markdown(f"""
        <div class="realvest-card">
            <div class="card-label">Latest HPI Index</div>
            <div class="card-value" style="color: #38BDF8;">{hpi_data['latest_hpi']}</div>
            <div class="card-subtext">Base 2013 = 100</div>
        </div>
        """, unsafe_allow_html=True)
        
    with k2:
        st.markdown(f"""
        <div class="realvest-card">
            <div class="card-label">Total Period Growth</div>
            <div class="card-value" style="color: #10B981;">+{hpi_data['total_growth_%']}%</div>
            <div class="card-subtext">Cumulative Expansion</div>
        </div>
        """, unsafe_allow_html=True)
        
    with k3:
        st.markdown(f"""
        <div class="realvest-card">
            <div class="card-label">Latest YoY Change</div>
            <div class="card-value" style="color: #F59E0B;">{hpi_data['latest_yoy_%']:+}%</div>
            <div class="card-subtext">4-Quarter Trailing</div>
        </div>
        """, unsafe_allow_html=True)
        
    with k4:
        st.markdown(f"""
        <div class="realvest-card">
            <div class="card-label">Residex Snapshot</div>
            <div class="card-value">113.13</div>
            <div class="card-subtext">Current Index Metric</div>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("<br>", unsafe_allow_html=True)
    
    col_l, col_r = st.columns([7, 5])
    
    with col_l:
        st.markdown('<div class="section-title">Historical HPI Trajectory (Base Year 2013=100)</div>', unsafe_allow_html=True)
        fig_line = px.line(
            df_hpi,
            x='Quarter',
            y='HPI@Assessment Prices',
            markers=True,
            line_shape='spline',
            color_discrete_sequence=['#38BDF8']
        )
        fig_line.update_layout(
            template='plotly_dark',
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            margin=dict(l=20, r=20, t=30, b=20),
            height=360,
            xaxis=dict(showgrid=False),
            yaxis=dict(gridcolor='#1E293B', title='HPI Index Value')
        )
        st.plotly_chart(fig_line, use_container_width=True)
        
    with col_r:
        st.markdown('<div class="section-title">Quarterly (QoQ) Rate Fluctuations (%)</div>', unsafe_allow_html=True)
        df_qoq = df_hpi.dropna(subset=['QoQ_Change_%']).copy()
        colors = ['#10B981' if v >= 0 else '#EF4444' for v in df_qoq['QoQ_Change_%']]
        
        fig_bar = go.Figure(go.Bar(
            x=df_qoq['Quarter'],
            y=df_qoq['QoQ_Change_%'],
            marker_color=colors
        ))
        fig_bar.update_layout(
            template='plotly_dark',
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            margin=dict(l=20, r=20, t=30, b=20),
            height=360,
            yaxis=dict(gridcolor='#1E293B', title='QoQ Growth %')
        )
        st.plotly_chart(fig_bar, use_container_width=True)
        
    st.markdown('<div class="section-title">Complete Historical HPI Data Record</div>', unsafe_allow_html=True)
    st.dataframe(df_hpi, use_container_width=True)
    
    st.markdown(f"""
    <div class="disclaimer-box">
        📊 <b>Index Data Integrity Policy:</b> {hpi_data['disclaimer']}
    </div>
    """, unsafe_allow_html=True)
