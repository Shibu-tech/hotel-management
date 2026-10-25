import React from 'react';
import { getStatusStyle, getPriorityStyle } from '../../utils/taskStatus';

export default function TaskStatusBadge({ status, size = 'md', className = '' }) {
  const style = getStatusStyle(status);

  const sizeStyles = {
    xs: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    sm: 'text-xs px-2.5 py-0.5 gap-1.5 font-medium',
    md: 'text-xs font-semibold px-3 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3.5 py-1.5 gap-2'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeStyles[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />
      <span>{style.label}</span>
    </span>
  );
}

export function PriorityBadge({ priority = 'medium', size = 'sm', className = '' }) {
  const style = getPriorityStyle(priority);

  const sizeStyles = {
    xs: 'text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5',
    sm: 'text-[11px] font-bold uppercase tracking-wider px-2 py-0.5',
    md: 'text-xs font-bold uppercase tracking-wider px-2.5 py-1'
  };

  return (
    <span
      className={`inline-flex items-center rounded border ${style.bg} ${style.text} ${style.border} ${sizeStyles[size]} ${className}`}
    >
      {style.label}
    </span>
  );
}
