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
    <div className="space-y-6 pb-12 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200 dark:border-[#273449]">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-medium uppercase tracking-wider border border-blue-500/20">
            SYSTEM PREFERENCES
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
          {t.platform_settings}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t.settings_desc}
        </p>
      </div>

      <div className="space-y-4">
        {/* Language Selection Card */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t.language_preference}
              </h3>
              <p className="text-xs text-slate-400">Select active interface translation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {languages.map((l) => {
              const isActive = language === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer flex flex-col justify-between gap-1 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-500/50 font-semibold'
                      : 'bg-slate-50 dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-700 dark:text-slate-300 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{l.label}</span>
                    {isActive && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {l.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Theme Archetype */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t.visual_archetype}
              </h3>
              <p className="text-xs text-slate-400">Electric Obsidian vs Decision Light</p>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
              Current: <b className="text-blue-600 dark:text-blue-400">{isDark ? 'Electric Obsidian (#0B1120 / #111827)' : 'Decision Light (#F8FAFC / #FFFFFF)'}</b>
            </span>
            <button
              onClick={onToggleTheme}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-medium transition-colors cursor-pointer shadow-sm"
            >
              {t.toggle_theme}
            </button>
          </div>
        </div>

        {/* Currency Benchmark */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <IndianRupee size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t.currency_benchmark}
              </h3>
              <p className="text-xs text-slate-400">Display currency for asset valuations (Standard: INR ₹)</p>
            </div>
          </div>

          <div className="pt-1 flex items-center gap-2.5">
            {['INR (₹) — Active', 'USD ($)', 'EUR (€)'].map((c) => {
              const code = c.split(' ')[0];
              const isActive = code === 'INR';
              return (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
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
        <div className="p-5 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Database size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
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


