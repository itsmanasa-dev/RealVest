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
  Building,
  Percent,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { formatInrLakhs, formatPercent } from '../../utils/currency';

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

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Top Greeting & Sync Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-[#273449]">
        <div>
          <span className="text-[11px] font-mono font-medium tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            {t.portfolio_overview}
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight mt-0.5">
            {t.greeting_investor}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t.system_live_data}
          </span>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            {t.last_synced}
          </span>
        </div>
      </div>

      {/* Financial Overview Metrics Row (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">{t.portfolio_value}</span>
            <Wallet size={15} />
          </div>
          <div className="text-2xl font-semibold font-mono text-slate-900 dark:text-white mt-1.5 tracking-tight">
            ₹1.85 Cr
          </div>
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
            {t.ytd_gain}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">{t.active_assets}</span>
            <Building size={15} />
          </div>
          <div className="text-2xl font-semibold font-mono text-slate-900 dark:text-white mt-1.5 tracking-tight">
            {properties.length} Assets
          </div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
            Bengaluru Top Hubs
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">{t.avg_yield}</span>
            <Percent size={15} />
          </div>
          <div className="text-2xl font-semibold font-mono text-emerald-600 dark:text-emerald-400 mt-1.5 tracking-tight">
            8.4%
          </div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
            YoY Cap Weighted
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">HPI Growth</span>
            <TrendingUp size={15} />
          </div>
          <div className="text-2xl font-semibold font-mono text-blue-600 dark:text-blue-400 mt-1.5 tracking-tight">
            +5.3%
          </div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
            NHB Residex Q4
          </div>
        </div>
      </div>

      {/* Grid: Market Dynamics + RealVest AI Pulse Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Market Dynamics Wave Card (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t.market_dynamics}
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 border border-emerald-500/20">
                <TrendingUp size={12} /> +4.2% YoY
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.hpi_index_label} (2021 – 2024 Actual)
            </p>
          </div>

          {/* Smooth Area Wave Chart */}
          <div className="h-32 w-full relative mt-3">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,75 Q 70,80 130,55 T 260,65 T 400,20 L 400,100 L 0,100 Z"
                fill="url(#waveGradient)"
              />
              <path
                d="M 0,75 Q 70,80 130,55 T 260,65 T 400,20"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex justify-between font-mono text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-[#273449]">
            <span>2021 Q4</span>
            <span>2022 Q4</span>
            <span>2023 Q4</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">2024 Q4 (141.0)</span>
          </div>
        </div>

        {/* AI Advisor Pulse Banner (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl border border-blue-500/20 dark:border-blue-500/30 bg-blue-50/40 dark:bg-[#111827] shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Brain size={16} />
              </div>
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {t.ai_pulse_title}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {t.ai_pulse_desc}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-blue-100 dark:border-[#273449] mt-3">
            <button
              onClick={() => onNavigate('advisor')}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-[#273449] bg-white dark:bg-[#172033] text-slate-700 dark:text-slate-200 font-medium text-xs hover:bg-slate-50 dark:hover:bg-[#1e2c47] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare size={13} /> {t.ask_ai_btn}
            </button>
            <button
              onClick={() => onNavigate('simulator')}
              className="flex-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus size={13} /> {t.new_analysis_btn}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Property Analysis Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
              {t.recent_analysis}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified Bengaluru properties with ML fair-value assessment
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            {t.view_all} <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.slice(0, 3).map((prop) => (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop)}
              className="group rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] overflow-hidden shadow-sm hover:border-blue-500/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                <img
                  src={prop.imageUrl}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/80 via-transparent to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-md text-white font-mono text-[10px] font-medium border border-white/10">
                    {prop.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-white font-mono text-[10px] font-semibold ${
                    prop.recommendation === 'BUY' ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}>
                    {prop.recommendation}
                  </span>
                </div>

                {/* Bottom Overlay Title */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <h4 className="text-sm font-semibold text-white tracking-tight truncate">
                    {prop.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 truncate">
                    {prop.location}, {prop.city}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-[#273449]">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">{t.est_value}</span>
                  <div className="text-sm font-semibold font-mono text-slate-900 dark:text-white">
                    {formatInrLakhs(prop.fairValueLakhs)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">{t.proj_roi}</span>
                  <div className="text-sm font-semibold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    {prop.annualYield}% <ArrowUpRight size={13} />
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


