import React, { useState } from 'react';
import { Sun, Moon, IndianRupee, ShieldCheck, Database, Globe, Check } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import type { Language } from '../../i18n/translations';

interface SettingsViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDark,
  onToggleTheme,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const [currency, setCurrency] = useState('INR');

  const languages: { code: Language; label: string; sub: string }[] = [
    { code: 'en', label: 'English', sub: 'Default platform language' },
    { code: 'hi', label: 'हिंदी (Hindi)', sub: 'भारतीय भाषा अनुवाद' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)', sub: 'ಬೆಂಗಳೂರು / ಕರ್ನಾಟಕ ಸ್ಥಳೀಯ ಭಾಷೆ' },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-2xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-[#273449]">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-bold uppercase tracking-wider border border-blue-500/20">
            SYSTEM PREFERENCES
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.platform_settings}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.settings_desc}
        </p>
      </div>

      <div className="space-y-6">
        {/* Language Selection Card */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {t.language_preference}
              </h3>
              <p className="text-xs text-slate-400">Select active interface translation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {languages.map((l) => {
              const isActive = language === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-slate-50 dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-700 dark:text-slate-300 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{l.label}</span>
                    {isActive && <Check size={16} />}
                  </div>
                  <span className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                    {l.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Theme Archetype */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {t.visual_archetype}
              </h3>
              <p className="text-xs text-slate-400">Electric Obsidian vs Decision Light</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200">
              Current: <b className="text-blue-600 dark:text-blue-400">{isDark ? 'Electric Obsidian (#0B1120 / #111827)' : 'Decision Light (#F8FAFC / #FFFFFF)'}</b>
            </span>
            <button
              onClick={onToggleTheme}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              {t.toggle_theme}
            </button>
          </div>
        </div>

        {/* Currency Benchmark */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
              <IndianRupee size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {t.currency_benchmark}
              </h3>
              <p className="text-xs text-slate-400">Display currency for asset valuations (Standard: INR ₹)</p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            {['INR (₹) — Active', 'USD ($)', 'EUR (€)'].map((c) => {
              const code = c.split(' ')[0];
              const isActive = code === 'INR';
              return (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-[#172033] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1e2c47] border border-transparent dark:border-[#273449]'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dataset Coverage */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {t.dataset_coverage}
              </h3>
              <p className="text-xs text-slate-400">{t.bengaluru_records_count}</p>
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
            Data models trained on certified Bengaluru housing transactions, MagicBricks rental yields, and Reserve Bank of India / National Housing Bank Housing Price Index time series.
          </div>
        </div>
      </div>
    </div>
  );
};

