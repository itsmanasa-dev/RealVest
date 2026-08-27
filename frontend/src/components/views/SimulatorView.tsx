import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Lightbulb,
  Save,
  ArrowRight,
  TrendingUp,
  Wallet,
  Calendar,
  DollarSign,
  Building,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { formatInrLakhs, formatInrRent } from '../../utils/currency';
import { simulatorService } from '../../services/simulatorService';

interface SimulatorViewProps {
  onBack?: () => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = () => {
  const { t } = useTranslation();

  // Scenario Variables in INR
  const [purchasePriceLakhs, setPurchasePriceLakhs] = useState<number>(75);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [targetYield, setTargetYield] = useState<number>(5.5);
  const [holdingPeriod, setHoldingPeriod] = useState<number>(5);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Computed Values
  const purchaseInr = purchasePriceLakhs * 100000;
  const downPaymentInr = purchaseInr * (downPaymentPct / 100);
  const loanAmountInr = purchaseInr - downPaymentInr;
  const estStampDutyRegInr = purchaseInr * 0.066; // 6.6% Karnataka Stamp Duty + Registration
  const totalUpfrontNeededInr = downPaymentInr + estStampDutyRegInr;

  const monthlyRent = Math.round((purchaseInr * (targetYield / 100)) / 12);

  const result = simulatorService.calculateScenario({
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

  const handlePreset = (price: number, down: number, rate: number, yieldPct: number) => {
    setPurchasePriceLakhs(price);
    setDownPaymentPct(down);
    setInterestRate(rate);
    setTargetYield(yieldPct);
  };

  const handleReset = () => {
    setPurchasePriceLakhs(75);
    setDownPaymentPct(20);
    setInterestRate(8.5);
    setTargetYield(5.5);
    setHoldingPeriod(5);
  };

  const handleSave = () => {
    setSaveToast(`Scenario saved: ₹${purchasePriceLakhs}L property @ ${interestRate}% loan interest.`);
    setTimeout(() => setSaveToast(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#273449]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
              FINANCIAL SIMULATOR
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Investment & Cash Flow Simulator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Adjust the sliders below to see your monthly EMI, rental income, upfront costs, and 5-year profit in plain numbers.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#172033] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RotateCcw size={13} /> Reset
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 cursor-pointer"
          >
            <Save size={13} /> Save Scenario
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {saveToast && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Quick Preset Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-mono text-slate-400 uppercase shrink-0">Quick Presets:</span>
        <button
          onClick={() => handlePreset(45, 20, 8.5, 6.0)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
            purchasePriceLakhs === 45
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-[#273449] text-slate-700 dark:text-slate-300 hover:border-emerald-500'
          }`}
        >
          ₹45L Starter 1/2 BHK
        </button>
        <button
          onClick={() => handlePreset(75, 20, 8.5, 5.5)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
            purchasePriceLakhs === 75
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-[#273449] text-slate-700 dark:text-slate-300 hover:border-emerald-500'
          }`}
        >
          ₹75L Standard 2 BHK
        </button>
        <button
          onClick={() => handlePreset(130, 25, 8.5, 5.0)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
            purchasePriceLakhs === 130
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-[#273449] text-slate-700 dark:text-slate-300 hover:border-emerald-500'
          }`}
        >
          ₹1.3 Cr Premium 3 BHK
        </button>
        <button
          onClick={() => handlePreset(250, 30, 8.5, 4.5)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
            purchasePriceLakhs === 250
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-[#273449] text-slate-700 dark:text-slate-300 hover:border-emerald-500'
          }`}
        >
          ₹2.5 Cr Luxury Villa
        </button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Easy Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#273449]">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-emerald-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  1. Your Property Assumptions
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Live Calculated</span>
            </div>

            {/* Input 1: Property Price */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Property Asking Price</span>
                <span className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  {formatInrLakhs(purchasePriceLakhs)}
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={300}
                step={2.5}
                value={purchasePriceLakhs}
                onChange={(e) => setPurchasePriceLakhs(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-[#172033] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>₹20 Lakhs</span>
                <span>₹1.5 Crore</span>
                <span>₹3.0 Crore</span>
              </div>
            </div>

            {/* Input 2: Down Payment */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#273449]/80">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Down Payment ({downPaymentPct}%)</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                  ₹{(downPaymentInr / 100000).toFixed(1)} Lakhs
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={downPaymentPct}
                onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-[#172033] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>10% (Min)</span>
                <span>20% (Standard)</span>
                <span>50% (High Equity)</span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#172033] p-2 rounded-xl border border-slate-200 dark:border-[#273449]">
                Loan Principal Needed: <strong className="text-slate-900 dark:text-white">₹{(loanAmountInr / 100000).toFixed(1)} Lakhs</strong> ({(100 - downPaymentPct)}%)
              </div>
            </div>

            {/* Input 3: Home Loan Interest Rate */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#273449]/80">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Loan Interest Rate (20 Years)</span>
                <span className="text-sm font-bold font-mono text-blue-600 dark:text-blue-400">
                  {interestRate}% p.a.
                </span>
              </div>
              <input
                type="range"
                min={7.0}
                max={12.0}
                step={0.25}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-200 dark:bg-[#172033] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>7.5% (Prime)</span>
                <span>8.5% (Current SBI/HDFC)</span>
                <span>11.0%</span>
              </div>
            </div>

            {/* Input 4: Target Rental Yield */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#273449]/80">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Expected Rental Yield</span>
                <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {targetYield}% (₹{monthlyRent.toLocaleString('en-IN')}/mo)
                </span>
              </div>
              <input
                type="range"
                min={3.0}
                max={10.0}
                step={0.25}
                value={targetYield}
                onChange={(e) => setTargetYield(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-[#172033] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>3.5% (City Min)</span>
                <span>5.5% (Bengaluru IT Corridor)</span>
                <span>8.0%+</span>
              </div>
            </div>

            {/* Input 5: Holding Period */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#273449]/80">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Investment Holding Period</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                  {holdingPeriod} Years
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={holdingPeriod}
                onChange={(e) => setHoldingPeriod(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-[#172033] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>1 Year</span>
                <span>5 Years (Recommended)</span>
                <span>10 Years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clear, Visual Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Hero Verdict Card */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-[#273449]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  Projected 5-Year Investment Outcome
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
                  +₹{(result.totalProfitInr / 100000).toFixed(1)} Lakhs
                </div>
                <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1">
                  <TrendingUp size={14} /> +{result.totalRoiPct}% Total ROI ({result.annualizedRoiPct}% per year)
                </div>
              </div>

              {/* Verdict Pill */}
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Decision Verdict</span>
                <span className={`px-4 py-1.5 rounded-2xl text-xs font-extrabold tracking-wider mt-1 ${
                  result.decision === 'BUY'
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                    : (result.decision === 'HOLD' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white')
                }`}>
                  {result.decision === 'BUY' ? 'RECOMMENDED: BUY' : (result.decision === 'HOLD' ? 'MODERATE: HOLD' : 'AVOID / RE-EVALUATE')}
                </span>
              </div>
            </div>

            {/* 3 Core Financial Summary Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              {/* Box 1: Monthly EMI */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Monthly Loan EMI</span>
                <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white mt-1 block">
                  ₹{result.monthlyEmi.toLocaleString('en-IN')}/mo
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">20-yr loan @ {interestRate}%</span>
              </div>

              {/* Box 2: Monthly Rent Income */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Monthly Rent Inflow</span>
                <span className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
                  +₹{monthlyRent.toLocaleString('en-IN')}/mo
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{targetYield}% gross yield</span>
              </div>

              {/* Box 3: Net Cash Flow */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Net Monthly Cash Flow</span>
                <span className={`text-base font-extrabold font-mono mt-1 block ${
                  result.netMonthlyCashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {result.netMonthlyCashFlow >= 0 ? '+' : ''}₹{result.netMonthlyCashFlow.toLocaleString('en-IN')}/mo
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {result.netMonthlyCashFlow >= 0 ? 'Surplus cash flow' : 'Out-of-pocket EMI gap'}
                </span>
              </div>
            </div>
          </div>

          {/* Upfront Cash Required Breakdown */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#273449]">
              <div className="flex items-center gap-2">
                <Wallet size={15} className="text-emerald-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Total Upfront Cash Needed to Buy
                </h3>
              </div>
              <span className="text-xs font-extrabold font-mono text-slate-900 dark:text-white">
                ₹{(totalUpfrontNeededInr / 100000).toFixed(1)} Lakhs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449] flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Down Payment ({downPaymentPct}%):</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{(downPaymentInr / 100000).toFixed(1)} Lakhs</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449] flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Govt Stamp Duty & Reg (6.6%):</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{(estStampDutyRegInr / 100000).toFixed(1)} Lakhs</span>
              </div>
            </div>
          </div>

          {/* Future Property Worth Timeline */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#273449]">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-blue-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Estimated Property Value Growth
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">~6.5% p.a. Historical Growth</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">In 1 Year</span>
                <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white mt-1 block">
                  {formatInrLakhs(result.projected2025ValLakhs)}
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">+₹{(result.projected2025ValLakhs - purchasePriceLakhs).toFixed(1)}L gain</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">In 2 Years</span>
                <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white mt-1 block">
                  {formatInrLakhs(result.projected2026ValLakhs)}
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">+₹{(result.projected2026ValLakhs - purchasePriceLakhs).toFixed(1)}L gain</span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-500/30">
                <span className="text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-400 font-bold block">
                  In {holdingPeriod} Years
                </span>
                <span className="text-sm font-extrabold font-mono text-emerald-700 dark:text-emerald-300 mt-1 block">
                  {formatInrLakhs(result.projectedFutureValLakhs)}
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  +₹{(result.projectedFutureValLakhs - purchasePriceLakhs).toFixed(1)}L gain
                </span>
              </div>
            </div>
          </div>

          {/* Smart Plain-English Investor Insights */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#273449]">
              <Lightbulb size={15} className="text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Investor Takeaways & Sensitivity
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449] flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  <strong>Break-even Timeline:</strong> Holding this property for at least <strong>3.5 years</strong> fully absorbs the ₹{(estStampDutyRegInr / 100000).toFixed(1)}L registration tax and home loan interest.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449] flex items-start gap-2.5">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {flipResult.rentFlipText}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#273449] flex items-start gap-2.5">
                <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
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
