import React, { useState } from 'react';
import { mockHotZones, marketData } from '../../data/mockProperties';
import { MetricCard } from '../common/MetricCard';
import { MapPin, TrendingUp, Plus, Minus, ArrowUpRight, ExternalLink } from 'lucide-react';

export const MarketIntelligenceView: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'YIELD' | 'GROWTH'>('GROWTH');
  const [selectedHotZone, setSelectedHotZone] = useState(mockHotZones[0]);

  const hpiSeries = marketData.series.slice(-8); // last 8 quarters

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[11px] font-bold uppercase tracking-wider">
            INSTITUTIONAL MACRO INTEL & RBI HPI
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Market Intelligence
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Institutional analysis of Bengaluru micro-markets, RBI Housing Price Index trajectory, and yield trends.
        </p>
      </div>

      {/* Interactive Bengaluru Hot Zones Heatmap Section */}
      <div className="relative h-96 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#031427] overflow-hidden shadow-xl">
        {/* Map Grid Pattern Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

        {/* Map Controls Top-Right */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <div className="flex items-center rounded-xl bg-[#102034]/90 border border-[#26364a] p-1 shadow-lg backdrop-blur-md">
            <button
              onClick={() => setActiveMetric('YIELD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeMetric === 'YIELD'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              [YIELD]
            </button>
            <button
              onClick={() => setActiveMetric('GROWTH')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeMetric === 'GROWTH'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              [GROWTH]
            </button>
          </div>
        </div>

        {/* Floating Bengaluru Hot Zone Pins */}
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
                <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-emerald-400 opacity-60" />
                <div className={`relative px-3 py-1.5 rounded-xl border-2 flex items-center gap-1.5 shadow-lg transition-transform group-hover:scale-110 ${
                  isSelected ? 'bg-emerald-500 border-white text-white' : 'bg-[#102034] border-emerald-400 text-emerald-400'
                }`}>
                  <MapPin size={14} />
                  <span className="text-[11px] font-mono font-bold whitespace-nowrap">{zone.name.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Floating Hot-Zone Data Chip Banner Bottom-Left */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-10 max-w-sm p-4 rounded-2xl bg-[#102034]/95 border border-[#26364a] backdrop-blur-xl shadow-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-emerald-400">
              CORRIDOR: {selectedHotZone.name}
            </span>
            <span className="text-xs font-mono text-slate-400">{selectedHotZone.city}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Demand Index</div>
              <div className="text-base font-extrabold font-mono text-white">
                {selectedHotZone.demandIndex}/100
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Avg Rent Yield</div>
              <div className="text-base font-extrabold font-mono text-emerald-400">
                {selectedHotZone.avgYield}%
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Price/sqft</div>
              <div className="text-base font-extrabold font-mono text-blue-400">
                ₹{selectedHotZone.avgPricePerSqft}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RBI HPI Trajectory Chart & Yield Trajectories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* HPI Trajectory Chart (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Historical Housing Price Index Trajectory (RBI HPI)
              </h3>
              <p className="text-xs text-slate-400">Assessment price trends in Bengaluru (Base 2013 = 100)</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-500 text-xs font-mono font-bold">
              +{marketData.totalGrowthPct}% 10-Yr Total
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2">
            {hpiSeries.map((item, idx) => {
              const val = item['HPI@Assessment Prices'];
              const minVal = 80;
              const maxVal = 120;
              const heightPct = Math.min(100, Math.max(20, ((val - minVal) / (maxVal - minVal)) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                  <span className="text-[10px] font-mono font-bold text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {val.toFixed(1)}
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-32 flex items-end p-1">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-md transition-all group-hover:brightness-110"
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 truncate w-full text-center">
                    {item.Quarter.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Institutional Summary & Key Benchmarks (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Latest HPI Index"
              value={String(marketData.latestHpi)}
              change={`+${marketData.latestYoyPct}% YoY`}
              changeType="positive"
              subtext="Bengaluru Assessment Index"
            />
            <MetricCard
              label="10-Year Growth"
              value={`+${marketData.totalGrowthPct}%`}
              change="Steady Trend"
              changeType="positive"
              subtext="Long term capital appreciation"
            />
          </div>

          {/* Institutional Analysis Summary Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                INSTITUTIONAL BENGALURU MACRO SUMMARY
              </span>
              <ExternalLink size={16} className="text-slate-400" />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Micro-market absorption velocity remains highest in prime tech corridors (Whitefield, Outer Ring Road, Sarjapur Road). Consistent tenant absorption paired with upcoming Namma Metro expansions supports steady long-term appreciation and rental yields averaging 4.8%–5.8%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
