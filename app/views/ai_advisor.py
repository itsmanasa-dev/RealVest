import streamlit as st
from app.translations import t
from src.ai.recommendation_engine import recommend_properties
from src.utils.formatting import format_currency_lakhs, format_rent, format_percentage, format_number
from src.utils.validation import safe_float, safe_int
from src.utils.errors import handle_user_errors

@handle_user_errors("Unable to process AI advisor search. Please try again.")
def render_ai_advisor(lang='English'):
    st.markdown(f"""
    <div>
        <div class="page-head">{t('advisor_title', lang)}</div>
        <div class="page-subhead">{t('advisor_sub', lang)}</div>
    </div>
    """, unsafe_allow_html=True)
    
    default_prompt = t('ai_default_query', lang)
    
    preset_query = st.text_input(
        t('lbl_ai_prompt', lang),
        value=default_prompt,
        placeholder=default_prompt
    )
    
    if st.button(t('btn_ai_search', lang), use_container_width=True) or preset_query:
        query_text = preset_query if preset_query else default_prompt
        
        res = recommend_properties(query_text, top_n=5)
        recs = res.get('recommendations', [])
        count = len(recs)
        
        st.markdown(f"""
        <div class="rv-card rv-card-winner" style="margin-bottom: 24px;">
            <div style="font-size: 16px; font-weight: 700; color: #0F172A;">
                {t('ai_response_banner', lang, count=count)}
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown(f'<div class="section-head">{t("section_matching_listings", lang)}</div>', unsafe_allow_html=True)
        
        if not recs:
            st.info(t('ai_empty', lang))
        else:
            for idx, item in enumerate(recs):
                asking_val = safe_float(item.get('asking_price_lakhs', 0))
                fair_val = safe_float(item.get('fair_value_lakhs', 0))
                rent_val = safe_float(item.get('monthly_rent', 0))
                yield_val = safe_float(item.get('rental_yield_pct', 0))
                score_val = safe_int(item.get('investment_score', 0))
                loc_str = str(item.get('location', ''))
                
                deal_st = str(item.get('deal_status', ''))
                verdict_tr = t('badge_good_deal', lang) if deal_st == "Potentially Undervalued" else (t('badge_overpriced', lang) if deal_st == "Potentially Overpriced" else t('badge_fair_price', lang))
                
                rationale_str = t('ai_rationale_text', lang, location=loc_str, yield_pct=format_percentage(yield_val))
                
                st.markdown(f"""
                <div class="rv-card">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                        <div>
                            <div style="font-size: 18px; font-weight: 800; color: #0F172A;">
                                #{idx+1}. {item.get('bhk', 2)} BHK in {loc_str}
                            </div>
                            <div style="font-size: 13px; color: #64748B; margin-top: 2px;">
                                {format_number(item.get('sqft', 0), decimals=0)} sqft • {item.get('area_type', '')}
                            </div>
                        </div>
                        <span class="badge badge-good">{verdict_tr}</span>
                    </div>
                    
                    <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid #F1F5F9; display: flex; gap: 32px; flex-wrap: wrap;">
                        <div>
                            <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">{t('lbl_asking_price', lang)}</div>
                            <div style="font-size: 17px; font-weight: 800; color: #0F172A;">{format_currency_lakhs(asking_val)}</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">{t('lbl_fair_value', lang)}</div>
                            <div style="font-size: 17px; font-weight: 800; color: #2563EB;">{format_currency_lakhs(fair_val)}</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">{t('lbl_rent', lang)}</div>
                            <div style="font-size: 17px; font-weight: 800; color: #15803D;">{format_rent(rent_val)}</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">{t('lbl_yield', lang)}</div>
                            <div style="font-size: 17px; font-weight: 800; color: #B45309;">{format_percentage(yield_val)}</div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 12px; background-color: #F8FAFC; padding: 10px 14px; border-radius: 8px; font-size: 13px; color: #334155;">
                        <b>{t('ai_rationale_head', lang)}</b> {rationale_str}
                    </div>
                </div>
                """, unsafe_allow_html=True)
                
                if st.button(t('btn_ai_analyze_item', lang, idx=idx+1), key=f"ai_analyze_{idx}"):
                    st.session_state['active_nav'] = 'Properties'
                    st.rerun()
