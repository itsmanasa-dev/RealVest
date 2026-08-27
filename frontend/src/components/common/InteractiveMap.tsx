import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MarketHotZone, Property } from '../../types';
import { mockProperties } from '../../data/mockProperties';
import {
  getPropertyCoordinate,
  BENGALURU_CENTER,
  MICRO_MARKET_COORDS,
} from '../../services/geoService';
import {
  MapPin,
  Plus,
  Minus,
  RotateCcw,
  TrendingUp,
  Navigation,
  ArrowUpRight,
  Compass,
} from 'lucide-react';
import { formatInrLakhs } from '../../utils/currency';
import { Badge, recommendationTone } from '../ui/Badge';

interface InteractiveMapProps {
  hotZones?: MarketHotZone[];
  selectedZone?: MarketHotZone;
  onSelectZone?: (zone: MarketHotZone) => void;
  properties?: Property[];
  onSelectProperty?: (property: Property) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties = mockProperties,
  onSelectProperty,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const hubsLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const tileLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [selectedPropMarker, setSelectedPropMarker] = useState<Property | null>(properties[0] || null);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // 1. Initialize Leaflet Map (Satellite Only)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [BENGALURU_CENTER.lat, BENGALURU_CENTER.lng],
      zoom: 11,
      minZoom: 9,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    const tileGroup = L.layerGroup().addTo(map);
    const hubsGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    tileLayerGroupRef.current = tileGroup;
    hubsLayerRef.current = hubsGroup;
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Load High-Resolution Geographic Satellite Layer + Road/Locality Reference Overlay
    if (mapboxToken) {
      L.tileLayer(
        `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`,
        { maxZoom: 19, subdomains: ['a', 'b', 'c', 'd'] }
      ).addTo(tileGroup);
    } else {
      // High-res Esri World Imagery Base (Satellite)
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      ).addTo(tileGroup);

