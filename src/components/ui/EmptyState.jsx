// src/components/ui/EmptyState.jsx
import React from 'react';
import { tokens } from '../../utils/classnames';
import clsx from 'clsx';

export const EmptyState = ({ icon: Icon, title, description, action, className }) => {
  return (
    <div className={clsx("text-center py-12", className)}>
      {Icon && (
        <Icon className="w-16 h-16 text-stone-400 mx-auto mb-4" />
      )}
      <h3 className="text-lg font-medium text-stone-900 dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-stone-500 dark:text-stone-400 mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action}
    </div>
  );
};