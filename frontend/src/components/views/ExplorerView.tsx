import React, { useState } from 'react';
import type { Property, AssetCategory } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { Search, MapPin, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface ExplorerViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({
  properties,
  onSelectProperty,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBhk, setSelectedBhk] = useState<number | 'ALL'>('ALL');
  const [maxBudget, setMaxBudget] = useState<number>(300);
  const [sortBy, setSortBy] = useState<'SCORE' | 'YIELD' | 'PRICE'>('SCORE');

  const filteredProperties = properties
    .filter((prop) => {
      const matchesSearch =
        prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBhk = selectedBhk === 'ALL' || prop.bhk === selectedBhk;
      const matchesBudget = prop.askingPriceLakhs <= maxBudget;

      return matchesSearch && matchesBhk && matchesBudget;
    })
    .sort((a, b) => {
      if (sortBy === 'SCORE') return b.investmentScore - a.investmentScore;
      if (sortBy === 'YIELD') return b.annualYield - a.annualYield;
      return a.askingPriceLakhs - b.askingPriceLakhs;
    });

  return (
    <div className="space-y-6 pb-12">
      {/* Sticky Search & Multi-Filter Control Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#102034]/90 backdrop-blur-xl shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input (5 Cols) */}
          <div className="md:col-span-5 relative w-full">
            <Search size={18} className="absolute left-4 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locality (e.g. Whitefield, Sarjapur Road, HSR)..."
              className="w-full pl-11 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#031427] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* BHK Filter Chips (3 Cols) */}
          <div className="md:col-span-3 flex items-center gap-1.5 overflow-x-auto">
            {(['ALL', 2, 3, 4] as (number | 'ALL')[]).map((bhk) => {
              const isActive = selectedBhk === bhk;
              return (
                <button
                  key={String(bhk)}
                  onClick={() => setSelectedBhk(bhk)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-1 ring-emerald-500/40'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {bhk === 'ALL' ? 'All BHK' : `${bhk} BHK`}
                </button>
              );
            })}
          </div>

          {/* Budget Slider & Sort Dropdown (4 Cols) */}
          <div className="md:col-span-4 flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Budget:</span>
                <span className="text-emerald-500 font-bold">≤ ₹{maxBudget} Lakhs</span>
              </div>
              <input
                type="range"
                min={30}
                max={500}
                step={10}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#031427] text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold focus:outline-none"
            >
              <option value="SCORE">Score (High-Low)</option>
              <option value="YIELD">Yield (High-Low)</option>
              <option value="PRICE">Price (Low-High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Grid Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            SHOWING {filteredProperties.length} VERIFIED PROPERTIES IN BENGALURU
          </span>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034]">
            <p className="text-slate-400 font-mono text-sm">
              No verified listings matched your filter parameters. Try increasing your max budget or searching a different locality.
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
                {/* Photography Header */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={prop.imageUrl}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102034] via-transparent to-transparent opacity-80" />

                  {/* Top-Right Score Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-mono text-xs font-extrabold shadow-lg shadow-emerald-500/30 flex items-center gap-1">
                      Score {prop.investmentScore}/100
                    </span>
                  </div>

                  {/* Top-Left Code Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-slate-900/80 text-slate-200 font-mono text-[11px] font-bold border border-slate-700">
                      {prop.code}
                    </span>
                    <RiskBadge level={prop.riskRadar.overallRisk} />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-500 mb-1">
                      <span>{prop.bhk} BHK</span>
                      <span>•</span>
                      <span>{prop.sqft} SQFT</span>
                      <span>•</span>
                      <span>{prop.location}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug mb-1 truncate">
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
                      <span className="text-[10px] font-mono uppercase text-slate-400">Asking Price</span>
                      <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
                        ₹{prop.askingPriceLakhs} L
                      </div>
                      <div className="text-[10px] text-blue-500 font-mono">
                        ML Fair: ₹{prop.fairValueLakhs} L
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400">Rental Yield</span>
                      <div className="text-base font-extrabold font-mono text-emerald-500 flex items-center gap-1">
                        {prop.annualYield}% <ArrowUpRight size={14} />
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ₹{prop.monthlyRent.toLocaleString()}/mo
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
