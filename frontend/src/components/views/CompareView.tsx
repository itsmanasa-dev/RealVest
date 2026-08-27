import React, { useState } from 'react';
import type { Property, NavTab } from '../../types';
import { Scale, Trophy, ArrowRight, Check } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { formatInrLakhs, formatInrRent } from '../../utils/currency';

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
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState<string[]>([
    properties[0]?.id || '',
    properties[1]?.id || '',
  ]);

  const selectedProps = selectedIds
    .map((id) => properties.find((p) => p.id === id))
    .filter(Boolean) as Property[];

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
    <div className="space-y-6 pb-12 w-full">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-[#273449]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
            {t.compare_title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.compare_subtitle}
          </p>
        </div>

        {selectedIds.length < 3 && (
          <button
            onClick={handleAddSlot}
            className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-[#172033] text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-[#273449] font-mono text-xs font-medium hover:bg-blue-100 dark:hover:bg-[#1e2c47] transition-colors cursor-pointer self-start sm:self-auto"
          >
            {t.add_asset}
          </button>
        )}
      </div>

      {/* Property Selector Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {selectedIds.map((currentId, slotIdx) => (
          <div
            key={slotIdx}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-medium uppercase text-slate-400">
                {t.property_slot} {String.fromCharCode(65 + slotIdx)}
              </span>
              {selectedIds.length > 2 && (
                <button
                  onClick={() => handleRemoveSlot(slotIdx)}
                  className="text-[11px] text-rose-500 hover:underline font-mono cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>

            <select
              value={currentId}
              onChange={(e) => handleSelectSlot(slotIdx, e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#172033] text-slate-900 dark:text-white text-xs font-medium focus:outline-none"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({formatInrLakhs(p.askingPriceLakhs)})
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#172033]">
              <th className="p-3 text-slate-500 dark:text-slate-400 font-medium uppercase">{t.metric_col}</th>
              {selectedProps.map((p) => (
                <th key={p.id} className="p-3 text-slate-900 dark:text-white font-semibold">
                  {p.location} ({p.code})
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#273449]">
            <tr>
              <td className="p-3 text-slate-500 dark:text-slate-400 font-medium">{t.asking_price}</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-3 font-semibold text-slate-900 dark:text-white">
                  {formatInrLakhs(p.askingPriceLakhs)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 text-slate-500 dark:text-slate-400 font-medium">{t.est_value}</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-3 font-semibold text-blue-600 dark:text-blue-400">
                  {formatInrLakhs(p.fairValueLakhs)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 text-slate-500 dark:text-slate-400 font-medium">{t.monthly_rent}</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-3 text-slate-800 dark:text-slate-200">
                  {formatInrRent(p.monthlyRent)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 text-slate-500 dark:text-slate-400 font-medium">{t.proj_roi}</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                  {p.annualYield}% YoY
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 text-slate-500 dark:text-slate-400 font-medium">{t.confidence}</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-3 font-semibold text-slate-900 dark:text-white">
                  {p.confidenceScore}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 text-slate-500 dark:text-slate-400 font-medium">{t.verdict}</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold text-white ${
                    p.recommendation === 'BUY' ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}>
                    {p.recommendation}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Best Pick Recommendation Banner */}
      {bestProperty && (
        <div className="p-4 sm:p-5 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/50 dark:bg-[#172033] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Trophy size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-semibold tracking-wider text-blue-600 dark:text-blue-400">
                {t.realvest_top_pick}
              </span>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                {bestProperty.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {t.highest_roi_desc} ({bestProperty.annualYield}% yield, {bestProperty.confidenceScore}% confidence).
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectProperty(bestProperty);
              onNavigate('analysis');
            }}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
          >
            {t.inspect_btn} <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
};


