import React, { useState, useMemo } from 'react';
import type { Property } from '../../types';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  RotateCcw,
  Building,
  Briefcase,
  Home,
  Store,
  Trees,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { PropertyCard } from '../property/PropertyCard';
import { clsx } from 'clsx';

interface ExplorerViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

const QUICK_AREAS = ['Whitefield', 'Electronic City', 'Sarjapur Road', 'Hebbal', 'HSR Layout', 'Indiranagar', 'Bellandur'];

const PROPERTY_TYPES = [
  { id: 'All', label: 'All Types', icon: Home },
  { id: 'Apartments', label: 'Apartments', icon: Building },
  { id: 'Offices', label: 'Offices', icon: Briefcase },
  { id: 'Villas', label: 'Villas', icon: Trees },
  { id: 'Commercial', label: 'Commercial', icon: Store },
];

export const ExplorerView: React.FC<ExplorerViewProps> = ({
  properties,
  onSelectProperty,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [didFilter, setDidFilter] = useState(false);

  // Filter states
  const [selectedCity, setSelectedCity] = useState<string>('All Bengaluru');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [minRoi, setMinRoi] = useState<number>(0);
  const [maxPriceLakhs, setMaxPriceLakhs] = useState<number>(300);
  const [minPriceLakhs, setMinPriceLakhs] = useState<number>(20);

  const activeFilters = (selectedCity !== 'All Bengaluru' ? 1 : 0) +
    (selectedType !== 'All' ? 1 : 0) + (minRoi > 0 ? 1 : 0);

  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      const matchesSearch =
        prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prop.code || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCity =
        selectedCity === 'All Bengaluru' ||
        prop.location.toLowerCase().includes(selectedCity.toLowerCase()) ||
        prop.city.toLowerCase().includes(selectedCity.toLowerCase());

      const matchesType =
        selectedType === 'All' ||
        (selectedType === 'Apartments' && prop.category === 'Residential') ||
        (selectedType === 'Offices' && prop.category === 'Commercial') ||
        (selectedType === 'Commercial' && prop.category === 'Commercial') ||
        (selectedType === 'Villas' && prop.category.includes('Villa')) ||
        (selectedType === 'Town Houses' && prop.category === 'Residential');

      const matchesRoi = prop.annualYield >= minRoi;
      const matchesPrice = prop.askingPriceLakhs >= minPriceLakhs && prop.askingPriceLakhs <= maxPriceLakhs;

      return matchesSearch && matchesCity && matchesType && matchesRoi && matchesPrice;
    });
  }, [properties, searchQuery, selectedCity, selectedType, minRoi, minPriceLakhs, maxPriceLakhs]);

  const handleResetFilters = () => {
    setSelectedCity('All Bengaluru');
    setSelectedType('All');
    setMinRoi(0);
    setMinPriceLakhs(20);
    setMaxPriceLakhs(300);
    setSearchQuery('');
  };

  const resetToAll = () => {
    setSelectedCity('All Bengaluru');
    setSelectedType('All');
    setMinRoi(0);
  };

  return (
    <div className="space-y-6 pb-4">
      <SectionHeader
        eyebrow="Discover"
        title="Where do you want to invest?"
        subtitle={`${filteredProperties.length} properties available across Bengaluru`}
        action={
          <Button variant="secondary" onClick={() => setShowFilterDrawer(true)}>
            <SlidersHorizontal size={16} />
            Filters
            {activeFilters > 0 && (
              <span className="w-2 h-2 rounded-full bg-brand" />
            )}
          </Button>
        }
      />

      {/* Search */}
      <div className="relative">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search localities, BHK, project names…"
          className="input pl-10 py-3 text-[15px]"
          aria-label="Search properties"
        />
      </div>

      {/* Quick area suggestions */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-3 shrink-0">
          Areas
        </span>
        {QUICK_AREAS.map((area) => {
          const selected = selectedCity === area;
          return (
            <button
              key={area}
              onClick={() => {
                setSelectedCity(selected ? 'All Bengaluru' : area);
                setDidFilter(true);
              }}
              className={clsx(
                'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap cursor-pointer transition-colors',
                selected
                  ? 'bg-brand text-white border-brand'
                  : 'bg-surface border-line text-ink-2 hover:border-line-strong'
              )}
            >
              <MapPin size={12} />
              {area}
            </button>
          );
        })}
      </div>

      {/* Active filter chips */}
      {activeFilters > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {selectedCity !== 'All Bengaluru' && (
            <Badge tone="brand">{selectedCity}<button onClick={resetToAll} className="ml-1 hover:opacity-70"><X size={11} /></button></Badge>
          )}
          {selectedType !== 'All' && (
            <Badge tone="brand">{selectedType}<button onClick={resetToAll} className="ml-1 hover:opacity-70"><X size={11} /></button></Badge>
          )}
          {minRoi > 0 && (
            <Badge tone="brand">ROI ≥ {minRoi}%<button onClick={resetToAll} className="ml-1 hover:opacity-70"><X size={11} /></button></Badge>
          )}
          <button onClick={handleResetFilters} className="text-xs text-ink-3 hover:text-ink underline cursor-pointer">
            Clear all
          </button>
        </div>
      )}

      {/* Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {filteredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} onSelect={onSelectProperty} className="rv-fade-in" />
          ))}
        </div>
      ) : (
        <div className="rv-card p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-surface-soft flex items-center justify-center">
            <Search size={22} className="text-ink-3" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-ink">No matching properties</h3>
          <p className="mt-1 text-sm text-ink-3">No properties match your current filters.</p>
          <Button className="mt-5" onClick={handleResetFilters}>Adjust filters</Button>
        </div>
      )}

      {/* Filter drawer */}
      {showFilterDrawer && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowFilterDrawer(false)}
        >
          <div
            className="w-full sm:max-w-lg rv-card rounded-t-2xl sm:rounded-2xl shadow-pop p-6 space-y-5 max-h-[92vh] overflow-y-auto animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Filters"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => setShowFilterDrawer(false)} className="btn btn-ghost -ml-2 cursor-pointer" aria-label="Close"><X size={18} /></button>
                <h3 className="text-lg font-semibold text-ink">Filters</h3>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs font-medium text-brand hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink-2">Area / Locality</label>
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="input">
                {['All Bengaluru', 'Whitefield', 'Indiranagar', 'HSR Layout', 'Electronic City', 'Sarjapur Road', 'Koramangala', 'Bellandur', 'Hebbal'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink-2">Property type</label>
              <div className="grid grid-cols-3 gap-2">
                {PROPERTY_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={clsx(
                        'px-3 py-2.5 rounded-md border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer',
                        isSelected
                          ? 'bg-brand text-white border-brand'
                          : 'bg-surface border-line text-ink-2 hover:border-line-strong'
                      )}
                    >
                      <Icon size={14} />
                      <span className="truncate">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ROI */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-ink-2">Minimum ROI</label>
                <span className="text-sm font-semibold text-brand">{minRoi}%+</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                step={1}
                value={minRoi}
                onChange={(e) => setMinRoi(Number(e.target.value))}
                style={{ ['--range' as string]: `${(minRoi / 25) * 100}%` }}
              />
              <div className="flex justify-between text-[10px] text-ink-3">
                <span>0%</span><span>10%</span><span>20%</span><span>25%+</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-ink-2">Price range</label>
                <span className="text-sm font-semibold text-ink">₹{minPriceLakhs}L – ₹{maxPriceLakhs}L</span>
              </div>
              <input
                type="range"
                min={20}
                max={400}
                step={5}
                value={maxPriceLakhs}
                onChange={(e) => setMaxPriceLakhs(Number(e.target.value))}
                style={{ ['--range' as string]: `${((maxPriceLakhs - 20) / 380) * 100}%` }}
              />
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] text-ink-3 block mb-1">Min (₹L)</span>
                  <input type="number" value={minPriceLakhs} onChange={(e) => setMinPriceLakhs(Number(e.target.value))} className="input" />
                </div>
                <div>
                  <span className="text-[10px] text-ink-3 block mb-1">Max (₹L)</span>
                  <input type="number" value={maxPriceLakhs} onChange={(e) => setMaxPriceLakhs(Number(e.target.value))} className="input" />
                </div>
              </div>
            </div>

            <Button fullWidth size="lg" onClick={() => setShowFilterDrawer(false)}>
              Show {filteredProperties.length} properties
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
