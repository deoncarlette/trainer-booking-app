// src/components/ui/Card.jsx
import React from 'react';
import { card } from '../../utils/classnames';
import clsx from 'clsx';

export const Card = ({ children, variant = 'default', padding = 'md', interactive = false, className, ...props }) => {
  return (
    <div
      className={clsx(
        card.base,
        card.variants[variant],
        card.padding[padding],
        interactive && card.interactive,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => (
  <div className={clsx("flex items-center justify-between mb-4", className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={clsx("text-lg font-semibold text-stone-900 dark:text-white", className)} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={clsx("space-y-4", className)} {...props}>
    {children}
  </div>
);