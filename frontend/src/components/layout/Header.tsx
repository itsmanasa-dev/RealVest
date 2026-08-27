import React, { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon, ArrowLeft, Globe, Home, Check, Brain } from 'lucide-react';
import type { NavTab } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import type { Language } from '../../i18n/translations';
import { clsx } from 'clsx';

interface HeaderProps {
  activeTab: NavTab;
  isDark: boolean;
  onToggleTheme: () => void;
  onSearchClick?: () => void;
  onBack?: () => void;
  showBack?: boolean;
  onOpenAdvisor?: () => void;
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  isDark,
  onToggleTheme,
  onSearchClick,
  onBack,
  showBack,
  onOpenAdvisor,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pageTitle =
    activeTab === 'dashboard' ? t.nav_dashboard :
    activeTab === 'explore' ? t.nav_explore :
    activeTab === 'analysis' ? t.nav_analysis :
    activeTab === 'saved-comparisons' ? 'Saved Scenarios' :
    activeTab === 'simulator' ? t.nav_simulator :
    activeTab === 'markets' ? t.nav_markets :
    'Settings';


  return (
    <header className="sticky top-0 z-30 bg-canvas/90 backdrop-blur-md border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          {showBack ? (
            <button
              onClick={onBack}
              className="btn btn-ghost -ml-2"
            >
              <ArrowLeft size={16} />
              <span>{t.back_to_assets}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 lg:hidden">
              <span className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center">
                <Home size={16} strokeWidth={2.4} />
              </span>
            </div>
          )}

          <div className="hidden md:block min-w-0">
            <span className="text-sm font-semibold text-ink tracking-tight">{pageTitle}</span>
          </div>

          {/* Desktop search */}
          {!showBack && (
            <button
              onClick={onSearchClick}
              className="ml-2 hidden md:flex items-center gap-2.5 px-4 py-2 rounded-md bg-surface border border-line text-ink-3 text-sm w-64 lg:w-80 text-left hover:border-line-strong hover:text-ink-2 transition-colors"
            >
              <Search size={15} className="shrink-0" />
              <span className="truncate">{t.search_placeholder}</span>
            </button>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Mobile search icon */}
          {!showBack && (
            <button
              onClick={onSearchClick}
              className="md:hidden w-9 h-9 rounded-md bg-surface border border-line text-ink-2 flex items-center justify-center cursor-pointer"
              aria-label="Search"
            >
              <Search size={16} />
            </button>
          )}

          {/* Language switcher */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 rounded-md bg-surface border border-line text-ink-2 hover:text-ink flex items-center justify-center cursor-pointer"
              aria-label="Change language"
              aria-expanded={open}
            >
              <Globe size={16} />
            </button>
            {open && (
              <div className="absolute right-0 mt-1.5 w-44 rv-card p-1.5 shadow-pop z-50 rv-fade-in">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setOpen(false);
                    }}
                    className={clsx(
                      'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer',
                      language === lang.code
                        ? 'bg-brand-soft text-brand font-semibold'
                        : 'text-ink-2 hover:bg-surface-soft'
                    )}
                  >
                    <span>{lang.label}</span>
                    {language === lang.code && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-md bg-surface border border-line text-ink-2 hover:text-ink flex items-center justify-center cursor-pointer"
            aria-label={isDark ? t.light_mode : t.dark_mode}
            title={isDark ? t.light_mode : t.dark_mode}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* AI Advisor Trigger Button */}
          {onOpenAdvisor && (
            <button
              onClick={onOpenAdvisor}
              className="px-2.5 py-1.5 rounded-md bg-brand-soft text-brand hover:bg-brand hover:text-white border border-brand/20 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer ml-1 shadow-xs"
              title="Open AI Advisor"
            >
              <Brain size={14} />
              <span className="hidden sm:inline">Advisor</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
