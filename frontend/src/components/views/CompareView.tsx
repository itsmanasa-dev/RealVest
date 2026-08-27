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
    <div className="space-y-5 pb-20 max-w-2xl mx-auto">
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.compare_title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t.compare_subtitle}
          </p>
        </div>

        {selectedIds.length < 3 && (
          <button
            onClick={handleAddSlot}
            className="px-3.5 py-2 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-slate-200 font-mono text-xs font-bold hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
          >
            {t.add_asset}
          </button>
        )}
      </div>

      {/* Property Selector Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {selectedIds.map((currentId, slotIdx) => (
          <div
            key={slotIdx}
            className="p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                {t.property_slot} {String.fromCharCode(65 + slotIdx)}
              </span>
              {selectedIds.length > 2 && (
                <button
                  onClick={() => handleRemoveSlot(slotIdx)}
                  className="text-xs text-rose-500 hover:underline font-mono cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>

            <select
              value={currentId}
              onChange={(e) => handleSelectSlot(slotIdx, e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#031427] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
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
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <th className="p-3.5 text-slate-400 font-bold uppercase">{t.metric_col}</th>
              {selectedProps.map((p) => (
                <th key={p.id} className="p-3.5 text-slate-900 dark:text-white font-extrabold">
                  {p.location} ({p.code})
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            <tr>
              <td className="p-3.5 text-slate-400 font-semibold">{t.asking_price}</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-3.5 font-bold text-slate-900 dark:text-white">
                  {formatInrLakhs(p.askingPriceLakhs)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3.5 text-slate-400 font-semibold">{t.est_value}</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-3.5 font-extrabold text-blue-600 dark:text-emerald-400 text-sm">
                  {formatInrLakhs(p.fairValueLakhs)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3.5 text-slate-400 font-semibold">{t.monthly_rent}</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-3.5 font-medium text-slate-800 dark:text-slate-200">
                  {formatInrRent(p.monthlyRent)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3.5 text-slate-400 font-semibold">{t.proj_roi}</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                  {p.annualYield}% YoY
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3.5 text-slate-400 font-semibold">{t.confidence}</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-3.5 font-bold text-slate-900 dark:text-white">
                  {p.confidenceScore}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3.5 text-slate-400 font-semibold">{t.verdict}</td>
              {selectedProps.map((p) => (
                <td key={p.id} className="p-3.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                    p.recommendation === 'BUY' ? 'bg-emerald-500' : 'bg-amber-500'
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
        <div className="p-5 sm:p-6 rounded-3xl bg-blue-600 dark:bg-blue-600 text-white shadow-lg shadow-blue-600/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0">
              <Trophy size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-blue-200">
                {t.realvest_top_pick}
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                {bestProperty.title}
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                {t.highest_roi_desc} ({bestProperty.annualYield}% yield, {bestProperty.confidenceScore}% confidence).
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectProperty(bestProperty);
              onNavigate('analysis');
            }}
            className="px-4 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {t.inspect_btn} <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
