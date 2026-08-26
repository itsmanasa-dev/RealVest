import React, { useState } from 'react';
import { Sliders, RotateCcw, TrendingUp, ArrowUpRight, Brain, FileSpreadsheet, Save, Zap } from 'lucide-react';
import { simulateInvestment, calculateDecisionFlip } from '../../services/analyticsService';

export const SimulatorView: React.FC = () => {
  // Scenario Variables State
  const [purchasePriceLakhs, setPurchasePriceLakhs] = useState<number>(75.0);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [monthlyRent, setMonthlyRent] = useState<number>(25000);
  const [holdingPeriod, setHoldingPeriod] = useState<number>(5);

  // Base Case Benchmark
  const baseSim = simulateInvestment({
    purchasePriceLakhs: 75.0,
    downPaymentPct: 20,
    interestRate: 8.5,
    monthlyRent: 25000,
    holdingPeriod: 5,
  });

  // Dynamic User Scenario
  const dynamicSim = simulateInvestment({
    purchasePriceLakhs,
    downPaymentPct,
    interestRate,
    monthlyRent,
    holdingPeriod,
  });

  // Sensitivity Decision Flip Boundaries
  const flipResult = calculateDecisionFlip(
    purchasePriceLakhs,
    78.0, // baseline fair valuation
    monthlyRent,
    interestRate
  );

  const roiDiff = parseFloat((dynamicSim.totalRoiPct - baseSim.totalRoiPct).toFixed(1));

  const handleReset = () => {
    setPurchasePriceLakhs(75.0);
    setDownPaymentPct(20);
    setInterestRate(8.5);
    setMonthlyRent(25000);
    setHoldingPeriod(5);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[11px] font-bold uppercase tracking-wider">
              WHAT-IF FINANCIAL ENGINE
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Decision Simulator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Model loan EMIs, net cash flow, projected capital appreciation, and sensitivity flip boundaries in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] text-slate-700 dark:text-slate-300 font-mono text-xs font-bold hover:border-slate-400 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RotateCcw size={15} /> 🔄 Reset to Base
          </button>
        </div>
      </div>

      {/* Main Grid: Control Panel + Bento Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenario Variables Control Panel (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders size={16} className="text-emerald-500" /> Scenario Controls
            </span>
            <span className="text-xs font-mono text-emerald-500 font-bold">Live Synced</span>
          </div>

          {/* Slider 1: Purchase Price */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Purchase Price</span>
              <span className="text-emerald-500 font-extrabold">₹{purchasePriceLakhs.toFixed(1)} Lakhs</span>
            </div>
            <input
              type="range"
              min={20}
              max={300}
              step={2.5}
              value={purchasePriceLakhs}
              onChange={(e) => setPurchasePriceLakhs(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>₹20 L</span>
              <span>₹300 L</span>
            </div>
          </div>

          {/* Slider 2: Down Payment */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Down Payment (%)</span>
              <span className="text-emerald-500 font-extrabold">{downPaymentPct}% (₹{((purchasePriceLakhs * downPaymentPct) / 100).toFixed(1)} L)</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>10%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Slider 3: Interest Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Home Loan Interest Rate</span>
              <span className="text-emerald-500 font-extrabold">{interestRate}%</span>
            </div>
            <input
              type="range"
              min={6.0}
              max={14.0}
              step={0.25}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>6.0%</span>
              <span>14.0%</span>
            </div>
          </div>

          {/* Slider 4: Monthly Rent */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Expected Monthly Rent</span>
              <span className="text-emerald-500 font-extrabold">₹{monthlyRent.toLocaleString()}/mo</span>
            </div>
            <input
              type="range"
              min={8000}
              max={150000}
              step={1000}
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>₹8k</span>
              <span>₹150k</span>
            </div>
          </div>

          {/* Slider 5: Holding Period */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Holding Period</span>
              <span className="text-emerald-500 font-extrabold">{holdingPeriod} Years</span>
            </div>
            <input
              type="range"
              min={2}
              max={15}
              step={1}
              value={holdingPeriod}
              onChange={(e) => setHoldingPeriod(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>2 Years</span>
              <span>15 Years</span>
            </div>
          </div>
        </div>

        {/* Side-by-Side Bento Comparison Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Base Case Card */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  BASE BENCHMARK
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-mono font-semibold">
                  ₹75L @ 8.5%
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Monthly Home Loan EMI</span>
                <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                  ₹{baseSim.monthlyEmi.toLocaleString()}/mo
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Net Monthly Cash Flow</span>
                <div className="text-lg font-bold font-mono text-slate-700 dark:text-slate-300">
                  {baseSim.netMonthlyCashFlow >= 0 ? `+₹${baseSim.netMonthlyCashFlow.toLocaleString()}/mo` : `-₹${Math.abs(baseSim.netMonthlyCashFlow).toLocaleString()}/mo`}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Total ROI (5-Yr)</span>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  {baseSim.totalRoiPct}% ({baseSim.annualizedRoiPct}% Ann.)
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Projected Future Value</span>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  ₹{baseSim.projectedFutureValLakhs} Lakhs
                </div>
              </div>
            </div>

            {/* Your Scenario Card (Dynamic) */}
            <div className="p-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 dark:bg-[#102034] shadow-md space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
                  YOUR WHAT-IF SCENARIO
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-white text-xs font-mono font-extrabold ${
                  dynamicSim.decision === 'BUY' ? 'bg-emerald-500' : (dynamicSim.decision === 'HOLD' ? 'bg-amber-500' : 'bg-rose-500')
                }`}>
                  {dynamicSim.decision}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Monthly Home Loan EMI</span>
                <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                  ₹{dynamicSim.monthlyEmi.toLocaleString()}/mo
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Net Monthly Cash Flow</span>
                <div className={`text-lg font-bold font-mono ${dynamicSim.netMonthlyCashFlow >= 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {dynamicSim.netMonthlyCashFlow >= 0 ? `+₹${dynamicSim.netMonthlyCashFlow.toLocaleString()}/mo` : `-₹${Math.abs(dynamicSim.netMonthlyCashFlow).toLocaleString()}/mo`}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Projected Total ROI</span>
                <div className="text-lg font-bold font-mono text-emerald-500 flex items-center gap-2">
                  {dynamicSim.totalRoiPct}%
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${roiDiff >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {roiDiff >= 0 ? `+${roiDiff}%` : `${roiDiff}%`}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Projected Future Value</span>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  ₹{dynamicSim.projectedFutureValLakhs} Lakhs
                </div>
              </div>
            </div>
          </div>

          {/* Decision Flip Boundary Analysis Section */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-amber-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Sensitivity Decision Flip Boundaries
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">What would change this verdict?</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">PRICE FLIP THRESHOLD</div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {flipResult.priceFlipText}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">RENT FLIP THRESHOLD</div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {flipResult.rentFlipText}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">INTEREST RATE THRESHOLD</div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {flipResult.rateFlipText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
