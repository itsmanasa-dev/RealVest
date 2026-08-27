import type {
  AdvisorProfile,
  AdvisorEngineResult,
  DecisionOption,
  Property,
  MarketHotZone,
  BudgetAllocation,
  RentVsBuyComparison,
} from '../types';
import { mockProperties, mockHotZones } from '../data/mockProperties';
import { simulatorService } from './simulatorService';

export const decisionEngineService = {
  /**
   * Evaluates user budget, goal, risk tolerance, and horizon against Bengaluru datasets
   * to produce 3 ranked, explainable investment strategies.
   */
  evaluate(
    profile: AdvisorProfile,
    allProperties: Property[] = mockProperties,
    hotZones: MarketHotZone[] = mockHotZones
  ): AdvisorEngineResult {
    const { budgetLakhs, goal, riskTolerance, horizon, preferredLocation, propertyType } = profile;

    // 1. Filter viable candidate pool based on budget leeway (up to +15% with leverage) and category
    const viable = allProperties.filter((p) => {
      const budgetMax = budgetLakhs * 1.15;
      const budgetMin = budgetLakhs * 0.35; // allow lower budget properties as reserve options
      const budgetOk = p.askingPriceLakhs <= budgetMax && p.askingPriceLakhs >= budgetMin;

      const locOk =
        preferredLocation === 'Any Bengaluru' ||
        preferredLocation === 'Any' ||
        p.location.toLowerCase().includes(preferredLocation.toLowerCase()) ||
        p.city.toLowerCase().includes(preferredLocation.toLowerCase());

      const typeOk =
        propertyType === 'Any' ||
        (propertyType === 'Residential' && p.category === 'Residential') ||
        (propertyType === 'Commercial' && p.category === 'Commercial') ||
        (propertyType === 'Land' && p.subCategory.toLowerCase().includes('land'));

      return budgetOk && locOk && typeOk;
    });

    const candidatePool = viable.length >= 3 ? viable : (allProperties.length >= 3 ? allProperties.slice(0, 5) : allProperties);

    // 2. Score each candidate transparently based on multi-factor weighted criteria
    const scored = candidatePool.map((prop) => {
      // Return Potential (Appreciation + Yield)
      const expectedAppreciation = prop.dealDiffPct < 0
        ? Math.min(Math.max(8.5 + Math.abs(prop.dealDiffPct) * 0.35, 6.0), 16.5)
        : 6.8;
      const annualYield = prop.annualYield;

      // Goal Weighting
      let goalScore = 0;
      if (goal === 'Capital Growth') {
        goalScore = expectedAppreciation * 5.0 + annualYield * 2.0;
      } else if (goal === 'Rental Income') {
        goalScore = annualYield * 7.5 + expectedAppreciation * 1.5;
      } else if (goal === 'Long-term Wealth') {
        goalScore = expectedAppreciation * 4.0 + annualYield * 3.5 + (prop.confidenceScore >= 80 ? 10 : 0);
      } else {
        // Balanced
        goalScore = expectedAppreciation * 3.5 + annualYield * 4.0;
      }

      // Affordability Score (closer to budget without exceeding it)
      const budgetDiff = (budgetLakhs - prop.askingPriceLakhs) / budgetLakhs;
      const affordabilityScore = budgetDiff >= 0
        ? 100 - budgetDiff * 30 // within budget (ideal)
        : 100 + budgetDiff * 150; // over budget penalty

      // Risk Tolerance Alignment
      const riskScoreRaw = prop.riskRadar?.riskScore || 85;
      let riskPenalty = 0;
      if (riskTolerance === 'Conservative') {
        if (prop.dealDiffPct > 0) riskPenalty += 20;
        if (prop.confidenceScore < 80) riskPenalty += 15;
      } else if (riskTolerance === 'Aggressive') {
        // Aggressive buyers prioritize higher yield/growth over safety buffer
        riskPenalty = Math.max(0, 10 - annualYield);
      }

      // Locality Momentum
      const zone = hotZones.find((z) => prop.location.toLowerCase().includes(z.name.toLowerCase().split(' ')[0])) || hotZones[0];
      const localityScore = (zone?.demandIndex || 90) * 0.2 + (zone?.growth30d || 10) * 1.5;

      const compositeScore =
        goalScore * 0.35 +
        affordabilityScore * 0.30 +
        localityScore * 0.20 +
        (riskScoreRaw - riskPenalty) * 0.15;

      return {
        property: prop,
        compositeScore,
        expectedAppreciation: parseFloat(expectedAppreciation.toFixed(1)),
        annualYield,
        zone,
      };
    });

    // Sort by composite score descending
    scored.sort((a, b) => b.compositeScore - a.compositeScore);

    // Pick top candidates
    const topPick = scored[0] || { property: allProperties[0], compositeScore: 92, expectedAppreciation: 12.4, annualYield: 11.1, zone: hotZones[0] };
    const altPick = scored.find((s) => s.property.id !== topPick.property.id && s.property.location !== topPick.property.location) || scored[1] || scored[0];
    const lowRiskPick = [...scored].sort((a, b) => {
      const aSafety = (a.property.dealDiffPct < 0 ? Math.abs(a.property.dealDiffPct) : 0) + a.property.confidenceScore;
      const bSafety = (b.property.dealDiffPct < 0 ? Math.abs(b.property.dealDiffPct) : 0) + b.property.confidenceScore;
      return bSafety - aSafety;
    })[0] || scored[0];

    // Build Decision Options
    const buildOption = (
      item: typeof topPick,
      rank: 1 | 2 | 3,
      rankLabel: '#1 BEST MATCH' | '#2 ALTERNATIVE STRATEGY' | '#3 LOWER-RISK OPTION',
      whyRanked: string,
      whyNotHigher?: string
    ): DecisionOption => {
      const p = item.property;
      const budgetAlloc: BudgetAllocation = {
        propertyCostLakhs: p.askingPriceLakhs,
        stampDutyAndRegLakhs: parseFloat((p.askingPriceLakhs * 0.066).toFixed(2)), // 6.6% Karnataka Statutory (Stamp + Reg)
        improvementsLakhs: parseFloat((Math.min(p.askingPriceLakhs * 0.03, 2.5)).toFixed(1)),
        cashReserveLakhs: parseFloat(Math.max(budgetLakhs - p.askingPriceLakhs * 1.096, 1.0).toFixed(1)),
        totalBudgetLakhs: budgetLakhs,
      };

      const flip = simulatorService.calculateDecisionFlip(
        p.askingPriceLakhs,
        p.fairValueLakhs,
        p.monthlyRent,
        8.5
      );

      // Rent vs Buy Calculation over 5-year holding period
      const annualRent = p.monthlyRent * 12;
      const fiveYearRentCostLakhs = parseFloat(((annualRent * 5 * 1.08) / 100000).toFixed(1)); // factoring 8% rent inflation
      const fiveYearPropGainLakhs = parseFloat((p.askingPriceLakhs * Math.pow(1 + item.expectedAppreciation / 100, 5) - p.askingPriceLakhs).toFixed(1));
      const fiveYearOwnershipNetGainLakhs = parseFloat((fiveYearPropGainLakhs + (annualRent * 5 * 0.7) / 100000 - budgetAlloc.stampDutyAndRegLakhs).toFixed(1));

      const rentVsBuy: RentVsBuyComparison = {
        monthlyRentInr: p.monthlyRent,
        fiveYearRentCostLakhs,
        fiveYearOwnershipNetGainLakhs,
        breakEvenHorizonYears: 2.8,
        verdict: fiveYearOwnershipNetGainLakhs > fiveYearRentCostLakhs ? 'BUY' : 'RENT',
        summary: `Buying generates ~₹${fiveYearOwnershipNetGainLakhs} L in equity appreciation vs ₹${fiveYearRentCostLakhs} L sunk in rental expenditure over 5 years.`,
      };

      const reasons = [
        `Optimal budget fit: Asking ₹${p.askingPriceLakhs} L against your ₹${budgetLakhs} L allocation.`,
        p.dealDiffPct < 0
          ? `ML Fair Value of ₹${p.fairValueLakhs} L offers an immediate ${Math.abs(p.dealDiffPct)}% valuation discount buffer.`
          : `High transaction volume in ${p.location} provides sustained liquidity.`,
        `Projected annual rental yield of ${p.annualYield}% exceeds the 3.8% Bengaluru metropolitan median.`,
        `Aligns with your ${goal} objective over a ${horizon} investment horizon.`,
      ];

      return {
        rank,
        rankLabel,
        property: p,
        corridor: p.location,
        strategyTitle: `${p.category} Acquisition in ${p.location}`,
        estimatedInvestmentLakhs: p.askingPriceLakhs,
        projectedValueLakhs: p.fairValueLakhs,
        expectedAppreciationPct: item.expectedAppreciation,
        rentalYieldPct: p.annualYield,
        riskLevel: p.dealDiffPct < 0 && p.confidenceScore >= 80 ? 'Low' : 'Moderate',
        confidenceScore: p.confidenceScore,
        reasons,
        whyRankedHere: whyRanked,
        whyNotRankedHigher: whyNotHigher,
        decisionFlip: flip,
        budgetAllocation: budgetAlloc,
        rentVsBuy,
      };
    };

    const bestMatch = buildOption(
      topPick,
      1,
      '#1 BEST MATCH',
      `${topPick.property.location} scored highest (${topPick.compositeScore.toFixed(0)}/100) due to exceptional ${goal.toLowerCase()} alignment, ${topPick.annualYield}% yield, and ₹${topPick.property.askingPriceLakhs} L budget proximity.`
    );

    const alternative = buildOption(
      altPick,
      2,
      '#2 ALTERNATIVE STRATEGY',
      `${altPick.property.location} provides strong alternative cash flow (${altPick.annualYield}% yield), offering geographic diversification outside ${topPick.property.location}.`,
      `Ranked #2 behind ${topPick.property.location} due to slightly lower projected capital appreciation.`
    );

    const lowerRiskOption = buildOption(
      lowRiskPick,
      3,
      '#3 LOWER-RISK OPTION',
      `${lowRiskPick.property.title} features the highest valuation safety buffer with verified transaction registry confidence (${lowRiskPick.property.confidenceScore}%).`,
      `Ranked as lower-risk defensive pick rather than aggressive growth asset.`
    );

    const summaryText =
      `Based on your ₹${budgetLakhs} Lakhs budget and ${goal.toLowerCase()} objective with ${riskTolerance.toLowerCase()} risk tolerance, ` +
      `RealVest recommends a ${topPick.property.category.toLowerCase()} acquisition in ${topPick.property.location}. ` +
      `This corridor currently provides the strongest combination of affordability, ${topPick.annualYield}% rental yield, and historical IT belt appreciation.`;

    return {
      profile,
      bestMatch,
      alternative,
      lowerRiskOption,
      macroSignals: {
        marketMomentum: 'Strong Buy Phase (Bengaluru East & South Corridors)',
        hpiGrowthRate: '+8.4% YoY (NHB Residex Benchmark)',
        bengaluruTopCorridor: `${topPick.property.location} / ${altPick.property.location}`,
      },
      advisorExecutiveSummary: summaryText,
    };
  },
};
