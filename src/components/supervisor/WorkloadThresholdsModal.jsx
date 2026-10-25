import React, { useState } from 'react';
import { X, Sliders, Info, RotateCcw, Check } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { DEFAULT_WORKLOAD_THRESHOLDS } from '../../utils/taskStatus';
import Button from '../ui/Button';

export default function WorkloadThresholdsModal({ isOpen, onClose }) {
  const { workloadThresholds, setWorkloadThresholds, showToast } = useTasks();

  const [optimalMax, setOptimalMax] = useState(workloadThresholds.optimalMax);
  const [moderateMax, setModerateMax] = useState(workloadThresholds.moderateMax);
  const [highMax, setHighMax] = useState(workloadThresholds.highMax);
  const [overloadedMin, setOverloadedMin] = useState(workloadThresholds.overloadedMin);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setWorkloadThresholds({
      optimalMax: Number(optimalMax),
      moderateMax: Number(moderateMax),
      highMax: Number(highMax),
      overloadedMin: Number(overloadedMin)
    });
    showToast('Workload capacity thresholds updated successfully', 'success');
    onClose();
  };

  const handleReset = () => {
    setOptimalMax(DEFAULT_WORKLOAD_THRESHOLDS.optimalMax);
    setModerateMax(DEFAULT_WORKLOAD_THRESHOLDS.moderateMax);
    setHighMax(DEFAULT_WORKLOAD_THRESHOLDS.highMax);
    setOverloadedMin(DEFAULT_WORKLOAD_THRESHOLDS.overloadedMin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="px-6 py-4 bg-[#172B4D] text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Sliders className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Configure Workload Thresholds</h2>
              <p className="text-[11px] text-slate-300">Operational Capacity Modeling (Demo Assumptions)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              These capacity thresholds are configurable operational parameters used to calculate real-time team
              saturation, warnings during task reassignment, and dashboard capacity levels.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Optimal Bandwidth (Max Active Tasks)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={optimalMax}
                onChange={(e) => setOptimalMax(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500">Currently 1 to {optimalMax} active tasks.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Moderate Capacity (Max Active Tasks)
              </label>
              <input
                type="number"
                min={2}
                max={6}
                value={moderateMax}
                onChange={(e) => setModerateMax(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500">Up to {moderateMax} active tasks.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                High Workload Warning Threshold (Active Tasks)
              </label>
              <input
                type="number"
                min={3}
                max={8}
                value={highMax}
                onChange={(e) => setHighMax(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500">Triggers 'High' workload warnings in reassignments.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Overloaded Critical Threshold (Active Tasks)
              </label>
              <input
                type="number"
                min={4}
                max={10}
                value={overloadedMin}
                onChange={(e) => setOverloadedMin(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500">
                Staff with {overloadedMin}+ active tasks (or 2+ overdue) are flagged Overloaded.
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white">
                Save Thresholds
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
