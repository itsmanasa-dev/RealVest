import type { Property, MarketHotZone, MarketData } from '../types';

export const mockProperties: Property[] = [
  {
    id: 'prop-vertex',
    code: 'ID: ATX-442',
    title: 'The Vertex Hub',
    location: 'Tech District',
    city: 'Austin, TX',
    category: 'Commercial',
    subCategory: 'CLASS A',
    bhk: 0,
    bathrooms: 12,
    sqft: 85000,
    askingPriceLakhs: 3950,
    fairValueLakhs: 4250,
    monthlyRent: 240000,
    annualYield: 6.8,
    investmentScore: 92,
    recommendation: 'BUY',
    confidenceScore: 78,
    dealStatus: 'Potentially Undervalued',
    dealDiffPct: -7.1,
    matchPercentage: 98,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    reasons: [
      'Positive ROI Trajectory: Projected yields outpace district average by 2.1%.',
      'Strong Market Trends: Tech sector expansion driving 95% occupancy rates in adjacent properties.',
      'Infrastructure Premium: Proximity to new transit hub increases long-term valuation.'
    ],
    risks: [
      'Minor localized commercial supply pipeline expansion expected in Q4.'
    ],
    riskRadar: {
      overallRisk: 'Low',
      riskScore: 24,
      overallColor: '#10b981',
      breakdown: [
        {
          category: 'Market Risk',
          level: 'Low',
          color: '#10b981',
          why: 'Sustained enterprise tenancy demand in primary tech corridor.',
          metric_label: 'Absorption',
          metric_value: '95.2%'
        },
        {
          category: 'Price Volatility',
          level: 'Medium',
          color: '#f59e0b',
          why: 'Interest rate shifts may adjust commercial cap rate yields mildly.',
          metric_label: 'Beta',
          metric_value: '0.84'
        },
        {
          category: 'Data Fidelity',
          level: 'High',
          color: '#3b82f6',
          why: 'Based on 1,400+ certified regional institutional sales records.',
          metric_label: 'Coverage',
          metric_value: '99%'
        }
      ]
    },
    waterfallFactors: [
      { factor: 'Base Sub-Market Benchmark', contribution_lakhs: 3600.0, sign: 'base' },
      { factor: 'Class A Commercial Spec Premium', contribution_lakhs: 450.0, sign: '+' },
      { factor: 'High Transit Connectivity Bonus', contribution_lakhs: 200.0, sign: '+' }
    ],
    explanations: [
      'High occupancy track record provides predictable monthly cash flows.',
      'Replacement cost valuation model indicates strong entry pricing.'
    ]
  },
  {
    id: 'prop-nexus',
    code: 'ID: DTN-101',
    title: 'Nexus Tower',
    location: 'Downtown Metro',
    city: 'Seattle, WA',
    category: 'Commercial',
    subCategory: 'PREMIUM OFFICE',
    bhk: 0,
    bathrooms: 8,
    sqft: 28000,
    askingPriceLakhs: 1100,
    fairValueLakhs: 1200,
    monthlyRent: 145000,
    annualYield: 7.2,
    investmentScore: 95,
    recommendation: 'BUY',
    confidenceScore: 88,
    dealStatus: 'Potentially Undervalued',
    dealDiffPct: -8.3,
    matchPercentage: 98,
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    reasons: [
      'Prime Downtown Metro corridor with 98% historical tenant retention.',
      'High cash-on-cash yield exceeding regional benchmark by 1.8%.'
    ],
    risks: [],
    riskRadar: {
      overallRisk: 'Low',
      riskScore: 20,
      overallColor: '#10b981',
      breakdown: [
        { category: 'Market Risk', level: 'Low', color: '#10b981', why: 'Low vacancy in core business district.', metric_label: 'Occupancy', metric_value: '98%' },
        { category: 'Price Volatility', level: 'Low', color: '#10b981', why: 'Long-term corporate lease contracts.', metric_label: 'Tenure', metric_value: '7.5 Yrs' },
        { category: 'Data Fidelity', level: 'High', color: '#3b82f6', why: 'Direct verified transaction comps.', metric_label: 'Data Comps', metric_value: '100%' }
      ]
    },
    waterfallFactors: [
      { factor: 'Downtown Micro-Market Baseline', contribution_lakhs: 1050.0, sign: 'base' },
      { factor: 'Corporate Long-Term Lease Premium', contribution_lakhs: 150.0, sign: '+' }
    ],
    explanations: ['Triple-net lease structure minimizing operational expenditure.']
  },
  {
    id: 'prop-aura',
    code: 'ID: MIA-991',
    title: 'Aura Residences',
    location: 'Westside District',
    city: 'Miami, FL',
    category: 'Residential',
    subCategory: 'MULTI-FAMILY',
    bhk: 3,
    bathrooms: 3,
    sqft: 2400,
    askingPriceLakhs: 820,
    fairValueLakhs: 850,
    monthlyRent: 58000,
    annualYield: 5.4,
    investmentScore: 89,
    recommendation: 'HOLD',
    confidenceScore: 84,
    dealStatus: 'Fairly Priced',
    dealDiffPct: -3.5,
    matchPercentage: 92,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    reasons: [
      'High coastal tenant retention with 98% occupancy rate.',
      'Stable luxury rental yields with low vacancy churn.'
    ],
    risks: ['Moderate coastal insurance overhead.'],
    riskRadar: {
      overallRisk: 'Medium',
      riskScore: 38,
      overallColor: '#f59e0b',
      breakdown: [
        { category: 'Market Risk', level: 'Medium', color: '#f59e0b', why: 'Mild seasonal tenancy cycles.', metric_label: 'Churn', metric_value: '4.2%' },
        { category: 'Price Volatility', level: 'Low', color: '#10b981', why: 'Consistent asset appreciation history.', metric_label: '5Y CAGR', metric_value: '+8.4%' },
        { category: 'Data Fidelity', level: 'High', color: '#3b82f6', why: 'Verified MLS transaction records.', metric_label: 'Fidelity', metric_value: '96%' }
      ]
    },
    waterfallFactors: [
      { factor: 'Westside Coastal Benchmark', contribution_lakhs: 780.0, sign: 'base' },
      { factor: 'Modern Architectural Build Quality', contribution_lakhs: 70.0, sign: '+' }
    ],
    explanations: ['Steady residential rental demand in luxury multi-family segment.']
  },
  {
    id: 'prop-apex',
    code: 'ID: SEA-104',
    title: 'Apex Logistics Hub',
    location: 'Northern Corridor',
    city: 'Seattle, WA',
    category: 'Commercial',
    subCategory: 'LOGISTICS PARK',
    bhk: 0,
    bathrooms: 6,
    sqft: 64000,
    askingPriceLakhs: 3200,
    fairValueLakhs: 3400,
    monthlyRent: 210000,
    annualYield: 7.8,
    investmentScore: 84,
    recommendation: 'BUY',
    confidenceScore: 91,
    dealStatus: 'Potentially Undervalued',
    dealDiffPct: -5.9,
    matchPercentage: 76,
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    reasons: [
      'Strategic highway interchange node with expanding freight rail link.',
      'E-commerce demand tailwinds accelerating sub-market rents.'
    ],
    risks: [],
    riskRadar: {
      overallRisk: 'Low',
      riskScore: 18,
      overallColor: '#10b981',
      breakdown: [
        { category: 'Market Risk', level: 'Low', color: '#10b981', why: 'Industrial absorption near 100%.', metric_label: 'Occupancy', metric_value: '100%' },
        { category: 'Price Volatility', level: 'Low', color: '#10b981', why: 'Institutional e-commerce tenant backing.', metric_label: 'Rating', metric_value: 'AAA' },
        { category: 'Data Fidelity', level: 'High', color: '#3b82f6', why: 'Industrial comp benchmark verified.', metric_label: 'Confidence', metric_value: '98%' }
      ]
    },
    waterfallFactors: [
      { factor: 'Logistics Corridor Land Baseline', contribution_lakhs: 3000.0, sign: 'base' },
      { factor: 'High-Bay Loading Dock Infrastructure', contribution_lakhs: 400.0, sign: '+' }
    ],
    explanations: ['Long-term triple net lease signed with national logistics provider.']
  },
  {
    id: 'prop-biscayne',
    code: 'ID: MIA-802',
    title: 'Biscayne Bay Plaza',
    location: 'Financial District',
    city: 'Miami, FL',
    category: 'Commercial',
    subCategory: 'CLASS A TOWER',
    bhk: 0,
    bathrooms: 16,
    sqft: 52000,
    askingPriceLakhs: 2450,
    fairValueLakhs: 2610,
    monthlyRent: 195000,
    annualYield: 6.9,
    investmentScore: 91,
    recommendation: 'BUY',
    confidenceScore: 86,
    dealStatus: 'Potentially Undervalued',
    dealDiffPct: -6.1,
    matchPercentage: 94,
    imageUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=80',
    reasons: [
      'Located in Miami prime Financial District with high tech & fintech influx.',
      'Asking price carries a 6.1% discount below replacement valuation.'
    ],
    risks: [],
    riskRadar: {
      overallRisk: 'Low',
      riskScore: 22,
      overallColor: '#10b981',
      breakdown: [
        { category: 'Market Risk', level: 'Low', color: '#10b981', why: 'Strong capital inflows to financial district.', metric_label: 'Inflow YoY', metric_value: '+14%' },
        { category: 'Price Volatility', level: 'Medium', color: '#f59e0b', why: 'Commercial tax adjustments.', metric_label: 'Tax Tier', metric_value: 'Tier 1' },
        { category: 'Data Fidelity', level: 'High', color: '#3b82f6', why: 'Comprehensive transaction history.', metric_label: 'Fidelity', metric_value: '97%' }
      ]
    },
    waterfallFactors: [
      { factor: 'Financial District Land Value', contribution_lakhs: 2200.0, sign: 'base' },
      { factor: 'Waterfront Proximity & Premium Finishes', contribution_lakhs: 410.0, sign: '+' }
    ],
    explanations: ['Strong anchor tenancy from regional banking and fintech headquarters.']
  }
];

