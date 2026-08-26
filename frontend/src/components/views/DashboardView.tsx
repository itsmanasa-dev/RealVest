import React from 'react';
import type { Property, NavTab } from '../../types';
import {
  TrendingUp,
  Brain,
  MessageSquare,
  Plus,
  ArrowUpRight,
  ChevronRight,
  Wallet,
} from 'lucide-react';

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
  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Top Greeting Section */}
      <div>
        <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
          PORTFOLIO OVERVIEW
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
          Good Morning, Investor.
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Market Data
          </span>
          <span className="text-xs font-mono text-slate-400">
            Last synced: Just now
          </span>
        </div>
      </div>

      {/* Grid: Market Dynamics + Portfolio Value */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Market Dynamics Card (7 Cols) */}
        <div className="md:col-span-7 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm flex flex-col justify-between overflow-hidden relative">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Market Dynamics
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold flex items-center gap-1">
                <TrendingUp size={14} /> +4.2%
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Aggregated Prime Real Estate Index
            </p>
          </div>

          {/* Smooth Area Wave Chart */}
          <div className="h-36 w-full relative mt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,75 Q 70,80 130,55 T 260,65 T 400,20 L 400,100 L 0,100 Z"
                fill="url(#waveGradient)"
              />
              <path
                d="M 0,75 Q 70,80 130,55 T 260,65 T 400,20"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex justify-between font-mono text-[11px] text-slate-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span>W1</span>
            <span>W2</span>
            <span>W3</span>
            <span className="text-emerald-500 font-bold">W4</span>
          </div>
        </div>

        {/* Portfolio Value Card (5 Cols) */}
        <div className="md:col-span-5 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                PORTFOLIO VALUE
              </span>
              <Wallet size={18} className="text-slate-400" />
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight mt-2">
              $4.2M
            </div>
            <div className="text-xs font-mono text-emerald-500 font-semibold mt-1">
              ↑ +$124,500 [YTD]
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Active Assets</div>
              <div className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                12 Properties
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Avg Yield</div>
              <div className="text-sm sm:text-base font-bold font-mono text-emerald-500 mt-0.5">
                6.8% YoY
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Advisor Pulse Banner */}
      <div className="relative p-5 sm:p-6 rounded-3xl border border-blue-500/20 dark:border-emerald-500/30 bg-gradient-to-r from-blue-500/5 dark:from-emerald-950/30 via-slate-50 dark:via-slate-900/50 to-white dark:to-slate-900/80 shadow-sm overflow-hidden">
        {/* Accent Glowing Rail */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 dark:bg-emerald-400 shadow-[0_0_10px_rgba(78,222,163,0.6)]" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pl-2">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 dark:bg-emerald-500/20 text-blue-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Brain size={22} className="animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-blue-600 dark:text-emerald-400">
                AI ADVISOR PULSE
              </span>
              <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5 leading-relaxed max-w-xl">
                "Based on your portfolio, emerging tech hubs in Austin show a 94% match for your risk profile with projected 12.4% ROI."
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => onNavigate('advisor')}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare size={14} /> Ask AI
            </button>
            <button
              onClick={() => onNavigate('simulator')}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 dark:bg-emerald-500 hover:bg-blue-700 dark:hover:bg-emerald-600 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/20 dark:shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> New Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Recent Property Analysis Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            Recent Property Analysis
          </h3>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-mono font-bold text-blue-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            VIEW ALL <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.slice(0, 3).map((prop) => (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop)}
              className="group rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                <img
                  src={prop.imageUrl}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#031427]/80 via-transparent to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-white font-mono text-[10px] font-bold border border-white/10">
                    {prop.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-600/90 dark:bg-emerald-600/90 text-white font-mono text-[10px] font-bold">
                    {prop.category.toUpperCase()}
                  </span>
                </div>

                {/* Bottom Overlay Title */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight truncate">
                    {prop.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 truncate">
                    {prop.location}, {prop.city}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Est. Price</span>
                  <div className="text-sm sm:text-base font-extrabold font-mono text-slate-900 dark:text-white">
                    ${(prop.fairValueLakhs / 100).toFixed(1)}M
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Proj. ROI</span>
                  <div className="text-sm sm:text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    {prop.annualYield}% <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
