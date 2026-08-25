import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
from app.translations import t
from src.analytics.hpi_analytics import get_hpi_trend_analysis
from src.utils.formatting import format_percentage, format_number
from src.utils.validation import safe_float
from src.utils.errors import handle_user_errors

@handle_user_errors("Unable to load market trend data.")
def render_market_trends(lang='English'):
    st.markdown(f"""
    <div>
        <div class="page-head">{t('market_title', lang)}</div>
        <div class="page-subhead">{t('market_sub', lang)}</div>
    </div>
    """, unsafe_allow_html=True)
    
    hpi_data = get_hpi_trend_analysis()
    df_hpi = hpi_data.get('hpi_table', None)
    
    # Metrics Row
    m1, m2, m3 = st.columns(3)
    with m1:
        st.metric(label=t('lbl_latest_hpi', lang), value=format_number(hpi_data.get('latest_hpi', 113.13), decimals=2))
    with m2:
        st.metric(label=t('lbl_10yr_growth', lang), value=format_percentage(hpi_data.get('total_growth_%', 34.3)))
    with m3:
        st.metric(label=t('lbl_yoy_traj', lang), value=format_percentage(hpi_data.get('latest_yoy_%', 1.9)))
        
    st.markdown("<br>", unsafe_allow_html=True)
    
    # HPI Trajectory Chart
    st.markdown(f'<div class="section-head">{t("section_hpi_chart", lang)}</div>', unsafe_allow_html=True)
    st.markdown(f"""
    <div style="font-size: 14px; color: #475569; margin-bottom: 12px;">
        {t('takeaway_hpi', lang)}
    </div>
    """, unsafe_allow_html=True)
    
    fig_line = px.line(
        df_hpi,
        x='Quarter',
        y='HPI@Assessment Prices',
        markers=True,
        line_shape='spline',
        color_discrete_sequence=['#2563EB'],
        title=t('chart_hpi_title', lang)
    )
    fig_line.update_layout(
        template='plotly_white',
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        margin=dict(l=10, r=10, t=30, b=20),
        height=320,
        xaxis=dict(showgrid=False, title=t('chart_quarter_axis', lang)),
        yaxis=dict(gridcolor='#E2E8F0', title=t('chart_hpi_axis', lang))
    )
    st.plotly_chart(fig_line, use_container_width=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Quarterly Movement Chart
    st.markdown(f'<div class="section-head">{t("section_qoq_chart", lang)}</div>', unsafe_allow_html=True)
    st.markdown(f"""
    <div style="font-size: 14px; color: #475569; margin-bottom: 12px;">
        {t('takeaway_qoq', lang)}
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
        title=t('chart_qoq_title', lang),
        template='plotly_white',
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        margin=dict(l=10, r=10, t=30, b=20),
        height=320,
        xaxis=dict(showgrid=False, title=t('chart_quarter_axis', lang)),
        yaxis=dict(gridcolor='#E2E8F0', title=t('chart_qoq_axis', lang))
    )
    st.plotly_chart(fig_bar, use_container_width=True)
