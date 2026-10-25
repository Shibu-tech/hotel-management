import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Sparkles,
  Wrench,
  UserCheck,
  ShieldAlert,
  ArrowRightLeft,
  BellRing
} from 'lucide-react';
import { ROOM_STATUS, OCCUPANCY_STATUS, RESERVATION_STATUS, WAKE_UP_STATUS } from '../../data/mockFrontDeskData';

export default function StatusBadge({ type = 'reservation', value, size = 'sm' }) {
  if (!value) return null;

  const sizeClass = size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  // 1. Room Cleanliness Status
  if (type === 'cleanliness') {
    switch (value) {
      case ROOM_STATUS.READY:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClass}`}>
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Ready & Clean</span>
          </span>
        );
      case ROOM_STATUS.DIRTY:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClass}`}>
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Turnover Required</span>
          </span>
        );
      case ROOM_STATUS.CLEANING:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200/80 ${sizeClass}`}>
            <Clock className="w-3 h-3 text-blue-600 animate-spin" />
            <span>Cleaning In Progress</span>
          </span>
        );
      case ROOM_STATUS.INSPECTION:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-200/80 ${sizeClass}`}>
            <CheckCircle2 className="w-3 h-3 text-purple-600" />
            <span>Awaiting Inspection</span>
          </span>
        );
      case ROOM_STATUS.MAINTENANCE:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-rose-50 text-rose-700 border border-rose-200/80 ${sizeClass}`}>
            <Wrench className="w-3 h-3 text-rose-600" />
            <span>Maintenance Lock</span>
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-slate-100 text-slate-700 ${sizeClass}`}>
            {value}
          </span>
        );
    }
  }

  // 2. Room Occupancy
  if (type === 'occupancy') {
    if (value === OCCUPANCY_STATUS.OCCUPIED) {
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-semibold bg-blue-100 text-blue-800 border border-blue-200 ${sizeClass}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          <span>Occupied</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-200 ${sizeClass}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        <span>Vacant</span>
      </span>
    );
  }

  // 3. Reservation Status
  if (type === 'reservation') {
    switch (value) {
      case RESERVATION_STATUS.CONFIRMED:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-semibold bg-sky-50 text-sky-700 border border-sky-200 ${sizeClass}`}>
            <Clock className="w-3 h-3 text-sky-600" />
            <span>Confirmed</span>
          </span>
        );
      case RESERVATION_STATUS.CHECKED_IN:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClass}`}>
            <UserCheck className="w-3 h-3 text-emerald-600" />
            <span>Checked-In</span>
          </span>
        );
      case RESERVATION_STATUS.CHECKED_OUT:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-200 ${sizeClass}`}>
            <CheckCircle2 className="w-3 h-3 text-slate-500" />
            <span>Checked-Out</span>
          </span>
        );
      case RESERVATION_STATUS.CANCELLED:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-rose-50 text-rose-700 border border-rose-200 ${sizeClass}`}>
            <XCircle className="w-3 h-3 text-rose-500" />
            <span>Cancelled</span>
          </span>
        );
      case RESERVATION_STATUS.NO_SHOW:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-red-50 text-red-700 border border-red-200 ${sizeClass}`}>
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span>No-Show</span>
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-slate-100 text-slate-700 ${sizeClass}`}>
            {value}
          </span>
        );
    }
  }

  // 4. Request / Task Priority
  if (type === 'priority') {
    const p = String(value).toLowerCase();
    if (p.includes('urgent') || p.includes('critical')) {
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-bold bg-rose-100 text-rose-800 border border-rose-200 ${sizeClass}`}>
          <ShieldAlert className="w-3 h-3 text-rose-600" />
          <span>Urgent</span>
        </span>
      );
    }
    if (p.includes('high')) {
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-semibold bg-amber-100 text-amber-800 border border-amber-200 ${sizeClass}`}>
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          <span>High</span>
        </span>
      );
    }
    if (p.includes('medium')) {
      return (
        <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200 ${sizeClass}`}>
          <span>Medium</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-200 ${sizeClass}`}>
        <span>Low</span>
      </span>
    );
  }

  // 5. Wake-up Call Status
  if (type === 'wakeup') {
    switch (value) {
      case WAKE_UP_STATUS.SCHEDULED:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-sky-50 text-sky-700 border border-sky-200 ${sizeClass}`}>
            <BellRing className="w-3 h-3 text-sky-600" />
            <span>Scheduled</span>
          </span>
        );
      case WAKE_UP_STATUS.COMPLETED:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClass}`}>
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Completed</span>
          </span>
        );
      case WAKE_UP_STATUS.FAILED:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-bold bg-rose-100 text-rose-800 border border-rose-200 ${sizeClass}`}>
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>Failed / No Answer</span>
          </span>
        );
      case WAKE_UP_STATUS.RESCHEDULED:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200 ${sizeClass}`}>
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Rescheduled</span>
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-slate-100 text-slate-700 ${sizeClass}`}>
            {value}
          </span>
        );
    }
  }

  // Fallback
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-200 ${sizeClass}`}>
      {value}
    </span>
  );
}
