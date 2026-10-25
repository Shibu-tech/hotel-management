import React from 'react';
import { ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';

export default function ManagerSummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeColor = 'bg-blue-100 text-blue-800',
  trend, // { direction: 'up' | 'down', text: '12% vs yesterday', positive: true }
  alert = false,
  onClick
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border p-4 sm:p-5 transition-all shadow-subtle ${
        alert
          ? 'border-red-300 bg-red-50/20 ring-1 ring-red-200'
          : 'border-slate-200/80 hover:border-slate-300'
      } ${onClick ? 'cursor-pointer hover:shadow-card' : ''}`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {badgeText && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
              {badgeText}
            </span>
          )}
          {Icon && (
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                alert ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value !== null && value !== undefined ? value : '—'}
        </div>
        {trend && (
          <div
            className={`flex items-center text-xs font-semibold ${
              trend.positive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend.direction === 'up' ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            <span>{trend.text}</span>
          </div>
        )}
      </div>

      {subtitle && (
        <div className="mt-1 text-xs text-slate-500 font-medium flex items-center gap-1">
          {alert && <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />}
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
}
