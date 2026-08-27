import React, { useState } from 'react';
import type { Property, AssetCategory } from '../../types';
import { Search, MapPin, ArrowUpRight, Sparkles, Filter } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { formatInrLakhs, formatInrRent } from '../../utils/currency';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('All Assets');
  const [selectedBhk, setSelectedBhk] = useState<number | 'all'>('all');

  const categories = [
    { key: 'All Assets', label: t.all_assets },
    { key: 'Residential', label: t.residential },
    { key: 'Commercial', label: t.commercial },
    { key: 'Villa / Penthouse', label: t.villas },
  ];

  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All Assets' ||
      prop.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesBhk = selectedBhk === 'all' || prop.bhk === selectedBhk;

    return matchesSearch && matchesCategory && matchesBhk;
  });

  return (
    <div className="space-y-5 pb-12 w-full">
      {/* Header & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-200 dark:border-[#273449]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
            {t.explore_title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filteredProperties.length} verified listings across active Bengaluru corridors
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full">
        <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.search_placeholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-sm"
        />
      </div>

      {/* Filter Row: Category Chips + BHK Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#273449] hover:bg-slate-50 dark:hover:bg-[#172033]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* BHK Filter */}
        <div className="flex items-center gap-1 text-xs font-mono shrink-0">
          <span className="text-slate-400 mr-1">BHK:</span>
          {(['all', 2, 3, 4] as const).map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBhk(b)}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                selectedBhk === b
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-[#172033] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1e2c47] border border-transparent dark:border-[#273449]'
              }`}
            >
              {b === 'all' ? 'All' : `${b} BHK`}
            </button>
          ))}
        </div>
      </div>

      {/* Property Cards Stack / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full p-10 text-center rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827]">
            <p className="text-slate-400 font-mono text-sm">
              {t.no_properties_found}
            </p>
          </div>
        ) : (
          filteredProperties.map((prop) => (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop)}
              className="group rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] overflow-hidden shadow-sm hover:border-blue-500/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Photo Container */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                <img
                  src={prop.imageUrl}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/75 via-transparent to-transparent" />

                {/* Top-Right Match Badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/90 dark:bg-emerald-500/20 text-white dark:text-emerald-400 border border-emerald-400/40 backdrop-blur-md font-mono text-[10px] font-medium flex items-center gap-1">
                    <Sparkles size={11} /> {prop.matchPercentage}%
                  </span>
                </div>

                {/* Top-Left Code Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-900/80 text-white font-mono text-[10px] font-medium border border-white/10">
                    {prop.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-white font-mono text-[10px] font-semibold ${
                    prop.recommendation === 'BUY' ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}>
                    {prop.recommendation}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {prop.title}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{prop.location}, {prop.city}</span>
                    {prop.bhk > 0 && <span className="ml-1 px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#172033] text-[10px] font-medium shrink-0">{prop.bhk} BHK</span>}
                  </div>
                </div>

                {/* Numbers Grid */}
                <div className="pt-2.5 border-t border-slate-100 dark:border-[#273449] grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">{t.asking_price}</span>
                    <div className="text-sm font-semibold font-mono text-slate-900 dark:text-white">
                      {formatInrLakhs(prop.askingPriceLakhs)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">{t.est_value}</span>
                    <div className="text-sm font-semibold font-mono text-blue-600 dark:text-blue-400">
                      {formatInrLakhs(prop.fairValueLakhs)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">{t.proj_roi}</span>
                    <div className="text-sm font-semibold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      {prop.annualYield}% <ArrowUpRight size={12} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


