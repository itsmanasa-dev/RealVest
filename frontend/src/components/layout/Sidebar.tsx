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
    { id: 'simulator', label: t.nav_simulator, icon: Sliders },
    { id: 'markets', label: t.nav_markets, icon: TrendingUp },
    { id: 'advisor', label: t.nav_advisor, icon: Brain },
    { id: 'settings', label: t.nav_settings, icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] flex-col justify-between hidden md:flex shrink-0 min-h-screen sticky top-0 transition-colors">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-[#273449] gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-mono font-extrabold shadow-lg shadow-blue-500/20">
            RV
          </div>
          <div>
            <span className="font-extrabold font-mono tracking-wider text-slate-900 dark:text-white text-base">
              REALVEST
            </span>
            <div className="text-[10px] font-mono text-blue-500 dark:text-blue-400 tracking-widest uppercase">
              BENGALURU AI ENGINE
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
                    ? 'bg-blue-600 dark:bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/25 ring-1 ring-blue-400/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#172033]'
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
      <div className="p-4 border-t border-slate-200 dark:border-[#273449] space-y-3">
        {/* Language Selection Quick Switcher */}
        <div className="flex items-center justify-between px-2 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5"><Globe size={13} /> Lang</span>
          <div className="flex gap-1">
            {(['en', 'hi', 'kn'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                  language === l
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-[#172033] text-slate-500 hover:text-slate-900 dark:hover:text-white border border-transparent dark:border-[#273449]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-2">
          <span className="text-[11px] font-mono text-slate-400">{t.visual_archetype}</span>
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#172033] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer border border-transparent dark:border-[#273449]"
            title={t.toggle_theme}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449]">
          <div className="flex items-center gap-2">
            <Building2 size={14} className="text-blue-500 dark:text-blue-400" />
            <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-bold">
              {t.verified_bengaluru_db}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {t.verified_ml_models}
          </div>
        </div>
      </div>
    </aside>
  );
};

