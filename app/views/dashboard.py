import streamlit as st
from app.translations import get_text
from src.utils.errors import handle_user_errors

@handle_user_errors("Something went wrong loading the homepage.")
def render_dashboard(lang='English'):
    # Hero Section
    st.markdown(f"""
    <div class="hero-box">
        <div class="hero-h1">{get_text('hero_title', lang)}</div>
        <div class="hero-p">{get_text('hero_sub', lang)}</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Hero Buttons Row
    b_col1, b_col2 = st.columns([6, 6])
    with b_col1:
        if st.button(f"🔍 {get_text('btn_analyze_prop', lang)}", use_container_width=True, key="home_btn_analyze"):
            st.session_state['active_nav'] = 'Properties'
            st.rerun()
            
    with b_col2:
        if st.button(f"📈 {get_text('btn_explore_invest', lang)}", use_container_width=True, key="home_btn_invest"):
            st.session_state['active_nav'] = 'Invest'
            st.rerun()
            
    st.markdown("<br><br>", unsafe_allow_html=True)
    
    # Three Simple Choice Cards
    st.markdown('<div class="section-head" style="text-align: center; margin-bottom: 24px;">WHAT WOULD YOU LIKE TO DO?</div>', unsafe_allow_html=True)
    
    c1, c2, c3 = st.columns(3)
    
    with c1:
        st.markdown(f"""
        <div class="rv-card" style="text-align: center;">
            <div style="font-size: 13px; font-weight: 800; color: #2563EB; letter-spacing: 1px; margin-bottom: 8px;">{get_text('choice_buy_title', lang)}</div>
            <div style="font-size: 20px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">{get_text('choice_buy_sub', lang)}</div>
            <div style="font-size: 14px; color: #64748B; margin-bottom: 20px; line-height: 1.5;">
                Evaluate fair market price, expected rental income, and valuation deals.
            </div>
        </div>
        """, unsafe_allow_html=True)
        if st.button("Check Property →", key="btn_choice_buy", use_container_width=True):
            st.session_state['active_nav'] = 'Properties'
            st.rerun()
            
    with c2:
        st.markdown(f"""
        <div class="rv-card" style="text-align: center;">
            <div style="font-size: 13px; font-weight: 800; color: #2563EB; letter-spacing: 1px; margin-bottom: 8px;">{get_text('choice_invest_title', lang)}</div>
            <div style="font-size: 20px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">{get_text('choice_invest_sub', lang)}</div>
            <div style="font-size: 14px; color: #64748B; margin-bottom: 20px; line-height: 1.5;">
                Rank top properties by expected rental yield and capital return scores.
            </div>
        </div>
        """, unsafe_allow_html=True)
        if st.button("Find Investments →", key="btn_choice_invest", use_container_width=True):
            st.session_state['active_nav'] = 'Invest'
            st.rerun()
            
    with c3:
        st.markdown(f"""
        <div class="rv-card" style="text-align: center;">
            <div style="font-size: 13px; font-weight: 800; color: #2563EB; letter-spacing: 1px; margin-bottom: 8px;">{get_text('choice_biz_title', lang)}</div>
            <div style="font-size: 20px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">{get_text('choice_biz_sub', lang)}</div>
            <div style="font-size: 14px; color: #64748B; margin-bottom: 20px; line-height: 1.5;">
                Analyze commercial competition density and ward demographics for business.
            </div>
        </div>
        """, unsafe_allow_html=True)
        if st.button("Find Location →", key="btn_choice_biz", use_container_width=True):
            st.session_state['active_nav'] = 'Business'
            st.rerun()
