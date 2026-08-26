import React from 'react';
import type { NavTab } from '../../types';
import {
  LayoutDashboard,
  Compass,
  LineChart,
  Sliders,
  TrendingUp,
  Bot,
  Settings,
  Sun,
  Moon,
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
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'explore', label: 'Explore', icon: <Compass size={18} /> },
    { id: 'analysis', label: 'Analysis', icon: <LineChart size={18} /> },
    { id: 'simulator', label: 'Simulator', icon: <Sliders size={18} /> },
    { id: 'markets', label: 'Market Intel', icon: <TrendingUp size={18} /> },
    { id: 'advisor', label: 'AI Advisor', icon: <Bot size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] p-6 justify-between transition-colors z-30">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-extrabold text-xl tracking-tighter">
            RV
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
              RealVest
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
              Institutional Intelligence
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className={isActive ? 'text-emerald-500' : 'text-slate-400'}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer & Theme Switch */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {isDark ? <Moon size={16} className="text-blue-400" /> : <Sun size={16} className="text-amber-500" />}
            <span>{isDark ? 'Electric Dark' : 'Institutional Light'}</span>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500">
            Theme
          </span>
        </button>
      </div>
    </aside>
  );
};
