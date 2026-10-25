import React from 'react';

export default function SummaryCard({
  title,
  count,
  subtext,
  icon: Icon,
  variant = 'blue',
  onClick
}) {
  const styles = {
    blue: {
      border: 'hover:border-blue-300',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      badgeBg: 'bg-blue-100 text-blue-800'
    },
    amber: {
      border: 'hover:border-amber-300',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      badgeBg: 'bg-amber-100 text-amber-800'
    },
    red: {
      border: 'hover:border-red-300',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      badgeBg: 'bg-red-100 text-red-800'
    },
    emerald: {
      border: 'hover:border-emerald-300',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-100 text-emerald-800'
    }
  };

  const current = styles[variant] || styles.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle hover:shadow-card transition-all cursor-pointer relative overflow-hidden group ${current.border}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
          {title}
        </span>
        <div
          className={`w-9 h-9 rounded-lg ${current.iconBg} ${current.iconColor} flex items-center justify-center transition-transform group-hover:scale-105`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900">{count}</span>
        {subtext && <span className="text-xs text-slate-500 font-medium">{subtext}</span>}
      </div>
    </div>
  );
}
