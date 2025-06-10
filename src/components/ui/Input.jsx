// src/components/ui/Input.jsx
import React from 'react';
import { form } from '../../utils/classnames';
import clsx from 'clsx';

export const Input = React.forwardRef(({ label, error, help, className, ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className={form.label}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          form.input,
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && <p className={form.error}>{error}</p>}
      {help && <p className={form.help}>{help}</p>}
    </div>
  );
});
Input.displayName = 'Input';

export const Textarea = React.forwardRef(({ label, error, help, className, ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className={form.label}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={clsx(
          form.textarea,
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && <p className={form.error}>{error}</p>}
      {help && <p className={form.help}>{help}</p>}
    </div>
  );
});
Textarea.displayName = 'Textarea';

export const Select = React.forwardRef(({ label, error, help, children, className, ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className={form.label}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={clsx(
          form.select,
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className={form.error}>{error}</p>}
      {help && <p className={form.help}>{help}</p>}
    </div>
  );
});
Select.displayName = 'Select';