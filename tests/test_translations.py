import pytest
from app.translations import t

def test_english_translations():
    assert t('brand_name', 'English') == 'REALVEST'
    assert t('nav_home', 'English') == 'Home'
    assert t('hero_title', 'English') == 'Is your next property actually worth it?'
    assert t('verdict_good', 'English') == 'Good deal'
    assert t('error_generic', 'English') == 'Something went wrong. Please try again.'

def test_hindi_translations():
    assert t('nav_home', 'Hindi') == 'होम'
    assert t('nav_properties', 'Hindi') == 'संपत्तियां'
    assert t('hero_title', 'Hindi') == 'क्या आपकी अगली संपत्ति वास्तव में इसके लायक है?'
    assert t('verdict_good', 'Hindi') == 'अच्छा सौदा (Good deal)'
    assert t('error_generic', 'Hindi') == 'कुछ गलत हुआ। कृपया फिर से प्रयास करें।'
    # Test formatting string interpolation
    formatted = t('why_asking_below', 'Hindi', diff="₹5.0 L")
    assert "₹5.0 L" in formatted

def test_kannada_translations():
    assert t('nav_home', 'Kannada') == 'ಹೋಮ್'
    assert t('nav_properties', 'Kannada') == 'ಆಸ್ತಿಗಳು'
    assert t('hero_title', 'Kannada') == 'ನಿಮ್ಮ ಮುಂದಿನ ಆಸ್ತಿ ನಿಜವಾಗಿಯೂ ಮೌಲ್ಯಯುತವಾಗಿದೆಯೇ?'
    assert t('verdict_good', 'Kannada') == 'ಉತ್ತಮ ವ್ಯವಹಾರ (Good deal)'
    assert t('error_generic', 'Kannada') == 'ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
    # Test formatting string interpolation
    formatted = t('why_asking_below', 'Kannada', diff="₹5.0 L")
    assert "₹5.0 L" in formatted
