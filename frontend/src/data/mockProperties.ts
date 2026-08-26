import type { Property, MarketHotZone, MarketData } from '../types';
import realPropertiesJson from './realProperties.json';
import marketDataJson from './marketData.json';

export const mockProperties: Property[] = realPropertiesJson as Property[];
export const marketData: MarketData = marketDataJson as MarketData;

export const mockHotZones: MarketHotZone[] = [
  {
    id: 'hz-1',
    name: 'Whitefield Tech Corridor',
    city: 'Bengaluru, KA',
    demandIndex: 96.4,
    growth30d: 14.8,
    avgYield: 5.4,
    avgPricePerSqft: 6850,
    coordinates: { x: 74, y: 38 }
  },
  {
    id: 'hz-2',
    name: 'Electronic City Phase 1 & 2',
    city: 'Bengaluru, KA',
    demandIndex: 92.1,
    growth30d: 11.2,
    avgYield: 5.8,
    avgPricePerSqft: 5200,
    coordinates: { x: 62, y: 82 }
  },
  {
    id: 'hz-3',
    name: 'Sarjapur Road Hub',
    city: 'Bengaluru, KA',
    demandIndex: 94.7,
    growth30d: 13.5,
    avgYield: 5.1,
    avgPricePerSqft: 7100,
    coordinates: { x: 68, y: 58 }
  },
  {
    id: 'hz-4',
    name: 'HSR Layout Sector 1-7',
    city: 'Bengaluru, KA',
    demandIndex: 98.2,
    growth30d: 16.4,
    avgYield: 4.8,
    avgPricePerSqft: 9400,
    coordinates: { x: 52, y: 64 }
  },
  {
    id: 'hz-5',
    name: 'Indiranagar 100ft Corridor',
    city: 'Bengaluru, KA',
    demandIndex: 95.0,
    growth30d: 12.0,
    avgYield: 4.2,
    avgPricePerSqft: 14500,
    coordinates: { x: 48, y: 34 }
  },
  {
    id: 'hz-6',
    name: 'Marathahalli Outer Ring Road',
    city: 'Bengaluru, KA',
    demandIndex: 93.8,
    growth30d: 12.9,
    avgYield: 5.3,
    avgPricePerSqft: 6400,
    coordinates: { x: 65, y: 44 }
  }
];
