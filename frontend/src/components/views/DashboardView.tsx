import React from 'react';
import type { Property, NavTab } from '../../types';
import {
  TrendingUp,
  Brain,
  Sparkles,
  Wallet,
  Sliders,
  Compass,
  ArrowRight,
  Scale,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { formatInrLakhs, formatPercent } from '../../utils/currency';
import { SectionHeader } from '../ui/SectionHeader';
import { Stat } from '../ui/Stat';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PropertyCard } from '../property/PropertyCard';

interface DashboardViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onNavigate: (tab: NavTab) => void;
  onOpenAdvisor?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  properties,
  onSelectProperty,
  onNavigate,
  onOpenAdvisor,
}) => {
  const { t } = useTranslation();
  const top = [...properties].sort((a, b) => b.annualYield - a.annualYield).slice(0, 3);

  const bestDeal = [...properties].sort(
    (a, b) => b.fairValueLakhs - b.askingPriceLakhs - (a.fairValueLakhs - a.askingPriceLakhs)
  )[0];

  const avgYield =
    properties.length > 0
      ? properties.reduce((s, p) => s + p.annualYield, 0) / properties.length
      : 0;

  return (
    <div className="space-y-6 pb-4">
      <SectionHeader
        eyebrow={t.portfolio_overview}
        title={t.greeting_investor}
        subtitle={`${properties.length} ${t.active_assets} · Bengaluru`}
      />

      {/* Portfolio / investment overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat
          label={t.portfolio_value}
          value="₹4.32 Cr"
          hint={<span className="flex items-center gap-1 text-pos font-medium"><TrendingUp size={13} /> +14.2%</span>}
          icon={Wallet}
          iconTone="brand"
        />
        <Stat
          label={t.active_assets}
          value={properties.length}
          hint={t.system_live_data}
          icon={Compass}
        />
        <Stat
          label={t.avg_yield}
          value={formatPercent(avgYield)}
          hint="Bengaluru median"
          icon={TrendingUp}
          iconTone="pos"
        />
        <Stat
          label={t.est_value}
          value={bestDeal ? formatInrLakhs(bestDeal.fairValueLakhs - bestDeal.askingPriceLakhs) : '—'}
          hint={bestDeal ? <span className="truncate block" title={bestDeal.title}>{bestDeal.title}</span> : undefined}
          icon={Scale}
          iconTone="pos"
        />
      </div>

      {/* Advisor insight banner */}
      <div className="rv-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <span className="w-11 h-11 rounded-lg bg-brand text-white flex items-center justify-center shrink-0 shadow-sm">
            <Brain size={22} />
          </span>
          <div className="min-w-0">
            <Badge tone="brand" className="mb-1.5">{t.ai_pulse_title}</Badge>
            <p className="text-sm text-ink-2 leading-relaxed">
              {t.ai_pulse_desc}
            </p>
          </div>
        </div>
        <div className="shrink-0 flex gap-2">
          <Button variant="secondary" onClick={() => onNavigate('simulator')}>
            <Sliders size={15} /> {t.new_analysis_btn}
          </Button>
          <Button onClick={onOpenAdvisor ? onOpenAdvisor : () => onNavigate('analysis')}>
            <Sparkles size={15} /> {t.ask_ai_btn}
          </Button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: t.nav_explore, desc: `${properties.length} ${t.active_assets}`, action: () => onNavigate('explore'), icon: Compass },
          { label: t.nav_analysis, desc: t.decision_rationale, action: () => onNavigate('analysis'), icon: Scale },
          { label: t.nav_simulator, desc: t.simulator_subtitle, action: () => onNavigate('simulator'), icon: Sliders },
          { label: t.nav_advisor, desc: t.advisor_subtitle, action: onOpenAdvisor ? onOpenAdvisor : () => onNavigate('analysis'), icon: Brain },
        ].map((a, idx) => {
          const Icon = a.icon;
          return (
            <button
              key={idx}
              onClick={a.action}
              className="rv-card rv-card-hover p-4 flex flex-col items-start justify-between gap-3 text-left cursor-pointer group w-full min-w-0 overflow-hidden"
            >
              <span className="w-9 h-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors shrink-0">
                <Icon size={18} />
              </span>
              <div className="w-full min-w-0">
                <span className="block text-sm font-semibold text-ink truncate">{a.label}</span>
                <span className="block text-xs text-ink-3 mt-0.5 truncate" title={a.desc}>{a.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recommended opportunities */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-ink tracking-tight">
              {t.recent_analysis}
            </h2>
            <p className="text-xs text-ink-3 mt-0.5">
              {t.highest_roi_desc}
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-sm font-medium text-brand hover:underline flex items-center gap-1 cursor-pointer"
          >
            {t.view_all} <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {top.map((prop, idx) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onSelect={onSelectProperty}
              badge={{ label: idx === 0 ? t.realvest_top_pick : idx === 1 ? t.match_badge : 'Featured', tone: idx === 0 ? 'brand' : 'neutral' }}
            />
          ))}
        </div>
      </div>
    </div>
  );

};
