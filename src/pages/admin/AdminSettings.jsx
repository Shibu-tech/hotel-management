import React, { useState } from 'react';
import {
  Sliders,
  Building2,
  Clock,
  Bell,
  Shield,
  HardDrive,
  Save,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lock,
  RefreshCw
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function AdminSettings() {
  const { systemConfig, updateSystemConfig } = useTasks();

  const [activeTab, setActiveTab] = useState('property'); // 'property', 'localization', 'security', 'notifications', 'backups'
  const [formData, setFormData] = useState({ ...systemConfig });
  const [feedback, setFeedback] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    setIsConfirmModalOpen(true);
  };

  const confirmSaveConfig = () => {
    updateSystemConfig(formData);
    setIsConfirmModalOpen(false);
    setFeedback('System configuration parameters successfully committed and audited.');
    setTimeout(() => setFeedback(''), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-cyan-100 text-cyan-950 border border-cyan-200">
              System Control Panel
            </span>
            <span className="text-xs text-slate-500 font-medium">Global Application Settings</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Platform Configuration & Property Parameters
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Modify hotel profile, localization, session authentication policies, and automated snapshot retention.
          </p>
        </div>

        <button
          onClick={confirmSaveConfig}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Commit Configuration Changes
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {feedback}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 text-xs">
        {[
          { key: 'property', label: 'Property & Brand', icon: Building2 },
          { key: 'localization', label: 'Timezone & Localization', icon: Clock },
          { key: 'security', label: 'Session & MFA Policies', icon: Shield },
          { key: 'notifications', label: 'Alerting & Webhooks', icon: Bell },
          { key: 'backups', label: 'Backup Retention Policy', icon: HardDrive }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Form Body */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <form onSubmit={handleSaveSubmit} className="space-y-6 max-w-2xl text-xs">
          {activeTab === 'property' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Hotel Property Identification
              </h3>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Hotel Property Name</label>
                <input
                  type="text"
                  value={formData.hotelName || ''}
                  onChange={(e) => handleInputChange('hotelName', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Property PMS Code</label>
                  <input
                    type="text"
                    value={formData.propertyCode || 'GAZ-01'}
                    onChange={(e) => handleInputChange('propertyCode', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Corporate Tax ID</label>
                  <input
                    type="text"
                    value={formData.taxId || 'TAX-994820-A'}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.address || '1000 Ocean Boulevard, Coastal Cove'}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'localization' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Timezone & Regional Preferences
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Reporting Timezone</label>
                  <select
                    value={formData.timezone || 'America/Los_Angeles'}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-semibold"
                  >
                    <option value="America/Los_Angeles">Pacific Time (PT) - America/Los_Angeles</option>
                    <option value="America/New_York">Eastern Time (ET) - America/New_York</option>
                    <option value="America/Chicago">Central Time (CT) - America/Chicago</option>
                    <option value="UTC">Universal Coordinated Time (UTC)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Operating Currency</label>
                  <select
                    value={formData.currency || 'USD'}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-semibold"
                  >
                    <option value="USD">USD ($) - United States Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="CAD">CAD ($) - Canadian Dollar</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Authentication & Session Security Controls
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Idle Session Timeout (Minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={formData.sessionTimeoutMinutes || 30}
                    onChange={(e) => handleInputChange('sessionTimeoutMinutes', Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Max Failed Attempts Before Lockout</label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={formData.maxFailedLogins || 5}
                    onChange={(e) => handleInputChange('maxFailedLogins', Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Enforce Multi-Factor Authentication (MFA)</div>
                  <div className="text-[11px] text-slate-500">Require TOTP or FIDO2 hardware keys for all privileged roles (Admin & Executive).</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.enforceMFA ?? true}
                  onChange={(e) => handleInputChange('enforceMFA', e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Notification & Broadcast Triggers
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Broadcast Security Incidents</div>
                    <div className="text-[11px] text-slate-500">Automatically push emergency incidents to executive leadership stream.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.broadcastIncidents ?? true}
                    onChange={(e) => handleInputChange('broadcastIncidents', e.target.checked)}
                    className="w-4 h-4 text-cyan-600 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">SMS / Emergency Pager Integration</div>
                    <div className="text-[11px] text-slate-500">Send high-priority SMS alerts to on-duty security responders.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.enableSMSAlerts ?? true}
                    onChange={(e) => handleInputChange('enableSMSAlerts', e.target.checked)}
                    className="w-4 h-4 text-cyan-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backups' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Automated Disaster Recovery & Retention
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Automated Snapshot Interval</label>
                  <select
                    value={formData.backupInterval || 'Every 6 Hours'}
                    onChange={(e) => handleInputChange('backupInterval', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-semibold"
                  >
                    <option value="Every 4 Hours">Every 4 Hours</option>
                    <option value="Every 6 Hours">Every 6 Hours</option>
                    <option value="Daily at Midnight">Daily at Midnight</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Snapshot Retention Period (Days)</label>
                  <input
                    type="number"
                    min="7"
                    max="365"
                    value={formData.backupRetentionDays || 30}
                    onChange={(e) => handleInputChange('backupRetentionDays', Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">All changes audited in compliance with SOC-2 Trust Criteria.</span>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Parameters
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold">Confirm System Changes</h3>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-700">
                Are you sure you want to commit these system configuration changes? An immutable audit event will be recorded in the security trail.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSaveConfig}
                  className="px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-sm"
                >
                  Confirm & Commit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