export const mockHotZones: MarketHotZone[] = [
  {
    id: 'hz-1',
    name: 'East Riverside',
    city: 'Austin, TX',
    demandIndex: 94.2,
    growth30d: 12.0,
    avgYield: 6.2,
    avgPricePerSqft: 480,
    coordinates: { x: 38, y: 46 }
  },
  {
    id: 'hz-2',
    name: 'Tech Corridor Sector 4',
    city: 'Austin, TX',
    demandIndex: 96.8,
    growth30d: 14.5,
    avgYield: 6.8,
    avgPricePerSqft: 520,
    coordinates: { x: 68, y: 32 }
  },
  {
    id: 'hz-3',
    name: 'Downtown Financial Hub',
    city: 'Miami, FL',
    demandIndex: 91.5,
    growth30d: 9.8,
    avgYield: 5.4,
    avgPricePerSqft: 650,
    coordinates: { x: 74, y: 70 }
  },
  {
    id: 'hz-4',
    name: 'Northern Freight Logistics',
    city: 'Seattle, WA',
    demandIndex: 88.4,
    growth30d: 11.0,
    avgYield: 7.2,
    avgPricePerSqft: 325,
    coordinates: { x: 26, y: 28 }
  }
];

export const marketData: MarketData = {
  latestHpi: 113.13,
  totalGrowthPct: 18.4,
  latestYoyPct: 4.2,
  series: [
    { Quarter: '2020 Q4', 'HPI@Assessment Prices': 88.4, 'QoQ_Change_%': 1.2, 'YoY_Change_%': 5.8 },
    { Quarter: '2021 Q4', 'HPI@Assessment Prices': 94.2, 'QoQ_Change_%': 1.8, 'YoY_Change_%': 6.6 },
    { Quarter: '2022 Q4', 'HPI@Assessment Prices': 101.5, 'QoQ_Change_%': 2.1, 'YoY_Change_%': 7.8 },
    { Quarter: '2023 Q4', 'HPI@Assessment Prices': 108.6, 'QoQ_Change_%': 1.9, 'YoY_Change_%': 7.0 },
    { Quarter: '2024 Q4', 'HPI@Assessment Prices': 113.13, 'QoQ_Change_%': 1.4, 'YoY_Change_%': 4.2 }
  ]
};
