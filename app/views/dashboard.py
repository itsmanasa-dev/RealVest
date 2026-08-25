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
    b_col1, b_col2 = st.columns([6, 6])
    with b_col1:
        if st.button(f"🔍 {t('btn_analyze_prop', lang)}", use_container_width=True, key="home_btn_analyze"):
            st.session_state['active_nav'] = 'Properties'
            st.rerun()
            
    with b_col2:
        if st.button(f"📈 {t('btn_explore_invest', lang)}", use_container_width=True, key="home_btn_invest"):
            st.session_state['active_nav'] = 'Invest'
            st.rerun()
            
    st.markdown("<br><br>", unsafe_allow_html=True)
    
    # Three Choice Cards
    st.markdown(f'<div class="section-head" style="text-align: center; margin-bottom: 24px;">{t("home_choice_heading", lang)}</div>', unsafe_allow_html=True)
    
    c1, c2, c3 = st.columns(3)
    
    with c1:
        st.markdown(f"""
        <div class="rv-card" style="text-align: center;">
            <div style="font-size: 13px; font-weight: 800; color: #2563EB; letter-spacing: 1px; margin-bottom: 8px;">{t('choice_buy_title', lang)}</div>
            <div style="font-size: 20px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">{t('choice_buy_sub', lang)}</div>
            <div style="font-size: 14px; color: #64748B; margin-bottom: 20px; line-height: 1.5;">
                {t('choice_buy_desc', lang)}
            </div>
        </div>
        """, unsafe_allow_html=True)
        if st.button(t('btn_choice_buy', lang), key="btn_choice_buy", use_container_width=True):
            st.session_state['active_nav'] = 'Properties'
            st.rerun()
            
    with c2:
        st.markdown(f"""
        <div class="rv-card" style="text-align: center;">
            <div style="font-size: 13px; font-weight: 800; color: #2563EB; letter-spacing: 1px; margin-bottom: 8px;">{t('choice_invest_title', lang)}</div>
            <div style="font-size: 20px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">{t('choice_invest_sub', lang)}</div>
            <div style="font-size: 14px; color: #64748B; margin-bottom: 20px; line-height: 1.5;">
                {t('choice_invest_desc', lang)}
            </div>
        </div>
        """, unsafe_allow_html=True)
        if st.button(t('btn_choice_invest', lang), key="btn_choice_invest", use_container_width=True):
            st.session_state['active_nav'] = 'Invest'
            st.rerun()
            
    with c3:
        st.markdown(f"""
        <div class="rv-card" style="text-align: center;">
            <div style="font-size: 13px; font-weight: 800; color: #2563EB; letter-spacing: 1px; margin-bottom: 8px;">{t('choice_biz_title', lang)}</div>
            <div style="font-size: 20px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">{t('choice_biz_sub', lang)}</div>
            <div style="font-size: 14px; color: #64748B; margin-bottom: 20px; line-height: 1.5;">
                {t('choice_biz_desc', lang)}
            </div>
        </div>
        """, unsafe_allow_html=True)
        if st.button(t('btn_choice_biz', lang), key="btn_choice_biz", use_container_width=True):
            st.session_state['active_nav'] = 'Business'
            st.rerun()
