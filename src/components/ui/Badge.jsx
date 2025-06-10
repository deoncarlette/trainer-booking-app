// src/components/ui/Badge.jsx
import React from 'react';
import { badge } from '../../utils/classnames';
import clsx from 'clsx';

export const Badge = ({ children, variant = 'default', className, ...props }) => {
  return (
    <span
      className={clsx(
        badge.base,
        badge.variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};