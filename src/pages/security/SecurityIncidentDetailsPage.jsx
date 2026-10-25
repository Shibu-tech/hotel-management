import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowLeft,
  Clock,
  User,
  Radio,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Users,
  ArrowUpRight,
  FileText,
  Upload,
  ShieldCheck,
  FileCheck2,
  Calendar
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { INCIDENT_SEVERITY, INCIDENT_STATUS } from '../../data/mockSecurityData';
import RequestBackupModal from '../../components/security/RequestBackupModal';
import EscalateIncidentModal from '../../components/security/EscalateIncidentModal';
import AddNoteModal from '../../components/security/AddNoteModal';
import CloseIncidentModal from '../../components/security/CloseIncidentModal';

export default function SecurityIncidentDetailsPage() {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  const {
    securityIncidents,
    securityEvidence,
    securityBackupRequests,
    securityProfile,
    updateSecurityIncidentStatus,
    uploadSecurityEvidence,
    showToast
  } = useTasks();

  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [newNoteInput, setNewNoteInput] = useState('');

  // Evidence upload state
  const [showUploadEvidence, setShowUploadEvidence] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceCategory, setEvidenceCategory] = useState('Photographic');
  const [evidenceNotes, setEvidenceNotes] = useState('');

  const incident = securityIncidents.find((i) => i.id === incidentId);

  if (!incident) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Security Incident Not Found</h2>
        <p className="text-slate-500 text-xs mt-1">The requested case record does not exist or has been restricted.</p>
        <Link
          to="/security/incidents"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Incidents
        </Link>
      </div>
    );
  }

  const linkedEvidence = securityEvidence.filter(
    (e) => (incident.evidenceIds || []).includes(e.id) || e.incidentId === incident.id
  );

  const linkedBackup = securityBackupRequests.filter((b) => b.incidentId === incident.id);

  const handleUploadEvidenceSubmit = (e) => {
    e.preventDefault();
    if (!evidenceTitle.trim()) return;

    uploadSecurityEvidence({
      incidentId: incident.id,
      title: evidenceTitle.trim(),
      category: evidenceCategory,
      notes: evidenceNotes.trim() || 'Tamper-evident evidence attached to case file.'
    });

    setEvidenceTitle('');
    setEvidenceNotes('');
    setShowUploadEvidence(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Navigation and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/security/incidents"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Security Incidents
        </Link>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {incident.status === INCIDENT_STATUS.OPEN && (
            <button
              type="button"
              onClick={() => updateSecurityIncidentStatus(incident.id, INCIDENT_STATUS.ACKNOWLEDGED)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
            >
              Acknowledge Dispatch
            </button>
          )}

          {incident.status === INCIDENT_STATUS.ACKNOWLEDGED && (
            <button
              type="button"
              onClick={() => updateSecurityIncidentStatus(incident.id, INCIDENT_STATUS.RESPONDING)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
            >
              Mark Responding En Route
            </button>
          )}

          <button
            type="button"
            onClick={() => setBackupModalOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" /> Request Backup
          </button>

          <button
            type="button"
            onClick={() => setEscalateModalOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-950 font-bold text-xs flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-3.5 h-3.5" /> Escalate
          </button>

          <button
            type="button"
            onClick={() => setAddNoteModalOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> Add Note
          </button>

          {incident.status !== INCIDENT_STATUS.CLOSED && (
            <button
              type="button"
              onClick={() => setCloseModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Authorize Closure
            </button>
          )}
        </div>
      </div>

      {/* Case Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                {incident.id}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                {incident.category}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  incident.severity === INCIDENT_SEVERITY.EMERGENCY
                    ? 'bg-red-600 text-white'
                    : incident.severity === INCIDENT_SEVERITY.HIGH
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-blue-100 text-blue-900'
                }`}
              >
                {incident.severity}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                {incident.status}
              </span>
              {incident.linkedBlocker && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-600" /> Linked Safety Lockout: {incident.linkedBlocker}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {incident.title}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
              {incident.description}
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-right shrink-0 text-xs space-y-1">
            <div>
              <span className="text-slate-400 text-[10px] block">Lead Assigned Responder</span>
              <span className="font-bold text-slate-900">{incident.assignedTo?.name || 'Unassigned'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Radio Channel</span>
              <span className="font-bold text-emerald-600 font-mono">{incident.assignedTo?.radioChannel || 'CH 03'}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 text-[11px] block">Location</span>
            <span className="font-bold text-slate-800">{incident.location}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Reported At</span>
            <span className="font-bold text-slate-800">{new Date(incident.reportedAt).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Target SLA</span>
            <span className="font-bold text-slate-800">{incident.targetResponseMinutes} Minutes</span>
          </div>
          <div>
            <span className="text-slate-400 text-[11px] block">Actual Response</span>
            <span className="font-bold text-emerald-600">
              {incident.actualResponseMinutes ? `${incident.actualResponseMinutes} Minutes` : 'En route'}
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column Section: Notes & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Chronological Notes & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notes Log */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Incident Field Observations & Notes</h3>
              </div>
              <button
                type="button"
                onClick={() => setAddNoteModalOpen(true)}
                className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
              >
                + Append Note
              </button>
            </div>

            <div className="p-4 space-y-3">
              {(incident.notes || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No field notes logged yet.</p>
              ) : (
                incident.notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="font-bold text-slate-800">{note.author}</span>
                      <span>{new Date(note.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed">{note.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Attached Evidence Vault Records */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Attached Chain-of-Custody Evidence</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadEvidence(!showUploadEvidence)}
                className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                {showUploadEvidence ? 'Cancel Upload' : 'Upload Evidence'}
              </button>
            </div>

            {/* Quick Upload Form */}
            {showUploadEvidence && (
              <form onSubmit={handleUploadEvidenceSubmit} className="p-4 border-b border-slate-100 bg-slate-50 space-y-3 text-xs">
                <h4 className="font-bold text-slate-800">Add Sealed Evidence Artifact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Evidence Title *</label>
                    <input
                      type="text"
                      required
                      value={evidenceTitle}
                      onChange={(e) => setEvidenceTitle(e.target.value)}
                      placeholder="e.g., CCTV Clip Hallway North 9"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Category</label>
                    <select
                      value={evidenceCategory}
                      onChange={(e) => setEvidenceCategory(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
                    >
                      <option value="Photographic">Photographic / High-Res</option>
                      <option value="CCTV Video">CCTV Video Clip</option>
                      <option value="Audio Recording">Audio Recording / Telemetry</option>
                      <option value="Digital Telemetry">Digital Safe / Lock Log</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Chain of Custody Notes</label>
                  <input
                    type="text"
                    value={evidenceNotes}
                    onChange={(e) => setEvidenceNotes(e.target.value)}
                    placeholder="e.g., Optical download performed with Master Key #02."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                  >
                    Encrypt & Vault
                  </button>
                </div>
              </form>
            )}

            <div className="p-4 space-y-3">
              {linkedEvidence.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No evidence files currently sealed for this case.</p>
              ) : (
                linkedEvidence.map((ev) => (
                  <div key={ev.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/40 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{ev.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                          {ev.category}
                        </span>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                          SHA-256 Verified
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{ev.fileSize}</span>
                    </div>

                    <h4 className="font-bold text-slate-800">{ev.title}</h4>
                    <p className="text-slate-600 text-[11px]">{ev.notes}</p>

                    <div className="pt-1 text-[10px] text-slate-500 border-t border-slate-200/60 flex items-center justify-between">
                      <span>Uploaded by: {ev.uploadedBy}</span>
                      <span className="text-emerald-700 font-bold">Protected / Immutable Vault</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Timeline & Backup Status */}
        <div className="space-y-6">
          {/* Linked Backup Status */}
          {linkedBackup.length > 0 && (
            <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Tactical Backup Dispatched</span>
              </div>
              {linkedBackup.map((b) => (
                <div key={b.id} className="p-2.5 rounded-lg bg-white border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between font-mono font-bold text-slate-800">
                    <span>{b.id}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900">
                      {b.status}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900">{b.requestedSupport}</p>
                  <p className="text-slate-500 text-[11px]">{b.reason}</p>
                </div>
              ))}
            </div>
          )}

          {/* Closure Details (if closed) */}
          {incident.closureDetails && (
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Case Formally Closed & Sealed</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {incident.closureDetails.resolutionSummary}
              </p>
              <div className="pt-2 border-t border-emerald-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>By: {incident.closureDetails.closedBy}</span>
                <span>{new Date(incident.closureDetails.closedAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {/* Immutable Audit Timeline */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/70">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Incident Timeline & Audit Trail
              </h3>
            </div>

            <div className="p-4 space-y-3">
              {(incident.timeline || []).map((t, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{t.event}</p>
                    <p className="text-slate-500 text-[10px]">
                      {t.actor} • {new Date(t.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RequestBackupModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
        defaultIncident={incident}
      />

      <EscalateIncidentModal
        isOpen={escalateModalOpen}
        onClose={() => setEscalateModalOpen(false)}
        defaultIncident={incident}
      />

      <AddNoteModal
        isOpen={addNoteModalOpen}
        onClose={() => setAddNoteModalOpen(false)}
        incidentId={incident.id}
      />

      <CloseIncidentModal
        isOpen={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        incident={incident}
      />
    </div>
  );
}
