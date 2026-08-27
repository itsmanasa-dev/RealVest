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
} from 'lucide-react';
import { mockHotZones, marketData } from '../../data/mockProperties';
import { InteractiveMap } from '../common/InteractiveMap';
import { useTranslation } from '../../context/LanguageContext';
import { formatPercent } from '../../utils/currency';

export const MarketIntelligenceView: React.FC = () => {
  const { t } = useTranslation();
  const [selectedHotZone, setSelectedHotZone] = useState(mockHotZones[0]);

  // Last 5 Annual HPI benchmarks (from 2020 Q4 to 2024 Q4)
  const hpiBars = [
    { year: '2020', hpi: 105.0, height: '45%', isCurrent: false },
    { year: '2021', hpi: 114.2, height: '58%', isCurrent: false },
    { year: '2022', hpi: 122.8, height: '69%', isCurrent: false },
    { year: '2023', hpi: 132.5, height: '82%', isCurrent: false },
    { year: '2024', hpi: 141.0, height: '96%', isCurrent: true },
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
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm overflow-hidden space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map size={18} className="text-blue-600 dark:text-emerald-400" />
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {t.opportunity_heatmap}
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono text-[10px] font-extrabold tracking-wider">
            BENGALURU GIS
          </span>
        </div>

        {/* Real Interactive Map Component */}
        <InteractiveMap
          hotZones={mockHotZones}
          selectedZone={selectedHotZone}
          onSelectZone={setSelectedHotZone}
        />
      </div>

      {/* Card 2: Trend Velocity 5Y Capital Appreciation */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-blue-600 dark:text-emerald-400" />
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {t.trend_velocity}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.five_year_projection}
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600 dark:text-emerald-400 tracking-tight">
              +34.3%
            </div>
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
              {t.yoy_average} (HPI 141.0)
            </div>
          </div>
        </div>

        {/* 5-Bar Vertical Chart Representation */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="h-36 w-full flex items-end justify-between gap-3 px-2 pb-2">
            {hpiBars.map((item) => (
              <div key={item.year} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  style={{ height: item.height }}
                  className={`w-full rounded-t-lg transition-all ${
                    item.isCurrent
                      ? 'bg-blue-600 dark:bg-emerald-500 shadow-md shadow-blue-500/25'
                      : 'bg-blue-100 dark:bg-slate-800'
                  }`}
                />
                <div className="text-center">
                  <span className={`block text-xs font-mono font-bold ${item.isCurrent ? 'text-blue-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    {item.year}
                  </span>
                  <span className="block text-[9px] font-mono text-slate-400">
                    {item.hpi}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card 3: Yield Trajectories */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <TrendingUp size={18} className="text-blue-600 dark:text-emerald-400" />
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            {t.yield_trajectories}
          </h3>
        </div>

        {/* 2 Metric Boxes Side-by-Side */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold">
              <span>{t.cash_on_cash}</span>
              <ArrowUp size={13} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
              7.8%
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
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
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-slate-800/70 border-l-4 border-l-blue-600 dark:border-l-emerald-400 space-y-3">
          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            {t.institutional_report_text}
          </p>

          <div className="text-right">
            <button
              onClick={() => alert('Bengaluru Micro-market Intelligence Brief generated from Residex and Housing Price Index.')}
              className="text-xs font-mono font-bold text-blue-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <FileText size={13} /> {t.full_report_btn} <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
