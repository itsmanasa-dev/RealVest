import React from 'react';
import { clsx } from 'clsx';

type Tone = 'positive' | 'warning' | 'danger' | 'brand' | 'neutral' | 'blue' | 'pos' | 'warn';

interface BadgeProps {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}

const toneStyles: Record<Tone, string> = {
  positive: 'bg-pos-soft text-pos',
  warning: 'bg-warn-soft text-warn',
  danger: 'bg-neg-soft text-neg',
  brand: 'bg-brand-soft text-brand',
  neutral: 'bg-surface-strong text-ink-2',
  blue: 'bg-brand/10 text-brand',
  pos: 'bg-pos-soft text-pos',
  warn: 'bg-warn-soft text-warn',
};

export const Badge: React.FC<BadgeProps> = ({ tone = 'neutral', className, children }) => {
  return <span className={clsx('badge', toneStyles[tone], className)}>{children}</span>;
};

export function recommendationTone(rec: string): Tone {
  if (rec === 'BUY') return 'positive';
  if (rec === 'HOLD') return 'warning';
  return 'danger';
}

export function riskTone(level: string): Tone {
  const n = String(level).toUpperCase();
  if (n === 'LOW' || n === 'LOW RISK') return 'positive';
  if (n === 'HIGH' || n === 'HIGH RISK') return 'danger';
  return 'warning';
}
