import streamlit as st

def inject_custom_css():
    st.markdown("""
    <style>
    /* Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    html, body, [class*="css"]  {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    /* Global Container Styles */
    .stApp {
        background-color: #0B0F19;
        color: #F1F5F9;
    }
    
    /* Hide Streamlit Default Header & Footer Elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header[data-testid="stHeader"] {background: rgba(11, 15, 25, 0.8); backdrop-filter: blur(8px);}
    
    /* Sidebar Styling */
    [data-testid="stSidebar"] {
        background-color: #0F172A;
        border-right: 1px solid #1E293B;
    }
    
    [data-testid="stSidebar"] .stSelectbox label, [data-testid="stSidebar"] .stRadio label {
        color: #94A3B8;
        font-weight: 500;
    }
    
    /* Header Brand Badge */
    .brand-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 0;
        margin-bottom: 24px;
        border-bottom: 1px solid #1E293B;
    }
    
    .brand-logo {
        background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);
        color: #FFFFFF;
        font-weight: 800;
        font-size: 18px;
        padding: 8px 14px;
        border-radius: 8px;
        letter-spacing: 1.5px;
    }
    
    .brand-text {
        font-size: 20px;
        font-weight: 700;
        color: #F8FAFC;
        letter-spacing: 0.5px;
    }

    .brand-tagline {
        font-size: 12px;
        color: #64748B;
        margin-top: -2px;
    }
    
    /* Metric Card Styling */
    .realvest-card {
        background-color: #1E293B;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 20px 24px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease, border-color 0.2s ease;
    }
    
    .realvest-card:hover {
        border-color: #38BDF8;
        transform: translateY(-2px);
    }
    
    .card-label {
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        color: #94A3B8;
        margin-bottom: 8px;
    }
    
    .card-value {
        font-size: 28px;
        font-weight: 700;
        color: #F8FAFC;
        margin-bottom: 4px;
    }
    
    .card-subtext {
        font-size: 13px;
        color: #64748B;
    }
    
    /* Status Badges */
    .badge-undervalued {
        background-color: rgba(16, 185, 129, 0.15);
        color: #34D399;
        border: 1px solid rgba(16, 185, 129, 0.3);
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        display: inline-block;
    }
    
    .badge-fair {
        background-color: rgba(56, 189, 248, 0.15);
        color: #38BDF8;
        border: 1px solid rgba(56, 189, 248, 0.3);
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        display: inline-block;
    }
    
    .badge-overpriced {
        background-color: rgba(239, 68, 68, 0.15);
        color: #F87171;
        border: 1px solid rgba(239, 68, 68, 0.3);
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        display: inline-block;
    }
    
    /* Section Header */
    .section-title {
        font-size: 18px;
        font-weight: 700;
        color: #F1F5F9;
        margin: 24px 0 12px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid #1E293B;
    }
    
    /* Disclaimer Container */
    .disclaimer-box {
        background-color: #0F172A;
        border: 1px solid #1E293B;
        border-left: 4px solid #38BDF8;
        border-radius: 6px;
        padding: 12px 16px;
        font-size: 12px;
        color: #94A3B8;
        margin-top: 16px;
    }
    
    /* Form Inputs Overrides */
    .stTextInput input, .stNumberInput input, .stSelectbox select {
        background-color: #0F172A !important;
        color: #F8FAFC !important;
        border: 1px solid #334155 !important;
        border-radius: 8px !important;
    }
    
    .stButton button {
        background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);
        color: #FFFFFF !important;
        font-weight: 600 !important;
        border: none !important;
        border-radius: 8px !important;
        padding: 10px 24px !important;
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
        transition: all 0.2s ease;
    }
    
    .stButton button:hover {
        background: linear-gradient(135deg, #0369A1 0%, #075985 100%);
        box-shadow: 0 6px 16px rgba(2, 132, 199, 0.4);
    }
    </style>
    """, unsafe_allow_html=True)
