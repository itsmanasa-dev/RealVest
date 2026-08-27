import type { SimulationParams, SimulationResult, DecisionFlipResult } from '../types';

/**
 * Calculates monthly home loan EMI
 */
export function calculateEmi(principalInr: number, annualRatePct: number, tenureYears: number = 20): number {
  if (annualRatePct <= 0 || tenureYears <= 0) {
    return Math.round(principalInr / (tenureYears * 12));
  }
  const monthlyRate = (annualRatePct / 100.0) / 12.0;
  const numMonths = tenureYears * 12;
  const emi = (principalInr * monthlyRate * Math.pow(1.0 + monthlyRate, numMonths)) / (Math.pow(1.0 + monthlyRate, numMonths) - 1.0);
  return Math.round(emi);
}

/**
 * Simulates investment scenario with transparent financial calculation in INR
 */
export function calculateScenario(params: SimulationParams): SimulationResult {
  const purchaseLakhs = params.purchasePriceLakhs;
  const purchaseInr = purchaseLakhs * 100000;
  const downPaymentPct = params.downPaymentPct || 20;
  const downPaymentInr = purchaseInr * (downPaymentPct / 100.0);
  const loanAmountInr = Math.max(0, purchaseInr - downPaymentInr);
  const interestRate = params.interestRate ?? 8.5;
  const tenureYears = 20;
  const monthlyRent = params.monthlyRent || Math.round((purchaseInr * 0.05) / 12);
  const vacancyRate = params.vacancyRatePct ?? 5.0;
  const appreciationRate = params.appreciationRatePct ?? 6.5;
  const holdingPeriod = params.holdingPeriod || 5;

  const monthlyEmi = calculateEmi(loanAmountInr, interestRate, tenureYears);
  const effectiveMonthlyRent = monthlyRent * (1.0 - vacancyRate / 100.0);
  const netMonthlyCashFlow = Math.round(effectiveMonthlyRent - monthlyEmi);
  const netAnnualCashFlow = Math.round(netMonthlyCashFlow * 12);
  const rentalYieldPct = parseFloat(((monthlyRent * 12.0) / purchaseInr * 100.0).toFixed(2));

  const futureValInr = purchaseInr * Math.pow(1.0 + (appreciationRate / 100.0), holdingPeriod);
  const projectedFutureValLakhs = parseFloat((futureValInr / 100000.0).toFixed(2));
  
  // Explicit 2025 (1-year forward) and 2026 (2-year forward) forecasts
  const val2025Inr = purchaseInr * (1.0 + (appreciationRate / 100.0));
  const val2026Inr = purchaseInr * Math.pow(1.0 + (appreciationRate / 100.0), 2);
  const projected2025ValLakhs = parseFloat((val2025Inr / 100000.0).toFixed(2));
  const projected2026ValLakhs = parseFloat((val2026Inr / 100000.0).toFixed(2));

  const capitalGainInr = futureValInr - purchaseInr;
  const totalRentalIncomeInr = netAnnualCashFlow * holdingPeriod;
  const totalProfitInr = Math.round(capitalGainInr + totalRentalIncomeInr);

  const initialCapitalInr = downPaymentInr;
  const totalRoiPct = initialCapitalInr > 0 
    ? parseFloat(((totalProfitInr / initialCapitalInr) * 100.0).toFixed(1))
    : 0;
  const annualizedRoiPct = holdingPeriod > 0
    ? parseFloat((totalRoiPct / holdingPeriod).toFixed(1))
    : 0;

  let decision: 'BUY' | 'HOLD' | 'AVOID' = 'BUY';
  if (totalRoiPct >= 35.0 && netMonthlyCashFlow > -20000) {
    decision = 'BUY';
  } else if (totalRoiPct >= 18.0 && netMonthlyCashFlow > -40000) {
    decision = 'HOLD';
  } else {
    decision = 'AVOID';
  }

  return {
    monthlyEmi,
    netMonthlyCashFlow,
    netAnnualCashFlow,
    rentalYieldPct,
    projected2025ValLakhs,
    projected2026ValLakhs,
    projectedFutureValLakhs,
    totalProfitInr,
    totalRoiPct,
    annualizedRoiPct,
    decision,
  };
}


