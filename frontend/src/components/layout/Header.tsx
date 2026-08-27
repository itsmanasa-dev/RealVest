import React, { useState } from 'react';
import { Search, Sun, Moon, ArrowLeft, Globe, Bell } from 'lucide-react';
import type { NavTab } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import type { Language } from '../../i18n/translations';

interface HeaderProps {
  categoryLabel?: string;
  activeTab: NavTab;
  isDark: boolean;
  onToggleTheme: () => void;
  onSearchClick?: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  categoryLabel,
  activeTab,
  isDark,
  onToggleTheme,
  onSearchClick,
  onBack,
  showBack,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#273449] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Avatar + Welcome Greeting (Matching Dribbble Reference) or Back Button */}
        <div className="flex items-center gap-3 min-w-0">
          {showBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#172033] transition-colors cursor-pointer border border-slate-200 dark:border-[#273449]"
            >
              <ArrowLeft size={15} />
              <span>{t.back_to_assets}</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {/* User Avatar */}
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shrink-0 shadow-sm">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                  <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">RV</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111827]" />
              </div>

              <div>
                <div className="text-xs text-slate-400 leading-none">Welcome,</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white leading-tight mt-0.5">
                  Courtney
                </div>
              </div>
            </div>
          )}

          {/* Desktop Search Bar */}
          {!showBack && (
            <button
              onClick={onSearchClick}
              className="hidden md:flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-[#172033] text-slate-400 text-xs hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer border border-transparent dark:border-[#273449] w-64 lg:w-72 text-left ml-4"
            >
              <Search size={14} className="text-slate-400 shrink-0" />
              <span className="truncate">Search properties, corridors...</span>
            </button>
          )}
        </div>

        {/* Right Actions: Notification Bell + Language + Theme Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notification Bell (from Dribbble screen) */}
          <button
            onClick={() => setHasNotif(false)}
            className="relative p-2 rounded-full bg-slate-100 dark:bg-[#172033] text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer border border-slate-200/60 dark:border-[#273449]"
            title="Notifications"
          >
            <Bell size={16} />
            {hasNotif && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#111827]" />
            )}
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#172033] text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200/60 dark:border-[#273449]"
              title="Change Language"
            >
              <Globe size={13} />
              <span className="uppercase">{language}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-40 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-xl py-1.5 z-50 overflow-hidden">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-3.5 py-1.5 text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      language === lang.code
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#172033]'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {language === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-[#172033] text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer border border-slate-200/60 dark:border-[#273449]"
            title={`${t.switch_to} ${isDark ? t.light_mode : t.dark_mode}`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
};



