import type { Property, MarketHotZone, MarketData } from '../types';
import rawRealProperties from './realProperties.json';
import rawMarketData from './marketData.json';

// Exported verified Bengaluru properties
export const mockProperties: Property[] = rawRealProperties as Property[];

// Exported Bengaluru Micro-market Hotspots
export const mockHotZones: MarketHotZone[] = [
  {
    id: 'hz-whitefield',
    name: 'Whitefield Tech Belt',
    city: 'Bengaluru, KA',
    demandIndex: 96.4,
    growth30d: 14.2,
    avgYield: 7.8,
    avgPricePerSqft: 7200,
    coordinates: { x: 78, y: 48 },
  },
  {
    id: 'hz-indiranagar',
    name: 'Indiranagar Prime Corridor',
    city: 'Bengaluru, KA',
    demandIndex: 98.1,
    growth30d: 11.5,
    avgYield: 6.2,
    avgPricePerSqft: 14500,
    coordinates: { x: 55, y: 42 },
  },
  {
    id: 'hz-koramangala',
    name: 'Koramangala Startup Hub',
    city: 'Bengaluru, KA',
    demandIndex: 97.2,
    growth30d: 12.8,
    avgYield: 6.9,
    avgPricePerSqft: 13200,
    coordinates: { x: 52, y: 62 },
  },
  {
    id: 'hz-hsr',
    name: 'HSR Layout Sector 1-7',
    city: 'Bengaluru, KA',
    demandIndex: 95.8,
    growth30d: 15.1,
    avgYield: 7.4,
    avgPricePerSqft: 9800,
    coordinates: { x: 58, y: 72 },
  },
  {
    id: 'hz-ecity',
    name: 'Electronic City Phase 1 & 2',
    city: 'Bengaluru, KA',
    demandIndex: 91.2,
    growth30d: 9.6,
    avgYield: 8.2,
    avgPricePerSqft: 5600,
    coordinates: { x: 62, y: 90 },
  },
  {
    id: 'hz-bellandur',
    name: 'Bellandur Outer Ring Road',
    city: 'Bengaluru, KA',
    demandIndex: 96.9,
    growth30d: 13.7,
    avgYield: 7.6,
    avgPricePerSqft: 8900,
    coordinates: { x: 68, y: 58 },
  },
  {
    id: 'hz-hebbal',
    name: 'Hebbal Airport Corridor',
    city: 'Bengaluru, KA',
    demandIndex: 93.5,
    growth30d: 10.4,
    avgYield: 6.5,
    avgPricePerSqft: 8400,
    coordinates: { x: 44, y: 22 },
  },
  {
    id: 'hz-yelahanka',
    name: 'Yelahanka Satellite Town',
    city: 'Bengaluru, KA',
    demandIndex: 89.6,
    growth30d: 12.2,
    avgYield: 7.1,
    avgPricePerSqft: 6100,
    coordinates: { x: 42, y: 12 },
  },
];

// Processed HPI Market Data from NHB/RBI Residex
export const marketData: MarketData = rawMarketData as MarketData;
