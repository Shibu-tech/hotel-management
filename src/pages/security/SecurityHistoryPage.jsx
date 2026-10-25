import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  CheckCircle2,
  Search,
  ShieldCheck,
  Calendar,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { INCIDENT_STATUS } from '../../data/mockSecurityData';

export default function SecurityHistoryPage() {
  const { securityIncidents } = useTasks();
  const [search, setSearch] = useState('');

  const closedIncidents = securityIncidents.filter((inc) => {
    const isClosed = inc.status === INCIDENT_STATUS.CLOSED;
    if (!isClosed) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        inc.id.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.location.toLowerCase().includes(q) ||
        inc.category.toLowerCase().includes(q) ||
        inc.closureDetails?.resolutionSummary?.toLowerCase().includes(q)
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
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-700 text-slate-200">
              Archived Dossiers
            </span>
            <span className="text-slate-300 text-xs">Official Case Archives</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Incident History & Closed Cases</h1>
          <p className="text-slate-300 text-xs mt-1 max-w-xl">
            Complete historical repository of sealed security cases, formal resolutions, police reporting records, and timestamps.
          </p>
        </div>

        <Link
          to="/security/dashboard"
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors shrink-0"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search archived cases by ID, summary, room..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 font-medium"
          />
        </div>

        <span className="text-slate-500 font-medium">
          {closedIncidents.length} Closed Case File{closedIncidents.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {closedIncidents.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-slate-500 border border-slate-200">
            <History className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No closed incidents found.</p>
            <p className="text-xs text-slate-400 mt-1">Cases will appear here once formally authorized and sealed.</p>
          </div>
        ) : (
          closedIncidents.map((inc) => (
            <div
              key={inc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 text-xs hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {inc.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {inc.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                    {inc.status}
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Formally Resolved
                  </span>
                </div>

                <div className="text-slate-400 text-[11px] flex items-center gap-2">
                  <span>Reported: {new Date(inc.reportedAt).toLocaleDateString()}</span>
                  {inc.closureDetails?.closedAt && (
                    <span>• Closed: {new Date(inc.closureDetails.closedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{inc.title}</h3>
                <p className="text-slate-600 text-xs mt-0.5">{inc.description}</p>
              </div>

              {/* Resolution Summary Box */}
              {inc.closureDetails && (
                <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
                    Closure Resolution Record
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {inc.closureDetails.resolutionSummary}
                  </p>
                  <div className="flex flex-wrap items-center justify-between pt-1.5 border-t border-emerald-200/60 text-[10px] text-slate-500">
                    <span>Authorized by: <strong>{inc.closureDetails.closedBy}</strong></span>
                    <span>
                      Police Agency Contacted:{' '}
                      <strong className={inc.closureDetails.policeNotified ? 'text-red-700' : 'text-slate-600'}>
                        {inc.closureDetails.policeNotified ? 'Yes (Report on File)' : 'No (Internal Resolution)'}
                      </strong>
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400 text-[11px]">Location: {inc.location}</span>
                <Link
                  to={`/security/incidents/${inc.id}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1"
                >
                  View Closed Dossier <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
