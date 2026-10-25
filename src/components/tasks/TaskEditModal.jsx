import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { TASK_CATEGORY } from '../../utils/taskStatus';
import { useTasks } from '../../context/TaskContext';

export default function TaskEditModal({
  isOpen,
  onClose,
  task
}) {
  const { updateTask } = useTasks();

  const [title, setTitle] = useState(task?.title || '');
  const [category, setCategory] = useState(task?.category || TASK_CATEGORY.HOUSEKEEPING);
  const [location, setLocation] = useState(task?.location || '');
  const [item, setItem] = useState(task?.item || '');
  const [quantity, setQuantity] = useState(task?.quantity ? String(task.quantity) : '1');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [dueAt, setDueAt] = useState(task?.dueAt ? task.dueAt.slice(0, 16) : '');
  const [instructions, setInstructions] = useState(task?.instructions || '');
  const [internalNotes, setInternalNotes] = useState(task?.internalNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      updateTask(task.id, {
        title: title.trim(),
        category,
        location: location.trim(),
        item: item.trim(),
        quantity: quantity ? Number(quantity) : 1,
        priority,
        dueAt: new Date(dueAt).toISOString(),
        instructions: instructions.trim(),
        internalNotes: internalNotes.trim()
      });
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Task ${task.id}`}
      subtitle="Modify operational parameters within authorized dispatcher scope"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={Object.values(TASK_CATEGORY)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Room / Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              required
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Item / Supply (Optional)"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />

          <Input
            label="Quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Work Instructions
          </label>
          <textarea
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Internal Dispatcher Notes
          </label>
          <input
            type="text"
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