/**
 * Calculates sensitivity decision flip boundaries
 */
export function calculateDecisionFlip(
  currentPriceLakhs: number,
  fairValueLakhs: number,
  currentRentInr: number,
  interestRatePct: number = 8.5
): DecisionFlipResult {
  const currentDiffPct = ((currentPriceLakhs - fairValueLakhs) / fairValueLakhs) * 100.0;
  
  let currentDecision: 'BUY' | 'HOLD' | 'AVOID' = 'BUY';
  if (currentDiffPct <= -5.0) {
    currentDecision = 'BUY';
  } else if (currentDiffPct <= 5.0) {
    currentDecision = 'HOLD';
  } else {
    currentDecision = 'AVOID';
  }

  const targetBuyPriceLakhs = parseFloat((fairValueLakhs * 0.95).toFixed(2));
  const targetAvoidPriceLakhs = parseFloat((fairValueLakhs * 1.06).toFixed(2));
  const priceGapToBuy = parseFloat((currentPriceLakhs - targetBuyPriceLakhs).toFixed(2));

  const currentAnnualYield = ((currentRentInr * 12.0) / (currentPriceLakhs * 100000.0)) * 100.0;
  const targetRentBuy = Math.round((currentPriceLakhs * 100000.0 * 0.055) / 12.0);
  const rentGap = targetRentBuy - currentRentInr;

  let priceFlipText = '';
  if (currentDecision === 'BUY') {
    priceFlipText = `Verdict flips from BUY to HOLD if asking price rises above ₹${targetAvoidPriceLakhs} L (+${((targetAvoidPriceLakhs - currentPriceLakhs)/currentPriceLakhs*100).toFixed(1)}%).`;
  } else if (currentDecision === 'HOLD') {
    priceFlipText = `Verdict flips to BUY if seller discounts price by ₹${Math.abs(priceGapToBuy).toFixed(1)} L to ₹${targetBuyPriceLakhs} L (-${Math.abs((priceGapToBuy/currentPriceLakhs)*100).toFixed(1)}%).`;
  } else {
    priceFlipText = `Verdict flips to BUY if asking price is negotiated down by ₹${priceGapToBuy.toFixed(1)} L to ₹${targetBuyPriceLakhs} L.`;
  }

  let rentFlipText = '';
  if (currentAnnualYield >= 5.0) {
    const minViableRent = Math.round((currentPriceLakhs * 100000.0 * 0.04) / 12.0);
    rentFlipText = `Verdict remains positive as long as monthly rent stays above ₹${minViableRent.toLocaleString('en-IN')}/mo (4.0% yield floor).`;
  } else {
    rentFlipText = `Verdict flips to BUY if monthly rental achieves ₹${targetRentBuy.toLocaleString('en-IN')}/mo (+₹${Math.max(0, rentGap).toLocaleString('en-IN')}/mo).`;
  }

  const maxViableInterestRate = parseFloat(Math.max(6.5, 11.0 - (currentDiffPct * 0.15)).toFixed(2));
  const rateFlipText = `Home loan interest rate above ${maxViableInterestRate}% will trigger cash-flow deficit and downgrade verdict.`;

  return {
    currentDecision,
    priceFlipText,
    rentFlipText,
    rateFlipText,
    flipThresholds: {
      targetFairPriceLakhs: targetBuyPriceLakhs,
      priceGapLakhs: priceGapToBuy,
      requiredMinRentInr: targetRentBuy,
      maxViableInterestRate,
    }
  };
}

export const simulatorService = {
  calculateEmi,
  calculateScenario,
  calculateDecisionFlip,
};
