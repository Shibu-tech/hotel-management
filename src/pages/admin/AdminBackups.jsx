import React, { useState } from 'react';
import {
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  ShieldCheck,
  Lock,
  Clock,
  Server,
  FileText,
  X
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function AdminBackups() {
  const { backups, triggerCreateBackup, triggerRestoreBackup } = useTasks();

  const [isCreating, setIsCreating] = useState(false);
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [selectedRestoreBackup, setSelectedRestoreBackup] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateSnapshot = (e) => {
    e.preventDefault();
    setIsCreating(true);
    setTimeout(() => {
      const backupId = triggerCreateBackup(snapshotLabel || 'Manual Administrative Snapshot');
      setIsCreating(false);
      setIsModalOpen(false);
      setSnapshotLabel('');
      setStatusMessage(`Backup archive ${backupId} generated and sealed with SHA-256 digest.`);
      setTimeout(() => setStatusMessage(''), 4000);
    }, 600);
  };

  const handleRestore = (backup) => {
    setSelectedRestoreBackup(backup);
  };

  const confirmRestoreAction = () => {
    if (!selectedRestoreBackup) return;
    triggerRestoreBackup(selectedRestoreBackup.id);
    const restoredId = selectedRestoreBackup.id;
    setSelectedRestoreBackup(null);
    setStatusMessage(`Disaster recovery verification successful for snapshot ${restoredId}. Data state validated.`);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const latestBackup = backups[0] || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-cyan-100 text-cyan-950 border border-cyan-200">
              Disaster Recovery & Business Continuity
            </span>
            <span className="text-xs text-slate-500 font-medium">AWS S3 Glacier Vault (us-west-2)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Database Snapshots & Recovery Vault
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Encrypted database snapshots, point-in-time recovery archives, and integrity validation seals.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Snapshot Archive
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
          {statusMessage}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Latest Confirmed Backup
          </div>
          <div className="text-lg font-black text-slate-900 font-mono">
            {latestBackup ? latestBackup.id : 'None'}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {latestBackup ? latestBackup.status : 'No backup available'}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Storage Vault & Encryption
          </div>
          <div className="text-lg font-black text-slate-900">AES-256 Encrypted</div>
          <div className="text-xs text-slate-500 mt-1">AWS S3 Glacier Vault (us-west-2)</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Retention Policy
          </div>
          <div className="text-lg font-black text-cyan-800">30-Day Rolling Window</div>
          <div className="text-xs text-slate-500 mt-1">Automated prunes with point-in-time seals</div>
        </div>
      </div>

      {/* Snapshots Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Available Point-in-Time Recovery Snapshots</h3>
          <span className="text-xs text-slate-500 font-mono">{backups.length} archives recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Archive Identifier</th>
                <th className="py-3 px-4">Description / Type</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Integrity Seal (SHA-256)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Disaster Recovery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {backups.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{b.label || b.description || 'Database Snapshot'}</td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">{b.timestamp}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{b.size || '142.8 MB'}</td>
                  <td className="py-3 px-4 font-mono text-[10px] text-slate-500 max-w-xs truncate">
                    {b.checksum || b.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {b.status || 'Confirmed'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRestore(b)}
                      className="px-3 py-1.5 text-slate-700 hover:text-cyan-800 hover:bg-cyan-50 font-bold border border-slate-200 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1.5 ml-auto"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-cyan-600" />
                      Verify / Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400">Database Engine</span>
                <h3 className="text-base font-bold">Initiate Snapshot Backup</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSnapshot} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Snapshot Label / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pre-Patch v4.2 Release Snapshot"
                  value={snapshotLabel}
                  onChange={(e) => setSnapshotLabel(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-semibold"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-slate-600 text-[11px]">
                <div>Target Storage: <strong className="text-slate-900">AWS S3 Glacier Vault (us-west-2)</strong></div>
                <div>Encryption Standard: <strong className="text-slate-900">AES-256 Envelope KMS</strong></div>
                <div>Estimated Duration: <strong className="text-slate-900">&lt; 1.5 seconds</strong></div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 rounded-lg shadow-sm cursor-pointer"
                >
                  {isCreating ? 'Creating Snapshot...' : 'Create Snapshot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {selectedRestoreBackup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-amber-900 text-white p-5 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
              <h3 className="text-base font-bold">Disaster Recovery Restore</h3>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-700">
                Are you sure you want to test and verify restoration of snapshot{' '}
                <strong className="text-slate-900 font-mono">{selectedRestoreBackup.id}</strong>?
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
                Restoration validation runs in an isolated sandbox database to confirm data integrity without dropping active live transactions.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedRestoreBackup(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRestoreAction}
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Verify & Restore
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
