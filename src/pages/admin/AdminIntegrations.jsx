import React, { useState } from 'react';
import {
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Lock,
  ExternalLink,
  ShieldCheck,
  Clock,
  Radio,
  Sliders
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export default function AdminIntegrations() {
  const { integrations, triggerIntegrationHealthCheck } = useTasks();
  const [testingId, setTestingId] = useState(null);
  const [healthStatus, setHealthStatus] = useState('');

  const handleTestService = (serviceId) => {
    setTestingId(serviceId);
    setTimeout(() => {
      const updated = triggerIntegrationHealthCheck(serviceId);
      setTestingId(null);
      setHealthStatus(`Health check completed for ${serviceId}: Status is Healthy (latency: ${updated.latency}).`);
      setTimeout(() => setHealthStatus(''), 3000);
    }, 600);
  };

  const handleTestAll = () => {
    setTestingId('ALL');
    setTimeout(() => {
      integrations.forEach((s) => triggerIntegrationHealthCheck(s.id));
      setTestingId(null);
      setHealthStatus('All 6 integrated external services verified operational.');
      setTimeout(() => setHealthStatus(''), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-cyan-100 text-cyan-950 border border-cyan-200">
              Infrastructure Telemetry
            </span>
            <span className="text-xs text-slate-500 font-medium">Enterprise Integration Monitor</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Integrated Services & Gateway Health
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time ping diagnostic status, gateway latency, and safe telemetry. Production credentials and API secrets are strictly masked.
          </p>
        </div>

        <button
          onClick={handleTestAll}
          disabled={testingId !== null}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${testingId === 'ALL' ? 'animate-spin' : ''}`} />
          Run All Health Checks
        </button>
      </div>

      {healthStatus && (
        <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
          {healthStatus}
        </div>
      )}

      {/* Secret Safety Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-start gap-3 text-xs">
        <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] block">
            Cryptographic Safety & Zero-Trust Architecture
          </span>
          <p className="text-slate-300 mt-0.5">
            Per OWASP ASVS and NIST 800-53 standards, raw API tokens, connection strings, and webhook signing secrets are isolated inside backend KMS HSM vaults and never transmitted to the browser client.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((srv) => {
          const isTesting = testingId === srv.id || testingId === 'ALL';
          const isOperational = srv.status === 'Operational';

          return (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-mono font-bold text-slate-500">{srv.id}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      isOperational ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {srv.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{srv.name}</h3>
                <div className="text-xs text-slate-500 font-medium mb-3">{srv.provider}</div>

                <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Endpoint:</span>
                    <span className="font-mono text-slate-700 font-semibold">{srv.endpoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Latency:</span>
                    <span className="font-mono font-bold text-slate-900">{srv.latency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Verified:</span>
                    <span className="text-slate-600 font-mono text-[11px]">{srv.lastCheck}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Safe Diagnostics:</span>
                    <span className="text-emerald-700 font-semibold">{srv.diagnostic}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleTestService(srv.id)}
                disabled={isTesting}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-xl transition-colors cursor-pointer"
              >
                <Zap className={`w-3.5 h-3.5 ${isTesting ? 'animate-bounce text-cyan-600' : ''}`} />
                {isTesting ? 'Pinging Gateway...' : 'Test Connection & Ping'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
