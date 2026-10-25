import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function FinanceKPICard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendValue,
  color = 'blue',
  onClick,
  badgeText
}) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      ring: 'hover:border-blue-300'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      ring: 'hover:border-emerald-300'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      ring: 'hover:border-amber-300'
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
      ring: 'hover:border-rose-300'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
      ring: 'hover:border-purple-300'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-5 border ${scheme.border} shadow-sm transition-all duration-150 ${
        onClick ? `cursor-pointer ${scheme.ring} hover:shadow-md` : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${scheme.bg} ${scheme.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </div>
        {badgeText && (
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${scheme.bg} ${scheme.text}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span className="truncate">{subtext}</span>
        {trendValue && (
          <span
            className={`inline-flex items-center gap-0.5 font-semibold text-[11px] ${
              trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-600'
            }`}
          >
            {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}
