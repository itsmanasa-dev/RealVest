import type { Property, SimulationParams, SimulationResult, DecisionFlipResult } from '../types';
import { mockProperties } from '../data/mockProperties';

/**
 * Calculates monthly home loan EMI
 */
export function calculateEmi(principalInr: number, annualRatePct: number, tenureYears: number): number {
  if (annualRatePct <= 0 || tenureYears <= 0) {
    return principalInr / (tenureYears * 12);
  }
  const monthlyRate = (annualRatePct / 100.0) / 12.0;
  const numMonths = tenureYears * 12;
  const emi = (principalInr * monthlyRate * Math.pow(1.0 + monthlyRate, numMonths)) / (Math.pow(1.0 + monthlyRate, numMonths) - 1.0);
  return Math.round(emi);
}

/**
 * Simulates investment financial cash flows, yields, ROI and future valuation
 */
export function simulateInvestment(params: SimulationParams): SimulationResult {
  const purchaseLakhs = params.purchasePriceLakhs;
  const purchaseInr = purchaseLakhs * 100000;
  const downPaymentPct = params.downPaymentPct || 20;
  const downPaymentInr = purchaseInr * (downPaymentPct / 100.0);
  const loanAmountInr = purchaseInr - downPaymentInr;
  const interestRate = params.interestRate || 8.5;
  const tenureYears = 20;
  const monthlyRent = params.monthlyRent || 25000;
  const vacancyRate = params.vacancyRatePct ?? 5.0;
  const appreciationRate = params.appreciationRatePct ?? 5.0;
  const holdingPeriod = params.holdingPeriod || 5;

  const monthlyEmi = calculateEmi(loanAmountInr, interestRate, tenureYears);
  const effectiveMonthlyRent = monthlyRent * (1.0 - vacancyRate / 100.0);
  const netMonthlyCashFlow = Math.round(effectiveMonthlyRent - monthlyEmi);
  const netAnnualCashFlow = Math.round(netMonthlyCashFlow * 12);
  const rentalYieldPct = parseFloat(((monthlyRent * 12.0) / purchaseInr * 100.0).toFixed(2));

  const futureValInr = purchaseInr * Math.pow(1.0 + (appreciationRate / 100.0), holdingPeriod);
  const projectedFutureValLakhs = parseFloat((futureValInr / 100000.0).toFixed(2));
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
  if (totalRoiPct >= 40.0 && netMonthlyCashFlow > -15000) {
    decision = 'BUY';
  } else if (totalRoiPct >= 20.0 && netMonthlyCashFlow > -30000) {
    decision = 'HOLD';
  } else {
    decision = 'AVOID';
  }

  const projected2025ValLakhs = parseFloat((purchaseLakhs * (1.0 + (appreciationRate / 100.0))).toFixed(2));
  const projected2026ValLakhs = parseFloat((purchaseLakhs * Math.pow(1.0 + (appreciationRate / 100.0), 2)).toFixed(2));


  return {
    monthlyEmi,
    netMonthlyCashFlow,
    netAnnualCashFlow,
    rentalYieldPct,
    projectedFutureValLakhs,
    projected2025ValLakhs,
    projected2026ValLakhs,
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
  const targetRentBuy = Math.round((currentPriceLakhs * 100000.0 * 0.045) / 12.0);
  const rentGap = targetRentBuy - currentRentInr;

  let priceFlipText = '';
  if (currentDecision === 'BUY') {
    priceFlipText = `Verdict flips from BUY to HOLD if asking price increases by ₹${(targetAvoidPriceLakhs - currentPriceLakhs).toFixed(1)} Lakhs (+${((targetAvoidPriceLakhs - currentPriceLakhs)/currentPriceLakhs*100).toFixed(1)}%).`;
  } else if (currentDecision === 'HOLD') {
    priceFlipText = `Verdict flips to BUY if seller discounts price by ₹${Math.abs(priceGapToBuy).toFixed(1)} Lakhs (-${Math.abs((priceGapToBuy/currentPriceLakhs)*100).toFixed(1)}%).`;
  } else {
    priceFlipText = `Verdict flips to BUY if asking price is negotiated down by ₹${priceGapToBuy.toFixed(1)} Lakhs to ₹${targetBuyPriceLakhs} Lakhs.`;
  }

  let rentFlipText = '';
  if (currentAnnualYield >= 4.5) {
    const minViableRent = Math.round((currentPriceLakhs * 100000.0 * 0.035) / 12.0);
    rentFlipText = `Verdict remains positive as long as monthly rent stays above ₹${minViableRent.toLocaleString()}/mo (3.5% yield floor).`;
  } else {
    rentFlipText = `Verdict flips to BUY if monthly rental achieves ₹${targetRentBuy.toLocaleString()}/mo (+₹${Math.max(0, rentGap).toLocaleString()}/mo).`;
  }

  const maxViableInterestRate = parseFloat(Math.max(6.0, 11.5 - (currentDiffPct * 0.2)).toFixed(2));
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

/**
 * Natural Language Query Parser & Matcher for AI Advisor
 */
export function queryAdvisor(query: string, allProperties: Property[] = mockProperties): {
  answer: string;
  matchedProperties: Property[];
} {
  const q = query.toLowerCase();

  // Extract budget
  let maxBudgetLakhs = 500;
  const lakhMatch = q.match(/(\d+)\s*(lakh|lac|l)/i);
  if (lakhMatch) {
    maxBudgetLakhs = parseInt(lakhMatch[1], 10);
  }

  // Extract BHK
  let targetBhk: number | null = null;
  const bhkMatch = q.match(/(\d+)\s*bhk/i);
  if (bhkMatch) {
    targetBhk = parseInt(bhkMatch[1], 10);
  }

  // Extract Location
  const localities = ['whitefield', 'electronic city', 'sarjapur road', 'sarjapur', 'hsr layout', 'hsr', 'indiranagar', 'marathahalli', 'bellandur', 'hebbal', 'thanisandra', 'yelahanka', 'rajaji nagar'];
  let matchedLoc = '';
  for (const loc of localities) {
    if (q.includes(loc)) {
      matchedLoc = loc;
      break;
    }
  }

  // Filter properties
  let filtered = allProperties.filter((p) => {
    const budgetOk = p.askingPriceLakhs <= maxBudgetLakhs * 1.15;
    const bhkOk = targetBhk === null || p.bhk === targetBhk;
    const locOk = !matchedLoc || p.location.toLowerCase().includes(matchedLoc);
    return budgetOk && bhkOk && locOk;
  });

  if (filtered.length === 0) {
    filtered = allProperties.filter((p) => !matchedLoc || p.location.toLowerCase().includes(matchedLoc));
  }
  if (filtered.length === 0) {
    filtered = allProperties.slice(0, 3);
  }

  const top = filtered.sort((a, b) => b.investmentScore - a.investmentScore).slice(0, 3);
  const best = top[0];

  const answer = `Based on RealVest property valuation and Bengaluru market analysis:\n\n` +
    `• **Top Match**: ${best.title} (${best.code})\n` +
    `• **Valuation Deal**: Asking ₹${best.askingPriceLakhs.toFixed(1)} L vs Estimated Value of ₹${best.fairValueLakhs.toFixed(1)} L (${best.dealStatus})\n` +
    `• **Rental Cash Flow**: ₹${best.monthlyRent.toLocaleString()}/mo with a ${best.annualYield}% annual yield\n` +
    `• **Verdict**: ${best.recommendation} (${best.confidenceScore}% Confidence) — Investment Score: ${best.investmentScore}/100\n` +
    `• **Key Driver**: ${best.reasons[0] || 'Strong micro-market transaction liquidity.'}`;

  return {
    answer,
    matchedProperties: top,
  };
}
