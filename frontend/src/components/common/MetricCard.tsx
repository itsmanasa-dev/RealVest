import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtext?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  changeType = 'positive',
  subtext,
  icon,
}) => {
  const changeColors = {
    positive: 'text-emerald-500 bg-emerald-500/10',
    negative: 'text-rose-500 bg-rose-500/10',
    neutral: 'text-slate-500 bg-slate-500/10',
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="font-mono text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </span>

        {change && (
          <span
            className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${changeColors[changeType]}`}
          >
            {change}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-sans">
          {subtext}
        </p>
      )}
    </div>
  );
};
