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
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'analysis', label: 'Portfolio', icon: LineChart },
    { id: 'markets', label: 'Market', icon: TrendingUp },
    { id: 'settings', label: 'Profile', icon: Bot },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-2xl border-t border-slate-200 dark:border-[#273449] px-4 py-2 flex items-center justify-around transition-colors lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-emerald-50 dark:bg-emerald-950/50' : ''}`}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : ''} />
            </div>

            <span className="text-[10px] font-medium tracking-tight mt-0.5">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

