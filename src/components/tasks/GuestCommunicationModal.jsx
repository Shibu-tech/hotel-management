import React, { useState } from 'react';
import { MessageSquare, PhoneCall, Building2 } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useTasks } from '../../context/TaskContext';

export default function GuestCommunicationModal({
  isOpen,
  onClose,
  task
}) {
  const { recordGuestCommunication } = useTasks();

  const [summary, setSummary] = useState('');
  const [channel, setChannel] = useState('Front Desk Concierge');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!summary.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      recordGuestCommunication(task.id, {
        summary: summary.trim(),
        contactChannel: channel
      });
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Authorized Guest Communication"
      subtitle={`Log an operational note regarding guest communication for ${task.id}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div className="font-bold text-slate-800">{task.id} — {task.title}</div>
          <div className="text-slate-500 mt-0.5">{task.location}</div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Communication Channel / Source
          </label>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Front Desk Concierge">Front Desk Concierge Call</option>
            <option value="In-Room Phone Operator">In-Room Phone / Operator</option>
            <option value="Guest Mobile App Message">Guest Mobile App Message</option>
            <option value="Executive Floor Lounge">Executive Floor Lounge Host</option>
            <option value="Direct In-Person Request">Direct In-Person Request</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Communication Summary & Guest Response <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="e.g. Front desk called guest to inform of 10m linen delivery delay. Guest acknowledged and thanked the team..."
            required
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
          <strong>Privacy Notice:</strong> Do not record credit card numbers, payment details, or personal sensitive identity data. All updates are auditable.
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={MessageSquare}
            disabled={!summary.trim() || isSubmitting}
            loading={isSubmitting}
          >
            Save Communication Log
          </Button>
        </div>
      </form>
    </Modal>
  );
}
