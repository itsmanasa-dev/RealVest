import streamlit as st
from app.translations import t
from src.models.predict import get_price_model
from src.ai.recommendation_engine import recommend_properties
from src.utils.formatting import format_currency_lakhs, format_rent, format_percentage, format_number
from src.utils.validation import safe_float, safe_int
from src.utils.errors import handle_user_errors

@handle_user_errors("Unable to load investment opportunities. Please try again.")
def render_investment_insights(lang='English'):
    st.markdown(f"""
    <div>
        <div class="page-head">{t('invest_title', lang)}</div>
        <div class="page-subhead">{t('invest_sub', lang)}</div>
    </div>
    """, unsafe_allow_html=True)
    
    m_data = get_price_model()
    top_locations = [t('opt_any_location', lang)] + m_data['top_locations']
    
    prop_types = [
        t('opt_all_types', lang),
        t('opt_apartment', lang),
        t('opt_house_villa', lang)
    ]
    
    yield_opts = [
        t('opt_any_yield', lang),
        "> 3.5%",
        "> 4.5%",
        "> 5.5%"
    ]
    
    with st.form("invest_filter_form"):
        c1, c2, c3, c4 = st.columns(4)
        with c1:
            max_budget = st.select_slider(t('lbl_budget', lang), options=[40, 60, 80, 100, 150, 200, 300, 500], value=100)
        with c2:
            selected_loc = st.selectbox(t('lbl_location', lang), top_locations, index=0)
        with c3:
            prop_type = st.selectbox(t('lbl_prop_type', lang), prop_types, index=0)
        with c4:
            min_yield_str = st.selectbox(t('lbl_min_yield', lang), yield_opts, index=0)
            
        submitted = st.form_submit_button(t('btn_show_opps', lang), use_container_width=True)
        
    st.markdown("<hr style='border-color: #E2E8F0; margin: 24px 0 28px 0;'>", unsafe_allow_html=True)
    
    # Query database and rank results
    is_any_loc = (selected_loc == t('opt_any_location', lang) or selected_loc == 'Any Location')
    loc_query = f"in {selected_loc}" if not is_any_loc else ""
    prompt_query = f"Find properties under {max_budget} lakh {loc_query} with high rental yield"
    
    res = recommend_properties(prompt_query, top_n=6)
    recs = res.get('recommendations', [])
    
    st.markdown(f'<div class="section-head">{t("section_opps", lang)}</div>', unsafe_allow_html=True)
    
    if not recs:
        st.info(t('invest_empty', lang))
    else:
        for idx, item in enumerate(recs):
            asking_val = safe_float(item.get('asking_price_lakhs', 0))
            fair_val = safe_float(item.get('fair_value_lakhs', 0))
            rent_val = safe_float(item.get('monthly_rent', 0))
            yield_val = safe_float(item.get('rental_yield_pct', 0))
            score_val = safe_int(item.get('investment_score', 0))
            
            # Badge selection: GOOD VALUE / HIGH YIELD / WATCH
            if asking_val < fair_val:
                badge_text = t('badge_good_value', lang)
                badge_cls = "badge-good"
            elif yield_val >= 4.5:
                badge_text = t('badge_high_yield', lang)
                badge_cls = "badge-brand"
            else:
                badge_text = t('badge_watch', lang)
                badge_cls = "badge-fair"
                
            st.markdown(f"""
            <div class="rv-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <div style="font-size: 20px; font-weight: 800; color: #0F172A;">
                            {item.get('bhk', 2)} BHK in {item.get('location', '')}
                        </div>
                        <div style="font-size: 13px; color: #64748B; margin-top: 2px;">
                            {format_number(item.get('sqft', 0), decimals=0)} sqft • {item.get('area_type', '')}
                        </div>
                    </div>
                    <span class="badge {badge_cls}">{badge_text}</span>
                </div>
                
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #F1F5F9;">
                    <div style="display: flex; gap: 36px; flex-wrap: wrap;">
                        <div>
                            <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">{t('lbl_asking_price', lang)}</div>
                            <div style="font-size: 18px; font-weight: 800; color: #0F172A;">{format_currency_lakhs(asking_val)}</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">{t('lbl_fair_value', lang)}</div>
                            <div style="font-size: 18px; font-weight: 800; color: #2563EB;">{format_currency_lakhs(fair_val)}</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">{t('lbl_rent', lang)}</div>
                            <div style="font-size: 18px; font-weight: 800; color: #15803D;">{format_rent(rent_val)}</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">{t('lbl_yield', lang)}</div>
                            <div style="font-size: 18px; font-weight: 800; color: #B45309;">{format_percentage(yield_val)}</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">{t('lbl_score', lang)}</div>
                            <div style="font-size: 18px; font-weight: 800; color: #0F172A;">{score_val}/100</div>
                        </div>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            if st.button(f"{t('btn_view_analysis', lang)} (#{idx+1})", key=f"btn_view_{idx}"):
                st.session_state['active_nav'] = 'Properties'
                st.rerun()
