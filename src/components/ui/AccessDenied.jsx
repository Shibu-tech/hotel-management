import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, ArrowRightLeft, LogIn, Lock } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { normalizeRole, ROLE_DEFAULT_ROUTES, ALL_ROLE_PROFILES } from '../../utils/permissions';

export default function AccessDenied({
  userRole = 'Unknown',
  userName = 'User',
  allowedRoles = [],
  requiredPermission = null,
  attemptedPath = ''
}) {
  const { switchActiveRole } = useTasks();
  const navigate = useNavigate();

  const normalizedUserRole = normalizeRole(userRole);
  const userDefaultRoute = ROLE_DEFAULT_ROUTES[normalizedUserRole] || '/login';

  const roleDisplayNames = {
    financial_operator: 'Financial Operator',
    frontdesk: 'Front Desk Coordinator',
    manager: 'Department Manager',
    supervisor: 'Department Supervisor',
    dispatcher: 'Department Dispatcher',
    security: 'Security Responder'
  };

  const formattedAllowed = allowedRoles
    .map((r) => roleDisplayNames[normalizeRole(r)] || r)
    .filter((v, idx, arr) => arr.indexOf(v) === idx)
    .join(', ');

  const firstAllowedRoleKey = allowedRoles.length > 0 ? normalizeRole(allowedRoles[0]) : null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-6 sm:p-10 text-center max-w-xl w-full animate-in fade-in-50 zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Lock className="w-8 h-8" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          Access Denied • Role Restriction
        </span>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
          Unauthorized Workspace Access
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-5 leading-relaxed">
          You are currently authenticated as <strong className="text-slate-900">{userName}</strong> (
          <span className="text-blue-700 font-semibold">{roleDisplayNames[normalizedUserRole] || userRole}</span>).
          {attemptedPath && (
            <span className="block mt-1 font-mono text-[11px] text-slate-500">
              Target Route: {attemptedPath}
            </span>
          )}
        </p>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left mb-6 text-xs text-slate-700 space-y-2">
          <div className="font-semibold text-slate-900 flex items-center justify-between">
            <span>Authorization Requirements:</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono">Enforced</span>
          </div>
          <p className="text-slate-600">
            • <strong>Authorized Role(s):</strong> {formattedAllowed || 'Restricted Administrator Role'}
          </p>
          {requiredPermission && (
            <p className="text-slate-600">
              • <strong>Required Permission:</strong> <code className="bg-slate-200 px-1 py-0.5 rounded">{requiredPermission}</code>
            </p>
          )}
          <p className="text-slate-500 text-[11px]">
            StayOps access policies enforce strict separation of duties. Your current account permissions do not grant access to this module.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate(userDefaultRoute)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to My Dashboard
          </button>

          {firstAllowedRoleKey && ALL_ROLE_PROFILES[firstAllowedRoleKey] && (
            <button
              type="button"
              onClick={() => {
                switchActiveRole(firstAllowedRoleKey);
                navigate(ROLE_DEFAULT_ROUTES[firstAllowedRoleKey]);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors shadow-xs"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Switch to {roleDisplayNames[firstAllowedRoleKey]}
            </button>
          )}

          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 text-xs font-semibold transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Role Selection
          </Link>
        </div>
      </div>
    </div>
  );
}