      // Esri World Boundaries and Places Reference Overlay (Roads, Locality & City Labels)
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, opacity: 0.95 }
      ).addTo(tileGroup);
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapboxToken]);

  // 2. Render Bengaluru Key Corridors & Micro-Market Labels
  useEffect(() => {
    const map = mapInstanceRef.current;
    const hubsGroup = hubsLayerRef.current;
    if (!map || !hubsGroup) return;

    hubsGroup.clearLayers();

    const prominentHubs = [
      { name: 'Whitefield', coord: MICRO_MARKET_COORDS['whitefield'], desc: 'IT Belt' },
      { name: 'Electronic City', coord: MICRO_MARKET_COORDS['electronic city'], desc: 'Tech Hub' },
      { name: 'Koramangala', coord: MICRO_MARKET_COORDS['koramangala'], desc: 'Commercial' },
      { name: 'Indiranagar', coord: MICRO_MARKET_COORDS['indiranagar'], desc: 'Central' },
      { name: 'Hebbal', coord: MICRO_MARKET_COORDS['hebbal'], desc: 'Airport Corridor' },
      { name: 'Marathahalli', coord: MICRO_MARKET_COORDS['marathahalli'], desc: 'ORR' },
      { name: 'HSR Layout', coord: MICRO_MARKET_COORDS['hsr layout'], desc: 'Residential' },
      { name: 'Sarjapur Road', coord: MICRO_MARKET_COORDS['sarjapur road'], desc: 'Growth Zone' },
      { name: 'Bellandur', coord: MICRO_MARKET_COORDS['bellandur'], desc: 'Tech Parks' },
    ];

    prominentHubs.forEach((hub) => {
      const hubHtml = `
        <div class="flex items-center gap-1 px-2 py-0.5 rounded-md backdrop-blur-md shadow-md border transition-transform hover:scale-105 select-none pointer-events-auto"
          style="
            background: rgba(15, 23, 42, 0.85);
            border-color: rgba(56, 189, 248, 0.4);
            color: #F8FAFC;
          "
        >
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span class="text-[10px] font-bold tracking-tight font-sans">${hub.name}</span>
          <span class="text-[8px] font-mono opacity-70">· ${hub.desc}</span>
        </div>
      `;

      const hubIcon = L.divIcon({
        className: 'hub-label-marker',
        html: hubHtml,
        iconSize: [110, 20],
        iconAnchor: [55, 10],
      });

      const hubMarker = L.marker([hub.coord.lat, hub.coord.lng], {
        icon: hubIcon,
        zIndexOffset: -50,
      });

      hubMarker.on('click', () => {
        map.flyTo([hub.coord.lat, hub.coord.lng], 13, { duration: 0.8 });
      });

      hubMarker.addTo(hubsGroup);
    });
  }, []);

  // 3. Render Property Markers with Rich Labels
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
        <div class="relative flex flex-col items-center cursor-pointer group">
          ${
            isSelected
              ? '<span class="animate-ping absolute -top-1 inline-flex h-8 w-8 rounded-full opacity-60 bg-emerald-500"></span>'
              : ''
          }
          <div class="relative px-2.5 py-1 rounded-xl border flex items-center gap-1.5 shadow-xl transition-all ${
            isSelected
              ? 'scale-110 ring-2 ring-emerald-400 font-bold bg-emerald-600 text-white'
              : 'hover:scale-105'
          }" style="
            background: ${
              isSelected
                ? (isBuy ? '#059669' : '#2563EB')
                : 'rgba(15, 23, 42, 0.92)'
            };
            border-color: ${isBuy ? '#10B981' : '#3B82F6'};
            color: #FFFFFF;
          ">
            <span class="w-2 h-2 rounded-full ${isBuy ? 'bg-emerald-400' : 'bg-blue-400'}"></span>
            <div class="flex flex-col text-left leading-tight">
              <span class="text-[11px] font-bold font-mono">₹${prop.askingPriceLakhs} L</span>
              <span class="text-[9px] font-mono opacity-85">${prop.annualYield}% ROI</span>
            </div>
          </div>
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm mt-0.5"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-realvest-property-marker',
        html: iconHtml,
        iconSize: [80, 36],
        iconAnchor: [40, 36],
      });

      const marker = L.marker([coord.lat, coord.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 100,
      });

      marker.on('click', () => {
        setSelectedPropMarker(prop);
        map.flyTo([coord.lat, coord.lng], Math.max(map.getZoom(), 13), { duration: 0.8 });
      });

      marker.addTo(markersGroup);
    });
  }, [properties, selectedPropMarker]);

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
        setLocationStatus('My location located');
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
    <div className="relative w-full h-[480px] sm:h-[560px] rounded-2xl border border-line bg-slate-950 overflow-hidden shadow-card select-none">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left Geographic Satellite Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-card">
          <Compass size={14} className="text-brand animate-spin-slow" />
          <span>Bengaluru Satellite GIS</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand/20 text-brand border border-brand/30 uppercase font-bold">
            Satellite
          </span>
        </div>
      </div>

      {/* Top Right Navigation & Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="flex flex-col rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 shadow-card overflow-hidden text-slate-200 self-end">
          <button
            onClick={handleZoomIn}
            className="p-2.5 hover:bg-slate-800 hover:text-white transition-colors border-b border-slate-800 cursor-pointer flex items-center justify-center"
            title="Zoom In"
          >
            <Plus size={15} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
            title="Zoom Out"
          >
            <Minus size={15} />
          </button>
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className={`p-2.5 border-t border-slate-800 transition-colors cursor-pointer flex items-center justify-center ${
              isLocating ? 'text-brand animate-pulse' : 'text-brand hover:text-white hover:bg-slate-800'
            }`}
            title="Locate My Position"
          >
            <Navigation size={15} />
          </button>
          <button
            onClick={handleRecenter}
            className="p-2.5 border-t border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
            title="Recenter Bengaluru"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Geolocation Status Alert */}
      {locationStatus && (
        <div className="absolute top-16 left-4 z-20 px-3.5 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-brand text-brand text-xs font-medium shadow-card flex items-center gap-1.5 rv-fade-in">
          <MapPin size={13} />
          <span>{locationStatus}</span>
        </div>
      )}

      {/* Bottom Property Inspection Card */}
      {selectedPropMarker && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-20 p-4 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-md rv-fade-in text-white">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 font-mono text-[10px] font-bold border border-slate-700">
                {selectedPropMarker.code}
              </span>
              <Badge tone={recommendationTone(selectedPropMarker.recommendation)}>
                {selectedPropMarker.recommendation}
              </Badge>
              <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-0.5">
                <TrendingUp size={12} /> {selectedPropMarker.annualYield}% ROI
              </span>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white tracking-tight truncate">
                {selectedPropMarker.title}
              </h4>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin size={12} /> {selectedPropMarker.location}, Bengaluru
              </p>
            </div>

            <div className="text-xs text-slate-300 flex items-center gap-2 font-mono pt-1 border-t border-slate-800">
              <span>Asking: <strong className="text-white">{formatInrLakhs(selectedPropMarker.askingPriceLakhs)}</strong></span>
              <span>•</span>
              <span className="text-brand">Fair Val: <strong>{formatInrLakhs(selectedPropMarker.fairValueLakhs)}</strong></span>
            </div>
          </div>

          {onSelectProperty && (
            <button
              onClick={() => onSelectProperty(selectedPropMarker)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-strong text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-card cursor-pointer shrink-0 transition-colors"
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
