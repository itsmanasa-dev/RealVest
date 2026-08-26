import React, { useState } from 'react';
import {
  MapPin,
  TrendingUp,
  Plus,
  Minus,
  Locate,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Map,
  Activity,
} from 'lucide-react';
import { mockHotZones } from '../../data/mockProperties';

export const MarketIntelligenceView: React.FC = () => {
  const [selectedHotZone, setSelectedHotZone] = useState(mockHotZones[0]);

  return (
    <div className="space-y-5 pb-20 max-w-2xl mx-auto">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Market Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time demographic and velocity tracking.
        </p>
      </div>

      {/* Card 1: Opportunity Heatmap (Matching Screenshot 1) */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm overflow-hidden space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map size={18} className="text-blue-600 dark:text-emerald-400" />
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Opportunity Heatmap
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-mono text-[10px] font-extrabold tracking-wider">
            LIVE
          </span>
        </div>

        {/* Interactive Map Visual */}
        <div className="relative h-64 sm:h-72 w-full rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-[#0f172a] overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:18px_18px] opacity-40" />

          {/* Map Controls Top-Right */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            <div className="flex flex-col rounded-2xl bg-white/95 dark:bg-[#102034]/95 border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden text-slate-700 dark:text-slate-200">
              <button
                onClick={() => alert('Zoom in')}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => alert('Zoom out')}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Minus size={16} />
              </button>
            </div>
            <button
              onClick={() => alert('Locate me')}
              className="p-2 rounded-2xl bg-white/95 dark:bg-[#102034]/95 border border-slate-200 dark:border-slate-700 shadow-md text-blue-600 dark:text-emerald-400 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
            >
              <Locate size={16} />
            </button>
          </div>

          {/* Floating Hot Zone Pins */}
          {mockHotZones.map((zone) => {
            const isSelected = selectedHotZone.id === zone.id;
            return (
              <div
                key={zone.id}
                onClick={() => setSelectedHotZone(zone)}
                style={{ left: `${zone.coordinates.x}%`, top: `${zone.coordinates.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
              >
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 dark:bg-emerald-400 opacity-60" />
                  <div className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                    isSelected ? 'bg-blue-600 border-white text-white' : 'bg-white dark:bg-[#102034] border-blue-500 text-blue-600'
                  }`}>
                    <MapPin size={16} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bottom-Left Information Chip */}
          <div className="absolute bottom-3 left-3 z-10 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-[#102034]/95 border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-lg flex items-center gap-2.5">
            <MapPin size={16} className="text-blue-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {selectedHotZone.name}
              </div>
              <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                +{selectedHotZone.growth30d}% Demand (30d)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Trend Velocity 5Y Capital Appreciation (Matching Screenshot 1) */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-blue-600 dark:text-emerald-400" />
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Trend Velocity
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              5Y Capital Appreciation Projection
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-600 dark:text-emerald-400 tracking-tight">
              +18.4%
            </div>
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
              YoY AVERAGE
            </div>
          </div>
        </div>

        {/* 5-Bar Vertical Chart Representation (2020-2024) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="h-36 w-full flex items-end justify-between gap-3 px-2 pb-2">
            {[
              { year: '2020', height: '35%', isCurrent: false },
              { year: '2021', height: '48%', isCurrent: false },
              { year: '2022', height: '42%', isCurrent: false },
              { year: '2023', height: '70%', isCurrent: false },
              { year: '2024', height: '95%', isCurrent: true },
            ].map((item) => (
              <div key={item.year} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  style={{ height: item.height }}
                  className={`w-full rounded-t-lg transition-all ${
                    item.isCurrent
                      ? 'bg-blue-600 dark:bg-emerald-500 shadow-md shadow-blue-500/25'
                      : 'bg-blue-100 dark:bg-slate-800'
                  }`}
                />
                <span className={`text-xs font-mono font-bold ${item.isCurrent ? 'text-blue-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {item.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card 3: Yield Trajectories (Matching Screenshot 1) */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <TrendingUp size={18} className="text-blue-600 dark:text-emerald-400" />
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            Yield Trajectories
          </h3>
        </div>

        {/* 2 Metric Boxes Side-by-Side */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold">
              <span>CASH ON CASH</span>
              <ArrowUp size={13} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
              6.2%
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold">
              <span>CAP RATE (EXIT)</span>
              <ArrowDown size={13} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
              4.8%
            </div>
          </div>
        </div>

        {/* Institutional Grade Note Box */}
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-slate-800/70 border-l-4 border-l-blue-600 dark:border-l-emerald-400 space-y-3">
          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            Institutional-grade analysis indicates strong capitalization compression in this sector over the next 36 months, driven by constrained supply metrics and localized infrastructure investment.
          </p>

          <div className="text-right">
            <button
              onClick={() => alert('Full institutional market intelligence report downloaded.')}
              className="text-xs font-mono font-bold text-blue-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              Full Report <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
