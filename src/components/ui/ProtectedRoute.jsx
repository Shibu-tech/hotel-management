import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTasks } from '../../context/TaskContext';
import { normalizeRole } from '../../utils/permissions';
import AccessDenied from './AccessDenied';

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  requiredPermission = null
}) {
  const { currentUser } = useTasks();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  const userRole = normalizeRole(currentUser.role || currentUser.roleId);

  // If specific roles are required, verify user has one of them
  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedAllowed = allowedRoles.map((r) => normalizeRole(r));
    const hasRole = normalizedAllowed.includes(userRole);

    if (!hasRole) {
      return (
        <AccessDenied
          userRole={currentUser.role || userRole}
          userName={currentUser.name}
          allowedRoles={allowedRoles}
          requiredPermission={requiredPermission}
          attemptedPath={location.pathname}
        />
      );
    }
  }

  // If specific granular permission is required, verify user has it
  if (requiredPermission) {
    const hasPerm = Boolean(
      currentUser.permissions?.[requiredPermission] ||
      currentUser.granularPermissions?.[requiredPermission] ||
      (requiredPermission === 'financial' && (
        userRole === 'financial_operator' ||
        currentUser.hasFinancialAccess === true
      ))
    );

    if (!hasPerm) {
      return (
        <AccessDenied
          userRole={currentUser.role || userRole}
          userName={currentUser.name}
          allowedRoles={allowedRoles}
          requiredPermission={requiredPermission}
          attemptedPath={location.pathname}
        />
      );
    }
  }

  return children;
}
