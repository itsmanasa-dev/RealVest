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
  const radius = 64;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (property.confidenceScore / 100) * circumference;

  const diffPct = ((property.askingPriceLakhs - property.fairValueLakhs) / property.fairValueLakhs) * 100;
  const isDiscount = diffPct < 0;

  return (
    <div className="space-y-5 pb-20 max-w-2xl mx-auto">
      {/* Property Title & Location Bar */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft size={15} /> {t.back_to_assets}
        </button>

        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              <MapPin size={15} className="text-slate-400 shrink-0" />
              <span>{property.location}, {property.city}</span>
              {property.sqft > 0 && <span className="ml-1 text-slate-400">• {property.sqft.toLocaleString('en-IN')} sqft</span>}
            </div>
          </div>

          <span className="px-3 py-1 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-mono text-xs font-bold shrink-0">
            {property.code}
          </span>
        </div>

        {/* Category Pill Badges */}
        <div className="flex items-center gap-2 mt-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
            {property.category}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            {property.subCategory}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-white ${
            property.recommendation === 'BUY' ? 'bg-emerald-600' : 'bg-amber-600'
          }`}>
            {property.recommendation}
          </span>
        </div>
      </div>

      {/* Card 1: AI Decision Synthesis */}
      <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm flex flex-col items-center text-center space-y-6">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
          {t.decision_synthesis}
        </h3>

        {/* Circular Radial Gauge */}
        <div className="relative flex items-center justify-center w-40 h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-blue-50 dark:text-slate-800"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-blue-600 dark:text-emerald-400 transition-all duration-1000 ease-out"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {property.confidenceScore}%
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mt-0.5">
              {t.confidence}
            </span>
          </div>
        </div>

        {/* Valuation Comparison Strip */}
        <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="text-left">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">{t.asking_price}</div>
            <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
              {formatInrLakhs(property.askingPriceLakhs)}
            </div>
          </div>
          <div className="text-center px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
            {isDiscount ? `${Math.abs(diffPct).toFixed(1)}% Discount` : `+${diffPct.toFixed(1)}% Premium`}
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">{t.ml_fair_value}</div>
            <div className="text-base font-extrabold font-mono text-blue-600 dark:text-emerald-400">
              {formatInrLakhs(property.fairValueLakhs)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => alert(`Initiating acquisition briefing for ${property.title} in ${property.location}.`)}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingCart size={18} /> {t.initiate_acquisition}
          </button>
          <button
            onClick={() => onNavigate('simulator')}
            className="py-3.5 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sliders size={18} /> {t.open_simulator}
          </button>
        </div>
      </div>

      {/* Row: 2 Metric Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* EXP. MONTHLY RENT */}
        <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-400 uppercase">
            <Wallet size={14} /> {t.monthly_rent}
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-2">
            {formatInrRent(property.monthlyRent)}
          </div>
        </div>

        {/* PROJ. ROI */}
        <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-400 uppercase">
            <LineChart size={14} /> {t.proj_roi}
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-2">
            {property.annualYield}% <span className="text-xs font-sans text-slate-400 font-normal">YoY Yield</span>
          </div>
        </div>
      </div>

      {/* Card 2: Decision Rationale */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Lightbulb size={20} className="text-blue-600 dark:text-emerald-400" />
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            {t.decision_rationale}
          </h3>
        </div>

        <div className="space-y-3">
          {property.reasons.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Card 3: Risk Assessment */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Radar size={20} className="text-amber-500" />
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            {t.risk_assessment}
          </h3>
        </div>

        <div className="space-y-3.5">
          {property.riskRadar.breakdown.map((item, idx) => {
            const isLow = item.level.toUpperCase().includes('LOW');
            const isMed = item.level.toUpperCase().includes('MED');
            const dotColor = isLow ? 'bg-emerald-500' : (isMed ? 'bg-amber-500' : 'bg-blue-500');
            const pillStyle = isLow
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
              : (isMed ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20');

            return (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                  <span>{item.category}</span>
                </div>
                <span className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold border ${pillStyle}`}>
                  {item.level.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
