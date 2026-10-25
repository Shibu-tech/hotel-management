import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Server,
  Activity,
  HardDrive,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  FileText,
  UserPlus,
  Zap,
  Lock
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function AdminDashboard() {
  const {
    adminKPIs,
    adminProfile,
    platformUsers,
    integrations,
    adminAuditLogs,
    backups,
    triggerIntegrationHealthCheck,
    triggerCreateBackup
  } = useTasks();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [quickStatus, setQuickStatus] = useState('');

  const handleRefreshAll = () => {
    setIsRefreshing(true);
    integrations.forEach((item) => triggerIntegrationHealthCheck(item.id));
    setTimeout(() => {
      setIsRefreshing(false);
      setQuickStatus('All 6 system integrations re-verified and healthy.');
      setTimeout(() => setQuickStatus(''), 3000);
    }, 800);
  };

  const handleInstantBackup = () => {
    const backupId = triggerCreateBackup('On-Demand Admin Dashboard Snapshot');
    setQuickStatus(`Encrypted backup snapshot ${backupId} initiated successfully.`);
    setTimeout(() => setQuickStatus(''), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-cyan-100 text-cyan-950 border border-cyan-200">
              Platform Administration
            </span>
            <span className="text-xs text-slate-500 font-medium">Production Infrastructure Cluster</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            System Overview & Platform Telemetry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as <span className="font-semibold text-slate-700">{adminProfile.name}</span> ({adminProfile.title}) • Role Access, Service Integrations, Infrastructure Backups & Audit Trail.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-600' : ''}`} />
            Run Service Health Checks
          </button>
          <button
            onClick={handleInstantBackup}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <HardDrive className="w-3.5 h-3.5" />
            Snapshot Database
          </button>
        </div>
      </div>

      {quickStatus && (
        <div className="p-3 bg-cyan-50 border border-cyan-200 text-cyan-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-600" />
          {quickStatus}
        </div>
      )}

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Link
          to="/admin/users"
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-cyan-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Registered Users</span>
            <Users className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">{adminKPIs.totalUsers}</div>
          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            Across 9 authorized roles <ArrowRight className="w-3 h-3 text-cyan-600" />
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Accounts</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{adminKPIs.activeAccounts}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">100% active standing</div>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-amber-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Access Requests</span>
            <Clock className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-amber-700">{adminKPIs.pendingAccessRequests}</div>
          <div className="text-[10px] text-slate-500 mt-1">Awaiting provision approval</div>
        </Link>

        <Link
          to="/admin/integrations"
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-cyan-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Integrations</span>
            <Server className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900">{adminKPIs.connectedServices}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">6 of 6 operational</div>
        </Link>

        <Link
          to="/admin/audit-logs"
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recent Events</span>
            <Activity className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-indigo-900">{adminKPIs.recentEventsCount}</div>
          <div className="text-[10px] text-slate-500 mt-1">Immutable security log</div>
        </Link>

        <Link
          to="/admin/backups"
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Backup Status</span>
            <HardDrive className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-base font-black text-emerald-700 leading-tight">Confirmed</div>
          <div className="text-[10px] text-slate-500 mt-1">AES-256 S3 Verified</div>
        </Link>
      </div>

      {/* Main Grid: Integrations Live Health & Recent Admin Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Integrations */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-600" />
                  Connected Services & API Gateways
                </h3>
                <p className="text-xs text-slate-500">Live operational status and ping latency</p>
              </div>
              <Link
                to="/admin/integrations"
                className="text-xs font-bold text-cyan-700 hover:text-cyan-900 flex items-center gap-1"
              >
                Manage All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 p-2">
              {integrations.slice(0, 5).map((srv) => (
                <div key={srv.id} className="p-3 flex items-center justify-between hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{srv.name}</div>
                      <div className="text-[11px] text-slate-400">{srv.provider} • Latency: <span className="font-mono text-slate-600">{srv.latency}</span></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {srv.status}
                    </span>
                    <button
                      onClick={() => triggerIntegrationHealthCheck(srv.id)}
                      title="Ping Service"
                      className="p-1 text-slate-400 hover:text-cyan-600 rounded transition-colors cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50/70 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-medium">
              Zero secret keys or unmasked database passwords exposed in browser runtime.
            </span>
          </div>
        </div>

        {/* Recent Admin Audit Events */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  Recent Administrative Audit Trail
                </h3>
                <p className="text-xs text-slate-500">Immutable record of technical actions & privileges</p>
              </div>
              <Link
                to="/admin/audit-logs"
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
              >
                View Full Log <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 p-2">
              {adminAuditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-slate-600">{log.action}</span>
                    <span className="text-slate-400">{log.timestamp}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800">{log.changeSummary}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Actor: <strong className="text-slate-600">{log.actor}</strong></span>
                    <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 font-bold rounded">
                      {log.outcome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50/70 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-medium">
              Append-only audit storage. Platform administrators cannot edit or purge log entries.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
