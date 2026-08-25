from app.translations.en import EN_TRANSLATIONS
from app.translations.hi import HI_TRANSLATIONS
from app.translations.kn import KN_TRANSLATIONS

LANG_MAP = {
    'English': EN_TRANSLATIONS,
    'Hindi': HI_TRANSLATIONS,
    'Kannada': KN_TRANSLATIONS
}

def t(key, lang='English', **kwargs):
    """
    Centralized translation function.
    Given a key and language ('English', 'Hindi', 'Kannada'), retrieves the string and formats optional kwargs.
    """
    trans_dict = LANG_MAP.get(lang, EN_TRANSLATIONS)
    template = trans_dict.get(key, EN_TRANSLATIONS.get(key, key))
    if kwargs:
        try:
            return template.format(**kwargs)
        except (KeyError, ValueError, IndexError):
            return template
    return template

def get_text(key, lang='English'):
    """
    Backward-compatible fallback helper for get_text.
    """
    return t(key, lang)
