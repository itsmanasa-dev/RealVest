import React, { useState } from 'react';
import type { MarketHotZone, Property } from '../../types';
import { mockProperties } from '../../data/mockProperties';
import { MapPin, Plus, Minus, RotateCcw, TrendingUp, Navigation, ArrowUpRight, Building2, CheckCircle2 } from 'lucide-react';
import { formatPercent, formatInrLakhs, formatInrRent } from '../../utils/currency';
import { useTranslation } from '../../context/LanguageContext';

interface InteractiveMapProps {
  hotZones: MarketHotZone[];
  selectedZone: MarketHotZone;
  onSelectZone: (zone: MarketHotZone) => void;
  properties?: Property[];
  onSelectProperty?: (property: Property) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  hotZones,
  selectedZone,
  onSelectZone,
  properties = mockProperties,
  onSelectProperty,
}) => {
  const { t } = useTranslation();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedPropMarker, setSelectedPropMarker] = useState<Property | null>(null);
  const [userLocation, setUserLocation] = useState<{ x: number; y: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Map coordinate mapping for Bengaluru verified properties
  const propertyCoords: Record<string, { x: number; y: number }> = {
    'prop-wf-001': { x: 76, y: 46 },
    'prop-ind-002': { x: 54, y: 40 },
    'prop-hsr-003': { x: 57, y: 70 },
    'prop-ec-004': { x: 61, y: 88 },
    'prop-sar-005': { x: 74, y: 68 },
    'prop-kor-006': { x: 50, y: 60 },
    'prop-bel-007': { x: 66, y: 56 },
    'prop-heb-008': { x: 42, y: 20 },
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.25));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedPropMarker(null);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationStatus(t.location_denied);
      return;
    }

    setIsLocating(true);
    setLocationStatus(t.locating_user);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        // Map latitude/longitude relative to Bengaluru bounding box
        // Bengaluru bounding box approx: Lat 12.85 to 13.15, Lon 77.45 to 77.75
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const xPct = Math.min(Math.max(((lon - 77.45) / 0.3) * 100, 15), 85);
        const yPct = Math.min(Math.max(((13.15 - lat) / 0.3) * 100, 15), 85);

        setUserLocation({ x: xPct, y: yPct });
        setLocationStatus(t.location_found);
        setTimeout(() => setLocationStatus(null), 4000);
      },
      (error) => {
        setIsLocating(false);
        setLocationStatus(t.location_denied);
        setTimeout(() => setLocationStatus(null), 4000);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  return (
    <div className="relative h-80 sm:h-96 w-full rounded-2xl border border-slate-200 dark:border-[#273449] bg-slate-900 overflow-hidden select-none">
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
          {/* Main Highway Spines */}
          <line x1="50" y1="10" x2="52" y2="90" stroke="#64748b" strokeWidth="0.6" />
          <line x1="15" y1="52" x2="88" y2="48" stroke="#64748b" strokeWidth="0.6" />
          <line x1="55" y1="50" x2="85" y2="85" stroke="#3b82f6" strokeWidth="0.8" />
        </svg>

        {/* Floating Micro-Market Hot Zone Polygons/Hubs */}
        {hotZones.map((zone) => {
          const isSelected = selectedZone.id === zone.id;
          return (
            <div
              key={zone.id}
              onClick={() => {
                onSelectZone(zone);
                setSelectedPropMarker(null);
              }}
              style={{
                left: `${zone.coordinates.x}%`,
                top: `${zone.coordinates.y}%`,
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
            >
              <div className="relative flex items-center justify-center">
                {isSelected && (
                  <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-blue-400 opacity-60" />
                )}
                <div
                  className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-all transform group-hover:scale-110 ${
                    isSelected
                      ? 'bg-blue-600 border-white text-white scale-110 shadow-blue-500/50'
                      : 'bg-[#111827] border-blue-400/80 text-blue-400 hover:border-blue-300 hover:text-white'
                  }`}
                >
                  <MapPin size={15} />
                </div>

                {/* Hover / Active Badge */}
                <div
                  className={`absolute top-9 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold whitespace-nowrap shadow-md transition-opacity pointer-events-none ${
                    isSelected
                      ? 'bg-blue-600 text-white opacity-100'
                      : 'bg-slate-900/90 text-slate-300 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {zone.name.split(' ')[0]}
                </div>
              </div>
            </div>
          );
        })}

        {/* Real Property Markers on Map (Connecting Map directly to Property Data) */}
        {properties.map((prop) => {
          const coords = propertyCoords[prop.id] || { x: 50 + (prop.investmentScore % 25) - 12, y: 50 + (prop.annualYield * 3) - 15 };
          const isPropSelected = selectedPropMarker?.id === prop.id;

          return (
            <div
              key={prop.id}
              onClick={() => setSelectedPropMarker(prop)}
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
            >
              <div className="relative flex items-center justify-center">
                {isPropSelected && (
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-75" />
                )}
                <div
                  className={`relative px-2 py-1 rounded-xl border flex items-center gap-1 shadow-md transition-all transform group-hover:scale-110 ${
                    isPropSelected
                      ? 'bg-emerald-500 border-white text-white font-mono text-[10px] font-extrabold scale-110 shadow-emerald-500/50'
                      : 'bg-[#111827]/90 border-emerald-400/70 text-emerald-400 font-mono text-[9px] font-bold hover:bg-emerald-600 hover:text-white'
                  }`}
                >
                  <Building2 size={12} />
                  <span>{prop.code}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* User Current Location Pin (Browser Geolocation) */}
        {userLocation && (
          <div
            style={{
              left: `${userLocation.x}%`,
              top: `${userLocation.y}%`,
            }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-blue-500 opacity-75" />
              <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-[8px] text-white">
                ●
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Floating Controls Top-Right (Zoom In, Zoom Out, Center, Locate Me) */}
      <div className="absolute top-3 right-3 z-30 flex flex-col gap-2">
        <div className="flex flex-col rounded-2xl bg-[#111827]/90 backdrop-blur-md border border-[#273449] shadow-lg overflow-hidden text-slate-200">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-slate-800 transition-colors border-b border-[#273449] cursor-pointer"
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
          onClick={handleLocateMe}
          disabled={isLocating}
          className={`p-2 rounded-2xl bg-[#111827]/90 backdrop-blur-md border border-[#273449] shadow-lg transition-colors cursor-pointer flex items-center justify-center ${
            isLocating ? 'text-blue-400 animate-pulse' : 'text-blue-400 hover:text-white hover:bg-slate-800'
          }`}
          title={t.locate_me}
        >
          <Navigation size={15} />
        </button>

        <button
          onClick={handleReset}
          className="p-2 rounded-2xl bg-[#111827]/90 backdrop-blur-md border border-[#273449] shadow-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
          title="Center Bengaluru"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Geolocation Status Toast Overlay */}
      {locationStatus && (
        <div className="absolute top-3 left-3 z-30 px-3 py-1.5 rounded-xl bg-[#111827]/90 backdrop-blur-md border border-blue-500/40 text-blue-300 text-[11px] font-mono shadow-lg flex items-center gap-1.5 animate-fadeIn">
          <span>{locationStatus}</span>
        </div>
      )}

      {/* Selected Property Modal / Card Overlay */}
      {selectedPropMarker ? (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-30 p-4 rounded-2xl bg-[#111827]/95 backdrop-blur-md border border-[#273449] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-w-[280px] sm:min-w-[340px]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-400 font-mono text-[10px] font-bold border border-blue-500/30">
                {selectedPropMarker.code}
              </span>
              <span className={`px-2 py-0.5 rounded text-white font-mono text-[10px] font-bold ${
                selectedPropMarker.recommendation === 'BUY' ? 'bg-emerald-600' : 'bg-amber-600'
              }`}>
                {selectedPropMarker.recommendation}
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-white mt-1">
              {selectedPropMarker.title}
            </h4>
            <div className="text-[11px] font-mono text-slate-300 mt-0.5 flex items-center gap-2">
              <span>Asking: {formatInrLakhs(selectedPropMarker.askingPriceLakhs)}</span>
              <span>•</span>
              <span className="text-blue-400">ML Value: {formatInrLakhs(selectedPropMarker.fairValueLakhs)}</span>
            </div>
          </div>

          {onSelectProperty && (
            <button
              onClick={() => onSelectProperty(selectedPropMarker)}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-1 shadow-md cursor-pointer shrink-0"
            >
              <span>{t.inspect_btn}</span>
              <ArrowUpRight size={14} />
            </button>
          )}
        </div>
      ) : (
        /* Default Bottom Information Card Overlay (Selected Zone) */
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 p-3.5 rounded-2xl bg-[#111827]/95 backdrop-blur-md border border-[#273449] shadow-xl flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-white">
                {selectedZone.name}
              </div>
              <div className="text-[11px] font-mono text-blue-400 font-semibold flex items-center gap-1">
                <TrendingUp size={12} /> {formatPercent(selectedZone.growth30d, true)} 30d Velocity • ₹{selectedZone.avgPricePerSqft.toLocaleString('en-IN')}/sqft
              </div>
            </div>
          </div>

          <div className="hidden sm:block pl-4 border-l border-[#273449] text-right">
            <div className="text-[10px] font-mono uppercase text-slate-400">Demand Index</div>
            <div className="text-sm font-extrabold font-mono text-white">
              {selectedZone.demandIndex}/100
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

