import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Radio,
  Search,
  ArrowRight,
  Filter,
  Plus
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { INCIDENT_SEVERITY } from '../../data/mockSecurityData';

export default function SecurityAlertsPage() {
  const { securityAlerts, acknowledgeSecurityAlert, createIncidentFromAlert } = useTasks();
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterAck, setFilterAck] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredAlerts = securityAlerts.filter((alt) => {
    if (filterSeverity !== 'ALL' && alt.severity !== filterSeverity) return false;
    if (filterAck === 'UNACK' && alt.acknowledged) return false;
    if (filterAck === 'ACK' && !alt.acknowledged) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        alt.id.toLowerCase().includes(q) ||
        alt.title.toLowerCase().includes(q) ||
        alt.location.toLowerCase().includes(q) ||
        alt.source?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-[#172B4D] rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white">
              Telemetry Feeds
            </span>
            <span className="text-slate-300 text-xs">Real-Time Sensor & Panic Button Grid</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Active Security Alerts</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-xl">
            Triage automatic perimeter breach sensors, silent cashier panic buttons, and door forced open alarms.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/security/dashboard"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alert ID, sensor, room..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
            />
          </div>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 font-medium bg-white focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value={INCIDENT_SEVERITY.EMERGENCY}>Emergency</option>
            <option value={INCIDENT_SEVERITY.HIGH}>High</option>
            <option value={INCIDENT_SEVERITY.MEDIUM}>Medium</option>
            <option value={INCIDENT_SEVERITY.LOW}>Low</option>
          </select>

          <select
            value={filterAck}
            onChange={(e) => setFilterAck(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 font-medium bg-white focus:outline-none"
          >
            <option value="ALL">All Acknowledged States</option>
            <option value="UNACK">Unacknowledged Only</option>
            <option value="ACK">Acknowledged Only</option>
          </select>
        </div>

        <span className="text-slate-500 font-medium">
          {filteredAlerts.length} Alert{filteredAlerts.length === 1 ? '' : 's'} Found
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-slate-500 border border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No active alerts matching your filters.</p>
            <p className="text-xs text-slate-400 mt-1">Sensor network is nominal across all 12 floors.</p>
          </div>
        ) : (
          filteredAlerts.map((alt) => (
            <div
              key={alt.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-slate-300 transition-all"
            >
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {alt.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900">
                    {alt.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      alt.severity === INCIDENT_SEVERITY.EMERGENCY
                        ? 'bg-red-600 text-white'
                        : alt.severity === INCIDENT_SEVERITY.HIGH
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    {alt.severity}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Source: {alt.source}
                  </span>
                  {alt.acknowledged ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Acknowledged by {alt.acknowledgedBy}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded animate-pulse">
                      Awaiting Response
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm">{alt.title}</h3>
                <p className="text-slate-600 leading-relaxed">{alt.description}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-[11px] pt-1">
                  <span><strong>Coordinates:</strong> {alt.location}</span>
                  <span><strong>Reported:</strong> {new Date(alt.timestamp).toLocaleTimeString()}</span>
                  {alt.recommendedAction && (
                    <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                      SOP: {alt.recommendedAction}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {!alt.acknowledged && (
                  <button
                    type="button"
                    onClick={() => acknowledgeSecurityAlert(alt.id)}
                    className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors shadow-xs"
                  >
                    Acknowledge Alert
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => createIncidentFromAlert(alt.id)}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs"
                >
                  Create Incident Dossier
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
