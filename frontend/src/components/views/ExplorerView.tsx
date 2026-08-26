import React, { useState } from 'react';
import { Property, AssetCategory } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { Search, MapPin, TrendingUp, SlidersHorizontal, ArrowUpRight } from 'lucide-react';

interface ExplorerViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({
  properties,
  onSelectProperty,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('All Assets');

  const categories: AssetCategory[] = ['All Assets', 'Commercial', 'Residential', 'Industrial'];

  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All Assets' || prop.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Sticky Search & Category Filter Bar */}
      <div className="sticky top-16 z-10 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#102034]/90 backdrop-blur-xl shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search markets, assets, or ZIP (e.g. Austin, ATX-442)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#031427] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-500/40'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Asset Grid Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            SHOWING {filteredProperties.length} INSTITUTIONAL ASSETS
          </span>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034]">
            <p className="text-slate-400 font-mono text-sm">
              No institutional properties matched your search parameters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((prop) => (
              <div
                key={prop.id}
                onClick={() => onSelectProperty(prop)}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] overflow-hidden shadow-sm hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer flex flex-col justify-between"
              >
                {/* 16:9 Photography Card Header */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={prop.imageUrl}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102034] via-transparent to-transparent opacity-80" />

                  {/* Top-Right AI Match Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-mono text-xs font-extrabold shadow-lg shadow-emerald-500/30 flex items-center gap-1">
                      🧠 Match {prop.matchPercentage}%
                    </span>
                  </div>

                  {/* Top-Left Code Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded bg-slate-900/80 text-slate-200 font-mono text-[11px] font-bold border border-slate-700">
                      {prop.code}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-500 mb-1">
                      <span>{prop.category}</span>
                      <span>•</span>
                      <span>{prop.subCategory}</span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug mb-1">
                      {prop.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                      <MapPin size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate">{prop.location}, {prop.city}</span>
                    </div>
                  </div>

                  {/* Numbers Grid */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400">Est. Value</span>
                      <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
                        ${(prop.estimatedValue / 1000000).toFixed(1)}M
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400">Proj. ROI</span>
                      <div className="text-base font-extrabold font-mono text-emerald-500 flex items-center gap-1">
                        {prop.projectedRoi}% <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
