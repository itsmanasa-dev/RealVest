import React from 'react';
import type { NavTab } from '../../types';
import {
  LayoutDashboard,
  Compass,
  LineChart,
  Sliders,
  TrendingUp,
  Bot,
} from 'lucide-react';

interface MobileNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dash', icon: <LayoutDashboard size={20} /> },
    { id: 'explore', label: 'Explore', icon: <Compass size={20} /> },
    { id: 'analysis', label: 'Analysis', icon: <LineChart size={20} /> },
    { id: 'simulator', label: 'Simulator', icon: <Sliders size={20} /> },
    { id: 'markets', label: 'Markets', icon: <TrendingUp size={20} /> },
    { id: 'advisor', label: 'Advisor', icon: <Bot size={20} /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 pointer-events-none">
      <div className="pointer-events-auto max-w-lg mx-auto flex items-center justify-around py-2.5 px-3 rounded-2xl bg-white/90 dark:bg-[#102034]/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/20">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-500 font-bold bg-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <div>{tab.icon}</div>
              <span className="text-[10px] font-mono tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
