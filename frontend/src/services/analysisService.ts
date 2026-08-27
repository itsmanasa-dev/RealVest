import type { Property, SimulationParams, SimulationResult, DecisionFlipResult } from '../types';
import { simulatorService } from './simulatorService';
import { advisorService } from './advisorService';

export const calculateEmi = simulatorService.calculateEmi;
export const simulateInvestment = simulatorService.calculateScenario;
export const calculateDecisionFlip = simulatorService.calculateDecisionFlip;

export function analyzeProperty(property: Property) {
  const diffPct = ((property.askingPriceLakhs - property.fairValueLakhs) / property.fairValueLakhs) * 100;
  const isUndervalued = diffPct < -3;
  const isOvervalued = diffPct > 5;

  const flipResult = simulatorService.calculateDecisionFlip(
    property.askingPriceLakhs,
    property.fairValueLakhs,
    property.monthlyRent
  );

  return {
    diffPct,
    isUndervalued,
    isOvervalued,
    flipResult,
  };
}

export const queryAdvisor = advisorService.query;

export const analysisService = {
  calculateEmi,
  simulateInvestment,
  calculateDecisionFlip,
  analyzeProperty,
  queryAdvisor,
};
