import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowLeft, KeyRound, AlertTriangle } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function PermissionGuard({
  children,
  requireFinancial = false,
  fallbackTitle = 'Access Restricted by Permission Policy',
  fallbackMessage = null
}) {
  const { frontDeskProfile } = useTasks();

  const hasFinancial = frontDeskProfile?.hasFinancialAccess !== false && frontDeskProfile?.financialPermissions?.canViewFolio !== false;

  if (requireFinancial && !hasFinancial) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 sm:p-12 text-center max-w-2xl mx-auto my-12 animate-in fade-in-50">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          Financial Permission Required
        </span>

        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          {fallbackTitle}
        </h2>

        <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
          {fallbackMessage ||
            'Direct access to guest financial folios, payment collection, and billing adjustments is protected by hotel security policy. Front Desk Coordinator David Martinez is currently operating under standard guest-facing privileges.'}
        </p>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left max-w-md mx-auto mb-8 text-xs text-slate-700 space-y-2">
          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            Security & Policy Compliance Rules:
          </div>
          <p className="text-slate-600">
            • Folio viewing & payment execution require explicit cashier/finance authority.
          </p>
          <p className="text-slate-600">
            • Refunds exceeding $0.00 must be submitted to the Department Manager for delegated approval.
          </p>
          <p className="text-slate-600">
            • You can enable financial test permissions in your Front Desk Profile settings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/frontdesk/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Front Desk Dashboard
          </Link>
          <Link
            to="/frontdesk/profile"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition-colors"
          >
            Review Permissions in Profile
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
