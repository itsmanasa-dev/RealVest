import React from 'react';

interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High' | 'LOW' | 'MEDIUM' | 'HIGH';
  label?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, label }) => {
  const normLevel = level.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH';
  const styles = {
    LOW: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    MEDIUM: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    HIGH: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${styles[normLevel] || styles.LOW}`}
    >
      {label ? `${label}: ` : ''}
      {normLevel}
    </span>
  );
};
