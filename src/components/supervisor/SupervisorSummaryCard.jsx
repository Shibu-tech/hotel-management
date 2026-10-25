import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function SupervisorSummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  onClick,
  badge
}) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50/70 text-blue-700 border-blue-100',
      iconBg: 'bg-blue-600 text-white',
      accent: 'border-l-blue-600'
    },
    amber: {
      bg: 'bg-amber-50/70 text-amber-800 border-amber-100',
      iconBg: 'bg-amber-600 text-white',
      accent: 'border-l-amber-500'
    },
    red: {
      bg: 'bg-red-50/70 text-red-700 border-red-100',
      iconBg: 'bg-red-600 text-white',
      accent: 'border-l-red-600'
    },
    purple: {
      bg: 'bg-purple-50/70 text-purple-700 border-purple-100',
      iconBg: 'bg-purple-600 text-white',
      accent: 'border-l-purple-600'
    },
    emerald: {
      bg: 'bg-emerald-50/70 text-emerald-700 border-emerald-100',
      iconBg: 'bg-emerald-600 text-white',
      accent: 'border-l-emerald-600'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all border-l-4 ${
        scheme.accent
      } ${onClick ? 'cursor-pointer hover:border-slate-300' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#172033] tracking-tight">{value}</span>
            {badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>

        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${scheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {onClick && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-blue-600">
          <span>View breakdown</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
        </div>
      )}
    </div>
  );
}
