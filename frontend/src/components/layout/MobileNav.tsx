import React from 'react';
import type { NavTab } from '../../types';
import {
  LayoutDashboard,
  Compass,
  LineChart,
  TrendingUp,
  Bot,
} from 'lucide-react';

interface MobileNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'analysis', label: 'Analysis', icon: LineChart },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
    { id: 'advisor', label: 'Advisor', icon: Bot },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#031427]/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800/80 px-3 py-2.5 flex items-center justify-around transition-colors">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
              isActive
                ? 'px-4 py-1.5 rounded-full bg-blue-600 dark:bg-emerald-500/20 text-white dark:text-emerald-400 dark:border dark:border-emerald-500/30 shadow-md shadow-blue-500/20 dark:shadow-emerald-500/10'
                : 'px-2 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon size={19} strokeWidth={isActive ? 2.4 : 1.8} />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
