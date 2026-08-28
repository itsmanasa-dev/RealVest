import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, ArrowLeft, Globe, Home, Check, Brain, LogOut, User as UserIcon } from 'lucide-react';
import type { NavTab } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import type { Language } from '../../i18n/translations';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

interface HeaderProps {
  activeTab: NavTab;
  isDark: boolean;
  onToggleTheme: () => void;
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


  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

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
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Language Segmented Switcher (EN | HI | KN) */}
          <div className="flex items-center p-0.5 rounded-lg bg-surface border border-line shadow-xs">
            {LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={clsx(
                    'px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer select-none',
                    isSelected
                      ? 'bg-brand text-white shadow-xs'
                      : 'text-ink-3 hover:text-ink hover:bg-surface-soft'
                  )}
                  title={`Switch to ${lang.label}`}
                >
                  {lang.code.toUpperCase()}
                </button>
              );
            })}
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

          {/* User Profile & Sign Out Button */}
          {user && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="h-9 px-2.5 rounded-md bg-surface border border-line hover:border-brand/40 text-ink flex items-center gap-2 cursor-pointer transition-colors"
                title={user.email || 'User Account'}
              >
                <div className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center text-[10px] font-bold">
                  {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                </div>
                <span className="text-xs font-medium max-w-[120px] truncate hidden md:inline">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface border border-line shadow-pop p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-line mb-1">
                    <p className="text-xs font-semibold text-ink truncate">
                      {user.displayName || 'RealVest User'}
                    </p>
                    <p className="text-[11px] text-ink-3 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 rounded-lg text-xs font-medium text-neg hover:bg-neg-soft flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
