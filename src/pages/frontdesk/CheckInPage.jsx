import React, { useState } from 'react';
import {
  LogIn,
  Search,
  UserCheck,
  Sparkles,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  KeyRound
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import StatusBadge from '../../components/frontdesk/StatusBadge';
import CheckInModal from '../../components/frontdesk/CheckInModal';

export default function CheckInPage() {
  const { reservations, rooms, frontDeskMetrics } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRes, setSelectedRes] = useState(null);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);

  // Eligible reservations for check-in: Confirmed reservations
  const arrivalsQueue = reservations.filter((r) => r.status === 'Confirmed');

  const filteredArrivals = arrivalsQueue.filter(
    (r) =>
      !searchQuery.trim() ||
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.assignedRoom && r.assignedRoom.includes(searchQuery))
  );

  const handleStartCheckIn = (res) => {
    setSelectedRes(res);
    setCheckInModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LogIn className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Guest Check-In Workflow Center
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {filteredArrivals.length} Pending Check-In
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Mandatory identity verification, registration confirmation, and real-time room readiness validation.
          </p>
        </div>

        {/* Security Rule Card */}
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
          <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Policy: No guest check-in permitted without verified ID and Housekeeping room clearance.</span>
        </div>
      </div>

      {/* Step Guide Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center">1</div>
          <div>
            <div className="font-bold text-slate-900">Locate Booking</div>
            <div className="text-[11px] text-slate-500">Find reservation record</div>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center">2</div>
          <div>
            <div className="font-bold text-slate-900">Verify Identity</div>
            <div className="text-[11px] text-slate-500">Visual ID check required</div>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center">3</div>
          <div>
            <div className="font-bold text-slate-900">Room Clearance</div>
            <div className="text-[11px] text-slate-500">Must be Ready & Clean</div>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">4</div>
          <div>
            <div className="font-bold text-slate-900">Issue Key Cards</div>
            <div className="text-[11px] text-slate-500">Stamp staff audit trail</div>
          </div>
        </div>
      </div>

      {/* Arrivals Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search arrivals by guest name, reservation reference, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          <div className="text-xs text-slate-500">
            Showing {filteredArrivals.length} pending arrivals
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Arrival & Duration</th>
                <th className="py-3 px-4">Room Type</th>
                <th className="py-3 px-4">Assigned Room</th>
                <th className="py-3 px-4">Cleanliness Clearance</th>
                <th className="py-3 px-4 text-right">Workflow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArrivals.length > 0 ? (
                filteredArrivals.map((res) => {
                  const roomObj = rooms.find((r) => r.roomNumber === res.assignedRoom);
                  const isReady = roomObj?.cleanliness === 'Ready / Clean & Inspected';

                  return (
                    <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{res.guestName}</div>
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                          {res.vipStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                        {res.reference}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">{res.arrivalDate}</div>
                        <div className="text-[11px] text-slate-500">
                          {res.nights} Nights • ETA {res.estimatedArrivalTime}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {res.roomType}
                      </td>

                      <td className="py-3.5 px-4">
                        {res.assignedRoom ? (
                          <span className="font-bold text-slate-900">Room {res.assignedRoom}</span>
                        ) : (
                          <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                            Floating (Assign Now)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge
                          type="cleanliness"
                          value={roomObj?.cleanliness || 'Awaiting Cleanliness Clearance'}
                          size="xs"
                        />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleStartCheckIn(res)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          Execute Check-In
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No matching pending arrivals found. All scheduled guests have checked in!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        reservation={selectedRes}
      />
    </div>
  );
}
