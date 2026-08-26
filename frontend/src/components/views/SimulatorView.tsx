import React, { useState } from 'react';
import { Sliders, RotateCcw, TrendingUp, ArrowUpRight, ArrowDownRight, Brain, FileSpreadsheet, Save } from 'lucide-react';

export const SimulatorView: React.FC = () => {
  // Scenario Sliders State
  const [purchasePrice, setPurchasePrice] = useState(450000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [targetYield, setTargetYield] = useState(6.2);
  const [holdingPeriod, setHoldingPeriod] = useState(10);

  // Base Case Benchmarks
  const baseRoi = 8.4;
  const baseCashFlow = 12000;
  const baseAppreciation = 150000;

  // Real-Time Dynamic Mathematical Calculation
  const priceRatio = purchasePrice / 450000;
  const rateImpact = (5.5 - interestRate) * 0.8;
  const yieldImpact = (targetYield - 6.2) * 1.1;
  const periodImpact = (holdingPeriod - 10) * 0.2;

  const dynamicRoi = parseFloat((baseRoi + rateImpact + yieldImpact + periodImpact).toFixed(1));
  const dynamicCashFlow = Math.round(purchasePrice * (targetYield / 100) - (purchasePrice * 0.8 * (interestRate / 100)));
  const dynamicAppreciation = Math.round(purchasePrice * (0.035 * holdingPeriod));

  const roiDiff = parseFloat((dynamicRoi - baseRoi).toFixed(1));
  const cashFlowDiff = dynamicCashFlow - baseCashFlow;

  // Dynamic AI Insight Banner Logic
  let aiSignal = 'Strong Buy Signal: Your scenario outperforms market base case by 2.8% annually.';
  let recStatus: 'BUY' | 'HOLD' | 'AVOID' = 'BUY';
  let recColor = 'bg-emerald-500';

  if (interestRate >= 7.5 || dynamicRoi < 6.0) {
    aiSignal = 'Recommendation changed from Buy to Hold due to higher interest rates reducing debt service coverage.';
    recStatus = 'HOLD';
    recColor = 'bg-amber-500';
  } else if (dynamicRoi < 4.0) {
    aiSignal = 'Avoid Signal: Sub-optimal yield threshold under current cost of capital parameters.';
    recStatus = 'AVOID';
    recColor = 'bg-rose-500';
  }

  const handleReset = () => {
    setPurchasePrice(450000);
    setInterestRate(5.5);
    setTargetYield(6.2);
    setHoldingPeriod(10);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[11px] font-bold uppercase tracking-wider">
              INTERACTIVE SANDBOX
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Decision Simulator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            What-If Analysis: Model your investment scenarios in real time.
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
        <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders size={16} className="text-emerald-500" /> Scenario Controls
            </span>
            <span className="text-xs font-mono text-slate-400">Live Sync</span>
          </div>

          {/* Slider 1: Purchase Price */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Purchase Price</span>
              <span className="text-emerald-500 font-extrabold">${purchasePrice.toLocaleString()} USD</span>
            </div>
            <input
              type="range"
              min={100000}
              max={2000000}
              step={25000}
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>$100k</span>
              <span>$2.0M</span>
            </div>
          </div>

          {/* Slider 2: Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Home Loan Interest Rate</span>
              <span className="text-emerald-500 font-extrabold">{interestRate}%</span>
            </div>
            <input
              type="range"
              min={2.0}
              max={10.0}
              step={0.25}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>2.0%</span>
              <span>10.0%</span>
            </div>
          </div>

          {/* Slider 3: Expected Yield */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Expected Annual Yield</span>
              <span className="text-emerald-500 font-extrabold">{targetYield}%</span>
            </div>
            <input
              type="range"
              min={2.0}
              max={15.0}
              step={0.1}
              value={targetYield}
              onChange={(e) => setTargetYield(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>2.0%</span>
              <span>15.0%</span>
            </div>
          </div>

          {/* Slider 4: Holding Period */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Holding Period</span>
              <span className="text-emerald-500 font-extrabold">{holdingPeriod} Years</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={holdingPeriod}
              onChange={(e) => setHoldingPeriod(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>1 Year</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Side-by-Side Bento Comparison Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Base Case Card */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  BASE CASE (MARKET AVG)
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-mono font-semibold">
                  BENCHMARK
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Est. Annual ROI</span>
                <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {baseRoi}%
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Net Monthly Cash Flow</span>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  +${(baseCashFlow / 12).toLocaleString()}/mo
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Total Appreciation</span>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  +${baseAppreciation.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Your Scenario Card (Dynamic) */}
            <div className="p-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 dark:bg-[#102034] shadow-md space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
                  YOUR SCENARIO (DYNAMIC)
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-white text-xs font-mono font-extrabold ${recColor}`}>
                  {recStatus}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Projected ROI</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-500 flex items-center gap-2">
                  {dynamicRoi}%
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${roiDiff >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {roiDiff >= 0 ? `+${roiDiff}%` : `${roiDiff}%`}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Net Monthly Cash Flow</span>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2">
                  {dynamicCashFlow >= 0 ? `+$${Math.round(dynamicCashFlow / 12).toLocaleString()}/mo` : `-$${Math.abs(Math.round(dynamicCashFlow / 12)).toLocaleString()}/mo`}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Total Appreciation</span>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  +${dynamicAppreciation.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic AI Insight Engine Card */}
          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-white dark:bg-[#102034] shadow-sm flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
              <Brain size={22} />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                DYNAMIC AI INSIGHT ENGINE
              </span>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">
                "{aiSignal}"
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer">
              <FileSpreadsheet size={16} /> 📊 Generate Report
            </button>
            <button className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] text-slate-700 dark:text-slate-300 font-semibold text-xs hover:border-slate-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm">
              <Save size={16} /> 💾 Save Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
