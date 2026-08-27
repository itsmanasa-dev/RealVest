import React, { useState } from 'react';
import {
  MapPin,
  TrendingUp,
  Activity,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Map,
  FileText,
  Sparkles,
  Info,
} from 'lucide-react';
import { Property } from '../../types';
import { mockHotZones, mockProperties, marketData } from '../../data/mockProperties';
import { InteractiveMap } from '../common/InteractiveMap';
import { useTranslation } from '../../context/LanguageContext';
import { formatPercent } from '../../utils/currency';

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


  // Historical observed annual benchmarks (2020-2024) + Legitimate Time-Series Forecasts (2025-2026)
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
    <div className="space-y-5 pb-20 max-w-2xl mx-auto">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.market_intel_title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.market_intel_subtitle}
        </p>
      </div>

      {/* Card 1: Interactive Opportunity Heatmap */}
      <div className="rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm overflow-hidden space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map size={18} className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {t.opportunity_heatmap}
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono text-[10px] font-extrabold tracking-wider">
            BENGALURU GIS
          </span>
        </div>

        {/* Real Interactive Map Component */}
        <InteractiveMap
          hotZones={mockHotZones}
          selectedZone={selectedHotZone}
          onSelectZone={setSelectedHotZone}
          properties={properties}
          onSelectProperty={onSelectProperty}
        />
      </div>


      {/* Card 2: Trend Velocity & Capital Appreciation: 2020-2024 Actual vs 2025-2026 Forecast */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {t.trend_velocity}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.five_year_projection}
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400 tracking-tight">
              +34.3%
            </div>
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
              {t.yoy_average} (HPI 141.0)
            </div>
          </div>
        </div>

        {/* Legend Indicator */}
        <div className="flex items-center justify-between text-[11px] font-mono font-semibold pt-1 border-t border-slate-100 dark:border-[#273449]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-blue-600 dark:bg-blue-500" />
            <span className="text-slate-600 dark:text-slate-300">{t.observed_through_2024}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500 border border-dashed border-emerald-300" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t.forecast_2025_2026}</span>
          </div>
        </div>

        {/* 7-Bar Chart with Historical vs 2025/2026 Forecast & Confidence Interval */}
        <div className="pt-3">
          <div className="h-44 w-full flex items-end justify-between gap-2 sm:gap-3 px-1 pb-2">
            {trajectoryBars.map((item) => (
              <div key={item.year} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                {/* Tooltip for Confidence Interval */}
                {item.isForecast && item.range && (
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-mono px-2 py-0.5 rounded shadow whitespace-nowrap z-20 pointer-events-none">
                    95% CI: {item.range}
                  </div>
                )}

                <div
                  style={{ height: item.height }}
                  className={`w-full rounded-t-lg transition-all relative ${
                    item.isForecast
                      ? 'bg-emerald-500/90 dark:bg-emerald-500 border-2 border-dashed border-emerald-300 shadow-md shadow-emerald-500/20'
                      : item.year === '2024'
                      ? 'bg-blue-600 dark:bg-blue-600 shadow-md shadow-blue-500/25'
                      : 'bg-blue-100 dark:bg-slate-800'
                  }`}
                >
                  {item.isForecast && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>

                <div className="text-center">
                  <span className={`block text-xs font-mono font-bold ${
                    item.isForecast
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : item.year === '2024'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-400'
                  }`}>
                    {item.year}
                  </span>
                  <span className="block text-[9px] font-mono text-slate-400">
                    {item.hpi}
                  </span>
                  <span className={`text-[8px] font-mono uppercase font-extrabold block mt-0.5 ${
                    item.isForecast ? 'text-emerald-500' : 'text-slate-400'
                  }`}>
                    {item.isForecast ? 'FCST' : 'ACT'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistical Forecast Range Detail Box */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-[#172033] border border-emerald-200/80 dark:border-[#273449] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400">
            <Sparkles size={14} />
            <span>2025–2026 Macro Statistical Projections</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div className="p-2 rounded-xl bg-white/80 dark:bg-[#111827]/80 border border-emerald-100 dark:border-[#273449]">
              <span className="text-[10px] text-slate-400 block uppercase">2025 Projected HPI</span>
              <span className="font-extrabold text-slate-900 dark:text-white">148.5</span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block mt-0.5">Range: 139.2 – 157.8</span>
            </div>
            <div className="p-2 rounded-xl bg-white/80 dark:bg-[#111827]/80 border border-emerald-100 dark:border-[#273449]">
              <span className="text-[10px] text-slate-400 block uppercase">2026 Projected HPI</span>
              <span className="font-extrabold text-slate-900 dark:text-white">155.0</span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block mt-0.5">Range: 144.2 – 165.8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Yield Trajectories */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#273449]">
          <TrendingUp size={18} className="text-blue-600 dark:text-blue-400" />
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            {t.yield_trajectories}
          </h3>
        </div>

        {/* 2 Metric Boxes Side-by-Side */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#172033]">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold">
              <span>{t.cash_on_cash}</span>
              <ArrowUp size={13} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
              7.8%
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#172033]">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold">
              <span>{t.cap_rate}</span>
              <ArrowDown size={13} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
              5.6%
            </div>
          </div>
        </div>

        {/* Institutional Grade Note Box */}
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-[#172033] border-l-4 border-l-blue-600 dark:border-l-blue-400 space-y-3">
          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            {t.institutional_report_text}
          </p>

          <div className="text-right">
            <button
              onClick={() => alert('Bengaluru Micro-market Intelligence Brief generated from NHB Residex and Certified Valuation Models.')}
              className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <FileText size={13} /> {t.full_report_btn} <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

