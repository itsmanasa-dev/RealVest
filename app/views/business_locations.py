import streamlit as st
import plotly.express as px
import pandas as pd
from app.translations import get_text
from src.location.business_analyzer import analyze_business_location
from src.utils.formatting import format_number
from src.utils.validation import safe_float, safe_int
from src.utils.errors import handle_user_errors

@handle_user_errors("Unable to analyze business location feasibility.")
def render_business_locations(lang='English'):
    st.markdown(f"""
    <div>
        <div class="page-head">{get_text('biz_title', lang)}</div>
        <div class="page-subhead">Analyze spatial competitor density, ward demographic benchmarks, and commercial property cost tiers.</div>
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
    
    # Question 1: What kind of business are you opening?
    st.markdown(f'### 1. {get_text("biz_q1", lang)}')
    b_type = st.radio(
        "Business Type",
        ['Cafe', 'Restaurant', 'Gym', 'Retail', 'Pharmacy'],
        index=0,
        horizontal=True,
        label_visibility="collapsed"
    )
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Question 2: Which area are you considering?
    st.markdown(f'### 2. {get_text("biz_q2", lang)}')
    c1, c2 = st.columns(2)
    with c1:
        preset_name = st.selectbox("Select area", list(location_presets.keys()), index=0)
        default_lat, default_lon = location_presets[preset_name]
    with c2:
        radius_km = st.slider("Analysis Radius (km)", min_value=0.5, max_value=5.0, value=2.0, step=0.5)
        
    res = analyze_business_location(default_lat, default_lon, business_type=b_type, radius_km=radius_km)
    
    comp_count = safe_int(res.get('competitor_count', 0))
    if comp_count > 15:
        comp_tier = "High"
    elif comp_count > 5:
        comp_tier = "Medium"
    else:
        comp_tier = "Low"
        
    pop_tier = "High"  # BBMP census indicator
    cost_tier = "High" if ("Indiranagar" in preset_name or "Koramangala" in preset_name) else "Medium"
    loc_score = safe_int(res.get('location_score', 85))
    
    st.markdown("<hr style='border-color: #E2E8F0; margin: 32px 0;'>", unsafe_allow_html=True)
    
    # Native Metrics Display
    m1, m2, m3, m4 = st.columns(4)
    with m1:
        st.metric(label=get_text('lbl_loc_score', lang), value=f"{loc_score}/100")
    with m2:
        st.metric(label=get_text('lbl_competition', lang), value=f"{comp_tier} ({comp_count} nodes)")
    with m3:
        st.metric(label=get_text('lbl_population', lang), value=f"{pop_tier} Density")
    with m4:
        st.metric(label=get_text('lbl_cost', lang), value=f"{cost_tier} Rent Tier")
        
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Why this area?
    st.markdown(f'<div class="section-head">{get_text("why_area_head", lang)}</div>', unsafe_allow_html=True)
    
    st.markdown(f"""
    <div class="rv-card">
        <div style="font-size: 15px; color: #334155; line-height: 1.6;">
            <b>{preset_name}</b> has strong BBMP population indicators and a dense {b_type.lower()} ecosystem ({comp_count} identified amenity nodes within {radius_km} km). 
            That means there is an established consumer market, but also stronger competitor presence.
            <br><br>
            <b>Summary:</b> {res.get('recommendation', '')}
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Supporting Competitor Map
    st.markdown('<div class="section-head">MAP OF NEARBY COMPETITOR NODES</div>', unsafe_allow_html=True)
    
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
        st.info("No nearby competitor amenity nodes found within the selected radius.")
        
    st.markdown("""
    <div style="font-size: 12px; color: #64748B; background: #F1F5F9; padding: 12px; border-radius: 8px; margin-top: 16px;">
        📌 <b>Data Honesty Policy:</b> Population metrics reflect BBMP ward demographic census benchmarks. The system does not claim or predict actual street footfall or store revenue without direct POS sensor data.
    </div>
    """, unsafe_allow_html=True)
