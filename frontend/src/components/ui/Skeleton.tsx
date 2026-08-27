import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, style }) => {
  return <div className={clsx('rv-skeleton', className)} style={style} />;
};
