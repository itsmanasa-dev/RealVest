import React, { useState } from 'react';
import type { Property } from '../../types';
import { MapPin, Heart, Home, Briefcase, Building2, ArrowUpRight } from 'lucide-react';
import { clsx } from 'clsx';
import { formatInrLakhs, formatInrRent } from '../../utils/currency';
import { Badge, recommendationTone } from '../ui/Badge';

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
  badge?: { label: string; tone?: 'brand' | 'pos' | 'warn' | 'neutral' };
  className?: string;
}

function TypeIcon({ category }: { category: Property['category'] }) {
  if (category === 'Commercial') return <Briefcase size={12} />;
  if (category.includes('Villa')) return <Building2 size={12} />;
  return <Home size={12} />;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  badge,
  className,
}) => {
  const [saved, setSaved] = useState(false);

  const diffPct =
    ((property.askingPriceLakhs - property.fairValueLakhs) / property.fairValueLakhs) * 100;
  const isDeal = diffPct < 0;

  return (
    <article
      className={clsx(
        'rv-card rv-card-hover overflow-hidden group flex flex-col cursor-pointer',
        className
      )}
      onClick={() => onSelect?.(property)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onSelect) onSelect(property);
      }}
      aria-label={`View analysis for ${property.title}`}
    >
      {/* Image / visual */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-strong">
        <img
          src={property.imageUrl}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Floating recommendation badge */}
        <div className="absolute top-3 left-3">
          <span className="absolute inset-0 rounded-md bg-black/10" />
          <Badge tone={recommendationTone(property.recommendation)} className="shadow-sm">
            {property.recommendation}
          </Badge>
        </div>

        {/* Save / favorite */}
        <button
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            setSaved(!saved);
          }}
          aria-label={saved ? 'Remove from saved' : 'Save property'}
        >
          <Heart
            size={16}
            strokeWidth={2}
            className={saved ? 'text-neg fill-neg' : 'text-ink-2'}
          />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-[15px] tracking-tight text-ink truncate">
              {property.title}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-3">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate">{property.location}, {property.city}</span>
            </p>
          </div>
          <span className="shrink-0 font-semibold text-ink">
            {formatInrLakhs(property.askingPriceLakhs)}
          </span>
        </div>

        {/* Type + BHK mini meta */}
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-soft text-ink-2 text-[11px] font-medium">
            <TypeIcon category={property.category} />
            {property.category}
          </span>
          {property.bhk > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-surface-soft text-ink-2 text-[11px] font-medium">
              {property.bhk} BHK
            </span>
          )}
          {property.sqft > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-surface-soft text-ink-2 text-[11px] font-medium">
              {property.sqft.toLocaleString('en-IN')} sqft
            </span>
          )}
        </div>

        {/* Key financial metrics (progressive disclosure) */}
        <div className="mt-3.5 grid grid-cols-3 gap-2 border-t pt-3 border-line">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-ink-3">Value</p>
            <p className="text-sm font-semibold text-ink truncate">
              {formatInrLakhs(property.fairValueLakhs)}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-ink-3">Rent</p>
            <p className="text-sm font-semibold text-ink truncate">
              {formatInrRent(property.monthlyRent)}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-ink-3">ROI</p>
            <p className={clsx('text-sm font-semibold truncate', property.annualYield >= 4 ? 'text-pos' : 'text-warn')}>
              {property.annualYield.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Investment fit / score + deal indicator */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-1 h-1.5 rounded-full bg-surface-strong overflow-hidden">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${Math.min(property.investmentScore, 100)}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-ink-2 shrink-0">
              {property.investmentScore} fit
            </span>
          </div>
          {badge ? (
            <Badge tone={badge.tone || 'brand'} className="shrink-0">
              {badge.label}
            </Badge>
          ) : (
            isDeal && (
              <Badge tone="positive" className="shrink-0">
                {Math.abs(diffPct).toFixed(0)}% under value
              </Badge>
            )
          )}
        </div>

        {/* CTA */}
        <div className="mt-4">
          <span className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-md bg-surface-soft text-ink font-semibold text-sm transition-colors group-hover:bg-brand group-hover:text-white">
            View Analysis
            <ArrowUpRight size={15} />
          </span>
        </div>
      </div>
    </article>
  );
};
