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
  Home,
  Briefcase,
  Sliders,
  Sparkles,
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
      {/* Top Banner: Total Invested with Green Wave Sparkline (Matching Screen 1) */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-400">
              Total Invested
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              ₹4.32 Cr
            </div>
            <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 pt-1">
              <TrendingUp size={13} /> +14.2% overall portfolio gain
            </div>
          </div>

          {/* Green Smooth Wave Timeline Chart */}
          <div className="w-full md:w-72 h-20 relative flex flex-col justify-end">
            <div className="w-full h-14 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="dribbbleWaveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,60 Q 40,25 80,45 T 160,20 T 240,35 T 300,10 L 300,80 L 0,80 Z"
                  fill="url(#dribbbleWaveGrad)"
                />
                <path
                  d="M 0,60 Q 40,25 80,45 T 160,20 T 240,35 T 300,10"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100 dark:border-[#273449]">
              <span>Jan</span>
              <span>Mar</span>
              <span>Jul</span>
              <span>Sept</span>
              <span>Dec</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row: R.O.I. vs Last Year Card + Monthly Income Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* R.O.I. vs Last Year Card (Screen 1 Left) */}
        <div className="p-5 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">R.O.I</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                12.8% <span className="text-xs font-normal text-slate-400">vs last year</span>
              </div>
            </div>
          </div>

          {/* Comparative Horizontal Progress Bars (2024 vs 2025/2026) */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#273449]">
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="w-10 text-slate-400 font-medium">2024</span>
              <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500 w-[62%]" />
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-semibold w-10 text-right">18.6%</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="w-10 text-slate-400 font-medium">2025</span>
              <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-400 w-[84%]" />
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold w-10 text-right">24.2%</span>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-slate-400 pl-13 pr-10 pt-0.5">
              <span>0%</span>
              <span>10%</span>
              <span>20%</span>
              <span>30%</span>
            </div>
          </div>
        </div>

        {/* Monthly Income Card (Screen 1 Right) */}
        <div className="p-5 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Monthly Income</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                ₹1,41,132 <span className="text-xs font-normal text-slate-400">vs last month</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
              ↗ 5%
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-[#273449] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Next Payout: 1st of month</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">100% On-time</span>
          </div>
        </div>
      </div>

      {/* Quick Actions (Screen 1 2x2 Large Card Buttons) */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
          Quick Actions:
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Action 1: Explore Properties */}
          <button
            onClick={() => onNavigate('explore')}
            className="p-5 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer text-left flex flex-col justify-between h-36 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Home size={20} />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block group-hover:text-emerald-600 transition-colors">
                Explore Properties
              </span>
              <span className="text-[11px] text-slate-400">
                {properties.length} active listings
              </span>
            </div>
          </button>

          {/* Action 2: View Portfolio */}
          <button
            onClick={() => onNavigate('analysis')}
            className="p-5 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer text-left flex flex-col justify-between h-36 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase size={20} />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block group-hover:text-indigo-600 transition-colors">
                View Portfolio
              </span>
              <span className="text-[11px] text-slate-400">
                Performance thesis
              </span>
            </div>
          </button>

          {/* Action 3: Decision Simulator */}
          <button
            onClick={() => onNavigate('simulator')}
            className="p-5 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer text-left flex flex-col justify-between h-36 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sliders size={20} />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block group-hover:text-blue-600 transition-colors">
                Simulate Scenarios
              </span>
              <span className="text-[11px] text-slate-400">
                EMI & yield calculator
              </span>
            </div>
          </button>

          {/* Action 4: AI Advisor */}
          <button
            onClick={() => onNavigate('advisor')}
            className="p-5 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] hover:border-amber-500/50 hover:shadow-md transition-all cursor-pointer text-left flex flex-col justify-between h-36 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block group-hover:text-amber-600 transition-colors">
                AI Valuation Pulse
              </span>
              <span className="text-[11px] text-slate-400">
                Instant comp intelligence
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Featured Properties in 2-Column Dribbble Card Style (Screen 2 preview) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
              Featured Verified Assets
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-yield institutional opportunities in Bengaluru
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {properties.slice(0, 3).map((prop, idx) => {
            const badgeTag = idx === 0 ? 'Trending' : (idx === 1 ? 'Available' : 'Closing Soon');
            const badgeClass = idx === 0
              ? 'bg-blue-600 text-white'
              : (idx === 1 ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white');

            return (
              <div
                key={prop.id}
                onClick={() => onSelectProperty(prop)}
                className="group rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Photo with Top-Left Floating Badge */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <img
                    src={prop.imageUrl}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Floating Top-Left Status Pill (from Dribbble Screen 2) */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold tracking-wide shadow-md ${badgeClass}`}>
                      {badgeTag}
                    </span>
                  </div>
                </div>

                {/* Card Details: Title on left, Price on right, ROI pill below */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {prop.title}
                    </h4>
                    <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white shrink-0">
                      {formatInrLakhs(prop.askingPriceLakhs)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
                      R.O.I. {prop.annualYield}%
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {prop.location}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};



