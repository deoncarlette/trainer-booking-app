// src/components/ui/Modal.jsx
import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import clsx from 'clsx';

export const Modal = ({ isOpen, onClose, title, children, size = 'md', className }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4',
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-stone-900/50 transition-opacity" onClick={onClose} />
        <div className={clsx(
          "inline-block w-full transform overflow-hidden rounded-lg",
          "bg-white dark:bg-stone-900 text-left align-bottom shadow-xl transition-all",
          "sm:my-8 sm:align-middle",
          sizeClasses[size],
          className
        )}>
          <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-700">
            <h2 className="text-xl font-semibold text-stone-900 dark:text-white">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};