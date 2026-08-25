import streamlit as st
import pandas as pd
from app.translations import t
from src.analytics.comparison import compare_properties
from src.models.predict import get_price_model
from src.utils.formatting import format_currency_lakhs, format_rent, format_percentage, format_number
from src.utils.validation import safe_float, safe_int
from src.utils.errors import handle_user_errors

@handle_user_errors("Unable to compare properties. Please verify parameters.")
def render_compare_properties(lang='English'):
    st.markdown(f"""
    <div>
        <div class="page-head">{t('compare_title', lang)}</div>
        <div class="page-subhead">{t('compare_sub', lang)}</div>
    </div>
    """, unsafe_allow_html=True)
    
    m_data = get_price_model()
    top_locations = m_data['top_locations']
    
    num_props = st.slider(t('lbl_num_compare', lang), min_value=2, max_value=3, value=2)
    
    default_configs = [
        {'name': 'Property A', 'loc': 'Whitefield', 'sqft': 1350, 'bhk': 2, 'asking': 78.0},
        {'name': 'Property B', 'loc': 'Electronic City', 'sqft': 1100, 'bhk': 2, 'asking': 52.0},
        {'name': 'Property C', 'loc': 'Sarjapur Road', 'sqft': 1600, 'bhk': 3, 'asking': 95.0},
    ]
    
    props_input = []
    cols = st.columns(num_props)
    
    for idx in range(num_props):
        cfg = default_configs[idx]
        with cols[idx]:
            st.markdown(f"#### Property {chr(65+idx)}")
            p_name = st.text_input(t('lbl_name', lang), value=cfg['name'], key=f"cmp_name_{idx}")
            p_loc = st.selectbox(t('lbl_locality', lang), top_locations, index=top_locations.index(cfg['loc']) if cfg['loc'] in top_locations else 0, key=f"cmp_loc_{idx}")
            p_sqft = st.number_input(t('lbl_area', lang), min_value=300, max_value=15000, value=cfg['sqft'], step=50, key=f"cmp_sqft_{idx}")
            p_bhk = st.number_input(t('lbl_bhk', lang), min_value=1, max_value=8, value=cfg['bhk'], step=1, key=f"cmp_bhk_{idx}")
            p_asking = st.number_input(t('lbl_asking_price_in', lang), min_value=5.0, max_value=3000.0, value=cfg['asking'], step=1.0, key=f"cmp_ask_{idx}")
            
            props_input.append({
                'name': p_name,
                'location': p_loc,
                'total_sqft': safe_float(p_sqft),
                'bhk': safe_int(p_bhk),
                'bath': safe_int(p_bhk),
                'asking_price_lakhs': safe_float(p_asking)
            })
            
    if st.button(t('btn_compare_submit', lang), use_container_width=True) or True:
        res = compare_properties(props_input)
        df_comp = res.get('comparison_df', pd.DataFrame())
        
        st.markdown("<hr style='border-color: #E2E8F0; margin: 32px 0;'>", unsafe_allow_html=True)
        
        st.markdown(f'<div class="section-head">{t("section_side_by_side", lang)}</div>', unsafe_allow_html=True)
        
        # Build translated matrix table
        matrix_data = {
            'Metric': [
                t('row_location', lang),
                t('row_area', lang),
                t('row_asking', lang),
                t('row_fair_val', lang),
                t('row_rent', lang),
                t('row_yield', lang),
                t('row_score', lang),
                t('row_verdict', lang)
            ]
        }
        
        for idx, row in df_comp.iterrows():
            prop_label = row.get('Property Name', f"Property {idx+1}")
            deal_st = str(row.get('Deal Status', ''))
            verdict_tr = t('badge_good_deal', lang) if deal_st == "Potentially Undervalued" else (t('badge_overpriced', lang) if deal_st == "Potentially Overpriced" else t('badge_fair_price', lang))
            
            matrix_data[prop_label] = [
                str(row.get('Location', '')),
                format_number(row.get('Area (Sqft)', 0), decimals=0),
                format_currency_lakhs(row.get('Asking Price (₹ Lakhs)', 0)),
                format_currency_lakhs(row.get('ML Estimated Value (₹ Lakhs)', 0)),
                format_rent(row.get('Monthly Rent (₹)', 0)),
                format_percentage(row.get('Rental Yield (%)', 0)),
                f"{safe_int(row.get('Investment Score', 0))}/100",
                verdict_tr
            ]
            
        df_matrix = pd.DataFrame(matrix_data).set_index('Metric')
        st.table(df_matrix)
        
        # Winner Section: OUR PICK
        best_name = res.get('best_property_name', 'Property A')
        best_row = df_comp[df_comp['Property Name'] == best_name].iloc[0] if not df_comp.empty else {}
        
        score_val = safe_int(best_row.get('Investment Score', 0))
        yield_str = format_percentage(best_row.get('Rental Yield (%)', 0))
        loc_str = str(best_row.get('Location', ''))
        
        st.markdown(f"""
        <div class="rv-card rv-card-winner" style="margin-top: 24px;">
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #1E40AF; letter-spacing: 0.5px;">
                {t('our_pick_head', lang)}
            </div>
            <div style="font-size: 26px; font-weight: 800; color: #0F172A; margin-top: 4px;">
                {best_name}
            </div>
            
            <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid #DBEAFE;">
                <div style="font-size: 15px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">{t('why_pick_head', lang)}</div>
                <div class="why-line"><span style="color: #15803D; font-weight: 800;">✓</span> {t('why_pick_score', lang, score=score_val)}</div>
                <div class="why-line"><span style="color: #15803D; font-weight: 800;">✓</span> {t('why_pick_yield', lang, yield_pct=yield_str)}</div>
                <div class="why-line"><span style="color: #15803D; font-weight: 800;">✓</span> {t('why_pick_price', lang, location=loc_str)}</div>
            </div>
        </div>
        """, unsafe_allow_html=True)
