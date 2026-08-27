import React, { useState } from 'react';
import {
  Map,
  Activity,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  FileText,
  Sparkles,
  TrendingUp,
  Flame,
  MapPin,
} from 'lucide-react';
import { Property } from '../../types';
import { mockHotZones, mockProperties } from '../../data/mockProperties';
import { InteractiveMap } from '../common/InteractiveMap';
import { useTranslation } from '../../context/LanguageContext';
import { SectionHeader } from '../ui/SectionHeader';
import { Card } from '../ui/Card';
import { Stat } from '../ui/Stat';
import { Badge } from '../ui/Badge';
import { clsx } from 'clsx';

interface MarketIntelligenceViewProps {
  properties?: Property[];
  onSelectProperty?: (property: Property) => void;
}

export const MarketIntelligenceView: React.FC<MarketIntelligenceViewProps> = ({
  properties = mockProperties,
  onSelectProperty,
}) => {
  const { t } = useTranslation();
  const [selectedHotZone, setSelectedHotZone] = useState(mockHotZones[0]);

  const trajectoryBars = [
    { year: '2020', hpi: 105.0, height: '42%', isForecast: false, range: null },
    { year: '2021', hpi: 114.2, height: '52%', isForecast: false, range: null },
    { year: '2022', hpi: 122.8, height: '62%', isForecast: false, range: null },
    { year: '2023', hpi: 132.5, height: '74%', isForecast: false, range: null },
    { year: '2024', hpi: 141.0, height: '84%', isForecast: false, range: null },
    { year: '2025', hpi: 148.5, height: '92%', isForecast: true, range: '139.2 – 157.8' },
    { year: '2026', hpi: 155.0, height: '100%', isForecast: true, range: '144.2 – 165.8' },
  ];

  return (
    <div className="space-y-5 pb-4">
      <SectionHeader
        eyebrow="Markets"
        title={t.market_intel_title}
        subtitle={t.market_intel_subtitle}
      />

      {/* Selected hot zone chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-3 shrink-0">Hot zones</span>
        {mockHotZones.map((zone) => {
          const active = selectedHotZone.id === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => setSelectedHotZone(zone)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5',
                active ? 'bg-brand text-white border-brand' : 'bg-surface border-line text-ink-2 hover:border-line-strong'
              )}
            >
              <Flame size={12} className={active ? 'text-white' : 'text-warn'} />
              {zone.name}
              <span className={clsx('font-mono text-[10px]', active ? 'text-white/70' : 'text-pos')}>+{zone.growth30d}%</span>
            </button>
          );
        })}
      </div>

      {/* Map */}
      <Card className="!p-0 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><Map size={18} /></span>
            <div>
              <h3 className="text-sm font-semibold text-ink">{t.opportunity_heatmap}</h3>
              <p className="text-xs text-ink-3">Bengaluru geographic market overview</p>
            </div>
          </div>
          <Badge tone="brand" className="hidden sm:inline-flex">LIVE GIS</Badge>
        </div>
        <InteractiveMap
          hotZones={mockHotZones}
          selectedZone={selectedHotZone}
          onSelectZone={setSelectedHotZone}
          properties={properties}
          onSelectProperty={onSelectProperty}
        />
      </Card>

      {/* Trend velocity */}
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><Activity size={16} /></span>
              <h3 className="text-sm font-semibold text-ink">{t.trend_velocity}</h3>
            </div>
            <p className="text-xs text-ink-3 mt-1">{t.five_year_projection}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold font-mono text-pos tracking-tight">+34.3%</div>
            <div className="text-[10px] font-mono uppercase text-ink-3">{t.yoy_average} (HPI 141.0)</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono pt-3 mt-3 border-t border-line">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-brand" />
            <span className="text-ink-2">{t.observed_through_2024}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-pos border border-dashed border-line-strong" />
            <span className="text-pos font-medium">{t.forecast_2025_2026}</span>
          </div>
        </div>

        {/* Chart */}
        <div className="pt-4">
          <div className="h-40 w-full flex items-end justify-between gap-2 sm:gap-4 px-1 pb-2">
            {trajectoryBars.map((item) => (
              <div key={item.year} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                {item.isForecast && item.range && (
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-ink text-canvas text-[9px] font-mono px-2 py-0.5 rounded shadow-card whitespace-nowrap z-20 pointer-events-none">
                    95% CI: {item.range}
                  </div>
                )}

                <div
                  style={{ height: item.height }}
                  className={clsx(
                    'w-full rounded-t transition-all relative',
                    item.isForecast
                      ? 'bg-pos border-2 border-dashed border-pos/50 shadow-sm'
                      : item.year === '2024'
                      ? 'bg-brand shadow-sm'
                      : 'bg-brand/15'
                  )}
                >
                  {item.isForecast && (
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-pos animate-ping" />
                  )}
                </div>

                <div className="text-center">
                  <span className={clsx(
                    'block text-xs font-mono font-medium',
                    item.isForecast ? 'text-pos' : item.year === '2024' ? 'text-brand font-semibold' : 'text-ink-3'
                  )}>
                    {item.year}
                  </span>
                  <span className="block text-[9px] font-mono text-ink-3">{item.hpi}</span>
                  <span className={clsx('text-[8px] font-mono uppercase font-semibold block mt-0.5', item.isForecast ? 'text-pos' : 'text-ink-3')}>
                    {item.isForecast ? 'FCST' : 'ACT'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast detail */}
        <div className="p-4 rounded-lg bg-pos-soft/50 border border-pos/20 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-pos">
            <Sparkles size={13} />
            <span>{t.forecast_label}</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-sm font-mono">
            <div className="p-3 rounded-lg bg-surface border border-line">
              <span className="text-[10px] text-ink-3 block uppercase">2025 Projected HPI</span>
              <span className="font-semibold text-ink">148.5</span>
              <span className="text-[9px] text-pos block mt-0.5">95% Range: 139.2 – 157.8</span>
            </div>
            <div className="p-3 rounded-lg bg-surface border border-line">
              <span className="text-[10px] text-ink-3 block uppercase">2026 Projected HPI</span>
              <span className="font-semibold text-ink">155.0</span>
              <span className="text-[9px] text-pos block mt-0.5">95% Range: 144.2 – 165.8</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Yield trajectories */}
      <Card>
        <div className="flex items-center gap-2 pb-3 border-b border-line">
          <span className="w-8 h-8 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><TrendingUp size={16} /></span>
          <h3 className="text-sm font-semibold text-ink">{t.yield_trajectories}</h3>
        </div>

        <div className="grid grid-cols-2 gap-3.5 mt-3">
          <Stat
            label={t.cash_on_cash}
            value="7.8%"
            icon={ArrowUp}
            iconTone="pos"
          />
          <Stat
            label={t.cap_rate}
            value="5.6%"
            icon={ArrowDown}
            iconTone="brand"
          />
        </div>

        <div className="p-4 rounded-lg bg-brand-soft/40 border-l-2 border-l-brand mt-3 space-y-2">
          <p className="text-xs text-ink-2 leading-relaxed font-medium">{t.institutional_report_text}</p>
          <div className="text-right">
            <button
              onClick={() => alert('Bengaluru Micro-market Intelligence Brief generated from NHB Residex and Certified Valuation Models.')}
              className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <FileText size={12} /> {t.full_report_btn} <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
