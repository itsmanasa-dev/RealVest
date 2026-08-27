import React from 'react';
import type { NavTab } from '../../types';
import {
  LayoutDashboard,
  Compass,
  LineChart,
  Scale,
  TrendingUp,
  Brain,
  Sliders,
  BookmarkCheck,
  Home,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { clsx } from 'clsx';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onReplayIntro?: () => void;
}

const PRIMARY: { id: NavTab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: '', icon: LayoutDashboard },
  { id: 'explore', label: '', icon: Compass },
  { id: 'analysis', label: '', icon: LineChart },
  { id: 'markets', label: '', icon: TrendingUp },
];

const SECONDARY: { id: NavTab; label: string; icon: React.ElementType }[] = [
  { id: 'simulator', label: '', icon: Sliders },
  { id: 'saved-comparisons', label: '', icon: BookmarkCheck },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onReplayIntro }) => {
  const { language, t } = useTranslation();

  const primary = PRIMARY.map((p) => ({
    ...p,
    label:
      p.id === 'dashboard' ? t.nav_dashboard :
      p.id === 'explore' ? t.nav_explore :
      p.id === 'analysis' ? t.nav_analysis :
      t.nav_markets,
  }));

  const secondary = SECONDARY.map((s) => ({
    ...s,
    label: s.id === 'saved-comparisons' 
      ? (language === 'kn' ? 'ಉಳಿಸಿದ ಸನ್ನಿವೇಶಗಳು' : language === 'hi' ? 'सहेजे गए परिदृश्य' : 'Saved Scenarios')
      : t.nav_simulator,
  }));

  const NavButton: React.FC<{ item: typeof primary[0] }> = ({ item }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        onClick={() => onTabChange(item.id)}
        className={clsx(
          'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer',
          isActive
            ? 'bg-brand text-white'
            : 'text-ink-2 hover:bg-surface-soft hover:text-ink'
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0" />
        <span className="truncate">{item.label}</span>
        {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />}
      </button>
    );
  };

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-line bg-surface sticky top-0 h-screen z-30 select-none">
      {/* Brand */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-line">
        <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center text-white shadow-sm">
          <Home size={18} strokeWidth={2.4} />
        </div>
        <div className="min-w-0">
          <span className="block font-semibold text-[15px] tracking-tight text-ink font-display">
            RealVest
          </span>
          <span className="block text-[10px] font-medium uppercase tracking-widest text-ink-3">
            {language === 'kn' ? 'ಹೂಡಿಕೆ ಸಲಹೆಗಾರ' : language === 'hi' ? 'निवेश सलाहकार' : 'Investment Advisor'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-3">
            {language === 'kn' ? 'ಹೂಡಿಕೆ' : language === 'hi' ? 'निवेश' : 'Invest'}
          </p>
          <div className="space-y-0.5">
            {primary.map((item) => (
              <NavButton key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div>
          <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-3">
            {language === 'kn' ? 'ಕಾರ್ಯಕ್ಷೇತ್ರ' : language === 'hi' ? 'कार्यक्षेत्र' : 'Workspace'}
          </p>
          <div className="space-y-0.5">
            {secondary.map((item) => (
              <NavButton key={item.id} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer status */}
      <div className="px-4 py-4 border-t border-line">
        <div className="px-3 py-2.5 rounded-lg bg-surface-soft border border-line flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pos opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pos" />
          </span>
          <span className="text-[11px] font-medium text-ink-2 truncate">{t.system_live_data}</span>
        </div>
        {onReplayIntro && (
          <button
            onClick={onReplayIntro}
            className="mt-2 w-full px-3 py-2 text-[11px] font-medium text-ink-3 hover:text-brand transition-colors text-left cursor-pointer"
          >
            Replay intro →
          </button>
        )}
      </div>
    </aside>
  );
};

