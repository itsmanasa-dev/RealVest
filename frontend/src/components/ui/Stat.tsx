import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatProps {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: LucideIcon;
  iconTone?: 'brand' | 'pos' | 'warn' | 'neutral';
  valueClassName?: string;
  className?: string;
}

export const Stat: React.FC<StatProps> = ({
  label,
  value,
  hint,
  icon: Icon,
  iconTone = 'neutral',
  valueClassName,
  className,
}) => {
  const tones = {
    brand: 'text-brand bg-brand-soft',
    pos: 'text-pos bg-pos-soft',
    warn: 'text-warn bg-warn-soft',
    neutral: 'text-ink-2 bg-surface-soft',
  };

  return (
    <div className={clsx('rv-card p-5', className)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">
          {label}
        </span>
        {Icon && (
          <span className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', tones[iconTone])}>
            <Icon size={16} strokeWidth={2.2} />
          </span>
        )}
      </div>
      <div className={clsx('mt-2 text-2xl font-semibold tracking-tight text-ink', valueClassName)}>
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-ink-2">{hint}</div>}
    </div>
  );
};
