import React, { useState } from 'react';
import { mockHotZones } from '../../data/mockProperties';
import { MetricCard } from '../common/MetricCard';
import { MapPin, TrendingUp, Plus, Minus, Compass, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';

export const MarketIntelligenceView: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'YIELD' | 'GROWTH'>('GROWTH');
  const [selectedHotZone, setSelectedHotZone] = useState(mockHotZones[0]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[11px] font-bold uppercase tracking-wider">
            INSTITUTIONAL MACRO INTEL
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Market Intelligence
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time institutional analysis of emerging localities, yield trajectories, and micro-market demand shifts.
        </p>
      </div>

      {/* Interactive Opportunity Heatmap Section */}
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

          <div className="flex flex-col rounded-xl bg-[#102034]/90 border border-[#26364a] overflow-hidden shadow-lg backdrop-blur-md">
            <button className="p-2 text-slate-300 hover:text-white border-b border-[#26364a] cursor-pointer">
              <Plus size={16} />
            </button>
            <button className="p-2 text-slate-300 hover:text-white cursor-pointer">
              <Minus size={16} />
            </button>
          </div>
        </div>

        {/* Floating Map Pin Nodes */}
        {mockHotZones.map((zone) => {
          const isSelected = selectedHotZone.id === zone.id;
          return (
            <div
              key={zone.id}
              onClick={() => setSelectedHotZone(zone)}
              style={{ left: `${zone.coordinates.x}%`, top: `${zone.coordinates.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
            >
              {/* Glowing Pulse Ring */}
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-emerald-400 opacity-60" />
                <div className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 ${
                  isSelected ? 'bg-emerald-500 border-white text-white' : 'bg-[#102034] border-emerald-400 text-emerald-400'
                }`}>
                  <MapPin size={16} />
                </div>
              </div>
            </div>
          );
        })}

        {/* Floating Hot-Zone Data Chip Banner Bottom-Left */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-10 max-w-sm p-4 rounded-2xl bg-[#102034]/90 border border-[#26364a] backdrop-blur-xl shadow-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-emerald-400">
              HOT ZONE: {selectedHotZone.name}
            </span>
            <span className="text-xs font-mono text-slate-400">{selectedHotZone.city}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Demand Index</div>
              <div className="text-lg font-extrabold font-mono text-white">
                {selectedHotZone.demandIndex} / 100
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">30-Day Growth</div>
              <div className="text-lg font-extrabold font-mono text-emerald-400 flex items-center gap-1">
                +{selectedHotZone.growth30d}% <ArrowUpRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Velocity Chart & Yield Trajectories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Velocity Chart (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                5-Year Capital Appreciation Velocity
              </h3>
              <p className="text-xs text-slate-400">Historical YoY growth across urban hubs</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-500 text-xs font-mono font-bold">
              +18.4% YoY Avg
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-44 w-full flex items-end justify-between gap-4 pt-6 pb-2 px-4">
            {[
              { year: '2020', val: 45, pct: '+6.2%' },
              { year: '2021', val: 62, pct: '+9.4%' },
              { year: '2022', val: 78, pct: '+12.1%' },
              { year: '2023', val: 92, pct: '+15.8%' },
              { year: '2024', val: 110, pct: '+18.4%' },
            ].map((item) => (
              <div key={item.year} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <span className="text-[10px] font-mono font-bold text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.pct}
                </span>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-32 flex items-end p-1">
                  <div
                    style={{ height: `${(item.val / 110) * 100}%` }}
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-md transition-all group-hover:brightness-110"
                  />
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">{item.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Yield Trajectories Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Cash on Cash"
              value="6.2%"
              change="↗ High"
              changeType="positive"
              subtext="Annual cash yield return"
            />
            <MetricCard
              label="Cap Rate (Exit)"
              value="4.8%"
              change="↘ Stable"
              changeType="neutral"
              subtext="Sub-market exit valuation"
            />
          </div>

          {/* Institutional Analysis Summary Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                INSTITUTIONAL SUMMARY
              </span>
              <ExternalLink size={16} className="text-slate-400" />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Micro-market absorption velocity remains elevated in primary tech corridors. High demand density coupled with restricted supply pipelines supports strong rent escalation projections over the 36-month horizon.
            </p>

            <button className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-mono text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2">
              <span>Full Report →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
