import React, { useState } from 'react';
import {
  LogOut,
  Search,
  Receipt,
  Sparkles,
  AlertTriangle,
  Brush,
  KeyRound,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import StatusBadge from '../../components/frontdesk/StatusBadge';
import CheckOutModal from '../../components/frontdesk/CheckOutModal';

export default function CheckOutPage() {
  const { reservations, folios } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRes, setSelectedRes] = useState(null);
  const [checkOutModalOpen, setCheckOutModalOpen] = useState(false);

  // Active in-house stays eligible for check-out
  const inHouseQueue = reservations.filter((r) => r.status === 'Checked-In');

  const filteredInHouse = inHouseQueue.filter(
    (r) =>
      !searchQuery.trim() ||
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.assignedRoom && r.assignedRoom.includes(searchQuery))
  );

  const handleStartCheckOut = (res) => {
    setSelectedRes(res);
    setCheckOutModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LogOut className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Guest Check-Out & Room Turnover Center
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {filteredInHouse.length} In-House Stays
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Folio settlement review, key return confirmation, and automated Housekeeping turnover dispatch.
          </p>
        </div>

        {/* Turnover Policy Card */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-xs">
          <Brush className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>Notice: On check-out, room is set to "Dirty" and a turnover task is dispatched.</span>
        </div>
      </div>

      {/* Workflow Steps Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center">1</div>
          <div>
            <div className="font-bold text-slate-900">Locate Stay</div>
            <div className="text-[11px] text-slate-500">Select in-house guest</div>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center">2</div>
          <div>
            <div className="font-bold text-slate-900">Folio Balance</div>
            <div className="text-[11px] text-slate-500">Verify zero balance</div>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center">3</div>
          <div>
            <div className="font-bold text-slate-900">Return Keycards</div>
            <div className="text-[11px] text-slate-500">Collect RFID keys</div>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">4</div>
          <div>
            <div className="font-bold text-slate-900">Dispatch Turnover</div>
            <div className="text-[11px] text-slate-500">Auto Housekeeping task</div>
          </div>
        </div>
      </div>

      {/* In-House Stays Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search in-house stays by guest name, room, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          <div className="text-xs text-slate-500">
            Showing {filteredInHouse.length} in-house stays
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-3 px-4">Room & Guest</th>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Stay Dates</th>
                <th className="py-3 px-4">Room Category</th>
                <th className="py-3 px-4">Folio Balance</th>
                <th className="py-3 px-4">Check-In Staff & Time</th>
                <th className="py-3 px-4 text-right">Workflow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInHouse.length > 0 ? (
                filteredInHouse.map((res) => {
                  const linkedFolio = folios.find((f) => f.reservationId === res.id);
                  const balance = linkedFolio ? linkedFolio.balance : res.folioBalance || 0;

                  return (
                    <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                            {res.assignedRoom}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{res.guestName}</div>
                            <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.2 rounded">
                              {res.vipStatus}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                        {res.reference}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">
                          {res.arrivalDate} → {res.departureDate}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {res.nights} Nights
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {res.roomType}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                            balance === 0
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          ${balance.toFixed(2)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                        <div>{res.checkInActor || 'Front Desk'}</div>
                        <div className="text-slate-400">
                          {new Date(res.checkInTimestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleStartCheckOut(res)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Execute Check-Out
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No active in-house stays found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CheckOutModal
        isOpen={checkOutModalOpen}
        onClose={() => setCheckOutModalOpen(false)}
        reservation={selectedRes}
      />
    </div>
  );
}
