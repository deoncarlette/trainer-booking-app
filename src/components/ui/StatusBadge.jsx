// src/components/ui/StatusBadge.jsx
import React from 'react';
import { Badge } from './Badge';

export const StatusBadge = ({ status, className, ...props }) => {
  const statusConfig = {
    pending: { variant: 'warning', label: 'Pending' },
    confirmed: { variant: 'success', label: 'Confirmed' },
    cancelled: { variant: 'error', label: 'Cancelled' },
    completed: { variant: 'info', label: 'Completed' },
    rejected: { variant: 'error', label: 'Rejected' },
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant} className={className} {...props}>
      {config.label}
    </Badge>
  );
};