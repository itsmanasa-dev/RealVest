import React from 'react';
import type { NavTab } from '../../types';
import {
  LayoutDashboard,
  Compass,
  LineChart,
  Scale,
  Sliders,
  TrendingUp,
  Brain,
  Settings,
  Sun,
  Moon,
  Building2,
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore', label: 'Property Explorer', icon: Compass },
    { id: 'analysis', label: 'Property Analysis', icon: LineChart },
    { id: 'compare', label: 'Compare Properties', icon: Scale },
    { id: 'simulator', label: 'Decision Simulator', icon: Sliders },
    { id: 'markets', label: 'Market Intelligence', icon: TrendingUp },
    { id: 'advisor', label: 'AI Advisor', icon: Brain },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#031427] flex-col justify-between hidden md:flex shrink-0 min-h-screen sticky top-0 transition-colors">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-mono font-extrabold shadow-lg shadow-emerald-500/20">
            RV
          </div>
          <div>
            <span className="font-extrabold font-mono tracking-wider text-slate-900 dark:text-white text-base">
              REALVEST
            </span>
            <div className="text-[10px] font-mono text-emerald-500 tracking-widest uppercase">
              DECISION ENGINE
            </div>
          </div>
        </div>

        {/* Navigation Link Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Bottom Controls */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-[11px] font-mono text-slate-400">Theme Mode</span>
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition-colors cursor-pointer"
            title="Toggle theme mode"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <Building2 size={14} className="text-emerald-500" />
            <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-bold">
              Bengaluru Market DB
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Verified ML Models Active
          </div>
        </div>
      </div>
    </aside>
  );
};
