import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
from app.translations import get_text
from src.analytics.hpi_analytics import get_hpi_trend_analysis
from src.utils.formatting import format_percentage, format_number
from src.utils.validation import safe_float
from src.utils.errors import handle_user_errors

@handle_user_errors("Unable to load market trend data.")
def render_market_trends(lang='English'):
    st.markdown(f"""
    <div>
        <div class="page-head">{get_text('market_title', lang)}</div>
        <div class="page-subhead">{get_text('market_sub', lang)}</div>
    </div>
    """, unsafe_allow_html=True)
    
    hpi_data = get_hpi_trend_analysis()
    df_hpi = hpi_data.get('hpi_table', None)
    
    # Metrics Row
    m1, m2, m3 = st.columns(3)
    with m1:
        st.metric(label="Latest Housing Price Index (HPI)", value=format_number(hpi_data.get('latest_hpi', 113.13), decimals=2))
    with m2:
        st.metric(label="10-Year HPI Market Growth", value=format_percentage(hpi_data.get('total_growth_%', 34.3)))
    with m3:
        st.metric(label="Latest YoY Trajectory", value=format_percentage(hpi_data.get('latest_yoy_%', 1.9)))
        
    st.markdown("<br>", unsafe_allow_html=True)
    
    # HPI Trajectory Chart + Explanation
    st.markdown('<div class="section-head">HISTORICAL HOUSING PRICE INDEX (BASE 2013=100)</div>', unsafe_allow_html=True)
    st.markdown("""
    <div style="font-size: 14px; color: #475569; margin-bottom: 12px;">
        💡 <b>Key takeaway:</b> Prices have increased across the available HPI period, reflecting steady long-term appreciation in urban Bengaluru housing.
    </div>
    """, unsafe_allow_html=True)
    
    fig_line = px.line(
        df_hpi,
        x='Quarter',
        y='HPI@Assessment Prices',
        markers=True,
        line_shape='spline',
        color_discrete_sequence=['#2563EB']
    )
    fig_line.update_layout(
        template='plotly_white',
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        margin=dict(l=10, r=10, t=20, b=20),
        height=320,
        xaxis=dict(showgrid=False),
        yaxis=dict(gridcolor='#E2E8F0', title='HPI Index Value')
    )
    st.plotly_chart(fig_line, use_container_width=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Quarterly Movement Chart + Explanation
    st.markdown('<div class="section-head">QUARTERLY (QoQ) RATE MOVEMENT (%)</div>', unsafe_allow_html=True)
    st.markdown("""
    <div style="font-size: 14px; color: #475569; margin-bottom: 12px;">
        💡 <b>Key takeaway:</b> Short-term quarterly fluctuations show mild seasonal shifts while maintaining an overall positive growth trajectory.
    </div>
    """, unsafe_allow_html=True)
    
    df_qoq = df_hpi.dropna(subset=['QoQ_Change_%']).copy()
    colors = ['#15803D' if v >= 0 else '#B91C1C' for v in df_qoq['QoQ_Change_%']]
    
    fig_bar = go.Figure(go.Bar(
        x=df_qoq['Quarter'],
        y=df_qoq['QoQ_Change_%'],
        marker_color=colors
    ))
    fig_bar.update_layout(
        template='plotly_white',
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        margin=dict(l=10, r=10, t=20, b=20),
        height=320,
        yaxis=dict(gridcolor='#E2E8F0', title='QoQ Growth %')
    )
    st.plotly_chart(fig_bar, use_container_width=True)
