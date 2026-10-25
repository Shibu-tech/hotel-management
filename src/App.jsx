import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider, useTasks } from './context/TaskContext';
import { normalizeRole, ROLE_DEFAULT_ROUTES } from './utils/permissions';
import ProtectedRoute from './components/ui/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';

// Front Desk Coordinator Workspace Layout & Pages
import FrontDeskLayout from './components/layout/FrontDeskLayout';
import FrontDeskDashboard from './pages/frontdesk/FrontDeskDashboard';
import Reservations from './pages/frontdesk/Reservations';
import CheckInPage from './pages/frontdesk/CheckInPage';
import CheckOutPage from './pages/frontdesk/CheckOutPage';
import GuestRequests from './pages/frontdesk/GuestRequests';
import GuestCases from './pages/frontdesk/GuestCases';
import RoomMoves from './pages/frontdesk/RoomMoves';
import WakeUpCalls from './pages/frontdesk/WakeUpCalls';
import GuestCommunications from './pages/frontdesk/GuestCommunications';
import Payments from './pages/frontdesk/Payments';
import FrontDeskReports from './pages/frontdesk/Reports';
import FrontDeskNotifications from './pages/frontdesk/Notifications';
import FrontDeskProfile from './pages/frontdesk/FrontDeskProfile';
import PermissionGuard from './components/ui/PermissionGuard';

// Department Manager Workspace Layout & Pages
import ManagerLayout from './components/layout/ManagerLayout';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import DepartmentTasks from './pages/manager/DepartmentTasks';
import StaffingScheduling from './pages/manager/StaffingScheduling';
import SLAPerformance from './pages/manager/SLAPerformance';
import ComplaintsRecovery from './pages/manager/ComplaintsRecovery';
import Approvals from './pages/manager/Approvals';
import Reports from './pages/manager/Reports';
import ManagerNotifications from './pages/manager/Notifications';
import ManagerProfile from './pages/manager/ManagerProfile';

// Department Supervisor Workspace Layout & Pages
import SupervisorLayout from './components/layout/SupervisorLayout';
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import TeamTasks from './pages/supervisor/TeamTasks';
import Inspections from './pages/supervisor/Inspections';
import Blockers from './pages/supervisor/Blockers';
import TeamWorkload from './pages/supervisor/TeamWorkload';
import Handover from './pages/supervisor/Handover';
import SupervisorNotifications from './pages/supervisor/Notifications';
import SupervisorProfile from './pages/supervisor/SupervisorProfile';

// Dispatcher Workspace Layout & Pages
import DispatcherLayout from './components/layout/DispatcherLayout';
import DispatcherDashboard from './pages/dispatcher/DispatcherDashboard';
import TaskQueue from './pages/dispatcher/TaskQueue';
import CreateTask from './pages/dispatcher/CreateTask';
import TaskDetails from './pages/dispatcher/TaskDetails';
import StaffWorkload from './pages/dispatcher/StaffWorkload';
import Notifications from './pages/dispatcher/Notifications';
import DispatcherProfile from './pages/dispatcher/DispatcherProfile';
import TaskFulfillerPage from './pages/fulfiller/TaskFulfillerPage';

// Task Fulfiller Workspace Layout & Pages
import TaskFulfillerLayout from './components/layout/TaskFulfillerLayout';
import TaskFulfillerDashboard from './pages/fulfiller/TaskFulfillerDashboard';
import MyTasksPage from './pages/fulfiller/MyTasksPage';
import TaskHistoryPage from './pages/fulfiller/TaskHistoryPage';
import FulfillerNotificationsPage from './pages/fulfiller/FulfillerNotificationsPage';
import FulfillerProfilePage from './pages/fulfiller/FulfillerProfilePage';

// Financial Operator Workspace Layout & Pages
import FinanceLayout from './components/layout/FinanceLayout';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import FoliosPage from './pages/finance/FoliosPage';
import TransactionsPage from './pages/finance/TransactionsPage';
import ReconciliationPage from './pages/finance/ReconciliationPage';
import RefundsPage from './pages/finance/RefundsPage';
import DiscrepanciesPage from './pages/finance/DiscrepanciesPage';
import ReportsPage from './pages/finance/ReportsPage';
import AuditPage from './pages/finance/AuditPage';
import FinanceNotifications from './pages/finance/FinanceNotifications';
import FinanceProfile from './pages/finance/FinanceProfile';

