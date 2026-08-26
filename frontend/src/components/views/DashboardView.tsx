import React from 'react';
import { Property, NavTab } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { RiskBadge } from '../common/RiskBadge';
import {
  TrendingUp,
  Brain,
  MessageSquare,
  PlusCircle,
  Building,
  ArrowUpRight,
  ChevronRight,
  ShieldAlert,
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
    <div className="space-y-6 pb-12">
      {/* Top Stats Grid: Market Dynamics & Portfolio Value */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Dynamics Card (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  MARKET DYNAMICS (30-DAY INDEX)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-xs font-bold flex items-center gap-1">
                  <TrendingUp size={14} /> +4.2%
                </span>
              </div>
              <h3 className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                942.80 <span className="text-sm font-sans font-normal text-slate-400">PTS</span>
              </h3>
            </div>
            <div className="flex gap-1 font-mono text-xs font-semibold">
              {['W1', 'W2', 'W3', 'W4'].map((w, i) => (
                <span
                  key={w}
                  className={`px-2.5 py-1 rounded-lg ${
                    i === 3
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-slate-400 bg-slate-100 dark:bg-slate-800/60'
                  }`}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>

          {/* Smooth SVG Dual-Tone Area Chart */}
          <div className="h-40 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="currentColor" strokeDasharray="4 4" className="text-slate-200 dark:text-slate-800" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="currentColor" strokeDasharray="4 4" className="text-slate-200 dark:text-slate-800" />

              {/* Area Fill */}
              <path
                d="M 0,90 Q 125,40 250,65 T 500,20 L 500,120 L 0,120 Z"
                fill="url(#emeraldGradient)"
              />
              {/* Smooth Stroke Curve */}
              <path
                d="M 0,90 Q 125,40 250,65 T 500,20"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Timeline Marker Nodes */}
              <circle cx="0" cy="90" r="4" className="fill-emerald-500" />
              <circle cx="125" cy="55" r="4" className="fill-emerald-500" />
              <circle cx="250" cy="65" r="4" className="fill-emerald-500" />
              <circle cx="375" cy="40" r="4" className="fill-emerald-500" />
              <circle cx="500" cy="20" r="6" className="fill-emerald-500 stroke-4 stroke-emerald-200 dark:stroke-emerald-950 animate-pulse" />
            </svg>
          </div>
        </div>

        {/* Portfolio Value Card (1 Col) */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                PORTFOLIO VALUE
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-xs font-mono font-bold">
                +$124,500 YTD
              </span>
            </div>
            <h2 className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
              $4,250,000
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-400">Active Assets</div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                <Building size={16} className="text-emerald-500" /> 12 Properties
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-400">Weighted Yield</div>
              <div className="text-lg font-bold font-mono text-emerald-500 mt-0.5">
                6.8% YoY
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Advisor Pulse Banner */}
      <div className="relative p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-900/40 to-slate-900/80 backdrop-blur-xl shadow-xl overflow-hidden group">
        {/* Emerald Left-Accent Glowing Rail */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 shadow-[0_0_12px_rgba(78,222,163,0.8)]" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pl-2">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
              <Brain size={26} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase font-extrabold tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AI INSIGHT PULSE
                </span>
                <span className="text-xs text-slate-400 font-mono">94% Profile Match</span>
              </div>
              <p className="text-sm md:text-base font-medium text-slate-200 leading-relaxed italic max-w-2xl">
                "Based on your portfolio, emerging tech hubs in Austin show a 94% match for your risk profile with projected 12.4% ROI."
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('advisor')}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare size={16} /> 💬 Ask AI
            </button>
            <button
              onClick={() => onNavigate('simulator')}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle size={16} /> + New Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Recent Property Analysis Carousel / Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recent Property Analysis
            </h3>
            <p className="text-xs text-slate-400">
              Verified institutional evaluations and ROI forecasts
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-mono font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
          >
            View All ({properties.length}) <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.slice(0, 3).map((prop) => (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop)}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
              {/* Thumbnail Container */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={prop.imageUrl}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102034] via-transparent to-transparent opacity-80" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white font-mono text-[11px] font-bold border border-white/10">
                    {prop.code}
                  </span>
                  <RiskBadge level={prop.risks.marketRisk} label="Risk" />
                </div>

                {/* Bottom Overlay Title */}
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    {prop.category} • {prop.subCategory}
                  </span>
                  <h4 className="text-base font-extrabold text-white tracking-tight leading-snug">
                    {prop.title}
                  </h4>
                  <p className="text-xs text-slate-300 font-sans truncate">
                    {prop.location}, {prop.city}
                  </p>
                </div>
              </div>

              {/* Card Body Numbers */}
              <div className="p-4 grid grid-cols-2 gap-3 border-t border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Est. Price</span>
                  <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
                    ${(prop.estimatedValue / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Proj. ROI</span>
                  <div className="text-base font-extrabold font-mono text-emerald-500 flex items-center gap-1">
                    {prop.projectedRoi}% <ArrowUpRight size={14} />
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
