import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function FinanceStatusBadge({ status, type = 'status' }) {
  if (!status) return null;

  const normalized = String(status).toLowerCase();

  // Status mapping logic
  if (normalized.includes('settled') || normalized.includes('completed') || normalized.includes('matched') || normalized.includes('resolved')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        {status}
      </span>
    );
  }

  if (normalized.includes('captured') || normalized.includes('authorized') || normalized.includes('approved')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
        {status}
      </span>
    );
  }

  if (normalized.includes('pending') || normalized.includes('awaiting') || normalized.includes('investigating') || normalized.includes('open')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        {status}
      </span>
    );
  }

  if (normalized.includes('variance') || normalized.includes('escalated') || normalized.includes('failed') || normalized.includes('rejected')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
        {status}
      </span>
    );
  }

  if (normalized.includes('reversed') || normalized.includes('refunded')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
        <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
        {status}
      </span>
    );
  }

  // Priority badges
  if (type === 'priority') {
    if (normalized === 'critical') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-600 text-white animate-pulse">
          Critical
        </span>
      );
    }
    if (normalized === 'high') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">
          High
        </span>
      );
    }
    if (normalized === 'medium') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800">
          Medium
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
        Low
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      {status}
    </span>
  );
}
