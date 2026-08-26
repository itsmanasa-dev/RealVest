import React from 'react';
import { Property, NavTab } from '../../types';
import { AIConfidenceGauge } from '../common/AIConfidenceGauge';
import { RiskBadge } from '../common/RiskBadge';
import { MetricCard } from '../common/MetricCard';
import {
  ArrowLeft,
  Bookmark,
  Sliders,
  CheckCircle2,
  MapPin,
  Building2,
  TrendingUp,
  ShieldCheck,
  Building,
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
            <ArrowLeft size={14} /> Back to Assets
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[11px] font-bold uppercase tracking-wider">
              {property.category} • {property.subCategory}
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
          <button className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] text-slate-700 dark:text-slate-300 font-mono text-xs font-bold hover:border-slate-400 transition-all flex items-center gap-2 cursor-pointer shadow-sm">
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
              INSTITUTIONAL VALUATION
            </span>
            <div className="text-3xl md:text-4xl font-extrabold font-mono text-white tracking-tight">
              ${(property.estimatedValue / 1000000).toFixed(1)}M USD
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white font-mono text-xs font-bold flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span>+{property.projectedRoi}% YoY Growth</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white font-mono text-xs font-bold flex items-center gap-2">
              <Building size={16} className="text-blue-400" />
              <span>{property.occupancyRate}% Occupancy</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Decision Synthesis Gauge Card */}
      <AIConfidenceGauge
        confidenceScore={property.confidenceScore}
        recommendation={property.recommendation}
        explainableText="Optimal entry window detected based on projected tech sector growth & cash-flow trajectory."
        onInitiateAcquisition={() => alert(`Acquisition sequence initiated for ${property.title}.`)}
      />

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Est. Value"
          value={`$${(property.estimatedValue / 1000000).toFixed(1)}M`}
          change="+12.4% YoY"
          changeType="positive"
        />
        <MetricCard
          label="Asking Price"
          value={`$${(property.askingPrice / 1000000).toFixed(1)}M`}
          subtext="Priced 6.8% below fair value"
        />
        <MetricCard
          label="Cap Rate (Exit)"
          value={`${property.capRate}%`}
          change="Strong"
          changeType="positive"
        />
        <MetricCard
          label="Projected ROI"
          value={`${property.projectedRoi}%`}
          change="+2.1% benchmark"
          changeType="positive"
        />
      </div>

      {/* Decision Rationale Checklist & Risk Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Decision Rationale Checklist */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={20} className="text-emerald-500" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Decision Rationale Checklist
            </h3>
          </div>

          <div className="space-y-3">
            {property.rationale.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Assessment Matrix */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-blue-500" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Risk Assessment Matrix
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 uppercase">3 Tiers</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Market Trend Risk
              </div>
              <RiskBadge level={property.risks.marketRisk} />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Price Volatility
              </div>
              <RiskBadge level={property.risks.priceVolatility} />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Data Fidelity & Coverage
              </div>
              <RiskBadge level={property.risks.dataFidelity} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
