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
    <div className="space-y-6 pb-12 w-full">
      {/* Title & Subhead */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-[#273449]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
            {t.simulator_title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.simulator_subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1e2c47] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={13} /> {t.reset_base}
          </button>
          <button
            onClick={() => alert(`Scenario saved: ${formatInrLakhs(purchasePriceLakhs)} asset @ ${interestRate}% interest, projected ${dynamicResult.totalRoiPct}% ROI over ${holdingPeriod} years.`)}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Save size={13} /> {t.save_scenario}
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scenario Controls (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#273449]">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                {t.scenario_variables}
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-[#273449]">
              {t.user_assumption}
            </span>
          </div>

          {/* Slider 1: Purchase Price */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400 uppercase">{t.purchase_price}</span>
              <span className="text-slate-900 dark:text-white font-semibold text-sm">
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
              className="w-full accent-blue-600 dark:accent-blue-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>₹20 L</span>
              <span>₹2 Cr</span>
              <span>₹4 Cr</span>
            </div>
          </div>

          {/* Slider 2: Down Payment */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400 uppercase">{t.down_payment}</span>
              <span className="text-slate-900 dark:text-white font-semibold text-sm">
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
              className="w-full accent-blue-600 dark:accent-blue-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
            />
          </div>

          {/* Slider 3: Interest Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400 uppercase">{t.interest_rate}</span>
              <span className="text-slate-900 dark:text-white font-semibold text-sm">
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
              className="w-full accent-blue-600 dark:accent-blue-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
            />
          </div>

          {/* Slider 4: Target Yield */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400 uppercase">{t.target_yield}</span>
              <span className="text-slate-900 dark:text-white font-semibold text-sm">
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
              className="w-full accent-blue-600 dark:accent-blue-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
            />
          </div>

          {/* Slider 5: Holding Period */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400 uppercase">{t.holding_period}</span>
              <span className="text-slate-900 dark:text-white font-semibold text-sm">
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
              className="w-full accent-blue-600 dark:accent-blue-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* Right Column: Comparative Results + Future Valuations + Decision Flip (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Comparative Results Row: Base Case vs Your Scenario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Base Case Card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3">
              <div className="pb-2 border-b border-slate-100 dark:border-[#273449] flex items-center justify-between text-[10px] font-mono font-medium uppercase tracking-wider text-slate-400">
                <span>{t.base_case}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#172033]">Observed Benchmark</span>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400">{t.projected_roi}</div>
                <div className="text-2xl font-semibold font-mono text-slate-900 dark:text-white mt-0.5">
                  {baseResult.totalRoiPct}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-[#273449] text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">{t.monthly_emi}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">₹{baseResult.monthlyEmi.toLocaleString('en-IN')}/mo</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">{t.net_cash_flow}</span>
                  <span className={`font-semibold ${baseResult.netMonthlyCashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {baseResult.netMonthlyCashFlow >= 0 ? '+' : ''}₹{baseResult.netMonthlyCashFlow.toLocaleString('en-IN')}/mo
                  </span>
                </div>
              </div>
            </div>

            {/* Your Scenario Card */}
            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/50 dark:bg-[#172033] shadow-sm space-y-3">
              <div className="pb-2 border-b border-blue-200/60 dark:border-[#273449] flex items-center justify-between text-[10px] font-mono font-medium uppercase tracking-wider text-blue-700 dark:text-blue-300">
                <span>{t.your_scenario}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  dynamicResult.decision === 'BUY'
                    ? 'bg-emerald-600 text-white'
                    : (dynamicResult.decision === 'HOLD' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white')
                }`}>
                  VERDICT: {dynamicResult.decision}
                </span>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase text-blue-600 dark:text-blue-400">{t.projected_roi}</div>
                <div className="text-2xl font-semibold font-mono text-slate-900 dark:text-white mt-0.5">
                  {dynamicResult.totalRoiPct}% <span className="text-xs font-normal text-slate-400">({dynamicResult.annualizedRoiPct}% p.a.)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200/60 dark:border-[#273449] text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">{t.monthly_emi}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{dynamicResult.monthlyEmi.toLocaleString('en-IN')}/mo</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">{t.net_cash_flow}</span>
                  <span className={`font-semibold ${dynamicResult.netMonthlyCashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {dynamicResult.netMonthlyCashFlow >= 0 ? '+' : ''}₹{dynamicResult.netMonthlyCashFlow.toLocaleString('en-IN')}/mo
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Forward Valuations Matrix (2025, 2026, 5Y) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#273449]">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-blue-600 dark:text-blue-400" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                  Valuation Trajectory Matrix
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                {t.model_projection}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center pt-1">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">2025 Value</span>
                <span className="text-sm font-semibold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {formatInrLakhs(dynamicResult.projected2025ValLakhs)}
                </span>
                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">+5.0% 1Y</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">2026 Value</span>
                <span className="text-sm font-semibold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {formatInrLakhs(dynamicResult.projected2026ValLakhs)}
                </span>
                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">+10.2% 2Y</span>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <span className="text-[10px] font-mono uppercase text-blue-700 dark:text-blue-300 block">{holdingPeriod}Y Compounded</span>
                <span className="text-sm font-semibold font-mono text-blue-700 dark:text-blue-400 mt-0.5 block">
                  {formatInrLakhs(dynamicResult.projectedFutureValLakhs)}
                </span>
                <span className="text-[9px] font-mono text-blue-600 dark:text-blue-300">Terminal Exit</span>
              </div>
            </div>
          </div>

          {/* Decision Flip: "What Would Change the Decision?" */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#273449]">
              <Lightbulb size={15} className="text-amber-500" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                What Would Change The Decision? (Sensitivity Flip)
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449] flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px]">
                  {flipResult.priceFlipText}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449] flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px]">
                  {flipResult.rentFlipText}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449] flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px]">
                  {flipResult.rateFlipText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


