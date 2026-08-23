import streamlit as st
import pandas as pd
from app.translations import get_text
from src.analytics.yield_calculator import calculate_rental_yield
from src.analytics.deal_classifier import classify_property_deal
from src.analytics.investment_scorer import calculate_investment_score

def render_investment_insights(lang='English'):
    st.markdown(f"""
    <div style="margin-bottom: 24px;">
        <h2 style="font-size: 26px; font-weight: 700; color: #F8FAFC;">{get_text('nav_insights', lang)}</h2>
        <p style="color: #94A3B8; font-size: 14px;">Understand rental yields, valuation deal ratings, and the transparent 4-factor Investment Score calculation methodology.</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown('<div class="section-title">Transparent Investment Score Formula Breakdown</div>', unsafe_allow_html=True)
    
    col1, col2 = st.columns([7, 5])
    
    with col1:
        st.markdown("""
        The **REALVEST Investment Score (0–100)** is calculated using four defensible, transparent metrics:
        
        1. **Valuation Ratio (35% Weight):** Evaluates how asking price compares to the ML-predicted fair value. Asking prices below fair value score up to 100 points.
        2. **Rental Yield Return (35% Weight):** Evaluates annual rent relative to property acquisition cost. Yields above 5.0% score 100 points.
        3. **Location Tier (15% Weight):** Evaluates micro-market infrastructure, demand density, and employment hub proximity.
        4. **Market Trend Benchmark (15% Weight):** Evaluates historical NHB Residex housing price index growth.
        """)
        
        sample_score = calculate_investment_score(72.0, 80.0, 4.2)
        st.markdown("#### Sample Calculation Matrix")
        df_breakdown = pd.DataFrame(sample_score['breakdown'])
        st.table(df_breakdown)
        
    with col2:
        st.markdown("""
        <div class="realvest-card">
            <h4 style="font-size: 16px; font-weight: 700; color: #F8FAFC; margin: 0 0 12px 0;">Rental Yield Formula</h4>
            <div style="background-color: #0F172A; padding: 16px; border-radius: 8px; font-family: monospace; color: #38BDF8; font-size: 14px; margin-bottom: 12px;">
                Rental Yield (%) = (Annual Rent / Property Price) × 100
            </div>
            <div style="font-size: 13px; color: #94A3B8; line-height: 1.6;">
                • <b>High Yield (> 5.0%):</b> Excellent cash flow return.<br>
                • <b>Moderate Yield (3.5% – 5.0%):</b> Prime urban residential standard.<br>
                • <b>Low Yield (< 3.5%):</b> Appreciation-heavy asset.
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown("""
        <div class="disclaimer-box">
            ⚖️ <b>Deal Classification Thresholds:</b><br>
            • <b>Potentially Undervalued:</b> Asking price < Fair Value by > 7%.<br>
            • <b>Fairly Priced:</b> Asking price within Fair Value ± 7%.<br>
            • <b>Potentially Overpriced:</b> Asking price > Fair Value by > 7%.
        </div>
        """, unsafe_allow_html=True)
