import React, { useState, useEffect } from 'react';
import type { Property, NavTab } from '../../types';
import {
  Scale,
  Trophy,
  ArrowRight,
  Check,
  Search,
  Sliders,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  RotateCcw,
  Building2,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { formatInrLakhs, formatInrRent } from '../../utils/currency';
import { comparisonApi } from '../../services/api/comparisonApi';
import { propertyApi } from '../../services/api/propertyApi';

interface CompareViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onNavigate: (tab: NavTab) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  properties: initialProperties,
  onSelectProperty,
  onNavigate,
}) => {
  const { t } = useTranslation();

  // User Requirements Search State
  const [locality, setLocality] = useState<string>('Whitefield');
  const [minBudget, setMinBudget] = useState<number>(25);
  const [maxBudget, setMaxBudget] = useState<number>(85);
  const [propertyType, setPropertyType] = useState<string>('Residential');
  const [bhk, setBhk] = useState<number | 'all'>('all');
  const [minSqft, setMinSqft] = useState<number>(800);
  const [maxSqft, setMaxSqft] = useState<number>(2000);
  const [goal, setGoal] = useState<string>('Capital Appreciation');
  const [risk, setRisk] = useState<string>('Moderate');
  const [holdingPeriod, setHoldingPeriod] = useState<string>('3–5 years');

  // Comparison State
  const [availableProperties, setAvailableProperties] = useState<Property[]>(initialProperties);
  const [selectedIds, setSelectedIds] = useState<string[]>([
    initialProperties[0]?.id || '',
    initialProperties[1]?.id || '',
  ]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic Comparison Result from Backend
  const [backendComparison, setBackendComparison] = useState<any>(null);

  const localitiesList = [
    'Whitefield',
    'Electronic City',
    'Sarjapur Road',
    'Hebbal',
    'Indiranagar',
    'HSR Layout',
    'Koramangala',
    'Bellandur',
    'Any Bengaluru',
  ];

  // Handle Find Matching Properties via FastAPI Search Endpoint
  const handleFindMatches = async () => {
    setIsSearching(true);
    setErrorMessage(null);
    try {
      const candidates = await comparisonApi.searchMatchingProperties({
        locality: locality === 'Any Bengaluru' ? undefined : locality,
        min_budget: minBudget,
        max_budget: maxBudget,
        property_type: propertyType,
        bhk: bhk === 'all' ? undefined : bhk,
        min_sqft: minSqft,
        max_sqft: maxSqft,
        goal,
        risk,
        holding_period: holdingPeriod,
      });

      if (candidates && candidates.length > 0) {
        setAvailableProperties(candidates);
        const nextIds = candidates.slice(0, 2).map((c) => c.id);
        setSelectedIds(nextIds);
        await runBackendComparison(nextIds);
      } else {
        setErrorMessage('No exact matches found for your criteria. Showing closest available Bengaluru properties.');
      }
    } catch (err: any) {
      console.warn('Backend API search fallback to local filtering:', err.message);
      // Local fallback
      const filtered = initialProperties.filter((p) => {
        const budgetOk = p.askingPriceLakhs >= minBudget * 0.8 && p.askingPriceLakhs <= maxBudget * 1.2;
        return budgetOk;
      });
      if (filtered.length >= 2) {
        setAvailableProperties(filtered);
        setSelectedIds([filtered[0].id, filtered[1].id]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Run Comparison on Backend
  const runBackendComparison = async (ids: string[]) => {
    if (ids.length === 0) return;
    setIsComparing(true);
    try {
      const res = await propertyApi.compareProperties(ids, {
        locality,
        min_budget: minBudget,
        max_budget: maxBudget,
        goal,
        risk,
        holding_period: holdingPeriod,
      });
      setBackendComparison(res);
    } catch (err: any) {
      console.warn('Backend compare endpoint unavailable, using local calculation.');
      setBackendComparison(null);
    } finally {
      setIsComparing(false);
    }
  };

  useEffect(() => {
    if (selectedIds.length > 0) {
      runBackendComparison(selectedIds);
    }
  }, [selectedIds]);

  const selectedProps = selectedIds
    .map((id) => availableProperties.find((p) => p.id === id) || initialProperties.find((p) => p.id === id))
    .filter(Boolean) as Property[];

  const bestProperty =
    backendComparison?.top_pick ||
    [...selectedProps].sort((a, b) => b.investmentScore - a.investmentScore)[0];

  const handleSelectSlot = (slotIdx: number, propId: string) => {
    const next = [...selectedIds];
    next[slotIdx] = propId;
    setSelectedIds(next);
  };

  const handleAddSlot = () => {
    if (selectedIds.length < 3) {
      const unused = availableProperties.find((p) => !selectedIds.includes(p.id)) || availableProperties[0];
      setSelectedIds([...selectedIds, unused.id]);
    }
  };

  const handleRemoveSlot = (slotIdx: number) => {
    if (selectedIds.length > 2) {
      setSelectedIds(selectedIds.filter((_, idx) => idx !== slotIdx));
    }
  };

  // Handle Save Comparison to MySQL
  const handleSaveComparison = async () => {
    setIsSaving(true);
    setSaveSuccessMsg(null);
    try {
      const title = `${locality} ${propertyType} Comparison (${selectedProps.length} assets)`;
      const criteria = {
        locality,
        min_budget: minBudget,
        max_budget: maxBudget,
        property_type: propertyType,
        bhk,
        goal,
        risk,
        holding_period: holdingPeriod,
      };

      const comparisonResults = backendComparison || {
        selected_properties: selectedProps,
        top_pick: bestProperty,
      };

      const reasoning = backendComparison?.reasoning || [
        `Top pick '${bestProperty?.title}' delivered ${bestProperty?.annualYield}% annual yield.`,
        `Estimated fair value of ₹${bestProperty?.fairValueLakhs} L with ${bestProperty?.confidenceScore}% confidence.`,
        `Directly aligns with ${goal} goal under a ${holdingPeriod} holding period.`,
      ];

      await comparisonApi.saveComparison({
        title,
        criteria,
        selected_property_ids: selectedIds,
        comparison_results: comparisonResults,
        top_pick: bestProperty?.title || 'Selected Asset',
        recommendation: bestProperty?.recommendation || 'BUY',
        reasoning,
      });

      setSaveSuccessMsg('Comparison saved successfully.');
      setTimeout(() => setSaveSuccessMsg(null), 5000);
    } catch (err: any) {
      setErrorMessage('Couldn\'t save this comparison. Please try again.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-6xl mx-auto">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-[#273449]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
              LIVE ANALYSIS
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            {t.compare_title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.compare_subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('saved-comparisons')}
            className="px-4 py-2 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200 dark:border-[#273449] text-slate-700 dark:text-slate-200 hover:border-emerald-500 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <BookmarkCheck size={14} className="text-emerald-500" />
            <span>Saved Comparisons</span>
          </button>

          {selectedIds.length < 3 && (
            <button
              onClick={handleAddSlot}
              className="px-3.5 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              + {t.add_asset}
            </button>
          )}
        </div>
      </div>

      {/* Step 1: User Requirements Input Panel */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#273449]">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-emerald-500" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Enter Your Comparison Requirements
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Bengaluru Housing & Rental Data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Area / Locality */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Area / Locality:
            </label>
            <select
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#172033] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
            >
              {localitiesList.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Range */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Budget Range:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                ₹{minBudget}L – ₹{maxBudget}L
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={minBudget}
                onChange={(e) => setMinBudget(Number(e.target.value))}
                placeholder="Min ₹L"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#172033] text-xs font-mono font-semibold text-slate-900 dark:text-white"
              />
              <input
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                placeholder="Max ₹L"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#172033] text-xs font-mono font-semibold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Property Type & BHK */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Type & BHK:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#172033] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Land">Land / Plot</option>
                <option value="Any">Any Type</option>
              </select>

              <select
                value={bhk}
                onChange={(e) => setBhk(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#172033] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
              >
                <option value="all">All BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
            </div>
          </div>

          {/* Investment Goal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Investment Goal:
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#172033] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
            >
              <option value="Capital Appreciation">Capital Appreciation</option>
              <option value="Rental Income">Rental Income</option>
              <option value="Balanced">Balanced Growth</option>
            </select>
          </div>
        </div>

        {/* Find Matching Properties Button */}
        <button
          onClick={handleFindMatches}
          disabled={isSearching}
          className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Search size={15} />
          <span>{isSearching ? 'Finding Matching Bengaluru Dataset Properties...' : 'FIND MATCHING PROPERTIES'}</span>
        </button>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Property Selector Row (Slot A, Slot B, Slot C) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {selectedIds.map((currentId, slotIdx) => (
          <div
            key={slotIdx}
            className="p-4 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                Property Slot {String.fromCharCode(65 + slotIdx)}
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
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#172033] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
            >
              {availableProperties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({formatInrLakhs(p.askingPriceLakhs)})
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Comparison Table (Responsive Dribbble Card) */}
      <div className="rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-[#273449] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale size={16} className="text-emerald-500" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              2. Side-by-Side Investment Metrics Comparison
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Investment Analysis</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#172033]">
                <th className="p-3.5 text-slate-500 dark:text-slate-400 font-bold uppercase">{t.metric_col}</th>
                {selectedProps.map((p) => (
                  <th key={p.id} className="p-3.5 text-slate-900 dark:text-white font-extrabold">
                    {p.location} ({p.code})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#273449]">
              <tr>
                <td className="p-3.5 text-slate-500 dark:text-slate-400 font-medium">{t.asking_price}</td>
                {selectedProps.map((p) => (
                  <td key={p.id} className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {formatInrLakhs(p.askingPriceLakhs)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 text-slate-500 dark:text-slate-400 font-medium">Estimated Value</td>
                {selectedProps.map((p) => (
                  <td key={p.id} className="p-3.5 font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatInrLakhs(p.fairValueLakhs)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 text-slate-500 dark:text-slate-400 font-medium">Valuation Deal Status</td>
                {selectedProps.map((p) => (
                  <td key={p.id} className="p-3.5 font-bold text-slate-800 dark:text-slate-200">
                    {p.dealStatus} ({p.dealDiffPct > 0 ? `+${p.dealDiffPct}%` : `${p.dealDiffPct}%`})
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 text-slate-500 dark:text-slate-400 font-medium">{t.monthly_rent}</td>
                {selectedProps.map((p) => (
                  <td key={p.id} className="p-3.5 text-slate-800 dark:text-slate-200">
                    {formatInrRent(p.monthlyRent)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 text-slate-500 dark:text-slate-400 font-medium">{t.proj_roi}</td>
                {selectedProps.map((p) => (
                  <td key={p.id} className="p-3.5 font-extrabold text-emerald-600 dark:text-emerald-400">
                    {p.annualYield}% p.a.
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 text-slate-500 dark:text-slate-400 font-medium">Investment Score</td>
                {selectedProps.map((p) => (
                  <td key={p.id} className="p-3.5 font-extrabold text-slate-900 dark:text-white">
                    {p.investmentScore}/100
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 text-slate-500 dark:text-slate-400 font-medium">Data Confidence</td>
                {selectedProps.map((p) => (
                  <td key={p.id} className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {p.confidenceScore}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 text-slate-500 dark:text-slate-400 font-medium">{t.verdict}</td>
                {selectedProps.map((p) => (
                  <td key={p.id} className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white ${
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
      </div>

      {/* Best Pick Recommendation Banner */}
      {bestProperty && (
        <div className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-[#111827] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <Trophy size={20} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
                {t.realvest_top_pick}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {bestProperty.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Top risk-adjusted return ({bestProperty.annualYield}% rental yield, estimated value ₹{bestProperty.fairValueLakhs} L).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={handleSaveComparison}
              disabled={isSaving}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200 dark:border-[#273449] text-slate-800 dark:text-slate-200 font-extrabold text-xs hover:border-emerald-500 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Bookmark size={14} className="text-emerald-500" />
              <span>{isSaving ? 'Saving...' : 'Save Comparison'}</span>
            </button>

            <button
              onClick={() => {
                onSelectProperty(bestProperty);
                onNavigate('analysis');
              }}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <span>{t.inspect_btn}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Save Success Banner */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-emerald-500" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button
            onClick={() => onNavigate('saved-comparisons')}
            className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
          >
            View in Saved Comparisons →
          </button>
        </div>
      )}
    </div>
  );
};
