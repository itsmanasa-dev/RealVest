import React, { useState } from 'react';
import { Search, Sun, Moon, ArrowLeft, Globe } from 'lucide-react';
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

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#273449] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Mobile Brand or Context Title / Back Button */}
        <div className="flex items-center gap-3 min-w-0">
          {showBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#172033] transition-colors cursor-pointer border border-transparent dark:border-[#273449]"
            >
              <ArrowLeft size={16} />
              <span>{t.back_to_assets}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5 lg:hidden">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-xs">
                RV
              </div>
              <span className="font-semibold text-slate-900 dark:text-white text-base">
                RealVest
              </span>
            </div>
          )}

          {/* Desktop Search Trigger Bar */}
          {!showBack && (
            <button
              onClick={onSearchClick}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#172033] text-slate-500 dark:text-slate-400 text-xs hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer border border-transparent dark:border-[#273449] w-64 md:w-80 text-left"
            >
              <Search size={14} className="shrink-0" />
              <span className="truncate">{t.search_placeholder.split('(')[0]}...</span>
            </button>
          )}
        </div>

        {/* Right Actions: Language Switcher + Theme Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile Search Button */}
          {!showBack && (
            <button
              onClick={onSearchClick}
              className="sm:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#172033] transition-colors cursor-pointer"
              title={t.search_prompt_btn}
            >
              <Search size={18} />
            </button>
          )}

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-[#172033] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200/60 dark:border-[#273449]"
              title="Change Language"
            >
              <Globe size={14} />
              <span className="uppercase">{language}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-40 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-lg py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      language === lang.code
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#172033]'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {language === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#172033] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer border border-slate-200/60 dark:border-[#273449]"
            title={`${t.switch_to} ${isDark ? t.light_mode : t.dark_mode}`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
};


