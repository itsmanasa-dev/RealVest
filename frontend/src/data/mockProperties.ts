import { Property, MarketHotZone } from '../types';

export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    code: 'ID: ATX-442',
    title: 'The Vertex Hub',
    location: 'Tech District, Sector 4',
    city: 'Austin, TX',
    category: 'Commercial',
    subCategory: 'CLASS A',
    estimatedValue: 42500000,
    askingPrice: 39800000,
    projectedRoi: 12.4,
    capRate: 6.8,
    occupancyRate: 95.2,
    matchPercentage: 98,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    recommendation: 'BUY',
    confidenceScore: 78,
    rationale: [
      'Positive ROI Trajectory (+2.1% over district benchmark)',
      'Strong Market Trends (95.2% sustained tenancy occupancy)',
      'Infrastructure Premium (proximity to new transit hub & sub-station)'
    ],
    risks: {
      marketRisk: 'LOW',
      priceVolatility: 'MEDIUM',
      dataFidelity: 'HIGH'
    },
    metrics: {
      sqft: 85000,
      pricePerSqft: 500,
      monthlyRent: 240000,
      annualYield: 6.8
    }
  },
  {
    id: 'prop-2',
    code: 'ID: MIA-991',
    title: 'Aura Residences',
    location: 'Biscayne Bay, Financial Hub',
    city: 'Miami, FL',
    category: 'Residential',
    subCategory: 'MULTI-FAMILY',
    estimatedValue: 18900000,
    askingPrice: 19200000,
    projectedRoi: 9.8,
    capRate: 5.4,
    occupancyRate: 98.0,
    matchPercentage: 92,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    recommendation: 'HOLD',
    confidenceScore: 84,
    rationale: [
      'High coastal tenant retention with 98% occupancy rate',
      'Stable luxury rental yields with low vacancy churn',
      'Premium amenity package including private marina access'
    ],
    risks: {
      marketRisk: 'MEDIUM',
      priceVolatility: 'LOW',
      dataFidelity: 'HIGH'
    },
    metrics: {
      sqft: 42000,
      pricePerSqft: 450,
      monthlyRent: 95000,
      annualYield: 5.4
    }
  },
  {
    id: 'prop-3',
    code: 'ID: SEA-104',
    title: 'Apex Logistics Hub',
    location: 'North Freight Corridor',
    city: 'Seattle, WA',
    category: 'Industrial',
    subCategory: 'LOGISTICS PARK',
    estimatedValue: 64000000,
    askingPrice: 58500000,
    projectedRoi: 14.1,
    capRate: 7.2,
    occupancyRate: 100.0,
    matchPercentage: 94,
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    recommendation: 'BUY',
    confidenceScore: 91,
    rationale: [
      'Triple-net leased to Fortune 500 logistics anchor tenant',
      'Strategic highway interchange node with expanding rail link',
      'E-commerce demand tailwinds accelerating sub-market rents'
    ],
    risks: {
      marketRisk: 'LOW',
      priceVolatility: 'LOW',
      dataFidelity: 'HIGH'
    },
    metrics: {
      sqft: 180000,
      pricePerSqft: 325,
      monthlyRent: 385000,
      annualYield: 7.2
    }
  },
  {
    id: 'prop-4',
    code: 'ID: BLR-802',
    title: 'Embassy Tech Plaza',
    location: 'Outer Ring Road, Marathahalli',
    city: 'Bengaluru, KA',
    category: 'Commercial',
    subCategory: 'IT PARK',
    estimatedValue: 28500000,
    askingPrice: 26000000,
    projectedRoi: 11.6,
    capRate: 7.8,
    occupancyRate: 94.0,
    matchPercentage: 96,
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    recommendation: 'BUY',
    confidenceScore: 86,
    rationale: [
      'Located in Bengaluru prime IT corridor with high absorption',
      'Priced 8.7% below regional replacement valuation benchmark',
      'Upcoming Namma Metro Phase 2 station within 300 meters'
    ],
    risks: {
      marketRisk: 'LOW',
      priceVolatility: 'MEDIUM',
      dataFidelity: 'HIGH'
    },
    metrics: {
      sqft: 65000,
      pricePerSqft: 400,
      monthlyRent: 175000,
      annualYield: 7.8
    }
  },
  {
    id: 'prop-5',
    code: 'ID: DEN-310',
    title: 'Highland Park Office Tower',
    location: 'Downtown Tech District',
    city: 'Denver, CO',
    category: 'Commercial',
    subCategory: 'CLASS A',
    estimatedValue: 31000000,
    askingPrice: 34500000,
    projectedRoi: 6.2,
    capRate: 4.9,
    occupancyRate: 88.5,
    matchPercentage: 76,
    imageUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=80',
    recommendation: 'AVOID',
    confidenceScore: 82,
    rationale: [
      'Asking price carries a 11.2% premium over fair valuation',
      'Elevated sub-market vacancy risk (11.5% unleased floor space)',
      'High capital expenditure required for HVAC & elevator upgrades'
    ],
    risks: {
      marketRisk: 'HIGH',
      priceVolatility: 'HIGH',
      dataFidelity: 'HIGH'
    },
    metrics: {
      sqft: 52000,
      pricePerSqft: 660,
      monthlyRent: 140000,
      annualYield: 4.9
    }
  }
];

export const mockHotZones: MarketHotZone[] = [
  {
    id: 'hz-1',
    name: 'East Riverside',
    city: 'Austin, TX',
    demandIndex: 94.2,
    growth30d: 12.4,
    avgYield: 7.1,
    coordinates: { x: 35, y: 42 }
  },
  {
    id: 'hz-2',
    name: 'Wynwood Tech District',
    city: 'Miami, FL',
    demandIndex: 91.8,
    growth30d: 9.8,
    avgYield: 6.4,
    coordinates: { x: 72, y: 68 }
  },
  {
    id: 'hz-3',
    name: 'Marathahalli ORR',
    city: 'Bengaluru, IN',
    demandIndex: 96.5,
    growth30d: 14.2,
    avgYield: 8.2,
    coordinates: { x: 55, y: 30 }
  },
  {
    id: 'hz-4',
    name: 'SoDo Logistics Zone',
    city: 'Seattle, WA',
    demandIndex: 88.4,
    growth30d: 7.6,
    avgYield: 6.9,
    coordinates: { x: 22, y: 25 }
  }
];
