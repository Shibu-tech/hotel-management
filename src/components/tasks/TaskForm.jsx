import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Save,
  X,
  AlertCircle,
  UserCheck,
  Calendar,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { TASK_CATEGORY, TASK_PRIORITY } from '../../utils/taskStatus';
import { useTasks } from '../../context/TaskContext';

const DRAFT_STORAGE_KEY = 'stayops_task_creation_draft';

export default function TaskForm({ isModal = false, onClose }) {
  const { staff, createTask, showToast } = useTasks();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(TASK_CATEGORY.HOUSEKEEPING);
  const [location, setLocation] = useState('');
  const [instructions, setInstructions] = useState('');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(() => {
    // Default 1 hour from now
    const d = new Date(Date.now() + 60 * 60 * 1000);
    return d.toISOString().slice(0, 16);
  });
  const [scheduledStart, setScheduledStart] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [guestUpdateRequired, setGuestUpdateRequired] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // Check for saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        setHasDraft(true);
      }
    } catch (e) {
      console.warn('Failed to inspect draft storage', e);
    }
  }, []);

  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        setTitle(draft.title || '');
        setCategory(draft.category || TASK_CATEGORY.HOUSEKEEPING);
        setLocation(draft.location || '');
        setInstructions(draft.instructions || '');
        setItem(draft.item || '');
        setQuantity(draft.quantity || '1');
        setPriority(draft.priority || 'medium');
        if (draft.dueDate) setDueDate(draft.dueDate);
        setScheduledStart(draft.scheduledStart || '');
        setAssigneeId(draft.assigneeId || '');
        setGuestUpdateRequired(Boolean(draft.guestUpdateRequired));
        setInternalNotes(draft.internalNotes || '');
        showToast('Draft loaded successfully', 'info');
      }
    } catch (e) {
      console.error('Failed to load draft', e);
    }
  };

  const saveDraft = () => {
    const draftData = {
      title,
      category,
      location,
      instructions,
      item,
      quantity,
      priority,
      dueDate,
      scheduledStart,
      assigneeId,
      guestUpdateRequired,
      internalNotes,
      savedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
      setHasDraft(true);
      showToast('Task draft saved to local storage', 'success');
    } catch (e) {
      showToast('Could not save draft', 'error');
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasDraft(false);
    showToast('Draft discarded', 'info');
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Task title is required';
    if (!location.trim()) errs.location = 'Room or location is required';
    if (!instructions.trim()) errs.instructions = 'Work instructions are required';
    if (!dueDate) errs.dueDate = 'Due date and time is required';
    else {
      const dueMs = new Date(dueDate).getTime();
      if (isNaN(dueMs)) errs.dueDate = 'Invalid date/time';
    }
    if (quantity && Number(quantity) <= 0) {
      errs.quantity = 'Quantity must be 1 or greater';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const assignedStaff = assigneeId ? staff.find((s) => s.id === assigneeId) : null;

    setTimeout(() => {
      const created = createTask({
        title,
        category,
        location,
        instructions,
        item,
        quantity,
        priority,
        dueAt: new Date(dueDate).toISOString(),
        scheduledStart: scheduledStart ? new Date(scheduledStart).toISOString() : null,
        assignedStaff,
        guestUpdateRequired,
        internalNotes
      });

      // Clear draft on successful creation
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setIsSubmitting(false);

      if (isModal && onClose) {
        onClose();
      } else {
        navigate(`/dispatcher/tasks/${created.id}`);
      }
    }, 300);
  };

  const handleCancel = () => {
    if (isModal && onClose) onClose();
    else navigate('/dispatcher/tasks');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Draft banner if available */}
      {hasDraft && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>You have an unsaved task creation draft from a previous session.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadDraft}
              className="font-bold underline text-blue-700 hover:text-blue-900"
            >
              Resume Draft
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={clearDraft}
              className="text-slate-500 hover:text-slate-700"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Basic Task Information */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
          1. Task Parameters & Location
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Task Title"
              placeholder="e.g. Hypoallergenic Bedding Set & Extra Pillows"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              required
            />
          </div>

          <div>
            <Select
              label="Department Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={Object.values(TASK_CATEGORY)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Room / Service Location"
              placeholder="e.g. Executive Suite 712 or Poolside Cabana 4"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={errors.location}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Priority Level <span className="text-red-500">*</span>
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value="urgent">🔴 Urgent (Immediate VIP SLA)</option>
              <option value="high">🟠 High Priority</option>
              <option value="medium">🔵 Medium (Standard)</option>
              <option value="low">⚪ Low Priority (Routine)</option>
            </select>
          </div>
        </div>

        {/* Optional Item and Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="sm:col-span-2">
            <Input
              label="Item Name / Equipment (Optional)"
              placeholder="e.g. Cotton Duvet Set, Luggage Cart, Champagne Bucket"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
          </div>

          <div>
            <Input
              label="Quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              error={errors.quantity}
            />
          </div>
        </div>
      </div>

      {/* Work Instructions & Dispatcher Notes */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
          2. Instructions & Protocol
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Work Instructions for Attendant / Runner <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Detailed instructions (e.g. Knock twice, do not ring doorbell. Ensure linens are sealed in plastic packaging...)"
            required
            className={`w-full text-xs sm:text-sm rounded-lg border p-3 bg-white text-slate-900 focus:outline-none focus:ring-1 ${
              errors.instructions
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.instructions && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.instructions}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Internal Dispatcher Operational Notes (Confidential)
          </label>
          <input
            type="text"
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="e.g. Guest checked in early with infant; notify concierge once completed."
            className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="pt-1">
          <label className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={guestUpdateRequired}
              onChange={(e) => setGuestUpdateRequired(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Front Desk / Guest Communication Required (Flag for confirmation call or message)</span>
          </label>
        </div>
      </div>

      {/* Assignment & Scheduling */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
          3. Scheduling & Staff Assignment
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Due Date & Time SLA <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
            />
            {errors.dueDate && <p className="mt-1 text-xs text-red-600">{errors.dueDate}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Scheduled Start (Optional)
            </label>
            <input
              type="datetime-local"
              value={scheduledStart}
              onChange={(e) => setScheduledStart(e.target.value)}
              className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Assign Staff (Optional)
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value="">Leave Unassigned (Queue Pool)</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.availability} ({s.activeTasksCount} active)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            Mock persistence mode: Tasks created are immediately saved to browser local state, updating queue counts and workload metrics across StayOps.
          </span>
        </div>
      </div>

      {/* Form Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="md"
            icon={Save}
            onClick={saveDraft}
            className="w-full sm:w-auto"
          >
            Save Draft
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={PlusCircle}
          loading={isSubmitting}
          className="w-full sm:w-auto"
        >
          Dispatch Task to Queue
        </Button>
      </div>
    </form>
  );
}
