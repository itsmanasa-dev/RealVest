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
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  properties,
  onSelectProperty,
  onNavigate,
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
        eyebrow="Overview"
        title={`Namaste, Investor.`}
        subtitle={`${properties.length} verified Bengaluru opportunities monitored right now.`}
      />

      {/* Portfolio / investment overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat
          label="Portfolio Value"
          value="₹4.32 Cr"
          hint={<span className="flex items-center gap-1 text-pos font-medium"><TrendingUp size={13} /> +14.2% overall</span>}
          icon={Wallet}
          iconTone="brand"
        />
        <Stat
          label="Active Opportunities"
          value={properties.length}
          hint="Monitored assets"
          icon={Compass}
        />
        <Stat
          label="Avg Rental Yield"
          value={formatPercent(avgYield)}
          hint="Across monitored assets"
          icon={TrendingUp}
          iconTone="pos"
        />
        <Stat
          label="Best Value Gap"
          value={bestDeal ? formatInrLakhs(bestDeal.fairValueLakhs - bestDeal.askingPriceLakhs) : '—'}
          hint={bestDeal ? `${bestDeal.title}` : undefined}
          icon={Scale}
          iconTone="pos"
        />
      </div>

      {/* Advisor insight banner */}
      <div className="rv-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <span className="w-11 h-11 rounded-lg bg-brand text-white flex items-center justify-center shrink-0">
            <Brain size={22} />
          </span>
          <div className="min-w-0">
            <Badge tone="brand" className="mb-1.5">Advisor Insight</Badge>
            <p className="text-sm text-ink-2 leading-relaxed">
              Bengaluru IT corridors (Whitefield & Outer Ring Road) show strong rental demand
              with ~7.4% average yield and +14.2% capital upside potential this year.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex gap-2">
          <Button variant="secondary" onClick={() => onNavigate('simulator')}>
            <Sliders size={15} /> {t.new_analysis_btn}
          </Button>
          <Button onClick={() => onNavigate('advisor')}>
            <Sparkles size={15} /> {t.ask_ai_btn}
          </Button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Explore Properties', desc: `${properties.length} active listings`, tab: 'explore' as NavTab, icon: Compass },
          { label: 'Compare', desc: 'Side-by-side analysis', tab: 'compare' as NavTab, icon: Scale },
          { label: 'Simulate', desc: 'EMI & cash flow', tab: 'simulator' as NavTab, icon: Sliders },
          { label: 'AI Advisor', desc: 'Investment guidance', tab: 'advisor' as NavTab, icon: Brain },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.tab}
              onClick={() => onNavigate(a.tab)}
              className="rv-card rv-card-hover p-4 flex flex-col items-start gap-3 text-left cursor-pointer group"
            >
              <span className="w-9 h-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                <Icon size={18} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{a.label}</span>
                <span className="block text-xs text-ink-3 mt-0.5">{a.desc}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Recommended opportunities */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-ink tracking-tight">
              Recommended opportunities
            </h2>
            <p className="text-xs text-ink-3 mt-0.5">
              Highest risk-adjusted return across monitored assets
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-sm font-medium text-brand hover:underline flex items-center gap-1 cursor-pointer"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {top.map((prop, idx) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onSelect={onSelectProperty}
              badge={{ label: idx === 0 ? 'Top pick' : idx === 1 ? 'Strong' : 'Featured', tone: idx === 0 ? 'brand' : 'neutral' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
