import React, { useState } from 'react';
import { Sliders, RotateCcw, Lightbulb, Save, ArrowLeft, Percent, Calculator, TrendingUp, Sparkles, Calendar } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { formatInrLakhs, formatInrRent, formatPercent } from '../../utils/currency';
import { simulatorService } from '../../services/simulatorService';

interface SimulatorViewProps {
  onBack?: () => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({ onBack }) => {
  const { t } = useTranslation();

  // Baseline Scenario Variables in INR
  const [purchasePriceLakhs, setPurchasePriceLakhs] = useState<number>(75);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [targetYield, setTargetYield] = useState<number>(6.5);
  const [holdingPeriod, setHoldingPeriod] = useState<number>(5);

  // Baseline Calculation (75L, 20% down, 8.5% interest, 6.5% yield, 5 years)
  const baseResult = simulatorService.calculateScenario({
    purchasePriceLakhs: 75,
    downPaymentPct: 20,
    interestRate: 8.5,
    monthlyRent: Math.round((7500000 * 0.065) / 12),
    holdingPeriod: 5,
  });

  // Dynamic User Scenario Calculation
  const monthlyRent = Math.round((purchasePriceLakhs * 100000 * (targetYield / 100)) / 12);
  const dynamicResult = simulatorService.calculateScenario({
    purchasePriceLakhs,
    downPaymentPct,
    interestRate,
    monthlyRent,
    holdingPeriod,
  });

  const flipResult = simulatorService.calculateDecisionFlip(
    purchasePriceLakhs,
    purchasePriceLakhs * 0.95,
    monthlyRent,
    interestRate
  );

  const handleReset = () => {
    setPurchasePriceLakhs(75);
    setDownPaymentPct(20);
    setInterestRate(8.5);
    setTargetYield(6.5);
    setHoldingPeriod(5);
  };

  return (
    <div className="space-y-5 pb-20 max-w-2xl mx-auto">
      {/* Title & Subhead */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.simulator_title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.simulator_subtitle}
        </p>
      </div>

      {/* Card 1: Scenario Variables */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#273449]">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {t.scenario_variables}
            </h3>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-[#172033] text-blue-600 dark:text-blue-400 text-[10px] font-mono font-bold border border-blue-200 dark:border-[#273449]">
              {t.user_assumption}
            </span>
          </div>
          <Sliders size={18} className="text-blue-600 dark:text-blue-400" />
        </div>

        {/* Slider 1: Purchase Price */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-semibold">
            <span className="text-slate-600 dark:text-slate-300 uppercase">{t.purchase_price}</span>
            <span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base">
              {formatInrLakhs(purchasePriceLakhs)}
            </span>
          </div>
          <input
            type="range"
            min={20}
            max={400}
            step={2.5}
            value={purchasePriceLakhs}
            onChange={(e) => setPurchasePriceLakhs(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>₹20 L</span>
            <span>₹2 Cr</span>
            <span>₹4 Cr</span>
          </div>
        </div>

        {/* Slider 2: Down Payment */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-semibold">
            <span className="text-slate-600 dark:text-slate-300 uppercase">{t.down_payment}</span>
            <span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base">
              {downPaymentPct}% ({formatInrLakhs((purchasePriceLakhs * downPaymentPct) / 100)})
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
          />
        </div>

        {/* Slider 3: Interest Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-semibold">
            <span className="text-slate-600 dark:text-slate-300 uppercase">{t.interest_rate}</span>
            <span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base">
              {interestRate}% p.a.
            </span>
          </div>
          <input
            type="range"
            min={6.5}
            max={13.0}
            step={0.25}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
          />
        </div>

        {/* Slider 4: Target Yield */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-semibold">
            <span className="text-slate-600 dark:text-slate-300 uppercase">{t.target_yield}</span>
            <span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base">
              {targetYield}% ({formatInrRent(monthlyRent)})
            </span>
          </div>
          <input
            type="range"
            min={3.0}
            max={14.0}
            step={0.2}
            value={targetYield}
            onChange={(e) => setTargetYield(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
          />
        </div>

        {/* Slider 5: Holding Period */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-semibold">
            <span className="text-slate-600 dark:text-slate-300 uppercase">{t.holding_period}</span>
            <span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base">
              {holdingPeriod} {t.years}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={15}
            step={1}
            value={holdingPeriod}
            onChange={(e) => setHoldingPeriod(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-[#172033] hover:bg-slate-200 dark:hover:bg-[#1e2c47] text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-transparent dark:border-[#273449]"
        >
          <RotateCcw size={14} /> {t.reset_base}
        </button>
      </div>

      {/* Projections Card: 2025, 2026 & 5-Year Future Scenarios */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#273449]">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {t.five_year_scenario}
            </h4>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            {t.model_projection}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#172033] border border-slate-100 dark:border-[#273449]">
            <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">2025 Value</span>
            <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white mt-1 block">
              {formatInrLakhs(dynamicResult.projected2025ValLakhs)}
            </span>
            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">+6.5% 1Y</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#172033] border border-slate-100 dark:border-[#273449]">
            <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">2026 Value</span>
            <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white mt-1 block">
              {formatInrLakhs(dynamicResult.projected2026ValLakhs)}
            </span>
            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">+13.4% 2Y</span>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
            <span className="text-[10px] font-mono uppercase text-blue-600 dark:text-blue-300 block font-semibold">{holdingPeriod}Y Value</span>
            <span className="text-base font-extrabold font-mono text-blue-700 dark:text-blue-400 mt-1 block">
              {formatInrLakhs(dynamicResult.projectedFutureValLakhs)}
            </span>
            <span className="text-[9px] font-mono text-blue-600 dark:text-blue-300">Compounded</span>
          </div>
        </div>
      </div>

      {/* Row: 2 Scenario Cards (Base Case vs Your Scenario) */}
      <div className="grid grid-cols-2 gap-4">
        {/* BASE CASE */}
        <div className="p-5 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3">
          <div className="pb-2 border-b border-slate-100 dark:border-[#273449] flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            <span>{t.base_case}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#172033] font-normal">Observed</span>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">{t.projected_roi}</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">
              {baseResult.totalRoiPct}%
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">{t.monthly_emi}</div>
            <div className="text-sm sm:text-base font-bold font-mono text-slate-700 dark:text-slate-300">
              ₹{baseResult.monthlyEmi.toLocaleString('en-IN')}/mo
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">{t.net_cash_flow}</div>
            <div className={`text-sm sm:text-base font-bold font-mono ${baseResult.netMonthlyCashFlow >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {baseResult.netMonthlyCashFlow >= 0 ? '+' : ''}₹{baseResult.netMonthlyCashFlow.toLocaleString('en-IN')}/mo
            </div>
          </div>
        </div>

        {/* YOUR SCENARIO */}
        <div className="p-5 rounded-3xl bg-blue-600 text-white shadow-md shadow-blue-600/20 space-y-3 relative overflow-hidden">
          <div className="pb-2 border-b border-white/20 flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-blue-100">
            <span>{t.your_scenario}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              dynamicResult.decision === 'BUY' ? 'bg-emerald-500 text-white' : (dynamicResult.decision === 'HOLD' ? 'bg-amber-400 text-slate-900' : 'bg-rose-500 text-white')
            }`}>
              {dynamicResult.decision}
            </span>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-blue-200 font-semibold">{t.projected_roi}</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-0.5 flex items-center gap-1">
              {dynamicResult.totalRoiPct}% {dynamicResult.totalRoiPct >= baseResult.totalRoiPct ? '↑' : '↓'}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-blue-200 font-semibold">{t.monthly_emi}</div>
            <div className="text-sm sm:text-base font-bold font-mono text-blue-100">
              ₹{dynamicResult.monthlyEmi.toLocaleString('en-IN')}/mo
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-blue-200 font-semibold">{t.net_cash_flow}</div>
            <div className="text-sm sm:text-base font-bold font-mono text-white">
              {dynamicResult.netMonthlyCashFlow >= 0 ? '+' : ''}₹{dynamicResult.netMonthlyCashFlow.toLocaleString('en-IN')}/mo
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Insight Engine Box */}
      <div className="p-4 sm:p-5 rounded-3xl bg-blue-50/80 dark:bg-[#172033] border border-blue-100 dark:border-[#273449] flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Lightbulb size={18} />
        </div>
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-blue-900 dark:text-blue-300">
            {t.insight_engine}
          </span>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            {flipResult.priceFlipText} {flipResult.rentFlipText}
          </p>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {flipResult.rateFlipText}
          </div>
        </div>
      </div>

      {/* Save Scenario Full-Width Button */}
      <button
        onClick={() => alert(`Scenario saved: ${formatInrLakhs(purchasePriceLakhs)} asset @ ${interestRate}% interest, projected ${dynamicResult.totalRoiPct}% ROI over ${holdingPeriod} years.`)}
        className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Save size={18} /> {t.save_scenario}
      </button>
    </div>
  );
};

