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
  Globe,
  BookmarkCheck,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

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
  const { language, setLanguage, t } = useTranslation();

  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: t.nav_dashboard, icon: LayoutDashboard },
    { id: 'explore', label: t.nav_explore, icon: Compass },
    { id: 'analysis', label: t.nav_analysis, icon: LineChart },
    { id: 'compare', label: t.nav_compare, icon: Scale },
    { id: 'saved-comparisons', label: 'Saved Scenarios', icon: BookmarkCheck },
    { id: 'simulator', label: t.nav_simulator, icon: Sliders },
    { id: 'markets', label: t.nav_markets, icon: TrendingUp },
    { id: 'advisor', label: t.nav_advisor, icon: Brain },
    { id: 'settings', label: t.nav_settings, icon: Settings },
  ];

  return (
    <aside className="w-60 border-r border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] flex-col justify-between hidden lg:flex shrink-0 min-h-screen sticky top-0 transition-colors z-30 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center px-5 border-b border-slate-200 dark:border-[#273449] gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-mono font-bold text-xs tracking-wider shadow-sm">
            RV
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight text-slate-900 dark:text-white text-sm">
              RealVest
            </span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400 tracking-wider uppercase">
              Decision Engine
            </span>
          </div>
        </div>

        {/* Navigation Link Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#172033]'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Bottom Controls */}
      <div className="p-4 border-t border-slate-200 dark:border-[#273449] space-y-3">
        {/* Language Selection Quick Switcher */}
        <div className="flex items-center justify-between px-1 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5"><Globe size={12} /> Lang</span>
          <div className="flex gap-1">
            {(['en', 'hi', 'kn'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium uppercase transition-colors cursor-pointer ${
                  language === l
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-[#172033] text-slate-500 hover:text-slate-900 dark:hover:text-white border border-transparent dark:border-[#273449]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Database Status Pill */}
        <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300 font-medium">
              Bengaluru HPI Live
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};



