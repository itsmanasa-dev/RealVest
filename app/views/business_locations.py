import streamlit as st
import plotly.express as px
import pandas as pd
from app.translations import get_text
from src.location.business_analyzer import analyze_business_location

def render_business_locations(lang='English'):
    st.markdown(f"""
    <div style="margin-bottom: 24px;">
        <h2 style="font-size: 26px; font-weight: 700; color: #F8FAFC;">{get_text('nav_business', lang)}</h2>
        <p style="color: #94A3B8; font-size: 14px;">Evaluate spatial competitor density, ward population demand benchmarks, and commercial feasibility for new business ventures.</p>
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
    
    col_f1, col_f2, col_f3 = st.columns(3)
    
    with col_f1:
        preset_name = st.selectbox("Select Target Micro-Market Hub", list(location_presets.keys()), index=0)
        default_lat, default_lon = location_presets[preset_name]
        
    with col_f2:
        b_type = st.selectbox(get_text('lbl_business_type', lang), ['Cafe', 'Restaurant', 'Gym', 'Pharmacy', 'Retail Shop'], index=0)
        
    with col_f3:
        radius_km = st.slider(get_text('lbl_radius', lang), min_value=0.5, max_value=5.0, value=2.0, step=0.5)
        
    res = analyze_business_location(default_lat, default_lon, business_type=b_type, radius_km=radius_km)
    
    st.markdown("<hr style='border-color: #1E293B; margin: 24px 0;'>", unsafe_allow_html=True)
    
    # KPI Result Cards
    k1, k2, k3, k4 = st.columns(4)
    with k1:
        st.markdown(f"""
        <div class="realvest-card">
            <div class="card-label">Business Score</div>
            <div class="card-value" style="color: {res['color']};">{res['location_score']}/100</div>
            <div class="card-subtext">{res['business_type']} Feasibility</div>
        </div>
        """, unsafe_allow_html=True)
        
    with k2:
        st.markdown(f"""
        <div class="realvest-card">
            <div class="card-label">Competitors ({radius_km}km)</div>
            <div class="card-value">{res['competitor_count']}</div>
            <div class="card-subtext">Spatial Nodes</div>
        </div>
        """, unsafe_allow_html=True)
        
    with k3:
        st.markdown("""
        <div class="realvest-card">
            <div class="card-label">Avg Ward Population</div>
            <div class="card-value">~42,500</div>
            <div class="card-subtext">BBMP Census Benchmark</div>
        </div>
        """, unsafe_allow_html=True)
        
    with k4:
        st.markdown("""
        <div class="realvest-card">
            <div class="card-label">Demand Tier</div>
            <div class="card-value" style="color: #38BDF8;">High Urban</div>
            <div class="card-subtext">Density Category</div>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown(f"**Recommendation Summary:** {res['recommendation']}")
    
    # Interactive Plotly Map
    st.markdown('<div class="section-title">Interactive Competitor Map</div>', unsafe_allow_html=True)
    
    competitors_df = res['nearby_competitors'].copy()
    
    if not competitors_df.empty:
        # Create map plot
        fig_map = px.scatter_mapbox(
            competitors_df,
            lat='lat',
            lon='lon',
            hover_name='name',
            hover_data=['amenity', 'cuisine', 'distance_km'],
            color_discrete_sequence=['#38BDF8'],
            zoom=12,
            height=450
        )
        
        # Add target location marker
        target_df = pd.DataFrame([{'name': f'Target Site ({preset_name})', 'lat': default_lat, 'lon': default_lon}])
        fig_target = px.scatter_mapbox(target_df, lat='lat', lon='lon', hover_name='name', color_discrete_sequence=['#EF4444'], zoom=12)
        
        fig_map.add_trace(fig_target.data[0])
        fig_map.update_layout(
            mapbox_style="carto-darkmatter",
            margin=dict(l=0, r=0, t=0, b=0),
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)'
        )
        st.plotly_chart(fig_map, use_container_width=True)
    else:
        st.info("No nearby competitor amenity nodes found within the immediate radius.")
        
    st.markdown(f"""
    <div class="disclaimer-box">
        📍 <b>Data Disclaimer:</b> {res['disclaimer']}
    </div>
    """, unsafe_allow_html=True)