// Security Responder Workspace Layout & Pages
import SecurityLayout from './components/layout/SecurityLayout';
import SecurityDashboard from './pages/security/SecurityDashboard';
import SecurityAlertsPage from './pages/security/SecurityAlertsPage';
import SecurityIncidentsPage from './pages/security/SecurityIncidentsPage';
import SecurityIncidentDetailsPage from './pages/security/SecurityIncidentDetailsPage';
import SecurityBackupPage from './pages/security/SecurityBackupPage';
import SecurityEscalationsPage from './pages/security/SecurityEscalationsPage';
import SecurityEvidencePage from './pages/security/SecurityEvidencePage';
import SecurityHandoverPage from './pages/security/SecurityHandoverPage';
import SecurityHistoryPage from './pages/security/SecurityHistoryPage';
import SecurityNotificationsPage from './pages/security/SecurityNotificationsPage';
import SecurityProfilePage from './pages/security/SecurityProfilePage';

// Executive Viewer/Approver Workspace Layout & Pages
import ExecutiveLayout from './components/layout/ExecutiveLayout';
import ExecutiveDashboard from './pages/executive/ExecutiveDashboard';
import ExecutiveDepartments from './pages/executive/ExecutiveDepartments';
import ExecutiveEscalations from './pages/executive/ExecutiveEscalations';
import ExecutiveApprovals from './pages/executive/ExecutiveApprovals';
import ExecutiveReports from './pages/executive/ExecutiveReports';
import ExecutiveCompliance from './pages/executive/ExecutiveCompliance';
import ExecutiveNotifications from './pages/executive/ExecutiveNotifications';
import ExecutiveProfile from './pages/executive/ExecutiveProfile';

// Platform Administrator Workspace Layout & Pages
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRoles from './pages/admin/AdminRoles';
import AdminIntegrations from './pages/admin/AdminIntegrations';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminBackups from './pages/admin/AdminBackups';
import AdminProfile from './pages/admin/AdminProfile';

/**
 * Role-aware root redirect component.
 * Uses authenticated user session to route to the correct workspace dashboard.
 */
function RootRedirect() {
  const { currentUser } = useTasks();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  const normalized = normalizeRole(currentUser.role || currentUser.roleId);
  const target = ROLE_DEFAULT_ROUTES[normalized] || '/finance/dashboard';
  return <Navigate to={target} replace />;
}

/**
 * Role-aware profile shortcut redirect.
 */
function ProfileRedirect() {
  const { currentUser } = useTasks();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  const normalized = normalizeRole(currentUser.role || currentUser.roleId);
  const target =
    normalized === 'financial_operator'
      ? '/finance/profile'
      : normalized === 'frontdesk'
      ? '/frontdesk/profile'
      : normalized === 'manager'
      ? '/manager/profile'
      : normalized === 'supervisor'
      ? '/supervisor/profile'
      : normalized === 'security'
      ? '/security/dashboard'
      : normalized === 'task_fulfiller'
      ? '/task-fulfiller/profile'
      : normalized === 'executive'
      ? '/executive/profile'
      : normalized === 'platform_admin'
      ? '/admin/profile'
      : '/dispatcher/profile';
  return <Navigate to={target} replace />;
}

/**
 * Safe fallback component for unknown URLs to avoid redirect loops
 * or silently rendering Front Desk for everyone.
 */
function NotFoundFallback() {
  const { currentUser } = useTasks();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  const normalized = normalizeRole(currentUser.role || currentUser.roleId);
  const target = ROLE_DEFAULT_ROUTES[normalized] || '/finance/dashboard';
  return <Navigate to={target} replace />;
}

