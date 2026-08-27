import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  hover,
  padded = true,
  className,
  children,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        'rv-card',
        hover && 'rv-card-hover',
        padded && 'p-5',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
