import React, { useState } from 'react';
import { Sliders, RotateCcw, Lightbulb, Save, ArrowLeft } from 'lucide-react';

interface SimulatorViewProps {
  onBack?: () => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({ onBack }) => {
  // Scenario Variables matching Screenshot 3
  const [purchasePrice, setPurchasePrice] = useState<number>(1250000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [targetYield, setTargetYield] = useState<number>(5.8);
  const [holdingPeriod, setHoldingPeriod] = useState<number>(5);

  // Dynamic Mathematical Simulation
  const baseRoi = 8.2;
  const baseCashFlow = 4500;

  // Rate impact
  const rateDelta = (6.5 - interestRate) * 0.8;
  const yieldDelta = (targetYield - 5.8) * 1.1;
  const dynamicRoi = parseFloat((baseRoi + rateDelta + yieldDelta).toFixed(1));

  // Dynamic Cash Flow Calculation
  const loanAmount = purchasePrice * 0.8;
  const monthlyRate = (interestRate / 100) / 12;
  const numMonths = 240;
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) / (Math.pow(1 + monthlyRate, numMonths) - 1);
  const monthlyRent = (purchasePrice * (targetYield / 100)) / 12;
  const dynamicCashFlow = Math.round(monthlyRent - emi);

  const handleReset = () => {
    setPurchasePrice(1250000);
    setInterestRate(6.5);
    setTargetYield(5.8);
    setHoldingPeriod(5);
  };

  const isHold = interestRate >= 6.5 || dynamicRoi < 7.0;

  return (
    <div className="space-y-5 pb-20 max-w-2xl mx-auto">
      {/* Title & Subhead */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Decision Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Adjust variables to see how they impact your investment strategy.
        </p>
      </div>

      {/* Card 1: Scenario Variables (Matching Screenshot 3) */}
      <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            Scenario Variables
          </h3>
          <Sliders size={18} className="text-blue-600 dark:text-emerald-400" />
        </div>

        {/* Slider 1: Purchase Price */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-semibold">
            <span className="text-slate-600 dark:text-slate-300 uppercase">PURCHASE PRICE</span>
            <span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base">
              ${purchasePrice.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={250000}
            max={5000000}
            step={25000}
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-emerald-400 cursor-pointer h-2 bg-blue-100 dark:bg-slate-800 rounded-lg"
          />
        </div>

        {/* Slider 2: Interest Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-semibold">
            <span className="text-slate-600 dark:text-slate-300 uppercase">INTEREST RATE</span>
            <span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base">
              {interestRate}%
            </span>
          </div>
          <input
            type="range"
            min={3.0}
            max={12.0}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-emerald-400 cursor-pointer h-2 bg-blue-100 dark:bg-slate-800 rounded-lg"
          />
        </div>

        {/* Slider 3: Target Yield */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-semibold">
            <span className="text-slate-600 dark:text-slate-300 uppercase">TARGET YIELD</span>
            <span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base">
              {targetYield}%
            </span>
          </div>
          <input
            type="range"
            min={2.0}
            max={12.0}
            step={0.1}
            value={targetYield}
            onChange={(e) => setTargetYield(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-emerald-400 cursor-pointer h-2 bg-blue-100 dark:bg-slate-800 rounded-lg"
          />
        </div>

        {/* Slider 4: Holding Period */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-semibold">
            <span className="text-slate-600 dark:text-slate-300 uppercase">HOLDING PERIOD</span>
            <span className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base">
              {holdingPeriod} Yrs
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={holdingPeriod}
            onChange={(e) => setHoldingPeriod(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-emerald-400 cursor-pointer h-2 bg-blue-100 dark:bg-slate-800 rounded-lg"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full py-2.5 rounded-2xl bg-blue-50 dark:bg-slate-800/80 hover:bg-blue-100 dark:hover:bg-slate-800 text-blue-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw size={14} /> Reset to Base
        </button>
      </div>

      {/* Row: 2 Scenario Cards (Base Case vs Your Scenario) */}
      <div className="grid grid-cols-2 gap-4">
        {/* BASE CASE */}
        <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            BASE CASE
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">EXPECTED ROI</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">
              {baseRoi}%
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">NET CASH FLOW</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              ${baseCashFlow.toLocaleString()}/mo
            </div>
          </div>
        </div>

        {/* YOUR SCENARIO (Solid Blue Card in Light Mode / Vibrant Emerald in Dark Mode) */}
        <div className="p-5 rounded-3xl bg-blue-600 dark:bg-blue-600 text-white shadow-md shadow-blue-600/20 space-y-4 relative overflow-hidden">
          <div className="pb-2 border-b border-white/20 text-[11px] font-mono font-bold uppercase tracking-wider text-blue-100">
            YOUR SCENARIO
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-blue-200 font-semibold">PROJECTED ROI</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-0.5 flex items-center gap-1">
              {dynamicRoi}% {dynamicRoi < baseRoi ? '↓' : '↑'}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-blue-200 font-semibold">NET CASH FLOW</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5 flex items-center gap-1">
              ${dynamicCashFlow.toLocaleString()}/mo {dynamicCashFlow < baseCashFlow ? '↓' : '↑'}
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Insight Engine Box */}
      <div className="p-4 sm:p-5 rounded-3xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700/60 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Lightbulb size={18} />
        </div>
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-blue-900 dark:text-blue-300">
            Insight Engine
          </span>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            Your recommendation changed from <b>Buy</b> to <b>{isHold ? 'Hold' : 'Buy'}</b>. The simulated <span className="bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded font-mono font-semibold">higher interest rates ({interestRate}%)</span> significantly reduce monthly net cash flow, breaking the required debt service coverage ratio.
          </p>
        </div>
      </div>

      {/* Save Scenario Full-Width Button */}
      <button
        onClick={() => alert(`Scenario saved with ${interestRate}% interest rate and $${purchasePrice.toLocaleString()} purchase price.`)}
        className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Save size={18} /> Save Scenario
      </button>
    </div>
  );
};
