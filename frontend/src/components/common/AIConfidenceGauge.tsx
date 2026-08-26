import React from 'react';

interface AIConfidenceGaugeProps {
  confidenceScore: number; // 0-100
  recommendation: 'BUY' | 'HOLD' | 'AVOID';
  explainableText?: string;
  onInitiateAcquisition?: () => void;
}

export const AIConfidenceGauge: React.FC<AIConfidenceGaugeProps> = ({
  confidenceScore,
  recommendation,
  explainableText = 'Optimal entry window detected based on projected tech sector growth.',
  onInitiateAcquisition,
}) => {
  const radius = 68;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidenceScore / 100) * circumference;

  const recBadgeColors = {
    BUY: 'bg-emerald-500 text-white shadow-emerald-500/30',
    HOLD: 'bg-amber-500 text-white shadow-amber-500/30',
    AVOID: 'bg-rose-500 text-white shadow-rose-500/30',
  };

  return (
    <div className="relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-xl overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Radial SVG Gauge */}
        <div className="relative flex items-center justify-center w-40 h-40 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-100 dark:text-slate-800"
              fill="transparent"
            />
            {/* Animated Dynamic Gauge Ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-emerald-500 transition-all duration-1000 ease-out"
              fill="transparent"
            />
          </svg>
          {/* Central Percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {confidenceScore}%
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
              Confidence
            </span>
          </div>
        </div>

        {/* AI Synthesis Details */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
              AI Decision Synthesis
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold font-mono tracking-wider shadow-md ${recBadgeColors[recommendation]}`}
            >
              {recommendation}
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            {explainableText}
          </p>

          <button
            onClick={onInitiateAcquisition}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🛒 INITIATE ACQUISITION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
