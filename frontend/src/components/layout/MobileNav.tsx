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
} from 'lucide-react';

interface MobileNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'explore', label: 'Explorer', icon: Compass },
    { id: 'analysis', label: 'Analysis', icon: LineChart },
    { id: 'compare', label: 'Compare', icon: Scale },
    { id: 'simulator', label: 'Simulate', icon: Sliders },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
    { id: 'advisor', label: 'Advisor', icon: Brain },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#031427]/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-mono transition-colors ${
              isActive
                ? 'text-emerald-500 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
