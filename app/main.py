import streamlit as st

# Set page configuration as first Streamlit call
st.set_page_config(
    page_title="REALVEST — AI Real Estate & Business Analytics",
    page_icon="🏢",
    layout="wide",
    initial_sidebar_state="expanded"
)

from app.styles import inject_custom_css
from app.translations import get_text
from app.views.dashboard import render_dashboard
from app.views.property_analyzer import render_property_analyzer
from app.views.compare_properties import render_compare_properties
from app.views.investment_insights import render_investment_insights
from app.views.business_locations import render_business_locations
from app.views.market_trends import render_market_trends
from app.views.ai_advisor import render_ai_advisor

# Inject design system styles
inject_custom_css()

# Initialize session state for language
if 'language' not in st.session_state:
    st.session_state['language'] = 'English'
    
lang = st.session_state['language']

# Sidebar Navigation
with st.sidebar:
    st.markdown("""
    <div class="brand-header">
        <div class="brand-logo">RV</div>
        <div>
            <div class="brand-text">REALVEST</div>
            <div class="brand-tagline">AI Analytics Platform</div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Language Selector in Sidebar
    selected_lang = st.selectbox(
        "🌐 Language / भाषा / ಭಾಷೆ",
        ['English', 'Hindi', 'Kannada'],
        index=['English', 'Hindi', 'Kannada'].index(lang)
    )
    if selected_lang != lang:
        st.session_state['language'] = selected_lang
        st.rerun()
        
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Navigation Menu
    nav_options = [
        get_text('nav_dashboard', lang),
        get_text('nav_analyzer', lang),
        get_text('nav_compare', lang),
        get_text('nav_insights', lang),
        get_text('nav_business', lang),
        get_text('nav_trends', lang),
        get_text('nav_advisor', lang)
    ]
    
    selected_nav = st.radio("NAVIGATION", nav_options, index=0)
    
    st.markdown("<hr style='border-color: #1E293B; margin: 30px 0;'>", unsafe_allow_html=True)
    st.markdown("""
    <div style="font-size: 11px; color: #64748B; text-align: center;">
        REALVEST v1.0.0 (MVP)<br>
        Bengaluru Real Estate & Location Intelligence<br>
        © 2026 REALVEST Analytics
    </div>
    """, unsafe_allow_html=True)

# Page Routing
if selected_nav == get_text('nav_dashboard', lang):
    render_dashboard(lang)
elif selected_nav == get_text('nav_analyzer', lang):
    render_property_analyzer(lang)
elif selected_nav == get_text('nav_compare', lang):
    render_compare_properties(lang)
elif selected_nav == get_text('nav_insights', lang):
    render_investment_insights(lang)
elif selected_nav == get_text('nav_business', lang):
    render_business_locations(lang)
elif selected_nav == get_text('nav_trends', lang):
    render_market_trends(lang)
elif selected_nav == get_text('nav_advisor', lang):
    render_ai_advisor(lang)
