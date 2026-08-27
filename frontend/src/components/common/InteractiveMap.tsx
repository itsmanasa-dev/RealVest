import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MarketHotZone, Property } from '../../types';
import { mockProperties } from '../../data/mockProperties';
import { getPropertyCoordinate, getHotZoneCoordinate, BENGALURU_CENTER } from '../../services/geoService';
import {
  MapPin,
  Plus,
  Minus,
  RotateCcw,
  TrendingUp,
  Navigation,
  ArrowUpRight,
  Building2,
  Layers,
  Flame,
  Check,
  Eye,
} from 'lucide-react';
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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);

  const [mapStyle, setMapStyle] = useState<'satellite' | 'street'>('satellite');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [selectedPropMarker, setSelectedPropMarker] = useState<Property | null>(properties[0] || null);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Initialize Real Geographic Map (Leaflet)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [BENGALURU_CENTER.lat, BENGALURU_CENTER.lng],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
    });

    // Satellite Imagery Layer (ESRI World Imagery or Mapbox)
    const satelliteUrl = mapboxToken
      ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    const streetUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const baseLayer = L.tileLayer(mapStyle === 'satellite' ? satelliteUrl : streetUrl, {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c', 'd'],
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    const heatmapGroup = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = markersGroup;
    heatmapLayerRef.current = heatmapGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Tile Layer (Satellite vs Street)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Find and remove current tile layer
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const satelliteUrl = mapboxToken
      ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    const streetUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    L.tileLayer(mapStyle === 'satellite' ? satelliteUrl : streetUrl, {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c', 'd'],
    }).addTo(map);
  }, [mapStyle, mapboxToken]);

  // Render Real Property Markers on Geographic Coordinate Points
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    properties.forEach((prop) => {
      const coord = getPropertyCoordinate(prop);
      const isSelected = selectedPropMarker?.id === prop.id;

      // Custom Clean RealVest Marker DivIcon
      const iconHtml = `
        <div class="relative flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
          ${isSelected ? '<span class="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-emerald-400 opacity-75"></span>' : ''}
          <div class="relative px-2.5 py-1 rounded-full border-2 flex items-center gap-1.5 shadow-lg transition-all ${
            isSelected
              ? 'bg-emerald-600 border-white text-white font-mono text-xs font-bold scale-110 shadow-emerald-500/50'
              : 'bg-[#0F172A]/90 border-emerald-400 text-white font-mono text-[11px] font-semibold hover:bg-emerald-600 hover:border-white'
          }">
            <span class="w-1.5 h-1.5 rounded-full ${prop.recommendation === 'BUY' ? 'bg-emerald-400' : 'bg-amber-400'}"></span>
            <span>₹${prop.askingPriceLakhs} L</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-realvest-marker',
        html: iconHtml,
        iconSize: [60, 30],
        iconAnchor: [30, 15],
      });

      const marker = L.marker([coord.lat, coord.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedPropMarker(prop);
        map.flyTo([coord.lat, coord.lng], Math.max(map.getZoom(), 13), { duration: 0.8 });
      });

      marker.addTo(markersGroup);
    });
  }, [properties, selectedPropMarker]);

  // Render Real Market Opportunity Heatmap Circles based on demandIndex and growth
  useEffect(() => {
    const heatmapGroup = heatmapLayerRef.current;
    if (!heatmapGroup) return;

    heatmapGroup.clearLayers();

    if (!showHeatmap) return;

    hotZones.forEach((zone) => {
      const coord = getHotZoneCoordinate(zone);
      const intensity = Math.min(Math.max((zone.demandIndex - 80) / 20, 0.2), 1.0);
      const radiusMeters = 1800 + zone.growth30d * 80;

      // Real Opportunity Heat Radius Circle
      const heatCircle = L.circle([coord.lat, coord.lng], {
        radius: radiusMeters,
        color: zone.growth30d >= 12 ? '#10B981' : '#3B82F6',
        weight: 1.5,
        opacity: 0.6,
        fillColor: zone.growth30d >= 12 ? '#10B981' : '#3B82F6',
        fillOpacity: 0.18 + intensity * 0.12,
      });

      heatCircle.bindTooltip(
        `<b>${zone.name}</b><br/>Demand Index: ${zone.demandIndex}/100<br/>30d Growth: +${zone.growth30d}%`,
        { direction: 'top', className: 'bg-slate-900 text-white rounded-lg text-xs font-mono p-1 border-none shadow-lg' }
      );

      heatCircle.on('click', () => {
        onSelectZone(zone);
      });

      heatCircle.addTo(heatmapGroup);
    });
  }, [hotZones, showHeatmap]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo([BENGALURU_CENTER.lat, BENGALURU_CENTER.lng], 11, { duration: 0.8 });
    setSelectedPropMarker(null);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Location unavailable in browser');
      setTimeout(() => setLocationStatus(null), 3500);
      return;
    }

    setIsLocating(true);
    setLocationStatus('Locating your position...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const map = mapInstanceRef.current;
        if (!map) return;

        if (userMarkerRef.current) {
          map.removeLayer(userMarkerRef.current);
        }

        const userMarker = L.circleMarker([latitude, longitude], {
          radius: 8,
          fillColor: '#3B82F6',
          color: '#FFFFFF',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(map);

        userMarkerRef.current = userMarker;
        map.flyTo([latitude, longitude], 13, { duration: 1 });
        setLocationStatus('My Location located');
        setTimeout(() => setLocationStatus(null), 3500);
      },
      () => {
        setIsLocating(false);
        setLocationStatus('Location access denied');
        setTimeout(() => setLocationStatus(null), 3500);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="relative w-full h-[460px] sm:h-[540px] rounded-3xl border border-slate-200 dark:border-[#273449] bg-slate-950 overflow-hidden shadow-sm select-none">
      {/* Real Geographic Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top-Left Geographic Status Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Bengaluru Geographic Satellite</span>
        </div>
      </div>

      {/* Map Floating Controls Top-Right (Satellite/Street, Heatmap, Zoom, Locate, Recenter) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Style & Heatmap Switchers */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 shadow-xl text-white">
          <button
            onClick={() => setMapStyle(mapStyle === 'satellite' ? 'street' : 'satellite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mapStyle === 'satellite'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Satellite / Street Map"
          >
            <Layers size={13} />
            <span className="uppercase">{mapStyle}</span>
          </button>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showHeatmap
                ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Opportunity Heatmap"
          >
            <Flame size={13} />
            <span>Heatmap</span>
          </button>
        </div>

        {/* Navigation & Zoom Bar */}
        <div className="flex flex-col rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden text-slate-200 self-end">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-white/15 transition-colors border-b border-white/10 cursor-pointer"
            title="Zoom In"
          >
            <Plus size={15} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-white/15 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <Minus size={15} />
          </button>
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className={`p-2 border-t border-white/10 transition-colors cursor-pointer flex items-center justify-center ${
              isLocating ? 'text-emerald-400 animate-pulse' : 'text-emerald-400 hover:text-white hover:bg-white/15'
            }`}
            title="My Location"
          >
            <Navigation size={15} />
          </button>
          <button
            onClick={handleRecenter}
            className="p-2 border-t border-white/10 text-slate-300 hover:text-white hover:bg-white/15 transition-colors cursor-pointer flex items-center justify-center"
            title="Recenter Bengaluru"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Geolocation Status Toast */}
      {locationStatus && (
        <div className="absolute top-16 left-4 z-20 px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-xl flex items-center gap-1.5 animate-fadeIn">
          <span>{locationStatus}</span>
        </div>
      )}

      {/* Selected Property Preview Sheet (Bottom-Left / Responsive Bottom) */}
      {selectedPropMarker && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-20 p-4 rounded-3xl bg-slate-950/95 backdrop-blur-md border border-white/20 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-lg">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 font-mono text-[10px] font-bold border border-white/10">
                {selectedPropMarker.code}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-white font-mono text-[10px] font-bold ${
                selectedPropMarker.recommendation === 'BUY' ? 'bg-emerald-600' : 'bg-amber-600'
              }`}>
                {selectedPropMarker.recommendation}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                {selectedPropMarker.annualYield}% ROI
              </span>
            </div>

            <h4 className="text-sm font-bold text-white tracking-tight truncate">
              {selectedPropMarker.title}
            </h4>

            <div className="text-xs text-slate-300 flex items-center gap-2 font-mono">
              <span>Asking: {formatInrLakhs(selectedPropMarker.askingPriceLakhs)}</span>
              <span>•</span>
              <span className="text-emerald-400">ML: {formatInrLakhs(selectedPropMarker.fairValueLakhs)}</span>
            </div>
          </div>

          {onSelectProperty && (
            <button
              onClick={() => onSelectProperty(selectedPropMarker)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25 cursor-pointer shrink-0 transition-all"
            >
              <span>View Analysis</span>
              <ArrowUpRight size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
