import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import TaskForm from '../../components/tasks/TaskForm';

export default function CreateTask() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-150">
      {/* Header */}
      <div>
        <Link
          to="/dispatcher/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Task Queue</span>
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Dispatch New Department Task
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Create room service, housekeeping, amenities, or luggage orders and schedule staff assignment
        </p>
      </div>

      {/* Task Creation Form */}
      <TaskForm />
    </div>
  );
}
