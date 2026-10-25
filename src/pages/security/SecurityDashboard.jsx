import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  Radio,
  Lock,
  CheckCircle2,
  Clock,
  PhoneCall,
  Eye,
  Building2,
  Users,
  Plus,
  ArrowUpRight,
  FileText,
  Search,
  Filter,
  Flame,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  Archive,
  History,
  FileCheck2,
  CalendarCheck2,
  Activity
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { INCIDENT_SEVERITY, INCIDENT_STATUS, BACKUP_STATUS } from '../../data/mockSecurityData';
import EmergencyProtocolModal from '../../components/security/EmergencyProtocolModal';
import SecurityIncidentModal from '../../components/security/SecurityIncidentModal';
import RequestBackupModal from '../../components/security/RequestBackupModal';
import EscalateIncidentModal from '../../components/security/EscalateIncidentModal';
import AddNoteModal from '../../components/security/AddNoteModal';
import CloseIncidentModal from '../../components/security/CloseIncidentModal';

export default function SecurityDashboard() {
  const navigate = useNavigate();
  const {
    securityProfile,
    securityKPIs,
    securityIncidents,
    securityAlerts,
    securityBackupRequests,
    securityEscalations,
    securityEvidence,
    securityHandovers,
    acknowledgeSecurityAlert,
    createIncidentFromAlert,
    updateSecurityIncidentStatus,
    updateBackupRequestStatus,
    showToast
  } = useTasks();

  // Modals state
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [createIncidentModalOpen, setCreateIncidentModalOpen] = useState(false);
  const [requestBackupModalOpen, setRequestBackupModalOpen] = useState(false);
  const [selectedIncidentForBackup, setSelectedIncidentForBackup] = useState(null);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [selectedIncidentForEscalate, setSelectedIncidentForEscalate] = useState(null);
  const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);
  const [selectedIncidentForNote, setSelectedIncidentForNote] = useState(null);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [selectedIncidentForClose, setSelectedIncidentForClose] = useState(null);

  // Filters for Priority Queue
  const [queueTab, setQueueTab] = useState('all'); // 'all' | 'alerts' | 'incidents'
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Combined Priority Items (Alerts + Active Incidents)
  const combinedQueue = useMemo(() => {
    let list = [];

    if (queueTab === 'all' || queueTab === 'alerts') {
      const formattedAlerts = securityAlerts.map((a) => ({
        ...a,
        itemType: 'ALERT',
        sortDate: new Date(a.timestamp || 0).getTime()
      }));
      list.push(...formattedAlerts);
    }

    if (queueTab === 'all' || queueTab === 'incidents') {
      const formattedIncidents = securityIncidents.map((i) => ({
        ...i,
        itemType: 'INCIDENT',
        sortDate: new Date(i.reportedAt || 0).getTime()
      }));
      list.push(...formattedIncidents);
    }

    // Filter by Severity
    if (severityFilter !== 'ALL') {
      list = list.filter((item) => item.severity?.toLowerCase() === severityFilter.toLowerCase());
    }

    // Filter by Status
    if (statusFilter !== 'ALL') {
      list = list.filter((item) => item.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.id?.toLowerCase().includes(q) ||
          item.title?.toLowerCase().includes(q) ||
          item.location?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => b.sortDate - a.sortDate);
  }, [securityAlerts, securityIncidents, queueTab, severityFilter, statusFilter, searchQuery]);

  // My Active Incidents only
  const myActiveIncidents = useMemo(() => {
    return securityIncidents.filter((inc) => {
      const isMine =
        inc.assignedTo?.id === securityProfile?.id ||
        (inc.assignedTo?.name && inc.assignedTo.name.includes(securityProfile?.name || 'Marcus Vance'));
      return isMine && inc.status !== INCIDENT_STATUS.CLOSED;
    });
  }, [securityIncidents, securityProfile]);

  // Timeline events combined
  const recentTimelineEvents = useMemo(() => {
    const events = [];
    securityIncidents.forEach((inc) => {
      (inc.timeline || []).forEach((t) => {
        events.push({
          incidentId: inc.id,
          title: inc.title,
          event: t.event,
          actor: t.actor,
          timestamp: t.timestamp,
          sortTime: new Date(t.timestamp || 0).getTime()
        });
      });
    });

    securityAlerts.forEach((alt) => {
      if (alt.acknowledged && alt.acknowledgedAt) {
        events.push({
          incidentId: alt.id,
          title: alt.title,
          event: `Alert Acknowledged by ${alt.acknowledgedBy}`,
          actor: alt.acknowledgedBy,
          timestamp: alt.acknowledgedAt,
          sortTime: new Date(alt.acknowledgedAt).getTime()
        });
      }
    });

    return events.sort((a, b) => b.sortTime - a.sortTime).slice(0, 7);
  }, [securityIncidents, securityAlerts]);

  const getSeverityBadgeClass = (sev) => {
    switch (sev) {
      case INCIDENT_SEVERITY.EMERGENCY:
        return 'bg-red-600 text-white font-bold';
      case INCIDENT_SEVERITY.HIGH:
        return 'bg-amber-100 text-amber-900 border border-amber-300 font-bold';
      case INCIDENT_SEVERITY.MEDIUM:
        return 'bg-blue-100 text-blue-900 border border-blue-200 font-semibold';
      case INCIDENT_SEVERITY.LOW:
        return 'bg-slate-100 text-slate-800 border border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case INCIDENT_STATUS.OPEN:
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case INCIDENT_STATUS.ACKNOWLEDGED:
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case INCIDENT_STATUS.RESPONDING:
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold';
      case INCIDENT_STATUS.INVESTIGATING:
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case INCIDENT_STATUS.RESOLVED:
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case INCIDENT_STATUS.CLOSED:
        return 'bg-slate-100 text-slate-700 border border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ======================================================== */}
      {/* 1. HERO PANEL: Safety & Security Incident Dispatch       */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-[#0F1E36] via-[#172B4D] to-[#1E293B] rounded-2xl p-6 text-white shadow-md relative overflow-hidden border border-slate-700/60">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600 text-white flex items-center gap-1 shadow-2xs">
                <ShieldAlert className="w-3 h-3" />
                Security Ops Command
              </span>
              <span className="text-slate-300 text-xs flex items-center gap-1 font-medium">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Grand Azure Bay Resort & Conference Center
              </span>
              <span className="text-slate-400 text-xs">|</span>
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Lead Officer: {securityProfile?.name || 'Marcus Vance'} ({securityProfile?.id || 'EMP-601'})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Safety & Security Incident Dispatch Hub
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Unified command center for real-time security alerts, tactical backup coordination, safety lockouts, management escalations, evidence chain of custody, and verified shift watch handovers.
            </p>
          </div>

          {/* Quick Action Controls in Hero */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs flex items-center gap-2.5 shadow-xs">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Radio Dispatch</span>
                <span className="font-bold text-white text-xs">{securityProfile?.radioChannel || 'CH 03 (Command)'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEmergencyModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Flame className="w-4 h-4" />
              Emergency Protocols
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedIncidentForBackup(null);
                setRequestBackupModalOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Users className="w-4 h-4" />
              Request Backup
            </button>

            <button
              type="button"
              onClick={() => setCreateIncidentModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Incident
            </button>

            <Link
              to="/security/alerts"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Alerts ({securityKPIs.activeAlertsCount})
            </Link>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. OPERATIONAL SUMMARY KPI CARDS                          */}
      {/* ======================================================== */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            Operational Security Indicators
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">Auto-synced with StayOps Security Engine</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* 1. Active Alerts */}
          <Link
            to="/security/alerts"
            className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs hover:border-red-400 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-semibold group-hover:text-red-600 transition-colors">
                Active Alerts
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-600 mt-1">{securityKPIs.activeAlertsCount}</div>
            <span className="text-[10px] text-slate-400 font-medium block truncate">Unacknowledged or active</span>
          </Link>

          {/* 2. My Active Incidents */}
          <Link
            to="/security/incidents"
            className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs hover:border-blue-400 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-semibold group-hover:text-blue-600 transition-colors">
                My Incidents
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-blue-600 mt-1">{securityKPIs.myActiveIncidentsCount}</div>
            <span className="text-[10px] text-slate-400 font-medium block truncate">Assigned to Officer Vance</span>
          </Link>

          {/* 3. Backup Requests Awaiting Response */}
          <Link
            to="/security/backup"
            className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs hover:border-amber-400 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-semibold group-hover:text-amber-600 transition-colors">
                Backup Awaiting
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-600 mt-1">{securityKPIs.backupAwaitingCount}</div>
            <span className="text-[10px] text-slate-400 font-medium block truncate">Pending responder pickup</span>
          </Link>

          {/* 4. Incidents Requiring Escalation */}
          <Link
            to="/security/escalations"
            className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs hover:border-purple-400 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-semibold group-hover:text-purple-600 transition-colors">
                Escalations
              </span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-600 mt-1">{securityKPIs.escalationsAwaitingCount}</div>
            <span className="text-[10px] text-slate-400 font-medium block truncate">Awaiting leadership action</span>
          </Link>

          {/* 5. Pending Handovers */}
          <Link
            to="/security/handover"
            className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs hover:border-emerald-400 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-semibold group-hover:text-emerald-600 transition-colors">
                Watch Handovers
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CalendarCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{securityKPIs.pendingHandoversCount}</div>
            <span className="text-[10px] text-slate-400 font-medium block truncate">Pending sign-off</span>
          </Link>

          {/* 6. Incidents Awaiting Documentation */}
          <Link
            to="/security/evidence"
            className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs hover:border-indigo-400 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-semibold group-hover:text-indigo-600 transition-colors">
                Awaiting Docs
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-indigo-600 mt-1">{securityKPIs.awaitingDocumentationCount}</div>
            <span className="text-[10px] text-slate-400 font-medium block truncate">Missing notes or evidence</span>
          </Link>
        </div>

        {/* Secondary Operational Indicators */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl px-4 py-2.5 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Security Officers On Duty</span>
                <span className="text-sm font-bold text-slate-900 block">{securityKPIs.officersOnDutyCount} Officers Active</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Floors 1–12 Covered</span>
          </div>

          <div className="bg-white rounded-xl px-4 py-2.5 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Room Safety Lockouts</span>
                <span className="text-sm font-bold text-amber-700 block">{securityKPIs.safetyLockoutsCount} Restricted Zones</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Requires Safety Sign-Off</span>
          </div>

          <div className="bg-white rounded-xl px-4 py-2.5 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Average Response Time</span>
                <span className="text-sm font-bold text-emerald-600 block">{securityKPIs.avgResponseTimeMinutes} Minutes</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Target: &lt; 5.0m</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. PRIORITY ALERTS & ACTIVE INCIDENT QUEUE                */}
      {/* ======================================================== */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Priority Alerts & Active Incidents</h2>
              <p className="text-[11px] text-slate-500">Live triage queue within responder authorized scope</p>
            </div>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setQueueTab('all')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                queueTab === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({securityAlerts.length + securityIncidents.length})
            </button>
            <button
              onClick={() => setQueueTab('alerts')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                queueTab === 'alerts' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alerts ({securityAlerts.length})
            </button>
            <button
              onClick={() => setQueueTab('incidents')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                queueTab === 'incidents' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Incidents ({securityIncidents.length})
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, title, room..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="Emergency">Emergency</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Open">Open</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Responding">Responding</option>
              <option value="Investigating">Investigating</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <span className="text-[11px] text-slate-500 font-medium">
            Showing {combinedQueue.length} record{combinedQueue.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Priority Items Table / List */}
        <div className="divide-y divide-slate-100 overflow-x-auto">
          {combinedQueue.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-slate-700 text-sm">No items matching current filter criteria.</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                All priority alarms and incidents have been addressed or resolved. You may review archived records in incident history.
              </p>
              <Link
                to="/security/history"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-bold mt-3"
              >
                <History className="w-3.5 h-3.5" />
                Go to Incident History
              </Link>
            </div>
          ) : (
            combinedQueue.map((item) => {
              const isAlert = item.itemType === 'ALERT';
              return (
                <div
                  key={`${item.itemType}-${item.id}`}
                  className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                >
                  {/* Left Column: ID, Category, Badges */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {item.id}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                          isAlert ? 'bg-purple-100 text-purple-900' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isAlert ? 'ALARM / SENSOR' : item.category}
                      </span>

                      <span className={`px-2 py-0.5 rounded text-[10px] ${getSeverityBadgeClass(item.severity)}`}>
                        {item.severity}
                      </span>

                      <span className={`px-2 py-0.5 rounded text-[10px] ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>

                      {item.acknowledged ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Ack
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded animate-pulse">
                          Unacknowledged
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">{item.title}</h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-[11px] mt-1">
                      <span>
                        <strong className="text-slate-700 font-semibold">Location:</strong> {item.location}
                      </span>
                      <span>
                        <strong className="text-slate-700 font-semibold">Reported:</strong>{' '}
                        {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : new Date(item.reportedAt).toLocaleTimeString()}
                      </span>
                      <span>
                        <strong className="text-slate-700 font-semibold">Owner/Assigned:</strong>{' '}
                        {item.assignedTo?.name || item.acknowledgedBy || 'Unassigned Queue'}
                      </span>
                    </div>

                    {item.nextAction && (
                      <p className="text-[11px] text-slate-600 mt-1.5 bg-slate-50 p-1.5 rounded border border-slate-100">
                        <strong className="text-slate-800">Next Action:</strong> {item.nextAction}
                      </p>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Alert Specific: Acknowledge & Create Incident */}
                    {isAlert && !item.acknowledged && (
                      <button
                        type="button"
                        onClick={() => acknowledgeSecurityAlert(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
                      >
                        Acknowledge Alert
                      </button>
                    )}

                    {isAlert && (
                      <button
                        type="button"
                        onClick={() => {
                          createIncidentFromAlert(item.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                      >
                        Convert to Incident
                      </button>
                    )}

                    {/* Incident Specific Actions */}
                    {!isAlert && (
                      <>
                        {item.status === INCIDENT_STATUS.OPEN && (
                          <button
                            type="button"
                            onClick={() => updateSecurityIncidentStatus(item.id, INCIDENT_STATUS.ACKNOWLEDGED)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                          >
                            Acknowledge
                          </button>
                        )}

                        {item.status === INCIDENT_STATUS.ACKNOWLEDGED && (
                          <button
                            type="button"
                            onClick={() => updateSecurityIncidentStatus(item.id, INCIDENT_STATUS.RESPONDING)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                          >
                            Start Response
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIncidentForBackup(item);
                            setRequestBackupModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs"
                        >
                          Backup
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIncidentForEscalate(item);
                            setEscalateModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-900 font-bold text-xs"
                        >
                          Escalate
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIncidentForNote(item);
                            setAddNoteModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs"
                        >
                          Add Note
                        </button>

                        {item.status !== INCIDENT_STATUS.CLOSED && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedIncidentForClose(item);
                              setCloseModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs"
                          >
                            Close Case
                          </button>
                        )}

                        <Link
                          to={`/security/incidents/${item.id}`}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          title="View Case File"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MAIN TWO-COLUMN SECTION                               */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: My Active Incidents */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">My Active Incidents</h2>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {myActiveIncidents.length} Assigned to Me
            </span>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[460px]">
            {myActiveIncidents.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                No active incidents currently assigned to your responder ID.
              </div>
            ) : (
              myActiveIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-xs">{inc.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${getSeverityBadgeClass(inc.severity)}`}>
                        {inc.severity}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${getStatusBadgeClass(inc.status)}`}>
                        {inc.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Target: {inc.targetResponseMinutes}m
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{inc.title}</h4>
                    <p className="text-slate-600 text-[11px] mt-0.5">{inc.description}</p>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span>
                      <strong className="text-slate-700">Location:</strong> {inc.location}
                    </span>
                    <Link
                      to={`/security/incidents/${inc.id}`}
                      className="font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                    >
                      View Dossier <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Backup Requests Coordination */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">Backup Coordination & Dispatch</h2>
            </div>
            <button
              onClick={() => {
                setSelectedIncidentForBackup(null);
                setRequestBackupModalOpen(true);
              }}
              className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Request Backup
            </button>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[460px]">
            {securityBackupRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No active tactical backup requests.
              </div>
            ) : (
              securityBackupRequests.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/40 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-950">{b.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                        {b.status}
                      </span>
                      <span className="text-[11px] text-slate-500">for {b.incidentId}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {new Date(b.requestedAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">{b.requestedSupport}</p>
                    <p className="text-slate-600 text-[11px] mt-0.5 font-medium">{b.reason}</p>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1 border-t border-amber-200/60">
                    <span>
                      <strong>Assigned:</strong> {b.assignedBackupOfficer || 'En route dispatch...'}
                    </span>

                    {/* Progress Lifecycle Buttons */}
                    <div className="flex items-center gap-1.5">
                      {b.status === BACKUP_STATUS.REQUESTED && (
                        <button
                          type="button"
                          onClick={() => updateBackupRequestStatus(b.id, BACKUP_STATUS.ACKNOWLEDGED)}
                          className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-[10px]"
                        >
                          Acknowledge
                        </button>
                      )}
                      {b.status === BACKUP_STATUS.ACKNOWLEDGED && (
                        <button
                          type="button"
                          onClick={() => updateBackupRequestStatus(b.id, BACKUP_STATUS.RESPONDING)}
                          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded text-[10px]"
                        >
                          En Route
                        </button>
                      )}
                      {b.status === BACKUP_STATUS.RESPONDING && (
                        <button
                          type="button"
                          onClick={() => updateBackupRequestStatus(b.id, BACKUP_STATUS.ARRIVED)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px]"
                        >
                          Mark Arrived
                        </button>
                      )}
                      {b.status === BACKUP_STATUS.ARRIVED && (
                        <button
                          type="button"
                          onClick={() => updateBackupRequestStatus(b.id, BACKUP_STATUS.COMPLETED)}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-[10px]"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. ESCALATIONS & RECENT SECURITY ACTIVITY                */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Escalations Requiring Action */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold text-slate-900">Escalations Requiring Action</h2>
            </div>
            <Link
              to="/security/escalations"
              className="text-xs font-semibold text-purple-700 hover:underline flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-4 space-y-3">
            {securityEscalations.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No active escalations.</p>
            ) : (
              securityEscalations.map((esc) => (
                <div
                  key={esc.id}
                  className="p-3.5 rounded-xl border border-purple-200/80 bg-purple-50/30 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-950">{esc.id}</span>
                    <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-100 px-1.5 py-0.5 rounded">
                      {esc.destinationRole}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900">{esc.incidentTitle} ({esc.incidentId})</h4>
                  <p className="text-slate-600 text-[11px]">{esc.reason}</p>
                  <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between">
                    <span>Deadline: {new Date(esc.responseDeadline).toLocaleTimeString()}</span>
                    <span className="font-bold text-slate-700">Ref: {esc.destinationContact}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Security Timeline */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Recent Security Activity</h2>
            </div>
            <span className="text-xs text-slate-500">Immutable Audit Feed</span>
          </div>

          <div className="p-4 space-y-3 max-h-[380px] overflow-y-auto">
            {recentTimelineEvents.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No recent security events logged.</p>
            ) : (
              recentTimelineEvents.map((t, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800">{t.event}</p>
                    <p className="text-slate-500 text-[11px] truncate">
                      {t.incidentId} • {t.title}
                    </p>
                  </div>
                  <div className="text-right shrink-0 text-[10px] text-slate-400">
                    <span>{t.actor}</span>
                    <span className="block">{new Date(t.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6. EVIDENCE & SHIFT HANDOVER SHORTCUTS                   */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Evidence Vault Card */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Evidence Vault & Chain of Custody</h3>
              <p className="text-[11px] text-slate-500">
                {securityEvidence.length} encrypted evidence artifacts with SHA-256 hashes
              </p>
            </div>
          </div>
          <Link
            to="/security/evidence"
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Open Vault
          </Link>
        </div>

        {/* Shift Handover Card */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <CalendarCheck2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Security Shift Handover</h3>
              <p className="text-[11px] text-slate-500">
                Watch transfer to Gabriel Thorne (Graveyard Shift)
              </p>
            </div>
          </div>
          <Link
            to="/security/handover"
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
          >
            Review Handover
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODALS                                                   */}
      {/* ======================================================== */}
      <EmergencyProtocolModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />

      <SecurityIncidentModal
        isOpen={createIncidentModalOpen}
        onClose={() => setCreateIncidentModalOpen(false)}
      />

      <RequestBackupModal
        isOpen={requestBackupModalOpen}
        onClose={() => setRequestBackupModalOpen(false)}
        defaultIncident={selectedIncidentForBackup}
      />

      <EscalateIncidentModal
        isOpen={escalateModalOpen}
        onClose={() => setEscalateModalOpen(false)}
        defaultIncident={selectedIncidentForEscalate}
      />

      <AddNoteModal
        isOpen={addNoteModalOpen}
        onClose={() => setAddNoteModalOpen(false)}
        incidentId={selectedIncidentForNote?.id}
      />

      <CloseIncidentModal
        isOpen={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        incident={selectedIncidentForClose}
      />
    </div>
  );
}
