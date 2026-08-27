import type { Property } from '../types';
import type { Language } from '../i18n/translations';
import { mockProperties } from '../data/mockProperties';

export interface AdvisorResponse {
  answer: string;
  matchedProperties: Property[];
  sources?: string[];
}

export const advisorService = {
  /**
   * Natural Language Query Parser & Matcher for AI Advisor (Client-Side Intelligence Engine)
   */
  async query(
    query: string,
    language: Language = 'en',
    allProperties: Property[] = mockProperties,
    contextProperty?: Property | null
  ): Promise<AdvisorResponse> {
    await new Promise((res) => setTimeout(res, 60));
    const q = query.toLowerCase().trim();

    // 1. Buy vs Rent queries
    if (q.includes('buy vs rent') || q.includes('buy or rent') || q.includes('rent vs buy') || q.includes('should i buy') || q.includes('should i rent')) {
      const answer =
        `**Buy vs. Rent Decision Analysis for Bengaluru:**\n\n` +
        `**When Buying Makes Sense:**\n` +
        `• **Holding Horizon of 5+ Years:** Amortizes the Karnataka 6.6% stamp duty/registration and transaction costs.\n` +
        `• **Capital Growth Corridors:** High-demand sub-markets (e.g. Whitefield, Sarjapur Road, Hebbal) with solid equity appreciation.\n` +
        `• **Tax Benefits & Equity:** Converting monthly housing expenditure into asset equity with deductions under Sec 24 & 80C.\n\n` +
        `**When Renting Makes Sense:**\n` +
        `• **Horizon Under 3 Years:** High job mobility across distant IT corridors.\n` +
        `• **Low Rental Yield Entry:** Premium properties offer ~3.8%–5.5% rental yield, allowing surplus capital to generate higher financial market returns.\n` +
        `• **High Interest Rate Climate:** If home loan interest (~8.5%) substantially exceeds net rental yield.\n\n` +
        `*Tip: Use the **Decision Simulator** tab to test your exact EMI vs Rent cash flow.*`;

      return {
        answer,
        matchedProperties: allProperties.slice(0, 3),
        sources: ['RealVest Decision Matrix', 'Bengaluru Rental Market Data'],
      };
    }

    // 2. Risk Questions
    if (q.includes('biggest risks') || q.includes('what are the risks') || q.includes('risks') || q.includes('drawbacks')) {
      const target = contextProperty || allProperties[0];
      const answer =
        `**The 5 Biggest Real Estate Risks in Bengaluru:**\n\n` +
        `• **1. Valuation & Premium Risk:** Buying above sub-market benchmarks reduces downside cushion. RealVest calculates estimated fair value to verify discount buffers.\n` +
        `• **2. Rental Vacancy & Yield Compression:** Tenant turnover and maintenance overheads in tech corridors affecting net cash flow.\n` +
        `• **3. Liquidity & Holding Period:** Real estate is an illiquid asset requiring a minimum 3–5 year horizon for capital gains.\n` +
        `• **4. Civic Infrastructure:** Peripheral suburbs may face transit delays or private water tanker dependency.\n` +
        `• **5. Floating Interest Rates:** Home loan rate hikes (~8.5% p.a.) directly impact monthly cash flows.\n\n` +
        `*Tip: Stress-test these variables directly in the Decision Simulator tab.*`;

      return {
        answer,
        matchedProperties: target ? [target] : allProperties.slice(0, 3),
        sources: ['RealVest Risk Radar Framework'],
      };
    }

    // 3. "Why was this property recommended?" / Property Intelligence
    if (q.includes('why was this property recommended') || q.includes('why recommended') || q.includes('why this property') || q.includes('is this property good') || q.includes('tell me about')) {
      const target = contextProperty || allProperties.sort((a, b) => b.investmentScore - a.investmentScore)[0];
      if (target) {
        const dealDesc = target.dealDiffPct < 0
          ? `${Math.abs(target.dealDiffPct)}% below estimated value (Discount buffer)`
          : (target.dealDiffPct > 0 ? `${target.dealDiffPct}% above estimated value` : 'At fair market value');

        const reasons = target.reasons && target.reasons.length > 0 ? target.reasons : [
          `Strong rental demand in ${target.location} IT corridor.`,
          `Solid gross rental yield of ${target.annualYield}% p.a.`,
          `High transaction volume with ${target.confidenceScore}% data confidence.`
        ];

        const answer =
          `**${target.title}** (${target.location})\n\n` +
          `• **Asking Price:** ₹${target.askingPriceLakhs.toFixed(1)} Lakhs\n` +
          `• **Estimated Value:** ₹${target.fairValueLakhs.toFixed(1)} Lakhs (${dealDesc})\n` +
          `• **Expected Rent:** ₹${target.monthlyRent.toLocaleString('en-IN')}/month (${target.annualYield}% gross yield)\n` +
          `• **Investment Score:** ${target.investmentScore}/100 — **${target.recommendation}** (${target.confidenceScore}% Confidence)\n\n` +
          `**Why Recommended:**\n` +
          reasons.slice(0, 3).map((r) => `• ${r}`).join('\n') + '\n\n' +
          `*Note: RealVest recommendations are decision support based on empirical market records.*`;

        return {
          answer,
          matchedProperties: [target],
          sources: [`Property Intelligence: ${target.title}`],
        };
      }
    }

    // 4. Locality Queries (e.g. "Is Whitefield good for rental income?")
    const localities = [
      { key: 'whitefield', name: 'Whitefield' },
      { key: 'electronic city', name: 'Electronic City' },
      { key: 'sarjapur', name: 'Sarjapur Road' },
      { key: 'hsr', name: 'HSR Layout' },
      { key: 'indiranagar', name: 'Indiranagar' },
      { key: 'marathahalli', name: 'Marathahalli' },
      { key: 'bellandur', name: 'Bellandur' },
      { key: 'hebbal', name: 'Hebbal' },
      { key: 'thanisandra', name: 'Thanisandra' },
      { key: 'yelahanka', name: 'Yelahanka' },
      { key: 'koramangala', name: 'Koramangala' },
    ];

    let matchedLocObj = localities.find((l) => q.includes(l.key));

    if (matchedLocObj) {
      const locProps = allProperties.filter((p) => p.location.toLowerCase().includes(matchedLocObj!.key));
      const activeProps = locProps.length > 0 ? locProps : allProperties;
      const avgPrice = (activeProps.reduce((sum, p) => sum + p.askingPriceLakhs, 0) / activeProps.length).toFixed(1);
      const avgYield = (activeProps.reduce((sum, p) => sum + p.annualYield, 0) / activeProps.length).toFixed(2);

      const answer =
        `**${matchedLocObj.name} Investment & Rental Market Analysis:**\n\n` +
        `• **Average Benchmark Price:** ~₹${avgPrice} Lakhs\n` +
        `• **Average Gross Rental Yield:** **${avgYield}% p.a.** (vs Bengaluru median of 4.1%)\n` +
        `• **Tenant Profile:** High-density IT/tech professionals seeking 2 BHK & 3 BHK units.\n\n` +
        `**Key Growth Drivers:**\n` +
        `• High employment density with major tech parks and commercial campuses.\n` +
        `• Metro and arterial road connectivity ensuring high occupancy rates.\n\n` +
        `**Considerations & Risks:**\n` +
        `• Peak hour traffic along main arterial corridors.\n` +
        `• Premium asking prices in prime societies require careful valuation verification.\n\n` +
        `**Top Listings in this Corridor:**\n` +
        activeProps.slice(0, 2).map((p) => `• **${p.title}** — ₹${p.askingPriceLakhs.toFixed(1)}L (Yield: ${p.annualYield}%, Score: ${p.investmentScore}/100)`).join('\n');

      return {
        answer,
        matchedProperties: activeProps.slice(0, 3),
        sources: [`${matchedLocObj.name} Market Intelligence`],
      };
    }

    // 5. Budget & Property Options (e.g. "Where should I invest ₹50L?", "I have ₹30L")
    let maxBudgetLakhs = 50.0;
    const croreMatch = q.match(/(\d+(?:\.\d+)?)\s*(cr|crore|ಕೋಟಿ|करोड़)/i);
    const lakhMatch = q.match(/(\d+(?:\.\d+)?)\s*(lakh|lakhs|lac|l|ಲಕ್ಷ|लाख)?/i);
    const numMatch = q.match(/(\d+(?:\.\d+)?)/);

    if (croreMatch) {
      maxBudgetLakhs = parseFloat(croreMatch[1]) * 100;
    } else if (lakhMatch && parseFloat(lakhMatch[1]) > 5) {
      maxBudgetLakhs = parseFloat(lakhMatch[1]);
    } else if (numMatch && parseFloat(numMatch[1]) > 5) {
      maxBudgetLakhs = parseFloat(numMatch[1]);
    }

    let filtered = allProperties.filter((p) => p.askingPriceLakhs <= maxBudgetLakhs * 1.25);
    if (filtered.length === 0) {
      filtered = [...allProperties].sort((a, b) => a.askingPriceLakhs - b.askingPriceLakhs).slice(0, 3);
    }

    const top = filtered.sort((a, b) => b.investmentScore - a.investmentScore).slice(0, 3);

    let answer =
      `**Investment Options for a Budget of ₹${maxBudgetLakhs.toFixed(0)} Lakhs in Bengaluru:**\n\n` +
      `**1. Recommended Micro-Markets:**\n`;

    if (maxBudgetLakhs <= 40) {
      answer += `• **Electronic City & Chandapura:** Best entry point for high rental yield (5.6%–6.4%) and tech worker tenant demand.\n`;
    } else if (maxBudgetLakhs <= 75) {
      answer += `• **Whitefield & Sarjapur Road:** Balanced mix of steady capital appreciation (+12% YoY) and solid rental demand (5.0%–5.5% yield).\n`;
    } else {
      answer += `• **Hebbal & Indiranagar:** Premium residential corridors with institutional liquidity and low downside risk.\n`;
    }

    answer += `\n**2. Top Matching Properties from Bengaluru Dataset:**\n`;
    top.forEach((p) => {
      answer += `• **${p.title}** (${p.location}) — Asking: ₹${p.askingPriceLakhs.toFixed(1)}L | Est. Value: ₹${p.fairValueLakhs.toFixed(1)}L | Rent: ₹${p.monthlyRent.toLocaleString('en-IN')}/mo (Yield: ${p.annualYield}%) | Score: ${p.investmentScore}/100 (**${p.recommendation}**)\n`;
    });

    answer +=
      `\n**3. Strategy Recommendation:**\n` +
      `• Focus on 2 BHK configurations with Ready-to-Move status for immediate rental cash flow.\n` +
      `• Target a minimum holding period of 3–5 years.\n\n` +
      `*Note: RealVest recommendations are data-grounded decision support based on Bengaluru market records, not guaranteed financial advice.*`;

    return {
      answer,
      matchedProperties: top,
      sources: ['Bengaluru Market Budget Analysis', 'RealVest Dataset'],
    };
  },
};
