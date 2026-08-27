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
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#031427]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left Action / Search / Back */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={t.back_to_assets}
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <button
              onClick={onSearchClick}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={t.search_prompt_btn}
            >
              <Search size={20} />
            </button>
          )}
        </div>

        {/* Center Brand Title */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-mono font-black text-sm shadow-md">
              RV
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight font-sans text-blue-600 dark:text-emerald-400 leading-tight">
                RealVest
              </span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase hidden sm:block">
                Bengaluru Real Estate AI
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions: Language Switcher + Theme Toggle + User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Change Language"
            >
              <Globe size={15} />
              <span className="uppercase">{language}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-[#102034] border border-slate-200 dark:border-slate-700 shadow-xl py-1.5 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      language === lang.code
                        ? 'bg-blue-50 dark:bg-emerald-500/20 text-blue-600 dark:text-emerald-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
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
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            title={`${t.switch_to} ${isDark ? t.light_mode : t.dark_mode}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Profile Avatar */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-blue-500/20 dark:ring-emerald-500/30 overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-700 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Investor Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
