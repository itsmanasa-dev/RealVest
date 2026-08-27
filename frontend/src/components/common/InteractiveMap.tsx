import React, { useState } from 'react';
import type { MarketHotZone } from '../../types';
import { MapPin, Plus, Minus, RotateCcw, TrendingUp, DollarSign } from 'lucide-react';
import { formatPercent } from '../../utils/currency';

interface InteractiveMapProps {
  hotZones: MarketHotZone[];
  selectedZone: MarketHotZone;
  onSelectZone: (zone: MarketHotZone) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  hotZones,
  selectedZone,
  onSelectZone,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.0));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative h-72 sm:h-80 w-full rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-slate-900 overflow-hidden select-none">
      {/* Bengaluru City Topology SVG Layer */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
        }}
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

        {/* Vector Arterials & Ring Roads */}
        <svg className="w-full h-full absolute inset-0 opacity-30 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Outer Ring Road (ORR) Loop */}
          <ellipse cx="56" cy="50" rx="28" ry="32" fill="none" stroke="#3b82f6" strokeWidth="0.8" strokeDasharray="2,2" />
          {/* Peripheral Ring Road */}
          <ellipse cx="55" cy="50" rx="42" ry="44" fill="none" stroke="#10b981" strokeWidth="0.6" strokeDasharray="3,3" />
          {/* Main Highway Spines (Hosur Rd, Bellary Rd, Old Madras Rd, Mysore Rd) */}
          <line x1="50" y1="10" x2="52" y2="90" stroke="#64748b" strokeWidth="0.6" />
          <line x1="15" y1="52" x2="88" y2="48" stroke="#64748b" strokeWidth="0.6" />
          <line x1="55" y1="50" x2="85" y2="85" stroke="#3b82f6" strokeWidth="0.8" />
        </svg>

        {/* Floating Hot Zone Markers */}
        {hotZones.map((zone) => {
          const isSelected = selectedZone.id === zone.id;
          return (
            <div
              key={zone.id}
              onClick={() => onSelectZone(zone)}
              style={{
                left: `${zone.coordinates.x}%`,
                top: `${zone.coordinates.y}%`,
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
            >
              <div className="relative flex items-center justify-center">
                {isSelected && (
                  <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-emerald-400 opacity-75" />
                )}
                <div
                  className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-all transform group-hover:scale-110 ${
                    isSelected
                      ? 'bg-emerald-500 border-white text-white scale-110 shadow-emerald-500/50'
                      : 'bg-[#102034] border-blue-400/80 text-blue-400 hover:border-emerald-400 hover:text-emerald-400'
                  }`}
                >
                  <MapPin size={15} />
                </div>

                {/* Hover / Active Badge */}
                <div
                  className={`absolute top-9 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold whitespace-nowrap shadow-md transition-opacity pointer-events-none ${
                    isSelected
                      ? 'bg-emerald-500 text-white opacity-100'
                      : 'bg-slate-900/90 text-slate-300 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {zone.name.split(' ')[0]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Floating Controls Top-Right */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <div className="flex flex-col rounded-2xl bg-[#102034]/90 backdrop-blur-md border border-slate-700/80 shadow-lg overflow-hidden text-slate-200">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-slate-800 transition-colors border-b border-slate-700/80 cursor-pointer"
            title="Zoom In"
          >
            <Plus size={15} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <Minus size={15} />
          </button>
        </div>
        <button
          onClick={handleReset}
          className="p-2 rounded-2xl bg-[#102034]/90 backdrop-blur-md border border-slate-700/80 shadow-lg text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
          title="Center Bengaluru"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Bottom Information Card Overlay */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 p-3.5 rounded-2xl bg-[#102034]/95 backdrop-blur-md border border-slate-700/80 shadow-xl flex items-center justify-between sm:justify-start gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <MapPin size={18} />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-extrabold text-white">
              {selectedZone.name}
            </div>
            <div className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp size={12} /> {formatPercent(selectedZone.growth30d, true)} 30d Velocity • ₹{selectedZone.avgPricePerSqft.toLocaleString('en-IN')}/sqft
            </div>
          </div>
        </div>

        <div className="hidden sm:block pl-4 border-l border-slate-700/80 text-right">
          <div className="text-[10px] font-mono uppercase text-slate-400">Demand Index</div>
          <div className="text-sm font-extrabold font-mono text-white">
            {selectedZone.demandIndex}/100
          </div>
        </div>
      </div>
    </div>
  );
};
