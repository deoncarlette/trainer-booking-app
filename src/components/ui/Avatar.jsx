// src/components/ui/Avatar.jsx
import React from 'react';
import clsx from 'clsx';

export const Avatar = ({ src, alt, size = 'md', fallback, className, ...props }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl',
  };

  const [imageError, setImageError] = React.useState(false);

  const getInitials = (name) => {
    return name?.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2) || '?';
  };

  return (
    <div
      className={clsx(
        "relative inline-flex items-center justify-center",
        "rounded-full bg-stone-100 dark:bg-stone-700",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className={clsx("font-medium text-stone-600 dark:text-stone-300", textSizeClasses[size])}>
          {fallback || getInitials(alt || '')}
        </span>
      )}
    </div>
  );
};