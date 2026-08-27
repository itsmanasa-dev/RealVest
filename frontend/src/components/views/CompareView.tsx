import React, { useState, useEffect } from 'react';
import type { Property, NavTab } from '../../types';
import {
  Scale,
  Trophy,
  ArrowRight,
  Search,
  Bookmark,
  BookmarkCheck,
  Plus,
  ArrowLeft,
  X,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { formatInrLakhs, formatInrRent } from '../../utils/currency';
import { comparisonApi } from '../../services/api/comparisonApi';
import { propertyApi } from '../../services/api/propertyApi';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { Badge, recommendationTone, riskTone } from '../ui/Badge';
import { Card } from '../ui/Card';
import { PropertyCard } from '../property/PropertyCard';
import { clsx } from 'clsx';

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

  const [locality, setLocality] = useState<string>('Whitefield');
  const [minBudget, setMinBudget] = useState<number>(25);
  const [maxBudget, setMaxBudget] = useState<number>(85);
  const [propertyType, setPropertyType] = useState<string>('Residential');
  const [bhk, setBhk] = useState<number | 'all'>('all');
  const [goal, setGoal] = useState<string>('Capital Appreciation');
  const [risk, setRisk] = useState<string>('Moderate');
  const [holdingPeriod, setHoldingPeriod] = useState<string>('3–5 years');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setErrorMessage("Couldn't save this comparison. Please try again.");
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const metricRows: { label: string; render: (p: Property) => React.ReactNode }[] = [
    { label: t.asking_price, render: (p) => <span className="font-semibold text-ink">{formatInrLakhs(p.askingPriceLakhs)}</span> },
    { label: 'Estimated value', render: (p) => <span className="font-semibold text-brand">{formatInrLakhs(p.fairValueLakhs)}</span> },
    { label: t.monthly_rent, render: (p) => <span className="text-ink-2">{formatInrRent(p.monthlyRent)}</span> },
    { label: t.proj_roi, render: (p) => <span className="font-semibold text-pos">{p.annualYield}%</span> },
    { label: 'Investment score', render: (p) => (
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-ink">{p.investmentScore}/100</span>
          <div className="w-10 h-1.5 rounded-full bg-surface-strong overflow-hidden">
            <div className="h-full bg-brand" style={{ width: `${p.investmentScore}%` }} />
          </div>
        </div>
      ) },
    { label: 'Risk', render: (p) => <Badge tone={riskTone(p.riskRadar.overallRisk)}>{p.riskRadar.overallRisk}</Badge> },
    { label: t.verdict, render: (p) => <Badge tone={recommendationTone(p.recommendation)}>{p.recommendation}</Badge> },
  ];

  return (
    <div className="space-y-6 pb-4">
      <SectionHeader
        eyebrow="Compare"
        title={t.compare_title}
        subtitle={t.compare_subtitle}
        action={
          <div className="flex items-center gap-2">
            {selectedIds.length < 3 && (
              <Button variant="secondary" onClick={handleAddSlot}>
                <Plus size={15} /> Add 3rd
              </Button>
            )}
            <Button variant="secondary" onClick={() => onNavigate('saved-comparisons')}>
              <BookmarkCheck size={15} /> Saved
            </Button>
          </div>
        }
      />

      {/* Requirements panel */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><Search size={16} /></span>
          <div>
            <h3 className="text-sm font-semibold text-ink">What are you looking for?</h3>
            <p className="text-xs text-ink-3">Set your requirements to find matching properties</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-2">Area / Locality</label>
            <select value={locality} onChange={(e) => setLocality(e.target.value)} className="input">
              {localitiesList.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-ink-2">Budget</label>
              <span className="text-xs font-semibold text-brand">₹{minBudget}L – ₹{maxBudget}L</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={minBudget} onChange={(e) => setMinBudget(Number(e.target.value))} className="input" placeholder="Min ₹L" />
              <input type="number" value={maxBudget} onChange={(e) => setMaxBudget(Number(e.target.value))} className="input" placeholder="Max ₹L" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-2">Type & BHK</label>
            <div className="grid grid-cols-2 gap-2">
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="input">
                <option>Residential</option><option>Commercial</option><option>Land / Plot</option><option>Any Type</option>
              </select>
              <select value={bhk} onChange={(e) => setBhk(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="input">
                <option value="all">All BHK</option><option value="1">1 BHK</option><option value="2">2 BHK</option>
                <option value="3">3 BHK</option><option value="4">4+ BHK</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink-2">Investment goal</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value)} className="input">
              <option>Capital Appreciation</option><option>Rental Income</option><option>Balanced Growth</option>
            </select>
          </div>
        </div>

        <Button className="mt-4 w-full" size="lg" onClick={handleFindMatches} disabled={isSearching}>
          <Search size={16} />
          {isSearching ? 'Finding matching properties…' : 'Find matching properties'}
        </Button>

        {errorMessage && (
          <div className="mt-3 p-3 rounded-lg bg-warn-soft text-warn text-sm">{errorMessage}</div>
        )}
      </Card>

      {/* Property slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {selectedIds.map((currentId, slotIdx) => {
          const currentProp = availableProperties.find((p) => p.id === currentId);
          return (
            <Card key={slotIdx} padded={false} className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">Slot {String.fromCharCode(65 + slotIdx)}</span>
                {selectedIds.length > 2 && (
                  <button onClick={() => handleRemoveSlot(slotIdx)} className="text-xs text-ink-3 hover:text-neg cursor-pointer flex items-center gap-0.5">
                    <X size={12} /> Remove
                  </button>
                )}
              </div>
              {currentProp ? (
                <button
                  onClick={() => onSelectProperty(currentProp)}
                  className="w-full text-left text-sm font-medium text-ink hover:text-brand truncate cursor-pointer"
                >
                  {currentProp.title}
                </button>
              ) : (
                <select value={currentId} onChange={(e) => handleSelectSlot(slotIdx, e.target.value)} className="input">
                  {availableProperties.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} ({formatInrLakhs(p.askingPriceLakhs)})</option>
                  ))}
                </select>
              )}
            </Card>
          );
        })}
      </div>

      {/* Comparison table */}
      {selectedProps.length > 0 && (
        <Card padded={false} className="overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-line">
            <span className="w-8 h-8 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><Scale size={16} /></span>
            <h3 className="text-sm font-semibold text-ink">Side-by-side comparison</h3>
            {isComparing && <span className="text-xs text-ink-3">updating…</span>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface-soft/60">
                  <th className="p-4 text-left font-medium text-ink-3 w-44">Metrics</th>
                  {selectedProps.map((p, i) => (
                    <th key={p.id} className={clsx('p-4 text-left', bestProperty?.id === p.id && 'bg-brand-soft/40')}>
                      <div className="flex items-center gap-1.5">
                        {bestProperty?.id === p.id && <Trophy size={14} className="text-warn" />}
                        <span className="font-semibold text-ink">{p.location}</span>
                      </div>
                      <span className="text-xs text-ink-3">{p.title}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {metricRows.map((row, ri) => (
                  <tr key={ri}>
                    <td className="p-4 text-ink-3">{row.label}</td>
                    {selectedProps.map((p) => (
                      <td key={p.id} className={clsx('p-4', bestProperty?.id === p.id && 'bg-brand-soft/40')}>
                        {row.render(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Best pick banner */}
      {bestProperty && (
        <div className="rv-card p-5 border-l-4 border-l-brand flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center shrink-0">
              <Trophy size={20} />
            </span>
            <div>
              <p className="section-eyebrow mb-1">RealVest top pick</p>
              <h3 className="text-base font-semibold text-ink">{bestProperty.title}</h3>
              <p className="text-sm text-ink-2 mt-1">
                Top risk-adjusted return ({bestProperty.annualYield}% rental yield, est. value {formatInrLakhs(bestProperty.fairValueLakhs)}).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" onClick={handleSaveComparison} disabled={isSaving}>
              <Bookmark size={15} /> {isSaving ? 'Saving…' : 'Save Comparison'}
            </Button>
            <Button onClick={() => onSelectProperty(bestProperty)}>
              Inspect <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      )}

      {saveSuccessMsg && (
        <div className="p-3 rounded-lg bg-pos-soft text-pos text-sm flex items-center justify-between gap-3 rv-fade-in">
          <span>{saveSuccessMsg}</span>
          <button onClick={() => onNavigate('saved-comparisons')} className="underline font-medium cursor-pointer">View saved →</button>
        </div>
      )}
    </div>
  );
};
