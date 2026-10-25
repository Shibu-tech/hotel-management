import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ListTodo, Users2, ShieldAlert } from 'lucide-react';
import Button from '../ui/Button';

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-[#172B4D] to-[#243B53] rounded-xl p-5 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h3 className="text-base font-bold tracking-tight">Department Dispatch Hub</h3>
        <p className="text-xs text-slate-300 mt-0.5">
          Fast actions for room requests, guest inquiries, shift reallocations, and escalation.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
        <Button
          variant="primary"
          size="md"
          icon={PlusCircle}
          onClick={() => navigate('/dispatcher/tasks/new')}
          className="shadow-md"
        >
          Create New Task
        </Button>

        <Button
          variant="outline"
          size="md"
          icon={ListTodo}
          onClick={() => navigate('/dispatcher/tasks')}
          className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
        >
          Open Task Queue
        </Button>

        <Button
          variant="outline"
          size="md"
          icon={Users2}
          onClick={() => navigate('/dispatcher/staff')}
          className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
        >
          Staff Workload
        </Button>
      </div>
    </div>
  );
}
