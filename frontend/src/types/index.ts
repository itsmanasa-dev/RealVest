export type NavTab = 
  | 'dashboard' 
  | 'explore' 
  | 'analysis' 
  | 'simulator' 
  | 'markets' 
  | 'advisor' 
  | 'settings';

export type AssetCategory = 'All Assets' | 'Commercial' | 'Residential' | 'Industrial';

export interface Property {
  id: string;
  code: string;
  title: string;
  location: string;
  city: string;
  category: 'Commercial' | 'Residential' | 'Industrial';
  subCategory: string;
  estimatedValue: number; // in USD or INR
  askingPrice: number;
  projectedRoi: number; // % YoY
  capRate: number; // %
  occupancyRate: number; // %
  matchPercentage: number;
  imageUrl: string;
  recommendation: 'BUY' | 'HOLD' | 'AVOID';
  confidenceScore: number; // %
  rationale: string[];
  risks: {
    marketRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    priceVolatility: 'LOW' | 'MEDIUM' | 'HIGH';
    dataFidelity: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  metrics: {
    sqft: number;
    pricePerSqft: number;
    monthlyRent: number;
    annualYield: number;
  };
}

export interface SimulationParams {
  purchasePrice: number;
  interestRate: number; // %
  targetYield: number; // %
  holdingPeriod: number; // Years
  downPaymentPct: number; // %
}

export interface SimulationResult {
  baseRoi: number;
  dynamicRoi: number;
  baseCashFlow: number;
  dynamicCashFlow: number;
  baseAppreciation: number;
  dynamicAppreciation: number;
  aiSignal: string;
  recommendation: 'BUY' | 'HOLD' | 'AVOID';
}

export interface MarketHotZone {
  id: string;
  name: string;
  city: string;
  demandIndex: number; // 0-100
  growth30d: number; // %
  avgYield: number; // %
  coordinates: { x: number; y: number }; // Relative map % position
}
