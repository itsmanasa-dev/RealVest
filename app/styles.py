import streamlit as st

def inject_custom_css():
    st.markdown("""
    <style>
    /* Google Fonts Import */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
    
    html, body, [class*="css"]  {
        font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    /* Clean Light Proptech Background */
    .stApp {
        background-color: #F8FAFC !important;
        color: #0F172A !important;
    }
    
    /* Hide Default Streamlit Header & Footer Elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header[data-testid="stHeader"] {
        background-color: #FFFFFF !important;
        border-bottom: 1px solid #E2E8F0 !important;
    }
    
    /* Sidebar Styling (If open) */
    [data-testid="stSidebar"] {
        background-color: #FFFFFF !important;
        border-right: 1px solid #E2E8F0 !important;
    }
    
    [data-testid="stSidebar"] .stRadio label, [data-testid="stSidebar"] .stSelectbox label {
        color: #475569 !important;
        font-weight: 600 !important;
        font-size: 14px !important;
    }

    /* Top Header Navbar Bar */
    .nav-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 24px;
        background-color: #FFFFFF;
        border-bottom: 1px solid #E2E8F0;
        margin-bottom: 28px;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    
    .nav-brand {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .nav-logo {
        background: #2563EB;
        color: #FFFFFF;
        font-weight: 800;
        font-size: 16px;
        padding: 6px 12px;
        border-radius: 8px;
        letter-spacing: 0.5px;
    }
    
    .nav-title {
        font-size: 20px;
        font-weight: 800;
        color: #0F172A;
        letter-spacing: -0.5px;
    }
    
    .nav-tagline {
        font-size: 12px;
        color: #64748B;
        margin-top: -2px;
    }
    
    /* Modern Premium White Cards */
    .rv-card {
        background-color: #FFFFFF !important;
        border: 1px solid #E2E8F0 !important;
        border-radius: 12px !important;
        padding: 24px !important;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02) !important;
        margin-bottom: 20px !important;
        transition: all 0.2s ease;
    }
    
    .rv-card:hover {
        border-color: #CBD5E1 !important;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06) !important;
    }
    
    .rv-card-winner {
        border: 2px solid #2563EB !important;
        background-color: #EFF6FF !important;
    }
    
    /* Hero Banners */
    .hero-box {
        text-align: center;
        padding: 48px 24px 36px 24px;
        max-width: 840px;
        margin: 0 auto 32px auto;
    }
    
    .hero-h1 {
        font-size: 42px;
        font-weight: 800;
        line-height: 1.15;
        color: #0F172A;
        letter-spacing: -1px;
        margin-bottom: 16px;
    }
    
    .hero-p {
        font-size: 18px;
        line-height: 1.6;
        color: #475569;
        max-width: 680px;
        margin: 0 auto 32px auto;
    }
    
    /* Page Titles */
    .page-head {
        font-size: 30px;
        font-weight: 800;
        color: #0F172A;
        letter-spacing: -0.6px;
        margin-bottom: 6px;
    }
    
    .page-subhead {
        font-size: 15px;
        color: #64748B;
        margin-bottom: 28px;
        line-height: 1.5;
    }
    
    .section-head {
        font-size: 18px;
        font-weight: 700;
        color: #0F172A;
        margin: 28px 0 14px 0;
        letter-spacing: -0.3px;
    }
    
    /* Native Metric Component Styling */
    div[data-testid="stMetric"] {
        background-color: #FFFFFF !important;
        border: 1px solid #E2E8F0 !important;
        padding: 16px 20px !important;
        border-radius: 12px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03) !important;
    }
    
    div[data-testid="stMetric"] label {
        color: #64748B !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        text-transform: uppercase !alignment;
        letter-spacing: 0.5px !important;
    }

    div[data-testid="stMetric"] [data-testid="stMetricValue"] {
        color: #0F172A !important;
        font-size: 26px !important;
        font-weight: 800 !important;
    }
    
    /* Badges */
    .badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 700;
    }
    
    .badge-good {
        background-color: #DCFCE7;
        color: #15803D;
    }
    
    .badge-fair {
        background-color: #FEF3C7;
        color: #B45309;
    }
    
    .badge-overpriced {
        background-color: #FEE2E2;
        color: #B91C1C;
    }
    
    .badge-brand {
        background-color: #DBEAFE;
        color: #1E40AF;
    }
    
    /* Plain Language Why Items */
    .why-line {
        padding: 10px 14px;
        background-color: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        margin-bottom: 8px;
        font-size: 14px;
        color: #334155;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    /* Native Form Overrides */
    .stTextInput input, .stNumberInput input, .stSelectbox select {
        background-color: #FFFFFF !important;
        color: #0F172A !important;
        border: 1px solid #CBD5E1 !important;
        border-radius: 8px !important;
        padding: 10px 14px !important;
    }

    .stTextInput input:focus, .stNumberInput input:focus, .stSelectbox select:focus {
        border-color: #2563EB !important;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
    }
    
    /* Primary & Secondary Buttons */
    .stButton button {
        background-color: #2563EB !important;
        color: #FFFFFF !important;
        font-weight: 700 !important;
        border: 1px solid #2563EB !important;
        border-radius: 8px !important;
        padding: 10px 24px !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
    }
    
    .stButton button:hover {
        background-color: #1D4ED8 !important;
        border-color: #1D4ED8 !important;
        transform: translateY(-1px) !important;
    }

    /* Native Dataframe Styling */
    .stDataFrame {
        border: 1px solid #E2E8F0 !important;
        border-radius: 8px !important;
        overflow: hidden !important;
    }
    </style>
    """, unsafe_allow_html=True)
