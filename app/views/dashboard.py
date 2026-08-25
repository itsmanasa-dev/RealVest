import streamlit as st
from app.translations import t
from src.utils.errors import handle_user_errors

@handle_user_errors("Something went wrong loading the homepage.")
def render_dashboard(lang='English'):
    # Hero Section
    st.markdown(f"""
    <div class="hero-box">
        <div class="hero-h1">{t('hero_title', lang)}</div>
        <div class="hero-p">{t('hero_sub', lang)}</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Hero Buttons Row
    b_col1, b_col2, b_col3 = st.columns(3)
    with b_col1:
        if st.button("🔍 Explore Properties", use_container_width=True, key="home_btn_explore"):
            st.session_state['active_nav'] = 'Explorer'
            st.rerun()
            
    with b_col2:
        if st.button("⚡ Decision Analysis", use_container_width=True, key="home_btn_analyze"):
            st.session_state['active_nav'] = 'Analysis'
            st.rerun()
            
    with b_col3:
        if st.button("📊 Decision Simulator", use_container_width=True, key="home_btn_sim"):
            st.session_state['active_nav'] = 'Simulator'
            st.rerun()
            
    st.markdown("<br><br>", unsafe_allow_html=True)
    
    # Four Choice Cards
    st.markdown(f'<div class="section-head" style="text-align: center; margin-bottom: 24px;">{t("home_choice_heading", lang)}</div>', unsafe_allow_html=True)
    
    c1, c2, c3, c4 = st.columns(4)
    
    with c1:
        st.markdown(f"""
        <div class="rv-card" style="text-align: center;">
            <div style="font-size: 13px; font-weight: 800; color: #2563EB; letter-spacing: 1px; margin-bottom: 8px;">EXPLORE</div>
            <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">Market Listings</div>
            <div style="font-size: 13px; color: #64748B; margin-bottom: 20px; line-height: 1.5;">
                Browse real dataset listings across Bengaluru micro-markets.
            </div>
        </div>
        """, unsafe_allow_html=True)
        if st.button("Property Explorer", key="btn_choice_exp", use_container_width=True):
            st.session_state['active_nav'] = 'Explorer'
            st.rerun()
            
    with c2:
        st.markdown(f"""
        <div class="rv-card" style="text-align: center;">
            <div style="font-size: 13px; font-weight: 800; color: #2563EB; letter-spacing: 1px; margin-bottom: 8px;">ANALYZE</div>
            <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">Fair Valuation & Risks</div>
            <div style="font-size: 13px; color: #64748B; margin-bottom: 20px; line-height: 1.5;">
                Get ML valuation factor breakdowns and risk radar scores.
            </div>
        </div>
        """, unsafe_allow_html=True)
        if st.button("Property Analysis", key="btn_choice_ana", use_container_width=True):
            st.session_state['active_nav'] = 'Analysis'
            st.rerun()
            
    with c3:
        st.markdown(f"""
        <div class="rv-card" style="text-align: center;">
            <div style="font-size: 13px; font-weight: 800; color: #2563EB; letter-spacing: 1px; margin-bottom: 8px;">SIMULATE</div>
            <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">What-If Engine</div>
            <div style="font-size: 13px; color: #64748B; margin-bottom: 20px; line-height: 1.5;">
                Model interest rates, cash flow, ROI and decision flip boundaries.
            </div>
        </div>
        """, unsafe_allow_html=True)
        if st.button("What-If Simulator", key="btn_choice_sim", use_container_width=True):
            st.session_state['active_nav'] = 'Simulator'
            st.rerun()

    with c4:
        st.markdown(f"""
        <div class="rv-card" style="text-align: center;">
            <div style="font-size: 13px; font-weight: 800; color: #2563EB; letter-spacing: 1px; margin-bottom: 8px;">COMPARE</div>
            <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">Side-by-Side</div>
            <div style="font-size: 13px; color: #64748B; margin-bottom: 20px; line-height: 1.5;">
                Compare properties side-by-side with ML top pick recommendation.
            </div>
        </div>
        """, unsafe_allow_html=True)
        if st.button("Property Compare", key="btn_choice_cmp", use_container_width=True):
            st.session_state['active_nav'] = 'Compare'
            st.rerun()
