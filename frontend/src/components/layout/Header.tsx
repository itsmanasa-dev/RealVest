import React from 'react';
import { Search, Bell, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  categoryLabel?: string;
  isDark: boolean;
  onToggleTheme: () => void;
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  categoryLabel = 'PORTFOLIO OVERVIEW',
  isDark,
  onToggleTheme,
  onSearchClick,
}) => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#031427]/80 backdrop-blur-md transition-colors">
      {/* Header Left: Greeting & Category Tag */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {categoryLabel}
          </span>
          {/* Pulsing Live Market Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              Live Market Data • Just synced
            </span>
          </div>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Good Morning, Investor
        </h2>
      </div>

      {/* Header Right: Actions & User Avatar */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onSearchClick}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <Search size={18} />
        </button>

        {/* Mobile Theme Switch Button */}
        <button
          onClick={onToggleTheme}
          className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-blue-500" />}
        </button>

        <button className="hidden sm:flex p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500"></span>
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-blue-600 p-0.5 shadow-md">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-mono font-bold text-xs">
              IN
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              Institutional Tier
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              fund_mgr_01
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
