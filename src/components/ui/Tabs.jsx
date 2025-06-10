// src/components/ui/Tabs.jsx
import React from 'react';
import clsx from 'clsx';

export const Tabs = ({ value, onValueChange, children, className }) => {
  return (
    <div className={className}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  );
};

export const TabsList = ({ children, className }) => {
  return (
    <div className={clsx(
      "flex space-x-1 rounded-lg bg-stone-100 dark:bg-stone-800 p-1",
      className
    )}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, onValueChange, currentValue, children, className }) => {
  const isActive = value === currentValue;

  return (
    <button
      onClick={() => onValueChange?.(value)}
      className={clsx(
        "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive 
          ? "bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm"
          : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white",
        className
      )}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, currentValue, children, className }) => {
  if (value !== currentValue) return null;

  return (
    <div className={clsx("mt-6", className)}>
      {children}
    </div>
  );
};