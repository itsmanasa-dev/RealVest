import React, { useState } from 'react';
import type { Property, NavTab } from '../../types';
import {
  MapPin,
  Sliders,
  Heart,
  Scale,
  Wallet,
  TrendingUp,
  ShieldCheck,
  Lightbulb,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { formatInrLakhs, formatInrRent } from '../../utils/currency';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { Badge, recommendationTone } from '../ui/Badge';
import { Stat } from '../ui/Stat';
import { Card } from '../ui/Card';
import { clsx } from 'clsx';

interface PropertyAnalysisViewProps {
  property: Property;
  onBack: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const PropertyAnalysisView: React.FC<PropertyAnalysisViewProps> = ({
  property,
  onBack,
  onNavigate,
}) => {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);

  const diffPct = ((property.askingPriceLakhs - property.fairValueLakhs) / property.fairValueLakhs) * 100;
  const isDiscount = diffPct < 0;

  const riskCategories = [
    { name: 'Price Valuation', level: isDiscount ? 'LOW' : 'MEDIUM', desc: isDiscount ? 'Priced below ML comparable sales.' : 'Slight premium to sub-market median.' },
    { name: 'Rental Cash Flow', level: property.annualYield >= 4.0 ? 'LOW' : 'MEDIUM', desc: `${property.annualYield}% yield vs 3.8% metro benchmark.` },
    { name: 'Market Volatility', level: 'LOW', desc: 'High transaction liquidity in the IT corridor.' },
    { name: 'Infrastructure', level: 'LOW', desc: 'Active metro connectivity and commercial hubs.' },
    { name: 'Data Confidence', level: property.confidenceScore >= 80 ? 'HIGH' : 'MEDIUM', desc: `${property.confidenceScore}% model confidence.` },
  ];

  const gaugeColor = property.recommendation === 'BUY' ? 'var(--success)' : property.recommendation === 'HOLD' ? 'var(--warning)' : 'var(--danger)';
  const gaugeRadius = 52;
  const gaugeC = 2 * Math.PI * gaugeRadius;
  const gaugeOffset = gaugeC - (property.confidenceScore / 100) * gaugeC;

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div>
        <button onClick={onBack} className="-ml-2 text-sm font-medium text-ink-3 hover:text-ink flex items-center gap-1 cursor-pointer mb-4">
          <ChevronRight size={14} className="rotate-180" /> {t.back_to_assets}
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <Badge tone={recommendationTone(property.recommendation)}>{property.recommendation}</Badge>
              <span className="text-xs text-ink-3">{property.category}{property.bhk ? ` · ${property.bhk} BHK` : ''}</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">{property.title}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-2">
              <MapPin size={15} className="text-ink-3" />
              {property.location}, {property.city}
              {property.sqft > 0 && <span className="text-ink-3"> · {property.sqft.toLocaleString('en-IN')} sqft</span>}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" onClick={() => setSaved(!saved)}>
              <Heart size={15} className={saved ? 'text-neg fill-neg' : ''} />
              {saved ? 'Saved' : 'Save'}
            </Button>
            <Button variant="secondary" onClick={() => onNavigate('compare')}>
              <Scale size={15} /> Compare
            </Button>
            <Button onClick={() => onNavigate('simulator')}>
              <Sliders size={15} /> Simulate
            </Button>
          </div>
        </div>
      </div>

      {/* Hero image / gallery */}
      <div className="rounded-xl overflow-hidden aspect-[16/8] sm:aspect-[21/9] bg-surface-strong">
        <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
      </div>

      {/* Investment summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat
          label="Asking Price"
          value={formatInrLakhs(property.askingPriceLakhs)}
          icon={Wallet}
          iconTone="neutral"
        />
        <Stat
          label="Estimated Value"
          value={formatInrLakhs(property.fairValueLakhs)}
          valueClassName="text-brand"
          icon={TrendingUp}
          iconTone="brand"
        />
        <Stat
          label="Expected Rent"
          value={formatInrRent(property.monthlyRent)}
          hint={`${property.annualYield.toFixed(1)}% rental yield`}
          icon={Wallet}
          iconTone="pos"
        />
        <Stat
          label="Projected ROI"
          value={`${property.annualYield.toFixed(1)}%`}
          hint="Annualized yield"
          icon={TrendingUp}
          iconTone="pos"
        />
      </div>

      {/* AI Decision + Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* AI Decision */}
        <Card className="lg:col-span-5">
          <div className="flex items-center justify-between mb-4">
            <p className="section-eyebrow">AI Decision</p>
            <Badge tone={recommendationTone(property.recommendation)}>{property.recommendation}</Badge>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={gaugeRadius} stroke="var(--surface-strong)" strokeWidth="9" fill="none" />
                <circle
                  cx="60" cy="60" r={gaugeRadius} stroke={gaugeColor} strokeWidth="9" strokeLinecap="round"
                  strokeDasharray={gaugeC} strokeDashoffset={gaugeOffset} fill="none"
                  style={{ transition: 'stroke-dashoffset 0.7s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold text-ink">{property.confidenceScore}%</span>
                <span className="text-[10px] uppercase tracking-wide text-ink-3">{t.confidence}</span>
              </div>
            </div>

            <div className="space-y-2 min-w-0">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-3">Investment fit</span>
                <span className="font-semibold text-ink">{property.investmentScore}/100</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-strong overflow-hidden">
                <div className="h-full rounded-full bg-brand" style={{ width: `${property.investmentScore}%` }} />
              </div>
              <div className="pt-2 border-t border-line">
                <span className="text-xs text-ink-3">Valuation spread</span>
                <p className={clsx('text-sm font-semibold', isDiscount ? 'text-pos' : 'text-warn')}>
                  {isDiscount ? `${Math.abs(diffPct).toFixed(1)}% underpriced` : `+${diffPct.toFixed(1)}% overpriced`}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Why recommendation */}
        <Card className="lg:col-span-7">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><Lightbulb size={16} /></span>
            <h3 className="text-sm font-semibold text-ink">Why this recommendation</h3>
          </div>
          <ul className="space-y-2.5">
            {property.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-ink-2 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Risk assessment */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-lg bg-warn-soft text-warn flex items-center justify-center"><ShieldCheck size={16} /></span>
          <h3 className="text-sm font-semibold text-ink">Risk assessment</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {riskCategories.map((r, idx) => {
            const isLow = r.level === 'LOW' || r.level === 'HIGH';
            return (
              <div key={idx} className="rounded-lg border border-line p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">{r.name}</span>
                  <Badge tone={r.level === 'LOW' ? 'pos' : 'warn'} className="!bg-surface-soft !text-ink-2">{r.level}</Badge>
                </div>
                <p className="mt-1 text-xs text-ink-3">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
};
