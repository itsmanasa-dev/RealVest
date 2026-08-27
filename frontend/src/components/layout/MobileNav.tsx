import React from 'react';
import type { NavTab } from '../../types';
import {
  LayoutDashboard,
  Compass,
  LineChart,
  TrendingUp,
  Bot,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

interface MobileNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();

  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: t.nav_dashboard, icon: LayoutDashboard },
    { id: 'explore', label: t.nav_explore, icon: Compass },
    { id: 'analysis', label: t.nav_analysis, icon: LineChart },
    { id: 'markets', label: t.nav_markets, icon: TrendingUp },
    { id: 'advisor', label: t.nav_advisor, icon: Bot },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-2xl border-t border-slate-200 dark:border-[#273449] px-3 py-2 flex items-center justify-around transition-colors">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
              isActive
                ? 'px-3.5 py-1 rounded-full bg-blue-600 dark:bg-blue-600/20 text-white dark:text-blue-400 dark:border dark:border-blue-500/30 shadow-md shadow-blue-500/20'
                : 'px-2 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />

            <span className="text-[10px] font-medium tracking-tight mt-0.5">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
