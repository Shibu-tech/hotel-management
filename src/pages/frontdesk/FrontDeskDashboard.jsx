import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogIn,
  LogOut,
  Users,
  ClipboardList,
  AlertOctagon,
  ShieldAlert,
  CalendarCheck,
  ArrowRightLeft,
  AlarmClock,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  CreditCard,
  Building2,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import KPICard from '../../components/frontdesk/KPICard';
import StatusBadge from '../../components/frontdesk/StatusBadge';
import CheckInModal from '../../components/frontdesk/CheckInModal';
import CheckOutModal from '../../components/frontdesk/CheckOutModal';
import CreateReservationModal from '../../components/frontdesk/CreateReservationModal';
import CreateRequestModal from '../../components/frontdesk/CreateRequestModal';
import CreateCaseModal from '../../components/frontdesk/CreateCaseModal';
import WakeUpCallModal from '../../components/frontdesk/WakeUpCallModal';

export default function FrontDeskDashboard() {
  const {
    frontDeskMetrics,
    reservations,
    tasks,
    complaints,
    wakeUpCalls,
    guestCommunications,
    frontDeskProfile
  } = useTasks();

  const navigate = useNavigate();

  // Modals state
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [selectedCheckInRes, setSelectedCheckInRes] = useState(null);

  const [checkOutModalOpen, setCheckOutModalOpen] = useState(false);
  const [selectedCheckOutRes, setSelectedCheckOutRes] = useState(null);

  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [caseModalOpen, setCaseModalOpen] = useState(false);
  const [wakeUpModalOpen, setWakeUpModalOpen] = useState(false);

  // Tab switch for arrivals / departures
  const [movementTab, setMovementTab] = useState('arrivals');

  const handleOpenCheckIn = (res) => {
    setSelectedCheckInRes(res);
    setCheckInModalOpen(true);
  };

  const handleOpenCheckOut = (res) => {
    setSelectedCheckOutRes(res);
    setCheckOutModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Welcome & Operational Context Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
              Front Desk Command
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Station 02 • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Welcome back, {frontDeskProfile.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational overview of today's guest movements, room readiness clearances, service routing, and guest resolutions.
          </p>
        </div>

        {/* Live Quick Counters Strip */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[90px]">
            <span className="text-[10px] font-semibold text-slate-500 block uppercase">Occupancy</span>
            <span className="text-base font-black text-slate-900">{frontDeskMetrics.occupancyRate}%</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[90px]">
            <span className="text-[10px] font-semibold text-slate-500 block uppercase">Ready Rooms</span>
            <span className="text-base font-black text-emerald-600">{frontDeskMetrics.vacantReadyRooms}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[90px]">
            <span className="text-[10px] font-semibold text-slate-500 block uppercase">Turnover Due</span>
            <span className="text-base font-black text-amber-600">{frontDeskMetrics.dirtyRooms}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <button
          onClick={() => setReservationModalOpen(true)}
          className="p-3 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all group shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 block truncate">New Reservation</span>
          <span className="text-[10px] text-slate-500 block">Book guest stay</span>
        </button>

        <button
          onClick={() => {
            const firstArrival = frontDeskMetrics.arrivalsList[0];
            if (firstArrival) handleOpenCheckIn(firstArrival);
            else navigate('/frontdesk/check-in');
          }}
          className="p-3 bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all group shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <LogIn className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 block truncate">Express Check-In</span>
          <span className="text-[10px] text-slate-500 block">{frontDeskMetrics.arrivalsCount} arriving today</span>
        </button>

        <button
          onClick={() => {
            const firstDep = frontDeskMetrics.departuresList[0];
            if (firstDep) handleOpenCheckOut(firstDep);
            else navigate('/frontdesk/check-out');
          }}
          className="p-3 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all group shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 block truncate">Express Check-Out</span>
          <span className="text-[10px] text-slate-500 block">{frontDeskMetrics.departuresCount} departures</span>
        </button>

        <button
          onClick={() => setRequestModalOpen(true)}
          className="p-3 bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all group shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <ClipboardList className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 block truncate">Create Request</span>
          <span className="text-[10px] text-slate-500 block">Route to department</span>
        </button>

        <button
          onClick={() => setCaseModalOpen(true)}
          className="p-3 bg-white hover:bg-rose-50/70 border border-slate-200 hover:border-rose-300 rounded-xl text-left transition-all group shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 block truncate">Open Case</span>
          <span className="text-[10px] text-slate-500 block">Log guest complaint</span>
        </button>

        <button
          onClick={() => setWakeUpModalOpen(true)}
          className="p-3 bg-white hover:bg-purple-50/70 border border-slate-200 hover:border-purple-300 rounded-xl text-left transition-all group shadow-2xs"
        >
          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <AlarmClock className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900 block truncate">Wake-Up Call</span>
          <span className="text-[10px] text-slate-500 block">Schedule wake-up</span>
        </button>
      </div>

      {/* KPI Cards (Section 5 Required Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Today's Arrivals"
          value={frontDeskMetrics.arrivalsCount}
          subtitle={`${frontDeskMetrics.arrivalsList.filter(r => r.assignedRoom).length} pre-assigned`}
          icon={LogIn}
          colorScheme="emerald"
          badge={frontDeskMetrics.arrivalsCount > 0 ? 'Pending In' : 'None'}
          onClick={() => navigate('/frontdesk/check-in')}
        />

        <KPICard
          title="Today's Departures"
          value={frontDeskMetrics.departuresCount}
          subtitle="Turnover tasks trigger"
          icon={LogOut}
          colorScheme="blue"
          badge={frontDeskMetrics.departuresCount > 0 ? 'Due Today' : 'None'}
          onClick={() => navigate('/frontdesk/check-out')}
        />

        <KPICard
          title="In-House Guests"
          value={frontDeskMetrics.inHouseStaysCount}
          subtitle={`${frontDeskMetrics.totalInHouseGuests} Total Headcount`}
          icon={Users}
          colorScheme="indigo"
          badge={`${frontDeskMetrics.occupancyRate}% Occ`}
          onClick={() => navigate('/frontdesk/reservations')}
        />

        <KPICard
          title="Open Requests"
          value={frontDeskMetrics.openRequestsCount}
          subtitle={`${frontDeskMetrics.unassignedRequestsCount} unassigned queue`}
          icon={ClipboardList}
          colorScheme="amber"
          badge={frontDeskMetrics.unassignedRequestsCount > 0 ? 'Action Needed' : 'Normal'}
          onClick={() => navigate('/frontdesk/requests')}
        />

        <KPICard
          title="Unresolved Cases"
          value={frontDeskMetrics.unresolvedComplaintsCount}
          subtitle="Guest grievances"
          icon={AlertOctagon}
          colorScheme="rose"
          badge={frontDeskMetrics.unresolvedComplaintsCount > 0 ? 'Needs Attention' : 'All Clear'}
          onClick={() => navigate('/frontdesk/cases')}
        />

        <KPICard
          title="Escalated / Overdue"
          value={frontDeskMetrics.escalatedCasesCount + frontDeskMetrics.overdueRequestsCount}
          subtitle={`${frontDeskMetrics.escalatedCasesCount} cases, ${frontDeskMetrics.overdueRequestsCount} reqs`}
          icon={ShieldAlert}
          colorScheme="rose"
          badge="High Priority"
          onClick={() => navigate('/frontdesk/cases')}
        />
      </div>

      {/* Operational Workflows Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Movements & Requests */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Arrivals & Departures Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMovementTab('arrivals')}
                  className={`text-xs font-bold pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
                    movementTab === 'arrivals'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Today's Expected Arrivals ({frontDeskMetrics.arrivalsCount})
                </button>
                <button
                  onClick={() => setMovementTab('departures')}
                  className={`text-xs font-bold pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
                    movementTab === 'departures'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Today's Scheduled Departures ({frontDeskMetrics.departuresCount})
                </button>
              </div>

              <Link
                to={movementTab === 'arrivals' ? '/frontdesk/check-in' : '/frontdesk/check-out'}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                View Workflow
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {movementTab === 'arrivals' ? (
                frontDeskMetrics.arrivalsList.length > 0 ? (
                  frontDeskMetrics.arrivalsList.map((res) => (
                    <div
                      key={res.id}
                      className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {res.assignedRoom || '?'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {res.guestName}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                              {res.vipStatus}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {res.reference}
                            </span>
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-3">
                            <span>Room Type: {res.roomType}</span>
                            <span>ETA: {res.estimatedArrivalTime}</span>
                            <span>{res.nights} Nights</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenCheckIn(res)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 transition-colors"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          Check-In
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No remaining arrivals scheduled for today. All guests processed.
                  </div>
                )
              ) : frontDeskMetrics.departuresList.length > 0 ? (
                frontDeskMetrics.departuresList.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {res.assignedRoom || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {res.guestName}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                            {res.vipStatus}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-3">
                          <span>Room {res.assignedRoom}</span>
                          <span>Folio Balance: ${res.folioBalance.toFixed(2)}</span>
                          <span>Checked in: {new Date(res.checkInTimestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenCheckOut(res)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Check-Out
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  No departures pending today.
                </div>
              )}
            </div>
          </div>

          {/* Recent Guest Requests Queue */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-blue-600" />
                  Recent Guest Requests & Department Routing
                </h3>
                <span className="text-[11px] text-slate-500">
                  Connected to shared task system • {frontDeskMetrics.unassignedRequestsCount} unassigned
                </span>
              </div>

              <Link
                to="/frontdesk/requests"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                All Requests
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {frontDeskMetrics.openRequestsList.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-500">
                        {t.id}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {t.title}
                      </span>
                      <StatusBadge type="priority" value={t.priority} size="xs" />
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="font-semibold text-blue-700">{t.location}</span>
                      <span>Dept: {t.category}</span>
                      <span>
                        Assignee:{' '}
                        {t.assignedTo ? (
                          <strong className="text-slate-800">{t.assignedTo.name}</strong>
                        ) : (
                          <span className="text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                            Unassigned Queue
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                      Status: {t.status}
                    </span>
                    <Link
                      to="/frontdesk/requests"
                      className="p-1 text-slate-400 hover:text-blue-600"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Complaints Needing Attention + Upcoming Wake-Ups + Communications */}
        <div className="space-y-6">
          {/* Complaints Needing Attention */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  Complaints Needing Attention
                </h3>
                <span className="text-[11px] text-slate-500">
                  {frontDeskMetrics.unresolvedComplaintsCount} active grievances
                </span>
              </div>

              <Link
                to="/frontdesk/cases"
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                Cases
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {frontDeskMetrics.unresolvedComplaintsList.length > 0 ? (
                frontDeskMetrics.unresolvedComplaintsList.slice(0, 3).map((c) => (
                  <div key={c.id} className="p-4 hover:bg-slate-50/80 transition-colors space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-slate-500">{c.id}</span>
                      <StatusBadge type="priority" value={c.severity} size="xs" />
                    </div>

                    <div className="font-bold text-slate-900">
                      {c.category}
                    </div>

                    <p className="text-slate-600 text-[11px] line-clamp-2">
                      {c.guestReference}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-50">
                      <span>Owner: {c.owner}</span>
                      <span className="text-blue-600 font-semibold">{c.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  No active guest complaints. Excellent operational score!
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Wake-Up Calls */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <AlarmClock className="w-4 h-4 text-indigo-600" />
                  Wake-Up Calls Today
                </h3>
                <span className="text-[11px] text-slate-500">
                  {frontDeskMetrics.upcomingWakeUpCallsCount} scheduled
                </span>
              </div>

              <Link
                to="/frontdesk/wake-up-calls"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View Calls
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {wakeUpCalls.slice(0, 3).map((w) => (
                <div key={w.id} className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm font-mono text-indigo-700">
                        {w.scheduledTime}
                      </span>
                      <span className="font-semibold text-slate-800">
                        Room {w.roomNumber}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                      {w.guestName}
                    </span>
                  </div>

                  <StatusBadge type="wakeup" value={w.status} size="xs" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Guest Communications Log */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Recent Guest Messaging
                </h3>
              </div>
              <Link
                to="/frontdesk/communications"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                All Comms
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {guestCommunications.slice(0, 3).map((g) => (
                <div key={g.id} className="p-3.5 hover:bg-slate-50/80 transition-colors space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-800">{g.guestName} ({g.roomNumber})</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">{g.channel}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] line-clamp-2">
                    {g.message}
                  </p>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
                    <span>{new Date(g.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-emerald-700 font-medium">{g.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        reservation={selectedCheckInRes}
      />

      <CheckOutModal
        isOpen={checkOutModalOpen}
        onClose={() => setCheckOutModalOpen(false)}
        reservation={selectedCheckOutRes}
      />

      <CreateReservationModal
        isOpen={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
      />

      <CreateRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />

      <CreateCaseModal
        isOpen={caseModalOpen}
        onClose={() => setCaseModalOpen(false)}
      />

      <WakeUpCallModal
        isOpen={wakeUpModalOpen}
        onClose={() => setWakeUpModalOpen(false)}
      />
    </div>
  );
}
