import React from 'react';
import { Search, Sun, Moon, ArrowLeft, Building2 } from 'lucide-react';
import type { NavTab } from '../../types';

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
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#031427]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left Action / Search / Back */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <button
              onClick={onSearchClick}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Search"
            >
              <Search size={20} />
            </button>
          )}
        </div>

        {/* Center Brand Title */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl tracking-tight font-sans text-blue-600 dark:text-emerald-400">
              RealVest
            </span>
          </div>
        </div>

        {/* Right Actions: Theme Toggle + User Avatar */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Profile Avatar (matching screenshots) */}
          <div className="w-9 h-9 rounded-full ring-2 ring-blue-500/20 dark:ring-emerald-500/30 overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-700 cursor-pointer">
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
