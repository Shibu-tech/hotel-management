import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Phone, Flame, HeartPulse, UserX, AlertOctagon, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { SECURITY_EMERGENCY_PROTOCOLS } from '../../data/mockSecurityData';

export default function EmergencyProtocolModal({ isOpen, onClose }) {
  const [selectedCode, setSelectedCode] = useState(SECURITY_EMERGENCY_PROTOCOLS[0]?.code || 'CODE RED');

  if (!isOpen) return null;

  const currentProtocol = SECURITY_EMERGENCY_PROTOCOLS.find((p) => p.code === selectedCode) || SECURITY_EMERGENCY_PROTOCOLS[0];

  const getCodeIcon = (code) => {
    switch (code) {
      case 'CODE RED':
        return <Flame className="w-5 h-5 text-red-500" />;
      case 'CODE BLUE':
        return <HeartPulse className="w-5 h-5 text-blue-500" />;
      case 'CODE BLACK':
        return <AlertOctagon className="w-5 h-5 text-slate-800" />;
      case 'CODE ORANGE':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 via-red-800 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldAlert className="w-6 h-6 text-red-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500 text-white">
                  CRITICAL S.O.P.
                </span>
                <span className="text-xs text-red-200 font-medium">Bypasses Routine Approvals</span>
              </div>
              <h2 className="text-lg font-black tracking-tight text-white mt-0.5">
                StayOps Emergency Protocols
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protocol Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-2 bg-slate-100 border-b border-slate-200">
          {SECURITY_EMERGENCY_PROTOCOLS.map((protocol) => {
            const isSelected = selectedCode === protocol.code;
            return (
              <button
                key={protocol.code}
                onClick={() => setSelectedCode(protocol.code)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {getCodeIcon(protocol.code)}
                <span>{protocol.code}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${currentProtocol.color}`}>
                  {currentProtocol.code}
                </span>
                <span className="text-xs font-bold text-slate-500 tracking-wide uppercase">
                  {currentProtocol.badge}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                {currentProtocol.title}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[11px] text-slate-500 block">Radio Priority</span>
              <span className="text-xs font-mono font-bold text-red-600">CH 03 COMMAND</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Mandatory Immediate Actions
            </h4>
            <ol className="space-y-2.5">
              {currentProtocol.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 shadow-2xs"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Emergency Contacts Banner */}
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center">
                <Phone className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-red-950">Direct Emergency Dispatch Extensions</p>
                <p className="text-red-700 text-[11px]">Fire: x9911 | Police: x9912 | Medical EMS: x9913 | General Mgr: x1001</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-bold shrink-0">
              Emergency Override
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
