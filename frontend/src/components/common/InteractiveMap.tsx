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
  Layers,
  Flame,
} from 'lucide-react';
import { formatInrLakhs } from '../../utils/currency';
import { Badge, recommendationTone } from '../ui/Badge';

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);

  const [mapStyle, setMapStyle] = useState<'satellite' | 'street'>('street');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [selectedPropMarker, setSelectedPropMarker] = useState<Property | null>(properties[0] || null);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [BENGALURU_CENTER.lat, BENGALURU_CENTER.lng],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
    });

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

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

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

  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    properties.forEach((prop) => {
      const coord = getPropertyCoordinate(prop);
      const isSelected = selectedPropMarker?.id === prop.id;
      const isBuy = prop.recommendation === 'BUY';

      const iconHtml = `
        <div class="relative flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
          ${isSelected ? '<span class="animate-ping absolute inline-flex h-9 w-9 rounded-full opacity-50" style="background: var(--rv-pos)"></span>' : ''}
          <div class="relative px-2.5 py-1 rounded-full border-2 flex items-center gap-1.5 shadow-lg transition-all ${
            isSelected
              ? 'scale-110 text-white font-mono text-xs font-bold'
              : 'text-white font-mono text-[11px] font-semibold'
          }" style="background: ${isBuy ? 'var(--rv-pos)' : '#0F172A'}70; border-color: ${isSelected ? '#fff' : 'var(--rv-pos)'}">
            <span class="w-1.5 h-1.5 rounded-full" style="background: ${isBuy ? '#fff' : '#FBBF24'}"></span>
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

  useEffect(() => {
    const heatmapGroup = heatmapLayerRef.current;
    if (!heatmapGroup) return;

    heatmapGroup.clearLayers();

    if (!showHeatmap) return;

    hotZones.forEach((zone) => {
      const coord = getHotZoneCoordinate(zone);
      const intensity = Math.min(Math.max((zone.demandIndex - 80) / 20, 0.2), 1.0);
      const radiusMeters = 1800 + zone.growth30d * 80;
      const isHot = zone.growth30d >= 12;

      const heatCircle = L.circle([coord.lat, coord.lng], {
        radius: radiusMeters,
        color: isHot ? 'var(--rv-pos)' : 'var(--rv-brand)',
        weight: 1.5,
        opacity: 0.6,
        fillColor: isHot ? 'var(--rv-pos)' : 'var(--rv-brand)',
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
          fillColor: '#2563EB',
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
    <div className="relative w-full h-[460px] sm:h-[540px] rounded-2xl border border-line bg-canvas overflow-hidden shadow-card select-none">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-full bg-canvas/85 backdrop-blur-md border border-line text-ink text-xs font-medium flex items-center gap-2 shadow-card">
          <span className="w-2 h-2 rounded-full bg-pos animate-pulse" />
          <span>Bengaluru Market Intelligence</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-canvas/90 backdrop-blur-md border border-line shadow-card text-ink">
          <button
            onClick={() => setMapStyle(mapStyle === 'satellite' ? 'street' : 'satellite')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mapStyle === 'satellite' ? 'bg-brand text-white shadow-sm' : 'text-ink-3 hover:text-ink hover:bg-surface'
            }`}
            title="Toggle Satellite / Street Map"
          >
            <Layers size={13} />
            <span className="uppercase">{mapStyle}</span>
          </button>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showHeatmap ? 'bg-brand-soft text-brand' : 'text-ink-3 hover:text-ink hover:bg-surface'
            }`}
            title="Toggle Opportunity Heatmap"
          >
            <Flame size={13} />
            <span>Heatmap</span>
          </button>
        </div>

        <div className="flex flex-col rounded-xl bg-canvas/90 backdrop-blur-md border border-line shadow-card overflow-hidden text-ink-2 self-end">
          <button onClick={handleZoomIn} className="p-2 hover:bg-surface transition-colors border-b border-line cursor-pointer" title="Zoom In">
            <Plus size={15} />
          </button>
          <button onClick={handleZoomOut} className="p-2 hover:bg-surface transition-colors cursor-pointer" title="Zoom Out">
            <Minus size={15} />
          </button>
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className={`p-2 border-t border-line transition-colors cursor-pointer flex items-center justify-center ${
              isLocating ? 'text-brand animate-pulse' : 'text-brand hover:text-ink hover:bg-surface'
            }`}
            title="My Location"
          >
            <Navigation size={15} />
          </button>
          <button
            onClick={handleRecenter}
            className="p-2 border-t border-line text-ink-3 hover:text-ink hover:bg-surface transition-colors cursor-pointer flex items-center justify-center"
            title="Recenter Bengaluru"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {locationStatus && (
        <div className="absolute top-16 left-4 z-20 px-3 py-1.5 rounded-full bg-canvas/90 backdrop-blur-md border border-brand text-brand text-xs font-medium shadow-card flex items-center gap-1.5 rv-fade-in">
          <MapPin size={12} />
          <span>{locationStatus}</span>
        </div>
      )}

      {selectedPropMarker && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-20 p-4 rounded-xl bg-canvas/95 backdrop-blur-md border border-line shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-lg rv-fade-in">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-surface text-ink-2 font-mono text-[10px] font-bold border border-line">
                {selectedPropMarker.code}
              </span>
              <Badge tone={recommendationTone(selectedPropMarker.recommendation)}>{selectedPropMarker.recommendation}</Badge>
              <span className="text-[11px] font-mono text-pos font-bold flex items-center gap-0.5">
                <TrendingUp size={11} /> {selectedPropMarker.annualYield}% ROI
              </span>
            </div>

            <h4 className="text-sm font-semibold text-ink tracking-tight truncate">{selectedPropMarker.title}</h4>

            <div className="text-xs text-ink-2 flex items-center gap-2 font-mono">
              <span>Asking: {formatInrLakhs(selectedPropMarker.askingPriceLakhs)}</span>
              <span>•</span>
              <span className="text-pos">ML: {formatInrLakhs(selectedPropMarker.fairValueLakhs)}</span>
            </div>
          </div>

          {onSelectProperty && (
            <button
              onClick={() => onSelectProperty(selectedPropMarker)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-brand hover:bg-brand-strong text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-card cursor-pointer shrink-0 transition-colors"
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
