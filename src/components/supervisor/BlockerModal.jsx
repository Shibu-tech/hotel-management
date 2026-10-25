import React, { useState } from 'react';
import {
  X,
  AlertOctagon,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  FileCheck2,
  Clock,
  Lock,
  Unlock,
  Info
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { BLOCKER_CATEGORIES, BLOCKER_STATUS, formatDateTime } from '../../utils/taskStatus';
import Button from '../ui/Button';

export default function BlockerModal({
  isOpen,
  onClose,
  mode = 'create', // 'create' | 'resolve' | 'update_action'
  blocker = null,
  prefilledTaskId = null
}) {
  const { tasks, createBlocker, resolveBlocker, updateBlocker, supervisorProfile } = useTasks();

  // Create Mode Fields
  const [selectedTaskId, setSelectedTaskId] = useState(
    prefilledTaskId || (blocker ? blocker.taskId : '')
  );
  const [category, setCategory] = useState(blocker?.category || BLOCKER_CATEGORIES[0]);
  const [description, setDescription] = useState(blocker?.description || '');
  const [operationalImpact, setOperationalImpact] = useState(blocker?.operationalImpact || '');
  const [responsiblePerson, setResponsiblePerson] = useState(
    blocker?.responsiblePerson || supervisorProfile.name
  );
  const [nextAction, setNextAction] = useState(blocker?.nextAction || '');
  const [expectedResolutionTime, setExpectedResolutionTime] = useState(
    blocker?.expectedResolutionTime
      ? new Date(blocker.expectedResolutionTime).toISOString().slice(0, 16)
      : new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [safetyRestricted, setSafetyRestricted] = useState(
    category === 'Safety restriction' || Boolean(blocker?.safetyRestricted)
  );

  // Resolve Mode Fields
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [safetyClearanceCert, setSafetyClearanceCert] = useState('');
  const [clearedBy, setClearedBy] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isSafetyBlocker =
    category === 'Safety restriction' ||
    safetyRestricted ||
    blocker?.safetyRestricted ||
    blocker?.category === 'Safety restriction';

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setCategory(newCat);
    if (newCat === 'Safety restriction') {
      setSafetyRestricted(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'create') {
      if (!selectedTaskId) {
        setError('Please select a related department task.');
        return;
      }
      if (!description.trim()) {
        setError('Please provide a detailed blocker description.');
        return;
      }
      if (!operationalImpact.trim()) {
        setError('Please describe the operational impact on service.');
        return;
      }

      setIsSubmitting(true);
      const newBlocker = createBlocker({
        taskId: selectedTaskId,
        category,
        description: description.trim(),
        operationalImpact: operationalImpact.trim(),
        responsiblePerson: responsiblePerson.trim(),
        nextAction: nextAction.trim(),
        expectedResolutionTime: new Date(expectedResolutionTime).toISOString(),
        safetyRestricted
      });

      setIsSubmitting(false);
      if (newBlocker) {
        onClose();
      }
    } else if (mode === 'resolve') {
      if (!resolutionNotes.trim()) {
        setError('Resolution notes are mandatory when closing an operational blocker.');
        return;
      }

      // Safety rule check
      if (blocker?.safetyRestricted || blocker?.category === 'Safety restriction') {
        if (!safetyClearanceCert.trim() || !clearedBy.trim()) {
          setError(
            'SAFETY PROTOCOL RESTRICTION: A safety hazard zone cannot be released without certified Safety Officer name and Certificate/Report number.'
          );
          return;
        }
      }

      setIsSubmitting(true);
      const success = resolveBlocker(blocker.id, {
        resolutionNotes: resolutionNotes.trim(),
        safetyClearanceCert: safetyClearanceCert.trim(),
        clearedBy: clearedBy.trim()
      });

      setIsSubmitting(false);
      if (success) {
        onClose();
      }
    } else if (mode === 'update_action') {
      if (!nextAction.trim()) {
        setError('Next action description cannot be empty.');
        return;
      }

      setIsSubmitting(true);
      updateBlocker(blocker.id, {
        nextAction: nextAction.trim(),
        expectedResolutionTime: new Date(expectedResolutionTime).toISOString()
      });
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div
          className={`px-6 py-4 text-white flex items-center justify-between border-b ${
            isSafetyBlocker ? 'bg-red-950 border-red-800' : 'bg-[#172B4D] border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                isSafetyBlocker ? 'bg-red-600' : 'bg-amber-600'
              }`}
            >
              <AlertOctagon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {mode === 'create'
                  ? 'Record Operational Blocker'
                  : mode === 'resolve'
                  ? 'Resolve & Close Blocker'
                  : 'Update Blocker Action'}
              </h2>
              <p className="text-xs text-slate-300">
                {mode === 'create'
                  ? 'Log barrier halting task completion'
                  : `Blocker ID: ${blocker?.id} • Task: ${blocker?.taskId}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs font-semibold text-red-700">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* CREATE MODE FORM */}
          {mode === 'create' && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Related Task <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select task experiencing blockage...</option>
                  {tasks
                    .filter((t) => t.status !== 'Completed')
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.id} - {t.title} ({t.location})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Blocker Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {BLOCKER_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Responsible Person / Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={responsiblePerson}
                    onChange={(e) => setResponsiblePerson(e.target.value)}
                    placeholder="e.g. David Kim (Maintenance Tech)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Safety Lockout Toggle */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  safetyRestricted
                    ? 'border-red-300 bg-red-50/80 text-red-950'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safetyRestricted}
                    onChange={(e) => setSafetyRestricted(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-red-600" />
                      Enforce Safety Restriction / Zone Lockout
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Restricts room/zone access. Release will require certified Safety Officer clearance sign-off.
                    </p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Blocker Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain exactly why the task cannot proceed..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Operational Impact <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={operationalImpact}
                  onChange={(e) => setOperationalImpact(e.target.value)}
                  placeholder="e.g. Elevators diverted; Guest check-in luggage route delayed by 30 mins..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Immediate Next Action
                  </label>
                  <input
                    type="text"
                    value={nextAction}
                    onChange={(e) => setNextAction(e.target.value)}
                    placeholder="e.g. Awaiting technician with spare valve"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Expected Resolution Time
                  </label>
                  <input
                    type="datetime-local"
                    value={expectedResolutionTime}
                    onChange={(e) => setExpectedResolutionTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* RESOLVE MODE FORM */}
          {mode === 'resolve' && blocker && (
            <>
              {/* Safety restriction banner */}
              {(blocker.safetyRestricted || blocker.category === 'Safety restriction') && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-red-700">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>MANDATORY SAFETY CLEARANCE PROTOCOL</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    This blocker enforces a safety restriction on{' '}
                    <span className="font-semibold">{blocker.location}</span>. In accordance with StayOps Safety
                    Standard 4.2, a supervisor <span className="font-bold underline">MUST NOT</span> release this zone
                    without certified sign-off from the authorized Safety or Engineering officer.
                  </p>
                </div>
              )}

              {/* Safety Sign-off Inputs */}
              {(blocker.safetyRestricted || blocker.category === 'Safety restriction') && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                    Safety Clearance Certification
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Certified Safety Officer Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={clearedBy}
                        onChange={(e) => setClearedBy(e.target.value)}
                        placeholder="e.g. Ronald Baker (Safety Inspector)"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Clearance Certificate / Report ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={safetyClearanceCert}
                        onChange={(e) => setSafetyClearanceCert(e.target.value)}
                        placeholder="e.g. SAFE-2026-CERT-904"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Resolution Notes & Actions Taken <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Detail how the blocker was eliminated, items replenished, repairs tested, or safe access restored..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
              </div>

              {/* Informational Notice */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2 text-xs text-blue-900">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Resolving this blocker unblocks the associated task and returns it to the active pipeline.
                  <span className="font-semibold"> It will NOT mark the task completed</span>, ensuring remaining work is
                  verified.
                </p>
              </div>
            </>
          )}

          {/* UPDATE ACTION MODE */}
          {mode === 'update_action' && blocker && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Current Next Action <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Revised Expected Resolution Time
                </label>
                <input
                  type="datetime-local"
                  value={expectedResolutionTime}
                  onChange={(e) => setExpectedResolutionTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className={
                mode === 'resolve'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            >
              {isSubmitting
                ? 'Processing...'
                : mode === 'create'
                ? 'Create Blocker'
                : mode === 'resolve'
                ? 'Resolve & Release Zone'
                : 'Update Next Action'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
