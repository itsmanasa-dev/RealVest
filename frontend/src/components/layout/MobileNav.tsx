import React from 'react';
import type { NavTab } from '../../types';
import {
  LayoutDashboard,
  Compass,
  Scale,
  TrendingUp,
  Brain,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { clsx } from 'clsx';

interface MobileNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();

  const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: t.nav_dashboard, icon: LayoutDashboard },
    { id: 'explore', label: t.nav_explore, icon: Compass },
    { id: 'compare', label: t.nav_compare, icon: Scale },
    { id: 'markets', label: t.nav_markets, icon: TrendingUp },
    { id: 'advisor', label: t.nav_advisor, icon: Brain },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-t border-line px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 flex items-stretch justify-around lg:hidden"
      aria-label="Primary"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={clsx(
              'flex flex-col items-center justify-center gap-0.5 rounded-md px-2 py-1 min-w-[56px] cursor-pointer',
              isActive ? 'text-brand' : 'text-ink-3'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={21} strokeWidth={isActive ? 2.3 : 1.8} />
            <span className={clsx('text-[10px] font-medium', isActive && 'font-semibold')}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
