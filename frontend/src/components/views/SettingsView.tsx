import React, { useState } from 'react';
import { Sun, Moon, DollarSign, ShieldCheck, Database, Check } from 'lucide-react';

interface SettingsViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDark,
  onToggleTheme,
}) => {
  const [currency, setCurrency] = useState('INR');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[11px] font-bold uppercase tracking-wider">
            SYSTEM PREFERENCES
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Platform Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure visual archetypes, currency benchmarks, and live market data parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme Archetype */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Visual Archetype Theme
              </h3>
              <p className="text-xs text-slate-400">Electric Obsidian vs Decision Light</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200">
              Current: <b className="text-emerald-500">{isDark ? 'Electric Obsidian (#031427)' : 'Decision Light (#f8f9ff)'}</b>
            </span>
            <button
              onClick={onToggleTheme}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-mono text-xs font-bold hover:bg-emerald-600 transition-all cursor-pointer shadow-md"
            >
              Toggle Theme
            </button>
          </div>
        </div>

        {/* Currency Benchmark */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Currency Unit Benchmark
              </h3>
              <p className="text-xs text-slate-400">Display currency for asset valuations</p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            {['INR (₹)', 'USD ($)', 'EUR (€)'].map((c) => {
              const code = c.split(' ')[0];
              const isActive = currency === code;
              return (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
