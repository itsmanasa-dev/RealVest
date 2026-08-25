import streamlit as st
import plotly.express as px
import pandas as pd
from app.translations import t
from src.location.business_analyzer import analyze_business_location
from src.utils.formatting import format_number
from src.utils.validation import safe_float, safe_int
from src.utils.errors import handle_user_errors

@handle_user_errors("Unable to analyze business location feasibility.")
def render_business_locations(lang='English'):
    st.markdown(f"""
    <div>
        <div class="page-head">{t('biz_title', lang)}</div>
        <div class="page-subhead">{t('biz_sub', lang)}</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Presets for popular Bengaluru hubs
    location_presets = {
        'Koramangala 5th Block': (12.934532, 77.626579),
        'Indiranagar 100ft Road': (12.978369, 77.640835),
        'Whitefield Main Road': (12.969812, 77.749962),
        'HSR Layout Sector 1': (12.911623, 77.638862),
        'Jayanagar 4th Block': (12.929267, 77.582424),
        'Electronic City Phase 1': (12.845212, 77.660162),
        'Yelahanka New Town': (13.099162, 77.592162)
    }
    
    b_type_options = [
        t('opt_cafe', lang),
        t('opt_restaurant', lang),
        t('opt_gym', lang),
        t('opt_retail', lang),
        t('opt_pharmacy', lang)
    ]
    
    # Question 1
    st.markdown(f'### {t("biz_q1", lang)}')
    selected_btype = st.radio(
        "Business Type",
        b_type_options,
        index=0,
        horizontal=True,
        label_visibility="collapsed"
    )
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Question 2
    st.markdown(f'### {t("biz_q2", lang)}')
    c1, c2 = st.columns(2)
    with c1:
        preset_name = st.selectbox(t('lbl_select_area', lang), list(location_presets.keys()), index=0)
        default_lat, default_lon = location_presets[preset_name]
    with c2:
        radius_km = st.slider(t('lbl_radius', lang), min_value=0.5, max_value=5.0, value=2.0, step=0.5)
        
    res = analyze_business_location(default_lat, default_lon, business_type=selected_btype, radius_km=radius_km)
    
    comp_count = safe_int(res.get('competitor_count', 0))
    if comp_count > 15:
        comp_tier = t('tier_high', lang)
    elif comp_count > 5:
        comp_tier = t('tier_medium', lang)
    else:
        comp_tier = t('tier_low', lang)
        
    pop_tier = t('tier_high_density', lang)
    cost_tier = t('tier_high_rent', lang) if ("Indiranagar" in preset_name or "Koramangala" in preset_name) else t('tier_medium_rent', lang)
    loc_score = safe_int(res.get('location_score', 85))
    
    st.markdown("<hr style='border-color: #E2E8F0; margin: 32px 0;'>", unsafe_allow_html=True)
    
    # Metrics
    m1, m2, m3, m4 = st.columns(4)
    with m1:
        st.metric(label=t('lbl_loc_score', lang), value=f"{loc_score}/100")
    with m2:
        st.metric(label=t('lbl_competition', lang), value=f"{comp_tier} ({comp_count})")
    with m3:
        st.metric(label=t('lbl_population', lang), value=pop_tier)
    with m4:
        st.metric(label=t('lbl_cost', lang), value=cost_tier)
        
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Why this area?
    st.markdown(f'<div class="section-head">{t("why_area_head", lang)}</div>', unsafe_allow_html=True)
    
    why_desc_str = t('why_area_desc', lang, preset_name=preset_name, b_type=selected_btype.lower(), comp_count=comp_count, radius=radius_km)
    summary_label = t('biz_summary_head', lang)
    rec_text = res.get('recommendation', '')
    
    st.markdown(f"""
    <div class="rv-card">
        <div style="font-size: 15px; color: #334155; line-height: 1.6;">
            {why_desc_str}
            <br><br>
            <b>{summary_label}</b> {rec_text}
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Competitor Map
    st.markdown(f'<div class="section-head">{t("section_map_nodes", lang)}</div>', unsafe_allow_html=True)
    
    competitors_df = res.get('nearby_competitors', pd.DataFrame()).copy()
    if not competitors_df.empty:
        fig_map = px.scatter_mapbox(
            competitors_df,
            lat='lat',
            lon='lon',
            hover_name='name',
            hover_data=['amenity', 'distance_km'],
            color_discrete_sequence=['#2563EB'],
            zoom=12,
            height=380
        )
        target_df = pd.DataFrame([{'name': f'Target Site ({preset_name})', 'lat': default_lat, 'lon': default_lon}])
        fig_target = px.scatter_mapbox(target_df, lat='lat', lon='lon', hover_name='name', color_discrete_sequence=['#DC2626'], zoom=12)
        fig_map.add_trace(fig_target.data[0])
        fig_map.update_layout(
            mapbox_style="carto-positron",
            margin=dict(l=0, r=0, t=0, b=0),
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)'
        )
        st.plotly_chart(fig_map, use_container_width=True)
    else:
        st.info(t('map_empty', lang))
        
    st.markdown(f"""
    <div style="font-size: 12px; color: #64748B; background: #F1F5F9; padding: 12px; border-radius: 8px; margin-top: 16px;">
        {t('footfall_disclaimer', lang)}
    </div>
    """, unsafe_allow_html=True)
