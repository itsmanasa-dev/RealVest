import React, { useState } from 'react';
import type { Property, AssetCategory } from '../../types';
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
  Check,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { formatInrLakhs } from '../../utils/currency';

interface ExplorerViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({
  properties,
  onSelectProperty,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Filter States
  const [selectedCity, setSelectedCity] = useState<string>('All Bengaluru');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [minRoi, setMinRoi] = useState<number>(0);
  const [maxPriceLakhs, setMaxPriceLakhs] = useState<number>(300);
  const [minPriceLakhs, setMinPriceLakhs] = useState<number>(20);

  const cities = [
    'All Bengaluru',
    'Whitefield',
    'Indiranagar',
    'HSR Layout',
    'Electronic City',
    'Sarjapur Road',
    'Koramangala',
    'Bellandur',
    'Hebbal',
  ];

  const propertyTypes = [
    { id: 'All', label: 'All Types', icon: Home },
    { id: 'Apartments', label: 'Apartments', icon: Building },
    { id: 'Offices', label: 'Offices', icon: Briefcase },
    { id: 'Town Houses', label: 'Town Houses', icon: Home },
    { id: 'Villas', label: 'Villas & Cottages', icon: Trees },
    { id: 'Commercial', label: 'Commercial', icon: Store },
  ];

  const handleResetFilters = () => {
    setSelectedCity('All Bengaluru');
    setSelectedType('All');
    setMinRoi(0);
    setMinPriceLakhs(20);
    setMaxPriceLakhs(300);
    setSearchQuery('');
  };

  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.code.toLowerCase().includes(searchQuery.toLowerCase());

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

  return (
    <div className="space-y-5 pb-12 w-full">
      {/* Header (Screen 2: Explore Property + Filter Button) */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-[#273449]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Property
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filteredProperties.length} properties available in Bengaluru
          </p>
        </div>

        {/* Filter Toggle Button (Top-Right Filter Icon) */}
        <button
          onClick={() => setShowFilterDrawer(true)}
          className="p-2.5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
          title="Open Filters"
        >
          <SlidersHorizontal size={18} />
          {(selectedCity !== 'All Bengaluru' || selectedType !== 'All' || minRoi > 0) && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>
      </div>

      {/* Pill Search Input Bar */}
      <div className="relative w-full">
        <Search size={16} className="absolute left-4 top-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Properties..."
          className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm"
        />
      </div>

      {/* Active Filter Chips Preview */}
      {(selectedCity !== 'All Bengaluru' || selectedType !== 'All' || minRoi > 0) && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Active:</span>
          {selectedCity !== 'All Bengaluru' && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-medium">
              {selectedCity}
            </span>
          )}
          {selectedType !== 'All' && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-medium">
              {selectedType}
            </span>
          )}
          {minRoi > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-medium">
              ROI &ge; {minRoi}%
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-[11px] text-slate-400 hover:text-rose-500 underline ml-2 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* 2-Column Property Card Grid (Screen 2 Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827]">
            <p className="text-slate-400 font-mono text-sm">
              {t.no_properties_found}
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-3 px-4 py-2 rounded-full bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredProperties.map((prop, idx) => {
            const badgeTag = idx % 3 === 0 ? 'Trending' : (idx % 3 === 1 ? 'Available' : 'Closing Soon');
            const badgeClass = idx % 3 === 0
              ? 'bg-blue-600 text-white'
              : (idx % 3 === 1 ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white');

            return (
              <div
                key={prop.id}
                onClick={() => onSelectProperty(prop)}
                className="group rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Photo with Top-Left Floating Badge */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <img
                    src={prop.imageUrl}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Floating Top-Left Status Pill (from Dribbble Screen 2) */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold tracking-wide shadow-md ${badgeClass}`}>
                      {badgeTag}
                    </span>
                  </div>
                </div>

                {/* Card Details: Title on left, Price on right, ROI pill below */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {prop.title}
                    </h4>
                    <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white shrink-0">
                      {formatInrLakhs(prop.askingPriceLakhs)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
                      R.O.I. {prop.annualYield}%
                    </span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                      {prop.location}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Screen 3: Dedicated Interactive Filters Sheet / Drawer Modal */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#273449]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X size={20} />
                </button>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Filters
                </h3>
              </div>

              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* City Dropdown Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                City <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#172033] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none appearance-none cursor-pointer"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <MapPin size={16} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Property Type Grid of Icon Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Property Type:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {propertyTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-50 dark:bg-[#172033] border-slate-200 dark:border-[#273449] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <Icon size={14} />
                      <span className="truncate">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* R.O.I Range Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">R.O.I Range:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-extrabold text-sm">
                  {minRoi}%+
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                step={1}
                value={minRoi}
                onChange={(e) => setMinRoi(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>0%</span>
                <span>5%</span>
                <span>10%</span>
                <span>15%</span>
                <span>20%</span>
                <span>25%+</span>
              </div>
            </div>

            {/* Price Range Slider & Min/Max Inputs */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Price Range:</span>
                <span className="text-slate-900 dark:text-white font-mono font-extrabold text-sm">
                  ₹{minPriceLakhs} L – ₹{maxPriceLakhs} L
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={400}
                step={5}
                value={maxPriceLakhs}
                onChange={(e) => setMaxPriceLakhs(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block">Min. Amount</span>
                  <div className="relative">
                    <input
                      type="number"
                      value={minPriceLakhs}
                      onChange={(e) => setMinPriceLakhs(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#172033] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
                    />
                    <span className="absolute right-3 top-2 text-[10px] font-mono text-slate-400">₹ Lakhs</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block">Max. Amount</span>
                  <div className="relative">
                    <input
                      type="number"
                      value={maxPriceLakhs}
                      onChange={(e) => setMaxPriceLakhs(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#172033] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
                    />
                    <span className="absolute right-3 top-2 text-[10px] font-mono text-slate-400">₹ Lakhs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save / Apply Full-Width Button (Vibrant Green) */}
            <button
              onClick={() => setShowFilterDrawer(false)}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer text-center"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



