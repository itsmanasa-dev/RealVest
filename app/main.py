import os
import sys

# Ensure project root directory is on sys.path when launched via `streamlit run app/main.py`
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

import streamlit as st

# Page config
st.set_page_config(
    page_title="REALVEST — Make smarter property decisions",
    page_icon="🏢",
    layout="wide",
    initial_sidebar_state="collapsed"
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
from src.utils.errors import handle_user_errors

# Inject light proptech fintech styles
inject_custom_css()

# Session State Initialization
if 'language' not in st.session_state:
    st.session_state['language'] = 'English'

if 'active_nav' not in st.session_state:
    st.session_state['active_nav'] = 'Home'

lang = st.session_state['language']

# Top Header Navigation Bar
st.markdown("""
<div class="nav-container">
    <div class="nav-brand">
        <div class="nav-logo">RV</div>
        <div>
            <div class="nav-title">REALVEST</div>
            <div class="nav-tagline">Make smarter property decisions.</div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Navigation Controls Row (Top Bar)
col_nav, col_lang = st.columns([8, 3])

with col_nav:
    nav_keys = ['Home', 'Properties', 'Invest', 'Business', 'Market', 'AI Advisor']
    nav_labels = [
        get_text('nav_home', lang),
        get_text('nav_properties', lang),
        get_text('nav_invest', lang),
        get_text('nav_business', lang),
        get_text('nav_market', lang),
        get_text('nav_advisor', lang)
    ]
    
    current_nav = st.session_state.get('active_nav', 'Home')
    curr_idx = nav_keys.index(current_nav) if current_nav in nav_keys else 0
    
    selected_label = st.radio(
        "Top Nav",
        nav_labels,
        index=curr_idx,
        horizontal=True,
        label_visibility="collapsed"
    )
    
    # Update active navigation
    for key, label in zip(nav_keys, nav_labels):
        if label == selected_label:
            if st.session_state['active_nav'] != key:
                st.session_state['active_nav'] = key
                st.rerun()
            break

with col_lang:
    selected_lang = st.selectbox(
        "🌐 Language",
        ['English', 'Hindi', 'Kannada'],
        index=['English', 'Hindi', 'Kannada'].index(lang),
        label_visibility="collapsed"
    )
    if selected_lang != lang:
        st.session_state['language'] = selected_lang
        st.rerun()

st.markdown("<hr style='border-color: #E2E8F0; margin: 16px 0 28px 0;'>", unsafe_allow_html=True)

# Safe Router Call with Error Interceptor
@handle_user_errors("Something went wrong while loading this page. Please try again.")
def route_page(nav_item, current_lang):
    if nav_item == 'Home':
        render_dashboard(current_lang)
    elif nav_item == 'Properties':
        render_property_analyzer(current_lang)
    elif nav_item == 'Invest':
        render_investment_insights(current_lang)
    elif nav_item == 'Business':
        render_business_locations(current_lang)
    elif nav_item == 'Market':
        render_market_trends(current_lang)
    elif nav_item == 'AI Advisor':
        render_ai_advisor(current_lang)
    elif nav_item == 'Compare':
        render_compare_properties(current_lang)
    else:
        render_dashboard(current_lang)

route_page(st.session_state.get('active_nav', 'Home'), lang)
