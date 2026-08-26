import React, { useState } from 'react';
import type { Property, AssetCategory } from '../../types';
import { Search, MapPin, ArrowUpRight, Sparkles } from 'lucide-react';

interface ExplorerViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({
  properties,
  onSelectProperty,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Assets');

  const categories = ['All Assets', 'Commercial', 'Residential'];

  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All Assets' ||
      prop.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-5 pb-20 max-w-5xl mx-auto">
      {/* Search Input Bar */}
      <div className="relative w-full">
        <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search markets, assets, or ZIP..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-emerald-500/40 transition-all shadow-sm"
        />
      </div>

      {/* Filter Chips Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 dark:bg-emerald-500/20 text-white dark:text-emerald-400 border border-blue-600 dark:border-emerald-500/40 shadow-sm'
                  : 'bg-white dark:bg-[#102034] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Property Cards Stack / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034]">
            <p className="text-slate-400 font-mono text-sm">
              No properties matched your search query. Try expanding your search terms.
            </p>
          </div>
        ) : (
          filteredProperties.map((prop) => (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop)}
              className="group rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 transform hover:scale-[1.01] cursor-pointer flex flex-col justify-between"
            >
              {/* Photo Container */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                <img
                  src={prop.imageUrl}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#031427]/70 via-transparent to-transparent" />

                {/* Top-Right Match Badge (Matching Screenshot 5) */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 dark:bg-emerald-500/20 text-white dark:text-emerald-400 border border-emerald-400/40 backdrop-blur-md font-mono text-xs font-bold shadow-md flex items-center gap-1">
                    <Sparkles size={13} /> Match {prop.matchPercentage}%
                  </span>
                </div>

                {/* Top-Left Code Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-white font-mono text-[10px] font-bold border border-white/10">
                    {prop.code}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {prop.title}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                    <MapPin size={14} className="text-slate-400 shrink-0" />
                    <span>{prop.location}, {prop.city}</span>
                  </div>
                </div>

                {/* Numbers Grid */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">EST. VALUE</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      ${(prop.fairValueLakhs / 100).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">PROJ. ROI</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      ↗ ~{prop.annualYield}%
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
