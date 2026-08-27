import type { Property } from '../types';
import type { Language } from '../i18n/translations';
import { mockProperties } from '../data/mockProperties';

export interface AdvisorResponse {
  answer: string;
  matchedProperties: Property[];
}

export const advisorService = {
  /**
   * Natural Language Query Parser & Matcher for AI Advisor
   */
  async query(query: string, language: Language = 'en', allProperties: Property[] = mockProperties): Promise<AdvisorResponse> {
    await new Promise((res) => setTimeout(res, 100));
    const q = query.toLowerCase();

    // Extract budget
    let maxBudgetLakhs = 500;
    const croreMatch = q.match(/(\d+(?:\.\d+)?)\s*(cr|crore|ಕೋಟಿ|करोड़)/i);
    const lakhMatch = q.match(/(\d+)\s*(lakh|lac|l|ಲಕ್ಷ|लाख)/i);
    if (croreMatch) {
      maxBudgetLakhs = parseFloat(croreMatch[1]) * 100;
    } else if (lakhMatch) {
      maxBudgetLakhs = parseInt(lakhMatch[1], 10);
    }

    // Extract BHK
    let targetBhk: number | null = null;
    const bhkMatch = q.match(/(\d+)\s*bhk/i);
    if (bhkMatch) {
      targetBhk = parseInt(bhkMatch[1], 10);
    }

    // Extract Localities in Bengaluru
    const localities = [
      'whitefield', 'electronic city', 'sarjapur', 'hsr', 'indiranagar',
      'marathahalli', 'bellandur', 'hebbal', 'thanisandra', 'yelahanka',
      'rajaji nagar', 'koramangala', 'vaarthur', 'haralur', 'bannerghatta'
    ];
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

    if (filtered.length === 0 && matchedLoc) {
      filtered = allProperties.filter((p) => p.location.toLowerCase().includes(matchedLoc));
    }
    if (filtered.length === 0) {
      filtered = allProperties.slice(0, 3);
    }

    const top = filtered.sort((a, b) => b.investmentScore - a.investmentScore).slice(0, 3);
    const best = top[0];

    let answer = '';
    if (language === 'hi') {
      answer = `बेंगलुरु रियल एस्टेट मॉडल और डेटासेट के आधार पर:\n\n` +
        `• **शीर्ष मिलान**: ${best.title} (${best.code})\n` +
        `• **मूल्यांकन**: मांग ₹${best.askingPriceLakhs.toFixed(1)} लाख बनाम एमएल उचित मूल्य ₹${best.fairValueLakhs.toFixed(1)} लाख (${best.dealStatus})\n` +
        `• **किराया नकदी प्रवाह**: ₹${best.monthlyRent.toLocaleString('en-IN')}/माह (${best.annualYield}% वार्षिक यील्ड)\n` +
        `• **निर्णय**: ${best.recommendation} (${best.confidenceScore}% विश्वास स्कोर) — स्कोर: ${best.investmentScore}/100\n` +
        `• **मुख्य चालक**: ${best.reasons[0] || 'मजबूत माइक्रो-मार्केट लिक्विडिटी।'}`;
    } else if (language === 'kn') {
      answer = `ಬೆಂಗಳೂರು ರಿಯಲ್ ಎಸ್ಟೇಟ್ ಡೇಟಾ ಮತ್ತು ವಿಶ್ಲೇಷಣೆಯ ಆಧಾರದ ಮೇಲೆ:\n\n` +
        `• **ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆ**: ${best.title} (${best.code})\n` +
        `• **ಬೆಲೆ ವಿಶ್ಲೇಷಣೆ**: ಕೇಳಲಾದ ಬೆಲೆ ₹${best.askingPriceLakhs.toFixed(1)} ಲಕ್ಷ vs ಅಂದಾಜು ನ್ಯಾಯಯುತ ಬೆಲೆ ₹${best.fairValueLakhs.toFixed(1)} ಲಕ್ಷ (${best.dealStatus})\n` +
        `• **ಬಾಡಿಗೆ ಆದಾಯ**: ₹${best.monthlyRent.toLocaleString('en-IN')}/ತಿಂಗಳು (${best.annualYield}% ವಾರ್ಷಿಕ ಇಳುವರಿ)\n` +
        `• **ತೀರ್ಪು**: ${best.recommendation} (${best.confidenceScore}% ವಿಶ್ವಾಸಾರ್ಹತೆ) — ಹೂಡಿಕೆ ಸ್ಕೋರ್: ${best.investmentScore}/100\n` +
        `• **ಮುಖ್ಯ ಅಂಶ**: ${best.reasons[0] || 'ಬಲವಾದ ಮಾರುಕಟ್ಟೆ ಬೇಡಿಕೆ ಮತ್ತು ಮೂಲಸೌಕರ್ಯ.'}`;
    } else {
      answer = `Based on RealVest property valuation and Bengaluru market analysis:\n\n` +
        `• **Top Match**: ${best.title} (${best.code})\n` +
        `• **Valuation Deal**: Asking ₹${best.askingPriceLakhs.toFixed(1)} L vs Estimated Value of ₹${best.fairValueLakhs.toFixed(1)} L (${best.dealStatus})\n` +
        `• **Rental Cash Flow**: ₹${best.monthlyRent.toLocaleString('en-IN')}/mo with a ${best.annualYield}% annual yield\n` +
        `• **Verdict**: ${best.recommendation} (${best.confidenceScore}% Confidence) — Investment Score: ${best.investmentScore}/100\n` +
        `• **Key Driver**: ${best.reasons[0] || 'Strong micro-market transaction liquidity.'}`;
    }

    return {
      answer,
      matchedProperties: top,
    };
  }
};
