import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Sliders, ShieldCheck, Info } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function SlaConfigModal({ isOpen, onClose }) {
  const { slaConfig, updateSlaConfig } = useTasks();

  const [urgent, setUrgent] = useState(slaConfig.urgentTargetMinutes || 30);
  const [high, setHigh] = useState(slaConfig.highTargetMinutes || 60);
  const [medium, setMedium] = useState(slaConfig.mediumTargetMinutes || 120);
  const [low, setLow] = useState(slaConfig.lowTargetMinutes || 240);
  const [atRisk, setAtRisk] = useState(slaConfig.atRiskThresholdPercent || 70);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSlaConfig({
      urgentTargetMinutes: Number(urgent),
      highTargetMinutes: Number(high),
      mediumTargetMinutes: Number(medium),
      lowTargetMinutes: Number(low),
      atRiskThresholdPercent: Number(atRisk)
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Department SLA Targets & Policies Configuration"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            Configure operational SLA duration targets by priority. Department compliance rates and "At Risk" flags dynamically update based on these exact threshold benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Urgent Priority Target (Minutes)
            </label>
            <input
              type="number"
              min="5"
              max="180"
              value={urgent}
              onChange={(e) => setUrgent(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              required
            />
            <span className="text-[10px] text-slate-400">Default: 30 minutes</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              High Priority Target (Minutes)
            </label>
            <input
              type="number"
              min="15"
              max="360"
              value={high}
              onChange={(e) => setHigh(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              required
            />
            <span className="text-[10px] text-slate-400">Default: 60 minutes</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Medium Priority Target (Minutes)
            </label>
            <input
              type="number"
              min="30"
              max="720"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              required
            />
            <span className="text-[10px] text-slate-400">Default: 120 minutes</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Low Priority Target (Minutes)
            </label>
            <input
              type="number"
              min="60"
              max="1440"
              value={low}
              onChange={(e) => setLow(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              required
            />
            <span className="text-[10px] text-slate-400">Default: 240 minutes</span>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            "At Risk" Trigger Threshold (% of SLA Target Duration)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="50"
              max="90"
              value={atRisk}
              onChange={(e) => setAtRisk(e.target.value)}
              className="flex-1 accent-blue-600"
            />
            <span className="font-bold text-slate-900 w-12 text-center text-sm">{atRisk}%</span>
          </div>
          <span className="text-[10px] text-slate-400">
            Tasks exceeding this percentage of their SLA target without completion are automatically flagged "At Risk".
          </span>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save SLA Benchmark Settings
          </Button>
        </div>
      </form>
    </Modal>
  );
}
