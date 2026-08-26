import React from 'react';
import type { Property, NavTab } from '../../types';
import { AIConfidenceGauge } from '../common/AIConfidenceGauge';
import { RiskBadge } from '../common/RiskBadge';
import { MetricCard } from '../common/MetricCard';
import {
  ArrowLeft,
  Bookmark,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Building,
  Layers,
} from 'lucide-react';

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
  return (
    <div className="space-y-6 pb-12">
      {/* Property Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Listings
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[11px] font-bold uppercase tracking-wider">
              {property.subCategory}
            </span>
            <span className="text-xs font-mono text-slate-400">{property.code}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {property.title}
          </h1>

          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mt-1">
            <MapPin size={16} className="text-emerald-500" />
            <span>{property.location}, {property.city}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert(`Saved ${property.code} to your watchlist.`)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] text-slate-700 dark:text-slate-300 font-mono text-xs font-bold hover:border-slate-400 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Bookmark size={16} /> 🔖 SAVE
          </button>
          <button
            onClick={() => onNavigate('simulator')}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25"
          >
            <Sliders size={16} /> 🧪 SIMULATOR
          </button>
        </div>
      </div>

      {/* Hero Photography & Valuation Display */}
      <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031427] via-[#031427]/40 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              ML ESTIMATED FAIR VALUATION
            </span>
            <div className="text-3xl md:text-4xl font-extrabold font-mono text-white tracking-tight">
              ₹{property.fairValueLakhs} Lakhs
            </div>
            <div className="text-xs font-mono text-slate-300 mt-1">
              Asking Price: <b className="text-white">₹{property.askingPriceLakhs} Lakhs</b> ({property.dealStatus})
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white font-mono text-xs font-bold flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span>{property.annualYield}% Annual Yield</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white font-mono text-xs font-bold flex items-center gap-2">
              <Building size={16} className="text-blue-400" />
              <span>₹{property.monthlyRent.toLocaleString()}/mo Rent</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Decision Synthesis Gauge Card */}
      <AIConfidenceGauge
        confidenceScore={property.confidenceScore}
        recommendation={property.recommendation}
        explainableText={`RealVest Decision Engine assigns a ${property.recommendation} verdict with ${property.confidenceScore}% confidence based on micro-market pricing benchmarks and yield coverage in ${property.location}.`}
        onInitiateAcquisition={() => alert(`Analysis report generated for ${property.title}.`)}
      />

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Asking Price"
          value={`₹${property.askingPriceLakhs} L`}
          subtext={`₹${Math.round((property.askingPriceLakhs * 100000) / property.sqft)} / sqft`}
        />
        <MetricCard
          label="ML Fair Value"
          value={`₹${property.fairValueLakhs} L`}
          change={property.dealDiffPct <= 0 ? `${Math.abs(property.dealDiffPct)}% Below Fair Value` : `+${property.dealDiffPct}% Over Fair Value`}
          changeType={property.dealDiffPct <= 0 ? 'positive' : 'negative'}
        />
        <MetricCard
          label="Estimated Rent"
          value={`₹${property.monthlyRent.toLocaleString()}`}
          subtext="Monthly tenant income"
        />
        <MetricCard
          label="Investment Score"
          value={`${property.investmentScore}/100`}
          change={property.investmentScore >= 75 ? 'Strong Deal' : 'Fair Deal'}
          changeType="positive"
        />
      </div>

      {/* Explainable Valuation Waterfall Breakdown */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Layers size={20} className="text-emerald-500" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explainable Valuation Waterfall Breakdown
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Trained ML Model Attribution</span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Quantified individual feature contributions explaining how the ML fair value of <b>₹{property.fairValueLakhs} Lakhs</b> was derived:
        </p>

        <div className="space-y-2 pt-2">
          {property.waterfallFactors.map((factor, idx) => {
            const isBase = factor.sign === 'base';
            const isPos = factor.sign === '+';
            const colorCls = isBase ? 'text-blue-500' : (isPos ? 'text-emerald-500' : 'text-rose-500');
            const icon = isBase ? '📌' : (isPos ? '▲ +' : '▼ -');

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                  <span className={`font-mono font-bold ${colorCls}`}>{icon}</span>
                  <span>{factor.factor}</span>
                </div>
                <div className={`font-mono font-extrabold text-sm ${colorCls}`}>
                  ₹{Math.abs(factor.contribution_lakhs).toFixed(2)} Lakhs
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decision Rationale Checklist & 5-Dimension Risk Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supporting Reasons & Signals */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <CheckCircle2 size={20} className="text-emerald-500" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Supporting Decision Reasons
            </h3>
          </div>

          <div className="space-y-3">
            {property.reasons.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-xs md:text-sm text-slate-700 dark:text-slate-200 font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {property.risks.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-500 uppercase">
                <AlertTriangle size={16} /> Risk Signals
              </div>
              {property.risks.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs text-rose-400 font-medium"
                >
                  <span>⚠</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5-Dimension Risk Radar Matrix */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-blue-500" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Property Risk Radar
              </h3>
            </div>
            <RiskBadge level={property.riskRadar.overallRisk} label="Overall" />
          </div>

          <div className="space-y-3">
            {property.riskRadar.breakdown.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">{item.metric_label}: {item.metric_value}</span>
                    <span
                      style={{ backgroundColor: item.color }}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold text-white"
                    >
                      {item.level}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <b>Why:</b> {item.why}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
