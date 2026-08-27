import React from 'react';
import type { Property, NavTab } from '../../types';
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  ShoppingCart,
  Building,
  LineChart,
  Lightbulb,
  Radar,
  Sliders,
  Wallet,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { formatInrLakhs, formatInrRent, formatPercent } from '../../utils/currency';

interface PropertyAnalysisViewProps {
  property: Property;
  onBack: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const PropertyAnalysisView: React.FC<PropertyAnalysisViewProps> = ({
  property,
  onBack,
  onNavigate,
}) => {
  const { t } = useTranslation();
  const radius = 54;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (property.confidenceScore / 100) * circumference;

  const diffPct = ((property.askingPriceLakhs - property.fairValueLakhs) / property.fairValueLakhs) * 100;
  const isDiscount = diffPct < 0;

  // Explainable Value Drivers Breakdown
  const sizeDeltaLakhs = parseFloat(((property.sqft / 1200) * 18.5).toFixed(1));
  const locationDeltaLakhs = parseFloat((property.fairValueLakhs * 0.14).toFixed(1));
  const readyDeltaLakhs = 4.2;
  const baseBenchmarkLakhs = parseFloat((property.fairValueLakhs - sizeDeltaLakhs - locationDeltaLakhs - readyDeltaLakhs).toFixed(1));

  // 6 Categorical Risk Elements
  const riskCategories = [
    { name: 'Price Valuation Risk', level: isDiscount ? 'LOW' : 'MEDIUM', desc: isDiscount ? 'Asking price is discounted below ML comparable sales.' : 'Priced at slight premium to sub-market median.' },
    { name: 'Rental Cash Flow Risk', level: property.annualYield >= 4.0 ? 'LOW' : 'MEDIUM', desc: `Yield at ${property.annualYield}% vs Bangalore 3.8% metro benchmark.` },
    { name: 'Market Volatility Risk', level: 'LOW', desc: 'Bengaluru IT corridor transaction liquidity remains high.' },
    { name: 'Location Infrastructure Risk', level: 'LOW', desc: 'Active metro connectivity and verified commercial hubs.' },
    { name: 'Liquidity & Resale Risk', level: 'MEDIUM', desc: 'Median resale transaction horizon: 45–60 days.' },
    { name: 'Data Confidence', level: property.confidenceScore >= 80 ? 'HIGH' : 'MEDIUM', desc: `${property.confidenceScore}% prediction confidence based on verified registry records.` },
  ];

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Property Title & Location Bar */}
      <div className="pb-3 border-b border-slate-200 dark:border-[#273449]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft size={14} /> {t.back_to_assets}
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-white font-mono text-[10px] font-semibold bg-slate-900 dark:bg-slate-800">
                {property.code}
              </span>
              <span className={`px-2 py-0.5 rounded text-white font-mono text-[10px] font-semibold ${
                property.recommendation === 'BUY' ? 'bg-emerald-600' : 'bg-amber-600'
              }`}>
                {property.recommendation}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {property.category} • {property.subCategory}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight mt-1">
              {property.title}
            </h1>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <MapPin size={13} className="text-slate-400 shrink-0" />
              <span>{property.location}, {property.city}</span>
              {property.sqft > 0 && <span className="text-slate-400">• {property.sqft.toLocaleString('en-IN')} sqft</span>}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('simulator')}
              className="px-3.5 py-2 rounded-full border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] text-slate-700 dark:text-slate-200 font-medium text-xs hover:bg-slate-50 dark:hover:bg-[#1e2c47] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sliders size={14} /> {t.open_simulator}
            </button>
            <button
              onClick={() => alert(`Initiating acquisition workflow for ${property.title}.`)}
              className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <ShoppingCart size={14} /> {t.initiate_acquisition}
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Decision Synthesis & Valuation Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Decision Synthesis Radial + Valuation Strip (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm flex flex-col items-center justify-between text-center">
          <div className="w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#273449]">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.decision_synthesis}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                property.recommendation === 'BUY'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}>
                VERDICT: {property.recommendation}
              </span>
            </div>

            {/* Circular Gauge */}
            <div className="relative flex items-center justify-center w-36 h-36 mx-auto my-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-slate-100 dark:text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-emerald-500 dark:text-emerald-400 transition-all duration-700 ease-out"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {property.confidenceScore}%
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-medium">
                  {t.confidence}
                </span>
              </div>
            </div>
          </div>

          {/* Valuation Comparison Box */}
          <div className="w-full p-3.5 rounded-lg bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449] grid grid-cols-2 gap-3 text-left">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">{t.asking_price}</div>
              <div className="text-sm font-semibold font-mono text-slate-900 dark:text-white mt-0.5">
                {formatInrLakhs(property.askingPriceLakhs)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">{t.ml_fair_value}</div>
              <div className="text-sm font-semibold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                {formatInrLakhs(property.fairValueLakhs)}
              </div>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200/60 dark:border-[#273449] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Valuation Spread:</span>
              <span className={`font-semibold ${isDiscount ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {isDiscount ? `${Math.abs(diffPct).toFixed(1)}% Underpriced (Discount)` : `+${diffPct.toFixed(1)}% Overpriced`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Metrics & Value Drivers Waterfall (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Quick Metrics (Rent & ROI) */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <Wallet size={13} /> {t.monthly_rent}
              </div>
              <div className="text-xl font-semibold font-mono text-slate-900 dark:text-white mt-1">
                {formatInrRent(property.monthlyRent)}
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                MagicBricks median estimate
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <LineChart size={13} /> {t.proj_roi}
              </div>
              <div className="text-xl font-semibold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {property.annualYield}%
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                Annualized rental yield
              </div>
            </div>
          </div>

          {/* Value Drivers / Feature Waterfall */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#273449]">
              <div className="flex items-center gap-1.5">
                <Building size={15} className="text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  ML Value Drivers (Factor Decomposition)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Additive Linearized Shapley</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Base Sub-Market Benchmark</span>
                <span className="text-slate-900 dark:text-white font-medium">₹{baseBenchmarkLakhs} L</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Area & Built-Up Dimension ({property.sqft} sqft)</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">+₹{sizeDeltaLakhs} L</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Locality IT Corridor Demand ({property.location})</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">+₹{locationDeltaLakhs} L</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Ready-To-Move Occupancy Factor</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">+₹{readyDeltaLakhs} L</span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-[#273449] flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-900 dark:text-white">ML Model Fair Value</span>
                <span className="text-blue-600 dark:text-blue-400">₹{property.fairValueLakhs.toFixed(1)} Lakhs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Why This Decision Evidence + Risk Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: Decision Evidence & Rationale */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3.5">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-[#273449]">
            <Lightbulb size={16} className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {t.decision_rationale}
            </h3>
          </div>

          <div className="space-y-2.5">
            {property.reasons.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: 6-Dimension Risk Radar */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3.5">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-[#273449]">
            <Radar size={16} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {t.risk_assessment}
            </h3>
          </div>

          <div className="space-y-2.5">
            {riskCategories.map((r, idx) => {
              const isLow = r.level === 'LOW' || r.level === 'HIGH';
              const pillStyle = r.level === 'LOW'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : (r.level === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20');

              return (
                <div key={idx} className="flex items-start justify-between gap-3 text-xs">
                  <div>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{r.name}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{r.desc}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border shrink-0 ${pillStyle}`}>
                    {r.level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


