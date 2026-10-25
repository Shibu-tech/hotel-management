import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Shield,
  ShieldCheck,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Mail,
  Building2,
  Clock,
  History,
  X,
  AlertOctagon
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function AdminUsers() {
  const {
    platformUsers,
    addUser,
    updateUser,
    toggleUserStatus,
    updateUserRole
  } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [historyUser, setHistoryUser] = useState(null);
  const [deactivateConfirmUser, setDeactivateConfirmUser] = useState(null);

  // Form states for New User
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'fulfiller',
    department: 'Housekeeping',
    title: 'Staff Associate'
  });

  const [notification, setNotification] = useState({ type: '', message: '' });

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const filteredUsers = platformUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) {
      showNotification('error', 'Name and corporate email are required.');
      return;
    }

    try {
      const created = addUser(newUser);
      showNotification('success', `User account ${created.name} (${created.id}) provisioned successfully.`);
      setIsInviteModalOpen(false);
      setNewUser({
        name: '',
        email: '',
        role: 'fulfiller',
        department: 'Housekeeping',
        title: 'Staff Associate'
      });
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      updateUser(editingUser.id, {
        name: editingUser.name,
        department: editingUser.department,
        title: editingUser.title
      });
      if (editingUser.newRole && editingUser.newRole !== editingUser.role) {
        updateUserRole(editingUser.id, editingUser.newRole);
      }
      showNotification('success', `User profile for ${editingUser.name} updated.`);
      setEditingUser(null);
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  const handleToggleStatus = (user) => {
    try {
      const result = toggleUserStatus(user.id);
      showNotification('success', `Account for ${user.name} is now ${result.status}.`);
      setDeactivateConfirmUser(null);
    } catch (err) {
      showNotification('error', err.message);
      setDeactivateConfirmUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-cyan-100 text-cyan-950 border border-cyan-200">
              Identity & Access Management
            </span>
            <span className="text-xs text-slate-500 font-medium">Enterprise RBAC Directory</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            User Accounts & Role Permissions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage provisioned hotel accounts, role assignments, activation status, and access verification.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Provision New Account
        </button>
      </div>

      {notification.message && (
        <div
          className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-2 animate-in fade-in ${
            notification.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          {notification.message}
        </div>
      )}

      {/* Filters Ribbon */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Role:</span>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="ALL">All Roles ({platformUsers.length})</option>
            <option value="platform_admin">Platform Administrator</option>
            <option value="executive">Executive Viewer/Approver</option>
            <option value="finance">Financial Operator</option>
            <option value="frontdesk">Front Desk Coordinator</option>
            <option value="manager">Department Manager</option>
            <option value="supervisor">Department Supervisor</option>
            <option value="dispatcher">Department Dispatcher</option>
            <option value="security">Security Responder</option>
            <option value="fulfiller">Task Fulfiller</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active Accounts</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">User & Identifier</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Department & Title</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredUsers.map((u) => {
                const isActive = u.status === 'Active';
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                        <span>{u.id}</span> • <span>{u.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                        u.role === 'platform_admin'
                          ? 'bg-cyan-100 text-cyan-900 border border-cyan-200'
                          : u.role === 'executive'
                          ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                          : u.role === 'finance'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{u.department || 'Operations'}</div>
                      <div className="text-[11px] text-slate-400">{u.title || 'Staff Member'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {u.lastLogin || 'Never logged in'}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {u.createdAt || '2026-01-15'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setHistoryUser(u)}
                          title="View Access History"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingUser({ ...u, newRole: u.role })}
                          title="Edit Profile"
                          className="p-1.5 text-slate-400 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeactivateConfirmUser(u)}
                          title={isActive ? 'Deactivate Account' : 'Activate Account'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isActive
                              ? 'text-rose-400 hover:text-rose-700 hover:bg-rose-50'
                              : 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No users match criteria</h4>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>

      {/* Provision User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400">Identity Provisioning</span>
                <h3 className="text-base font-bold">Create User Account</h3>
              </div>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Adams"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="r.adams@stayops-resort.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Role Assignment</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="fulfiller">Task Fulfiller</option>
                    <option value="dispatcher">Department Dispatcher</option>
                    <option value="supervisor">Department Supervisor</option>
                    <option value="manager">Department Manager</option>
                    <option value="frontdesk">Front Desk Coordinator</option>
                    <option value="finance">Financial Operator</option>
                    <option value="security">Security Responder</option>
                    <option value="executive">Executive Viewer/Approver</option>
                    <option value="platform_admin">Platform Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Department</label>
                  <select
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Front Office">Front Office</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Guest Services">Guest Services</option>
                    <option value="Safety & Security">Safety & Security</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Executive Management">Executive Management</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Corporate Title</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Guest Coordinator"
                  value={newUser.title}
                  onChange={(e) => setNewUser({ ...newUser, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 flex items-start gap-2">
                <Lock className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <span>
                  Passwords are automatically generated and dispatched via encrypted corporate onboarding link. Never stored in plaintext.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-sm"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400">Account Modification</span>
                <h3 className="text-base font-bold">Edit Profile: {editingUser.id}</h3>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Role Assignment</label>
                <select
                  value={editingUser.newRole || editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, newRole: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="platform_admin">Platform Administrator</option>
                  <option value="executive">Executive Viewer/Approver</option>
                  <option value="finance">Financial Operator</option>
                  <option value="frontdesk">Front Desk Coordinator</option>
                  <option value="manager">Department Manager</option>
                  <option value="supervisor">Department Supervisor</option>
                  <option value="dispatcher">Department Dispatcher</option>
                  <option value="security">Security Responder</option>
                  <option value="fulfiller">Task Fulfiller</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Department</label>
                <input
                  type="text"
                  value={editingUser.department}
                  onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Corporate Title</label>
                <input
                  type="text"
                  value={editingUser.title}
                  onChange={(e) => setEditingUser({ ...editingUser, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-sm"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate/Activate Confirmation Modal */}
      {deactivateConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-rose-900 text-white p-5 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-300" />
              <h3 className="text-base font-bold">
                {deactivateConfirmUser.status === 'Active' ? 'Confirm Deactivation' : 'Confirm Activation'}
              </h3>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-700">
                Are you sure you want to {deactivateConfirmUser.status === 'Active' ? 'suspend' : 'reinstate'} access for{' '}
                <strong className="text-slate-900">{deactivateConfirmUser.name}</strong> ({deactivateConfirmUser.id})?
              </p>

              {deactivateConfirmUser.role === 'platform_admin' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] font-medium">
                  <strong>Notice:</strong> Safety guards prevent deactivating the last active Platform Administrator.
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeactivateConfirmUser(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleToggleStatus(deactivateConfirmUser)}
                  className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-sm ${
                    deactivateConfirmUser.status === 'Active'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {deactivateConfirmUser.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Access History Modal */}
      {historyUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400">Security Audit Log</span>
                <h3 className="text-base font-bold">Access History: {historyUser.name}</h3>
              </div>
              <button onClick={() => setHistoryUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div>User ID: <strong className="text-slate-900">{historyUser.id}</strong></div>
                <div>Role: <strong className="text-slate-900">{historyUser.role}</strong></div>
                <div>Created: <strong className="text-slate-900">{historyUser.createdAt || '2026-01-15'}</strong></div>
                <div>Last Login: <strong className="text-slate-900">{historyUser.lastLogin || 'Never'}</strong></div>
              </div>

              <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Recent Authenticated Events</div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">OAuth / MFA Session Exchange</div>
                    <div className="text-[10px] text-slate-400">IP: 192.168.10.45 • TLS 1.3</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    SUCCESS
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">Workspace Context Handshake</div>
                    <div className="text-[10px] text-slate-400">StayOps Core API Gateway</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    SUCCESS
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setHistoryUser(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
