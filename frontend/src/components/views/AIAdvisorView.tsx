import React, { useState } from 'react';
import type {
  Property,
  NavTab,
  AdvisorProfile,
  InvestmentGoal,
  RiskTolerance,
  InvestmentHorizon,
  PropertyTypePreference,
  AdvisorEngineResult,
  DecisionOption,
} from '../../types';
import {
  Bot,
  Send,
  ArrowUpRight,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  MapPin,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Building,
  RotateCcw,
  Scale,
  PieChart,
  Home,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';
import { decisionEngineService } from '../../services/decisionEngineService';
import { advisorService } from '../../services/advisorService';
import { useTranslation } from '../../context/LanguageContext';
import { formatInrLakhs, formatInrRent, formatPercent } from '../../utils/currency';

interface AIAdvisorViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onNavigate?: (tab: NavTab) => void;
}

export const AIAdvisorView: React.FC<AIAdvisorViewProps> = ({
  properties,
  onSelectProperty,
  onNavigate,
}) => {
  const { language, t } = useTranslation();

  // User Profile Form State
  const [budgetLakhs, setBudgetLakhs] = useState<number>(50);
  const [goal, setGoal] = useState<InvestmentGoal>('Capital Growth');
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>('Moderate');
  const [horizon, setHorizon] = useState<InvestmentHorizon>('3–5 years');
  const [preferredLocation, setPreferredLocation] = useState<string>('Any Bengaluru');
  const [propertyType, setPropertyType] = useState<PropertyTypePreference>('Residential');

  // Evaluation State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'decision' | 'chat'>('decision');
  const [selectedRankTab, setSelectedRankTab] = useState<1 | 2 | 3>(1);

  // Compute Initial Evaluation
  const [engineResult, setEngineResult] = useState<AdvisorEngineResult>(() =>
    decisionEngineService.evaluate(
      {
        budgetLakhs: 50,
        goal: 'Capital Growth',
        riskTolerance: 'Moderate',
        horizon: '3–5 years',
        preferredLocation: 'Any Bengaluru',
        propertyType: 'Residential',
      },
      properties
    )
  );

  // Chat State
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<
    { sender: 'user' | 'ai'; text: string; matchedProperty?: Property }[]
  >([
    {
      sender: 'ai',
      text: `Hello! I am RealVest's AI Decision Advisor for Bengaluru. You can configure your investment profile above or ask questions regarding locations, ML valuations, yields, and macro forecasts.`,
    },
  ]);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = decisionEngineService.evaluate(
        {
          budgetLakhs,
          goal,
          riskTolerance,
          horizon,
          preferredLocation,
          propertyType,
        },
        properties
      );
      setEngineResult(result);
      setIsAnalyzing(false);
      setSelectedRankTab(1);
    }, 350);
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const updated = [...messages, { sender: 'user' as const, text: query }];
    setMessages(updated);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    const { answer, matchedProperties } = await advisorService.query(query, language, properties);
    const matched = matchedProperties[0] || properties[0];

    setIsTyping(false);
    setMessages([
      ...updated,
      {
        sender: 'ai',
        text: answer,
        matchedProperty: matched,
      },
    ]);
  };

  const activeOption: DecisionOption =
    selectedRankTab === 1
      ? engineResult.bestMatch
      : selectedRankTab === 2
      ? engineResult.alternative
      : engineResult.lowerRiskOption;

  const locationsList = [
    'Any Bengaluru',
    'Whitefield',
    'Indiranagar',
    'HSR Layout',
    'Electronic City',
    'Sarjapur Road',
    'Koramangala',
    'Bellandur',
    'Hebbal',
  ];

  return (
    <div className="space-y-6 pb-12 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-[#273449]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
              BENGALURU DECISION ENGINE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Personalized Investment Advisor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Targeted real estate capital allocation backed by ML valuation and verified corridor growth
          </p>
        </div>

        {/* View Mode Toggle (Decision Engine vs AI Chat) */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#273449]">
          <button
            onClick={() => setActiveTab('decision')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'decision'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Decision Plan
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Bot size={13} />
            <span>AI Q&A</span>
          </button>
        </div>
      </div>

      {/* STEP 1: Investment Advisor Input Controls (Card) */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#273449]">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-emerald-500" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Your Investment Profile & Preferences
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Step 1 of 2</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Budget Input & Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Investment Budget:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-extrabold text-sm">
                ₹{budgetLakhs} Lakhs ({formatInrLakhs(budgetLakhs)})
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={250}
              step={5}
              value={budgetLakhs}
              onChange={(e) => setBudgetLakhs(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-400">
              <span>₹15 L</span>
              <span>₹1 Cr</span>
              <span>₹2.5 Cr</span>
            </div>
          </div>

          {/* Investment Goal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Investment Goal:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['Capital Growth', 'Rental Income', 'Balanced', 'Long-term Wealth'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center truncate ${
                    goal === g
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Tolerance */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Risk Tolerance:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Conservative', 'Moderate', 'Aggressive'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskTolerance(r)}
                  className={`px-2 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
                    riskTolerance === r
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Investment Horizon */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Investment Horizon:
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(['1–3 years', '3–5 years', '5–10 years', '10+ years'] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`px-1.5 py-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer text-center ${
                    horizon === h
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Preferred Locality:
            </label>
            <div className="relative">
              <select
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#273449] bg-slate-50 dark:bg-[#172033] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none appearance-none cursor-pointer"
              >
                {locationsList.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <MapPin size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Property Category:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Any', 'Residential', 'Commercial'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setPropertyType(t)}
                  className={`px-2 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
                    propertyType === t
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button: ANALYZE MY OPTIONS */}
        <div className="pt-2">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            <span>{isAnalyzing ? 'Evaluating Bengaluru Datasets & ML Models...' : 'ANALYZE MY OPTIONS'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'decision' ? (
        /* STEP 2: Personalized Decision Engine Results */
        <div className="space-y-6 animate-fadeIn">
          {/* Executive Strategy Banner */}
          <div className="p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/5 dark:bg-[#111827] shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-[#273449]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Targeted Allocation Strategy
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {engineResult.bestMatch.strategyTitle}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-mono text-xs font-extrabold shadow-sm">
                  {engineResult.bestMatch.rankLabel}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#172033] text-slate-700 dark:text-slate-300 font-mono text-xs font-bold border border-slate-200 dark:border-[#273449]">
                  {engineResult.bestMatch.confidenceScore}% Confidence
                </span>
              </div>
            </div>

            {/* Executive Metrics 5-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#172033] border border-slate-100 dark:border-[#273449]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Est. Investment</span>
                <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {formatInrLakhs(engineResult.bestMatch.estimatedInvestmentLakhs)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#172033] border border-slate-100 dark:border-[#273449]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">ML Fair Value</span>
                <span className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {formatInrLakhs(engineResult.bestMatch.projectedValueLakhs)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#172033] border border-slate-100 dark:border-[#273449]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Rental Yield</span>
                <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {engineResult.bestMatch.rentalYieldPct}% p.a.
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#172033] border border-slate-100 dark:border-[#273449]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Exp. Appreciation</span>
                <span className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  +{engineResult.bestMatch.expectedAppreciationPct}%/yr
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#172033] border border-slate-100 dark:border-[#273449] col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Risk Rating</span>
                <span className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {engineResult.bestMatch.riskLevel} Risk
                </span>
              </div>
            </div>

            {/* Executive Explanation & Actions */}
            <div className="space-y-2.5 pt-2">
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {engineResult.advisorExecutiveSummary}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  onClick={() => onSelectProperty(engineResult.bestMatch.property)}
                  className="px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <span>View Property Analysis</span>
                  <ArrowUpRight size={14} />
                </button>

                {onNavigate && (
                  <>
                    <button
                      onClick={() => onNavigate('markets')}
                      className="px-4 py-2 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200 dark:border-[#273449] text-slate-800 dark:text-slate-200 font-bold text-xs hover:border-emerald-500 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <MapPin size={14} className="text-emerald-500" />
                      <span>View on Satellite Map</span>
                    </button>
                    <button
                      onClick={() => onNavigate('simulator')}
                      className="px-4 py-2 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200 dark:border-[#273449] text-slate-800 dark:text-slate-200 font-bold text-xs hover:border-emerald-500 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Sliders size={14} className="text-emerald-500" />
                      <span>Simulate Strategy</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Comparative Strategy Tabs (#1 Best Match, #2 Alternative, #3 Lower-Risk) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                2. Comparative Strategy Ranking
              </h3>
              <span className="text-xs font-mono text-slate-400">Evaluated from verified market data</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {([engineResult.bestMatch, engineResult.alternative, engineResult.lowerRiskOption] as const).map((opt) => {
                const isSelected = selectedRankTab === opt.rank;
                return (
                  <div
                    key={opt.rank}
                    onClick={() => setSelectedRankTab(opt.rank)}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-white dark:bg-[#111827] shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#273449]">
                        <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-extrabold ${
                          opt.rank === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-[#172033] text-slate-600 dark:text-slate-300'
                        }`}>
                          {opt.rankLabel}
                        </span>
                        <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                          {formatInrLakhs(opt.estimatedInvestmentLakhs)}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-2">
                        {opt.property.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} /> {opt.corridor}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#172033]">
                          <span className="text-[10px] text-slate-400 block">Yield</span>
                          <span className="font-bold text-slate-900 dark:text-white">{opt.rentalYieldPct}%</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#172033]">
                          <span className="text-[10px] text-slate-400 block">Growth</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">+{opt.expectedAppreciationPct}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                      <b>Why Ranked #{opt.rank}:</b> {opt.whyRankedHere}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Deep-Dive Analysis for Selected Option */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: "WHY REALVEST RECOMMENDS THIS" & "WHY NOT OTHERS?" */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#273449]">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Why RealVest Recommends This ({activeOption.rankLabel})
                </h4>
              </div>

              <div className="space-y-2">
                {activeOption.reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              {/* "WHY NOT THE OTHER OPTIONS?" */}
              <div className="pt-3 border-t border-slate-100 dark:border-[#273449] space-y-2">
                <div className="flex items-center gap-2">
                  <Scale size={15} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Why Not The Other Options?
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {activeOption.rank === 1
                    ? `Whitefield / ${engineResult.bestMatch.corridor} ranked #1 because it delivered the highest balanced composite score (${engineResult.bestMatch.expectedAppreciationPct}% capital growth + ${engineResult.bestMatch.rentalYieldPct}% rental yield) directly within your ₹${budgetLakhs} L budget.`
                    : activeOption.whyNotRankedHigher}
                </p>
              </div>

              {/* "WHAT WOULD CHANGE MY DECISION?" */}
              <div className="pt-3 border-t border-slate-100 dark:border-[#273449] space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={15} className="text-amber-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    What Would Change My Decision?
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-800 dark:text-amber-300 space-y-1">
                  <div>• {activeOption.decisionFlip.priceFlipText}</div>
                  <div>• {activeOption.decisionFlip.rentFlipText}</div>
                  <div>• {activeOption.decisionFlip.rateFlipText}</div>
                </div>
              </div>
            </div>

            {/* Right: Budget Allocation & Rent vs Buy */}
            <div className="space-y-6">
              {/* Budget Allocation */}
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#273449]">
                  <div className="flex items-center gap-2">
                    <PieChart size={16} className="text-emerald-500" />
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                      Transparent Budget Allocation (₹{budgetLakhs} L)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Karnataka Statutory</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-[#172033]">
                    <span className="text-slate-500 dark:text-slate-400">Property Purchase Cost</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      ₹{activeOption.budgetAllocation.propertyCostLakhs} L
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-[#172033]">
                    <span className="text-slate-500 dark:text-slate-400">Stamp Duty & Registration (~6.6%)</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      ₹{activeOption.budgetAllocation.stampDutyAndRegLakhs} L
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-[#172033]">
                    <span className="text-slate-500 dark:text-slate-400">Renovation & Interior Setup</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      ₹{activeOption.budgetAllocation.improvementsLakhs} L
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/20">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">Unallocated Cash Reserve</span>
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                      ₹{activeOption.budgetAllocation.cashReserveLakhs} L
                    </span>
                  </div>
                </div>
              </div>

              {/* Rent vs Buy Comparison Module */}
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#273449]">
                  <div className="flex items-center gap-2">
                    <Home size={16} className="text-emerald-500" />
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                      Rent vs Buy Analysis (5-Year Horizon)
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-mono text-[10px] font-bold">
                    VERDICT: {activeOption.rentVsBuy.verdict}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeOption.rentVsBuy.summary}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                  <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                    <span className="text-[10px] text-slate-400 block">5-Yr Sunk Rent</span>
                    <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400 mt-0.5 block">
                      ₹{activeOption.rentVsBuy.fiveYearRentCostLakhs} L
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                    <span className="text-[10px] text-slate-400 block">5-Yr Net Equity Gain</span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      +₹{activeOption.rentVsBuy.fiveYearOwnershipNetGainLakhs} L
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono text-center pt-1">
                  Estimated Break-even Period: <b>{activeOption.rentVsBuy.breakEvenHorizonYears} years</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STEP 3: Integrated AI Advisor Chat View */
        <div className="space-y-4 animate-fadeIn">
          {/* Chat Messages Container */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-4 min-h-[380px] max-h-[500px] overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {msg.sender === 'user' ? 'YOU' : <Bot size={16} />}
                </div>

                <div className={`max-w-xl space-y-2.5 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-line text-left ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-white font-medium shadow-sm'
                        : 'bg-slate-50 dark:bg-[#172033] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#273449]'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.matchedProperty && msg.sender === 'ai' && (
                    <div
                      onClick={() => onSelectProperty(msg.matchedProperty!)}
                      className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-[#172033] hover:border-emerald-500 transition-colors cursor-pointer text-left flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div>
                        <div className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                          {msg.matchedProperty.code} • {msg.matchedProperty.recommendation} ({msg.matchedProperty.confidenceScore}% Confidence)
                        </div>
                        <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                          {msg.matchedProperty.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          Asking: {formatInrLakhs(msg.matchedProperty.askingPriceLakhs)} • {msg.matchedProperty.annualYield}% Yield
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1 shadow-sm shrink-0">
                        View <ArrowUpRight size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Analyzing Bengaluru housing datasets & models...
              </div>
            )}
          </div>

          {/* Query Input Box */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask RealVest (e.g., 'Why Whitefield over Electronic City?', 'Should I rent or buy with ₹40L?')"
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm"
            />
            <button
              onClick={() => handleSend()}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send size={14} /> Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
