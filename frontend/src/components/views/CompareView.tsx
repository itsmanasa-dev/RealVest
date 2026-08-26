import React, { useState } from 'react';
import type { Property, NavTab } from '../../types';
import { Scale, Trophy, CheckCircle2, ArrowRight } from 'lucide-react';

interface CompareViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onNavigate: (tab: NavTab) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  properties,
  onSelectProperty,
  onNavigate,
}) => {
  // Allow picking 2 or 3 properties
  const [selectedIds, setSelectedIds] = useState<string[]>([
    properties[0]?.id || '',
    properties[1]?.id || '',
  ]);

  const selectedProps = selectedIds
    .map((id) => properties.find((p) => p.id === id))
    .filter(Boolean) as Property[];

  // Determine "Our Pick" automatically based on investment score & yield
  const bestProperty = [...selectedProps].sort((a, b) => b.investmentScore - a.investmentScore)[0];

  const handleSelectSlot = (slotIdx: number, propId: string) => {
    const next = [...selectedIds];
    next[slotIdx] = propId;
    setSelectedIds(next);
  };

  const handleAddSlot = () => {
    if (selectedIds.length < 3) {
      const unused = properties.find((p) => !selectedIds.includes(p.id)) || properties[0];
      setSelectedIds([...selectedIds, unused.id]);
    }
  };

  const handleRemoveSlot = (slotIdx: number) => {
    if (selectedIds.length > 2) {
      setSelectedIds(selectedIds.filter((_, idx) => idx !== slotIdx));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[11px] font-bold uppercase tracking-wider">
              SIDE-BY-SIDE EVALUATION
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Compare Properties
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare verified properties across price, ML valuation, yield, and investment risk.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.length < 3 && (
            <button
              onClick={handleAddSlot}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              + Add 3rd Property
            </button>
          )}
        </div>
      </div>

      {/* Property Selectors Row */}
      <div className={`grid grid-cols-1 sm:grid-cols-${selectedIds.length} gap-4`}>
        {selectedIds.map((currentId, slotIdx) => (
          <div
            key={slotIdx}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">
                Property {String.fromCharCode(65 + slotIdx)}
              </span>
              {selectedIds.length > 2 && (
                <button
                  onClick={() => handleRemoveSlot(slotIdx)}
                  className="text-xs text-rose-500 hover:text-rose-400 font-mono"
                >
                  ✕ Remove
                </button>
              )}
            </div>

            <select
              value={currentId}
              onChange={(e) => handleSelectSlot(slotIdx, e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#031427] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.title} (₹{p.askingPriceLakhs} L)
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1a2c]">
              <th className="p-4 text-slate-400 font-bold uppercase tracking-wider">Metrics</th>
              {selectedProps.map((prop, idx) => (
                <th key={prop.id} className="p-4 text-slate-900 dark:text-white font-extrabold text-sm">
                  Property {String.fromCharCode(65 + idx)}: {prop.code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            <tr>
              <td className="p-4 text-slate-400 font-bold">Location</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                  {p.location}, {p.city}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-slate-400 font-bold">Configuration</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-4 text-slate-700 dark:text-slate-300">
                  {p.bhk} BHK • {p.sqft} sqft
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-slate-400 font-bold">Asking Price</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-4 font-extrabold text-slate-900 dark:text-white text-sm">
                  ₹{p.askingPriceLakhs} Lakhs
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-slate-400 font-bold">ML Fair Value</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-4 font-extrabold text-blue-500 text-sm">
                  ₹{p.fairValueLakhs} Lakhs
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-slate-400 font-bold">Expected Monthly Rent</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-4 font-bold text-emerald-500">
                  ₹{p.monthlyRent.toLocaleString()}/mo
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-slate-400 font-bold">Rental Yield (%)</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-4 font-extrabold text-amber-500">
                  {p.annualYield}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-slate-400 font-bold">Investment Score</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-4 font-extrabold text-emerald-500 text-base">
                  {p.investmentScore} / 100
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-slate-400 font-bold">AI Verdict</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-white font-extrabold text-[11px] ${
                    p.recommendation === 'BUY' ? 'bg-emerald-500' : (p.recommendation === 'HOLD' ? 'bg-amber-500' : 'bg-rose-500')
                  }`}>
                    {p.recommendation} ({p.dealStatus})
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Automated Best Pick Banner */}
      {bestProperty && (
        <div className="p-6 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-slate-900/50 to-slate-900/80 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Trophy size={26} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-extrabold text-emerald-400 tracking-widest uppercase">
                  REALVEST AUTOMATED BEST PICK
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  {bestProperty.title} ({bestProperty.code})
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Highest overall investment score ({bestProperty.investmentScore}/100) with a {bestProperty.annualYield}% rental yield in {bestProperty.location}.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectProperty(bestProperty);
                onNavigate('analysis');
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer shrink-0"
            >
              Inspect Details <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
