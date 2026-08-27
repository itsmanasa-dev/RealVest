export type NavTab = 
  | 'dashboard' 
  | 'explore' 
  | 'analysis' 
  | 'compare'
  | 'simulator' 
  | 'markets' 
  | 'advisor' 
  | 'settings';

export type AssetCategory = 'All Assets' | 'Residential' | 'Commercial' | 'Villa / Penthouse';

export interface WaterfallFactor {
  factor: string;
  contribution_lakhs: number;
  sign: '+' | '-' | 'base';
}

export interface RiskRadarItem {
  category: string;
  level: 'Low' | 'Medium' | 'High';
  color: string;
  why: string;
  metric_label: string;
  metric_value: string;
}

export interface RiskRadar {
  overallRisk: 'Low' | 'Medium' | 'High';
  riskScore: number;
  overallColor: string;
  breakdown: RiskRadarItem[];
}

export interface Property {
  id: string;
  code: string;
  title: string;
  location: string;
  city: string;
  category: 'Commercial' | 'Residential' | 'Villa / Penthouse';
  subCategory: string;
  bhk: number;
  bathrooms: number;
  sqft: number;
  askingPriceLakhs: number;
  fairValueLakhs: number;
  monthlyRent: number;
  annualYield: number; // in %
  investmentScore: number; // 0-100
  recommendation: 'BUY' | 'HOLD' | 'AVOID';
  confidenceScore: number; // %
  dealStatus: string;
  dealDiffPct: number;
  matchPercentage: number;
  imageUrl: string;
  reasons: string[];
  risks: string[];
  riskRadar: RiskRadar;
  waterfallFactors: WaterfallFactor[];
  explanations: string[];
}

export interface SimulationParams {
  purchasePriceLakhs: number;
  interestRate: number; // %
  monthlyRent: number; // INR
  holdingPeriod: number; // Years
  downPaymentPct: number; // %
  vacancyRatePct?: number;
  appreciationRatePct?: number;
  location?: string;
}

export interface SimulationResult {
  monthlyEmi: number;
  netMonthlyCashFlow: number;
  netAnnualCashFlow: number;
  rentalYieldPct: number;
  projected2025ValLakhs: number;
  projected2026ValLakhs: number;
  projectedFutureValLakhs: number;
  totalProfitInr: number;
  totalRoiPct: number;
  annualizedRoiPct: number;
  decision: 'BUY' | 'HOLD' | 'AVOID';
}


export interface DecisionFlipResult {
  currentDecision: 'BUY' | 'HOLD' | 'AVOID';
  priceFlipText: string;
  rentFlipText: string;
  rateFlipText: string;
  flipThresholds: {
    targetFairPriceLakhs: number;
    priceGapLakhs: number;
    requiredMinRentInr: number;
    maxViableInterestRate: number;
  };
}

export interface MarketHotZone {
  id: string;
  name: string;
  city: string;
  demandIndex: number; // 0-100
  growth30d: number; // %
  avgYield: number; // %
  avgPricePerSqft: number;
  coordinates: { x: number; y: number }; // Relative map % position
}

export interface HPIRecord {
  Quarter: string;
  'HPI@Assessment Prices': number;
  'QoQ_Change_%'?: number | null;
  'YoY_Change_%'?: number | null;
  isObserved?: boolean;
}

export interface ForecastRecord {
  quarter: string;
  year: string;
  forecastHpi: number;
  confidenceInterval: [number, number]; // [lower_bound, upper_bound]
  type: 'FORECAST';
}

export interface MarketData {
  latestHpi: number;
  totalGrowthPct: number;
  latestYoyPct: number;
  historicalEndQuarter: string;
  historicalThroughYear: number;
  series: HPIRecord[];
  forecastSeries: ForecastRecord[];
  forecastModel: string;
}

export type InvestmentGoal = 'Capital Growth' | 'Rental Income' | 'Balanced' | 'Long-term Wealth';
export type RiskTolerance = 'Conservative' | 'Moderate' | 'Aggressive';
export type InvestmentHorizon = '1–3 years' | '3–5 years' | '5–10 years' | '10+ years';
export type PropertyTypePreference = 'Any' | 'Residential' | 'Commercial' | 'Land';

export interface AdvisorProfile {
  budgetLakhs: number;
  goal: InvestmentGoal;
  riskTolerance: RiskTolerance;
  horizon: InvestmentHorizon;
  preferredLocation: string; // 'Any Bengaluru' or micro-market
  propertyType: PropertyTypePreference;
  minYieldRequired?: number;
}

export interface BudgetAllocation {
  propertyCostLakhs: number;
  stampDutyAndRegLakhs: number; // ~6.6% Karnataka statutory
  improvementsLakhs: number;
  cashReserveLakhs: number;
  totalBudgetLakhs: number;
}

export interface RentVsBuyComparison {
  monthlyRentInr: number;
  fiveYearRentCostLakhs: number;
  fiveYearOwnershipNetGainLakhs: number;
  breakEvenHorizonYears: number;
  verdict: 'BUY' | 'RENT';
  summary: string;
}

export interface DecisionOption {
  rank: 1 | 2 | 3;
  rankLabel: '#1 BEST MATCH' | '#2 ALTERNATIVE STRATEGY' | '#3 LOWER-RISK OPTION';
  property: Property;
  corridor: string;
  strategyTitle: string;
  estimatedInvestmentLakhs: number;
  projectedValueLakhs: number;
  expectedAppreciationPct: number;
  rentalYieldPct: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  confidenceScore: number;
  reasons: string[];
  whyRankedHere: string;
  whyNotRankedHigher?: string;
  decisionFlip: DecisionFlipResult;
  budgetAllocation: BudgetAllocation;
  rentVsBuy: RentVsBuyComparison;
}

export interface AdvisorEngineResult {
  profile: AdvisorProfile;
  bestMatch: DecisionOption;
  alternative: DecisionOption;
  lowerRiskOption: DecisionOption;
  macroSignals: {
    marketMomentum: string;
    hpiGrowthRate: string;
    bengaluruTopCorridor: string;
  };
  advisorExecutiveSummary: string;
}