export default function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication & Role Selection Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Role-Aware Root Redirect (routes to authorized role dashboard) */}
          <Route path="/" element={<RootRedirect />} />

          {/* Quick Profile URL Redirect */}
          <Route path="/profile" element={<ProfileRedirect />} />

          {/* ======================================================== */}
          {/* FRONT DESK COORDINATOR WORKSPACE (PROTECTED)             */}
          {/* ======================================================== */}
          <Route
            path="/frontdesk"
            element={
              <ProtectedRoute allowedRoles={['frontdesk', 'front_desk_coordinator', 'ROLE_FRONT_DESK_COORDINATOR']}>
                <FrontDeskLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/frontdesk/dashboard" replace />} />
            <Route path="dashboard" element={<FrontDeskDashboard />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="check-in" element={<CheckInPage />} />
            <Route path="check-out" element={<CheckOutPage />} />
            <Route path="requests" element={<GuestRequests />} />
            <Route path="cases" element={<GuestCases />} />
            <Route path="room-moves" element={<RoomMoves />} />
            <Route path="wake-up-calls" element={<WakeUpCalls />} />
            <Route path="communications" element={<GuestCommunications />} />
            <Route
              path="payments"
              element={
                <PermissionGuard requireFinancial={true}>
                  <Payments />
                </PermissionGuard>
              }
            />
            <Route path="reports" element={<FrontDeskReports />} />
            <Route path="notifications" element={<FrontDeskNotifications />} />
            <Route path="profile" element={<FrontDeskProfile />} />
          </Route>

          {/* ======================================================== */}
          {/* DEPARTMENT MANAGER WORKSPACE (PROTECTED)                 */}
          {/* ======================================================== */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={['manager', 'department_manager', 'ROLE_DEPT_MANAGER']}>
                <ManagerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/manager/dashboard" replace />} />
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="tasks" element={<DepartmentTasks />} />
            <Route path="staffing" element={<StaffingScheduling />} />
            <Route path="performance" element={<SLAPerformance />} />
            <Route path="complaints" element={<ComplaintsRecovery />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<ManagerNotifications />} />
            <Route path="profile" element={<ManagerProfile />} />
          </Route>

          {/* ======================================================== */}
          {/* DEPARTMENT SUPERVISOR WORKSPACE (PROTECTED)               */}
          {/* ======================================================== */}
          <Route
            path="/supervisor"
            element={
              <ProtectedRoute allowedRoles={['supervisor', 'department_supervisor', 'ROLE_DEPT_SUPERVISOR']}>
                <SupervisorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/supervisor/dashboard" replace />} />
            <Route path="dashboard" element={<SupervisorDashboard />} />
            <Route path="tasks" element={<TeamTasks />} />
            <Route path="inspections" element={<Inspections />} />
            <Route path="blockers" element={<Blockers />} />
            <Route path="team" element={<TeamWorkload />} />
            <Route path="handover" element={<Handover />} />
            <Route path="notifications" element={<SupervisorNotifications />} />
            <Route path="profile" element={<SupervisorProfile />} />
          </Route>

          {/* ======================================================== */}
          {/* DEPARTMENT DISPATCHER WORKSPACE (PROTECTED)               */}
          {/* ======================================================== */}
          <Route
            path="/dispatcher"
            element={
              <ProtectedRoute allowedRoles={['dispatcher', 'department_dispatcher', 'ROLE_DEPT_DISPATCHER']}>
                <DispatcherLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dispatcher/dashboard" replace />} />
            <Route path="dashboard" element={<DispatcherDashboard />} />
            <Route path="tasks" element={<TaskQueue />} />
            <Route path="tasks/new" element={<CreateTask />} />
            <Route path="tasks/:taskId" element={<TaskDetails />} />
            <Route path="staff" element={<StaffWorkload />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<DispatcherProfile />} />
          </Route>

          {/* ======================================================== */}
          {/* TASK FULFILLER WORKSPACE (PROTECTED)                     */}
          {/* ======================================================== */}
          <Route
            path="/task-fulfiller"
            element={
              <ProtectedRoute allowedRoles={['task_fulfiller', 'fulfiller', 'attendant_runner', 'ROLE_TASK_FULFILLER']}>
                <TaskFulfillerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/task-fulfiller/dashboard" replace />} />
            <Route path="dashboard" element={<TaskFulfillerDashboard />} />
            <Route path="tasks" element={<MyTasksPage />} />
            <Route path="history" element={<TaskHistoryPage />} />
            <Route path="notifications" element={<FulfillerNotificationsPage />} />
            <Route path="profile" element={<FulfillerProfilePage />} />
          </Route>

          {/* Backward compatibility / quick redirect for /fulfiller */}
          <Route path="/fulfiller" element={<Navigate to="/task-fulfiller/dashboard" replace />} />

          {/* ======================================================== */}
          {/* FINANCIAL OPERATOR WORKSPACE (PROTECTED)                 */}
          {/* ======================================================== */}
          <Route
            path="/finance"
            element={
              <ProtectedRoute allowedRoles={['financial_operator', 'finance', 'ROLE_FINANCIAL_OPERATOR']}>
                <FinanceLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/finance/dashboard" replace />} />
            <Route path="dashboard" element={<FinanceDashboard />} />
            <Route path="folios" element={<FoliosPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="reconciliation" element={<ReconciliationPage />} />
            <Route path="refunds" element={<RefundsPage />} />
            <Route path="discrepancies" element={<DiscrepanciesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="audit" element={<AuditPage />} />
            <Route path="notifications" element={<FinanceNotifications />} />
            <Route path="profile" element={<FinanceProfile />} />
          </Route>

          {/* ======================================================== */}
          {/* SECURITY RESPONDER WORKSPACE (PROTECTED)                 */}
          {/* ======================================================== */}
          <Route
            path="/security"
            element={
              <ProtectedRoute allowedRoles={['security', 'security_responder', 'ROLE_SECURITY_RESPONDER']}>
                <SecurityLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/security/dashboard" replace />} />
            <Route path="dashboard" element={<SecurityDashboard />} />
            <Route path="alerts" element={<SecurityAlertsPage />} />
            <Route path="incidents" element={<SecurityIncidentsPage />} />
            <Route path="incidents/:incidentId" element={<SecurityIncidentDetailsPage />} />
            <Route path="backup" element={<SecurityBackupPage />} />
            <Route path="escalations" element={<SecurityEscalationsPage />} />
            <Route path="evidence" element={<SecurityEvidencePage />} />
            <Route path="handover" element={<SecurityHandoverPage />} />
            <Route path="history" element={<SecurityHistoryPage />} />
            <Route path="notifications" element={<SecurityNotificationsPage />} />
            <Route path="profile" element={<SecurityProfilePage />} />
          </Route>

          {/* ======================================================== */}
          {/* EXECUTIVE VIEWER/APPROVER WORKSPACE (PROTECTED)          */}
          {/* ======================================================== */}
          <Route
            path="/executive"
            element={
              <ProtectedRoute allowedRoles={['executive', 'executive_approver', 'ROLE_EXECUTIVE_APPROVER']}>
                <ExecutiveLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/executive/dashboard" replace />} />
            <Route path="dashboard" element={<ExecutiveDashboard />} />
            <Route path="departments" element={<ExecutiveDepartments />} />
            <Route path="escalations" element={<ExecutiveEscalations />} />
            <Route path="approvals" element={<ExecutiveApprovals />} />
            <Route path="reports" element={<ExecutiveReports />} />
            <Route path="compliance" element={<ExecutiveCompliance />} />
            <Route path="notifications" element={<ExecutiveNotifications />} />
            <Route path="profile" element={<ExecutiveProfile />} />
          </Route>

          {/* ======================================================== */}
          {/* PLATFORM ADMINISTRATOR WORKSPACE (PROTECTED)             */}
          {/* ======================================================== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['platform_admin', 'admin', 'ROLE_PLATFORM_ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="integrations" element={<AdminIntegrations />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="backups" element={<AdminBackups />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* Role-aware Fallback Route (no loops, no default front desk silent render) */}
          <Route path="*" element={<NotFoundFallback />} />
        </Routes>
      </BrowserRouter>
    </TaskProvider>
  );
}
