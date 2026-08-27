import React, { useState, useEffect } from 'react';
import type { Property, NavTab } from '../../types';
import {
  MapPin,
  Sliders,
  Heart,
  Scale,
  Wallet,
  TrendingUp,
  ShieldCheck,
  Lightbulb,
  ChevronRight,
  Trophy,
  Search,
  Bookmark,
  BookmarkCheck,
  Plus,
  X,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { formatInrLakhs, formatInrRent } from '../../utils/currency';
import { comparisonApi } from '../../services/api/comparisonApi';
import { propertyApi } from '../../services/api/propertyApi';
import { Button } from '../ui/Button';
import { Badge, recommendationTone, riskTone } from '../ui/Badge';
import { Stat } from '../ui/Stat';
import { Card } from '../ui/Card';
import { clsx } from 'clsx';

interface PropertyAnalysisViewProps {
  property: Property;
  properties?: Property[];
  onSelectProperty?: (property: Property) => void;
  onBack: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const PropertyAnalysisView: React.FC<PropertyAnalysisViewProps> = ({
  property,
  properties = [],
  onSelectProperty,
  onBack,
  onNavigate,
}) => {
  const { t } = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState<'analysis' | 'compare'>('analysis');
  const [saved, setSaved] = useState(false);

  // ----------------------------------------------------
  // Comparison State (Merged into Analysis Workspace)
  // ----------------------------------------------------
  const [locality, setLocality] = useState<string>(property.location || 'Whitefield');
  const [minBudget, setMinBudget] = useState<number>(Math.max(15, Math.floor(property.askingPriceLakhs * 0.7)));
  const [maxBudget, setMaxBudget] = useState<number>(Math.ceil(property.askingPriceLakhs * 1.3));
  const [propertyType, setPropertyType] = useState<string>('Residential');
  const [bhk, setBhk] = useState<number | 'all'>('all');
  const [goal, setGoal] = useState<string>('Capital Appreciation');
  const [risk, setRisk] = useState<string>('Moderate');
  const [holdingPeriod, setHoldingPeriod] = useState<string>('3–5 years');

  const availableProperties = properties.length > 0 ? properties : [property];
  const otherProperty = availableProperties.find((p) => p.id !== property.id) || property;

  const [selectedIds, setSelectedIds] = useState<string[]>([property.id, otherProperty.id]);
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

  // Run comparison when comparison IDs change
  const runComparison = async (ids: string[]) => {
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
      console.warn('Backend compare endpoint fallback to local scoring calculation.');
      setBackendComparison(null);
    } finally {
      setIsComparing(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'compare' && selectedIds.length > 0) {
      runComparison(selectedIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds, activeSubTab]);

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
        const nextIds = [property.id, ...candidates.filter((c) => c.id !== property.id).slice(0, 1).map((c) => c.id)];
        setSelectedIds(nextIds);
        await runComparison(nextIds);
      } else {
        setErrorMessage('No exact matches found for your criteria. Showing closest available Bengaluru properties.');
      }
    } catch (err: any) {
      console.warn('Fallback to cached listings:', err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const selectedProps = selectedIds
    .map((id) => availableProperties.find((p) => p.id === id))
    .filter(Boolean) as Property[];

  const bestProperty =
    backendComparison?.top_pick ||
    [...selectedProps].sort((a, b) => b.investmentScore - a.investmentScore)[0] ||
    property;

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
      const title = `${locality} Comparison (${selectedProps.length} assets)`;
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

      setSaveSuccessMsg('Comparison saved successfully to your workspace.');
      setTimeout(() => setSaveSuccessMsg(null), 5000);
    } catch (err: any) {
      setErrorMessage("Couldn't save this comparison scenario. Please try again.");
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // ----------------------------------------------------
  // Single Property Analysis Metrics
  // ----------------------------------------------------
  const diffPct = ((property.askingPriceLakhs - property.fairValueLakhs) / property.fairValueLakhs) * 100;
  const isDiscount = diffPct < 0;

  const riskCategories = [
    { name: 'Price Valuation', level: isDiscount ? 'LOW' : 'MEDIUM', desc: isDiscount ? 'Priced below comparable sales.' : 'Slight premium to sub-market median.' },
    { name: 'Rental Cash Flow', level: property.annualYield >= 4.0 ? 'LOW' : 'MEDIUM', desc: `${property.annualYield}% yield vs 3.8% metro benchmark.` },
    { name: 'Market Volatility', level: 'LOW', desc: 'High transaction liquidity in the IT corridor.' },
    { name: 'Infrastructure', level: 'LOW', desc: 'Active metro connectivity and commercial hubs.' },
    { name: 'Data Confidence', level: property.confidenceScore >= 80 ? 'HIGH' : 'MEDIUM', desc: `${property.confidenceScore}% model confidence.` },
  ];

  const gaugeColor = property.recommendation === 'BUY' ? 'var(--success)' : property.recommendation === 'HOLD' ? 'var(--warning)' : 'var(--danger)';
  const gaugeRadius = 52;
  const gaugeC = 2 * Math.PI * gaugeRadius;
  const gaugeOffset = gaugeC - (property.confidenceScore / 100) * gaugeC;

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
    { label: 'Risk', render: (p) => <Badge tone={riskTone(p.riskRadar?.overallRisk || 'Low')}>{p.riskRadar?.overallRisk || 'Low'}</Badge> },
    { label: t.verdict, render: (p) => <Badge tone={recommendationTone(p.recommendation)}>{p.recommendation}</Badge> },
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Workspace Header & Action Switcher */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <button onClick={onBack} className="-ml-2 text-sm font-medium text-ink-3 hover:text-ink flex items-center gap-1 cursor-pointer">
            <ChevronRight size={14} className="rotate-180" /> {t.back_to_assets}
          </button>

          {/* Sub-workspace Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-surface border border-line">
            <button
              onClick={() => setActiveSubTab('analysis')}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
                activeSubTab === 'analysis' ? 'bg-brand text-white shadow-sm' : 'text-ink-3 hover:text-ink'
              )}
            >
              <Layers size={13} />
              <span>Asset Analysis</span>
            </button>
            <button
              onClick={() => setActiveSubTab('compare')}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
                activeSubTab === 'compare' ? 'bg-brand text-white shadow-sm' : 'text-ink-3 hover:text-ink'
              )}
            >
              <Scale size={13} />
              <span>Compare Properties</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <Badge tone={recommendationTone(property.recommendation)}>{property.recommendation}</Badge>
              <span className="text-xs text-ink-3">{property.category}{property.bhk ? ` · ${property.bhk} BHK` : ''}</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">{property.title}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-2">
              <MapPin size={15} className="text-ink-3" />
              {property.location}, {property.city}
              {property.sqft > 0 && <span className="text-ink-3"> · {property.sqft.toLocaleString('en-IN')} sqft</span>}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" onClick={() => setSaved(!saved)}>
              <Heart size={15} className={saved ? 'text-neg fill-neg' : ''} />
              {saved ? 'Saved' : 'Save'}
            </Button>
            <Button
              variant={activeSubTab === 'compare' ? 'primary' : 'secondary'}
              onClick={() => setActiveSubTab(activeSubTab === 'compare' ? 'analysis' : 'compare')}
            >
              <Scale size={15} /> {activeSubTab === 'compare' ? 'Back to Analysis' : 'Compare'}
            </Button>
            <Button onClick={() => onNavigate('simulator')}>
              <Sliders size={15} /> Simulate
            </Button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* MODE 1: SINGLE PROPERTY ANALYSIS VIEW */}
      {/* ==================================================== */}
      {activeSubTab === 'analysis' && (
        <div className="space-y-6 rv-fade-in">
          {/* Hero image / gallery */}
          <div className="rounded-xl overflow-hidden aspect-[16/8] sm:aspect-[21/9] bg-surface-strong">
            <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
          </div>

          {/* Investment summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat
              label="Asking Price"
              value={formatInrLakhs(property.askingPriceLakhs)}
              icon={Wallet}
              iconTone="neutral"
            />
            <Stat
              label="Estimated Value"
              value={formatInrLakhs(property.fairValueLakhs)}
              valueClassName="text-brand"
              icon={TrendingUp}
              iconTone="brand"
            />
            <Stat
              label="Expected Rent"
              value={formatInrRent(property.monthlyRent)}
              hint={`${property.annualYield.toFixed(1)}% rental yield`}
              icon={Wallet}
              iconTone="pos"
            />
            <Stat
              label="Projected ROI"
              value={`${property.annualYield.toFixed(1)}%`}
              hint="Annualized yield"
              icon={TrendingUp}
              iconTone="pos"
            />
          </div>

          {/* AI Decision + Risk */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* AI Decision */}
            <Card className="lg:col-span-5">
              <div className="flex items-center justify-between mb-4">
                <p className="section-eyebrow">AI Decision</p>
                <Badge tone={recommendationTone(property.recommendation)}>{property.recommendation}</Badge>
              </div>

              <div className="flex items-center gap-5">
                <div className="relative w-32 h-32 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={gaugeRadius} stroke="var(--surface-strong)" strokeWidth="9" fill="none" />
                    <circle
                      cx="60" cy="60" r={gaugeRadius} stroke={gaugeColor} strokeWidth="9" strokeLinecap="round"
                      strokeDasharray={gaugeC} strokeDashoffset={gaugeOffset} fill="none"
                      style={{ transition: 'stroke-dashoffset 0.7s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold text-ink">{property.confidenceScore}%</span>
                    <span className="text-[10px] uppercase tracking-wide text-ink-3">{t.confidence}</span>
                  </div>
                </div>

                <div className="space-y-2 min-w-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-3">Investment fit</span>
                    <span className="font-semibold text-ink">{property.investmentScore}/100</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-strong overflow-hidden">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${property.investmentScore}%` }} />
                  </div>
                  <div className="pt-2 border-t border-line">
                    <span className="text-xs text-ink-3">Valuation spread</span>
                    <p className={clsx('text-sm font-semibold', isDiscount ? 'text-pos' : 'text-warn')}>
                      {isDiscount ? `${Math.abs(diffPct).toFixed(1)}% underpriced` : `+${diffPct.toFixed(1)}% overpriced`}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Why recommendation */}
            <Card className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><Lightbulb size={16} /></span>
                <h3 className="text-sm font-semibold text-ink">Why this recommendation</h3>
              </div>
              <ul className="space-y-2.5">
                {property.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-ink-2 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Risk assessment */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-warn-soft text-warn flex items-center justify-center"><ShieldCheck size={16} /></span>
              <h3 className="text-sm font-semibold text-ink">Risk assessment</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {riskCategories.map((r, idx) => {
                return (
                  <div key={idx} className="rounded-lg border border-line p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">{r.name}</span>
                      <Badge tone={r.level === 'LOW' ? 'pos' : 'warn'} className="!bg-surface-soft !text-ink-2">{r.level}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-ink-3">{r.desc}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODE 2: IN-PAGE PROPERTY COMPARISON WORKSPACE */}
      {/* ==================================================== */}
      {activeSubTab === 'compare' && (
        <div className="space-y-6 rv-fade-in">
          {/* Search requirements panel */}
          <Card>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><Search size={16} /></span>
                <div>
                  <h3 className="text-sm font-semibold text-ink">Compare Against Market Benchmark</h3>
                  <p className="text-xs text-ink-3">Find and compare properties in {locality} or other corridors</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedIds.length < 3 && (
                  <Button variant="secondary" size="sm" onClick={handleAddSlot}>
                    <Plus size={14} /> Add 3rd Slot
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => onNavigate('saved-comparisons')}>
                  <BookmarkCheck size={14} /> Saved
                </Button>
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
                  <label className="text-xs font-semibold text-ink-2">Budget Range</label>
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
                <label className="text-xs font-semibold text-ink-2">Investment Goal</label>
                <select value={goal} onChange={(e) => setGoal(e.target.value)} className="input">
                  <option>Capital Appreciation</option><option>Rental Income</option><option>Balanced Growth</option>
                </select>
              </div>
            </div>

            <Button className="mt-4 w-full" size="lg" onClick={handleFindMatches} disabled={isSearching}>
              <Search size={16} />
              {isSearching ? 'Finding matching properties…' : 'Find & Compare Matching Properties'}
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
                <Card key={slotIdx} padded={false} className="p-3.5 border-line">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">
                      Slot {String.fromCharCode(65 + slotIdx)} {slotIdx === 0 ? '(Current Asset)' : ''}
                    </span>
                    {selectedIds.length > 2 && (
                      <button onClick={() => handleRemoveSlot(slotIdx)} className="text-xs text-ink-3 hover:text-neg cursor-pointer flex items-center gap-0.5">
                        <X size={12} /> Remove
                      </button>
                    )}
                  </div>
                  {currentProp ? (
                    <div className="space-y-1">
                      <div className="font-semibold text-sm text-ink truncate">{currentProp.title}</div>
                      <div className="text-xs text-ink-3 flex items-center justify-between">
                        <span>{currentProp.location}</span>
                        <span className="font-mono font-bold text-ink">{formatInrLakhs(currentProp.askingPriceLakhs)}</span>
                      </div>
                    </div>
                  ) : (
                    <select value={currentId} onChange={(e) => handleSelectSlot(slotIdx, e.target.value)} className="input text-xs">
                      {availableProperties.map((p) => (
                        <option key={p.id} value={p.id}>{p.title} ({formatInrLakhs(p.askingPriceLakhs)})</option>
                      ))}
                    </select>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Side-by-Side Comparison Table */}
          {selectedProps.length > 0 && (
            <Card padded={false} className="overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-line">
                <span className="w-8 h-8 rounded-lg bg-brand-soft text-brand flex items-center justify-center"><Scale size={16} /></span>
                <h3 className="text-sm font-semibold text-ink">Side-by-side comparison</h3>
                {isComparing && <span className="text-xs text-ink-3">updating metrics…</span>}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line bg-surface-soft/60">
                      <th className="p-4 text-left font-medium text-ink-3 w-44">Metrics</th>
                      {selectedProps.map((p) => (
                        <th key={p.id} className={clsx('p-4 text-left', bestProperty?.id === p.id && 'bg-brand-soft/40')}>
                          <div className="flex items-center gap-1.5">
                            {bestProperty?.id === p.id && <Trophy size={14} className="text-warn" />}
                            <span className="font-semibold text-ink">{p.location}</span>
                          </div>
                          <span className="text-xs text-ink-3 block font-normal truncate max-w-[180px]">{p.title}</span>
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

          {/* Top Pick Banner */}
          {bestProperty && (
            <div className="rv-card p-5 border-l-4 border-l-brand flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center shrink-0">
                  <Trophy size={20} />
                </span>
                <div>
                  <p className="section-eyebrow mb-1">RealVest Top Decision Pick</p>
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
                {onSelectProperty && (
                  <Button onClick={() => { onSelectProperty(bestProperty); setActiveSubTab('analysis'); }}>
                    Inspect <ArrowRight size={15} />
                  </Button>
                )}
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
      )}
    </div>
  );
};
