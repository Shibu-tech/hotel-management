import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  Plus,
  LogIn,
  LogOut,
  User,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  Edit3,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import StatusBadge from '../../components/frontdesk/StatusBadge';
import CheckInModal from '../../components/frontdesk/CheckInModal';
import CheckOutModal from '../../components/frontdesk/CheckOutModal';
import CreateReservationModal from '../../components/frontdesk/CreateReservationModal';

export default function Reservations() {
  const { reservations, rooms } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roomTypeFilter, setRoomTypeFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [checkOutModalOpen, setCheckOutModalOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState(null);

  // Filtered reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      // Search
      const matchesSearch =
        !searchQuery.trim() ||
        r.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.assignedRoom && r.assignedRoom.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.email && r.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.phone && r.phone.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

      // Room Type
      const matchesRoomType = roomTypeFilter === 'ALL' || r.roomType === roomTypeFilter;

      // Date
      const matchesDate = !dateFilter || r.arrivalDate === dateFilter || r.departureDate === dateFilter;

      return matchesSearch && matchesStatus && matchesRoomType && matchesDate;
    });
  }, [reservations, searchQuery, statusFilter, roomTypeFilter, dateFilter]);

  const handleOpenCheckIn = (res) => {
    setSelectedRes(res);
    setCheckInModalOpen(true);
  };

  const handleOpenCheckOut = (res) => {
    setSelectedRes(res);
    setCheckOutModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Reservations Directory
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {filteredReservations.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Search, filter, and manage hotel guest reservations, room assignments, and clearance check workflows.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Reservation
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Reference (SO-8041), Guest Name, Room, Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
            >
              <option value="ALL">All Reservation Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked-In">Checked-In / In-House</option>
              <option value="Checked-Out">Checked-Out</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Room Type Filter */}
          <div>
            <select
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
            >
              <option value="ALL">All Room Types</option>
              <option value="Deluxe King">Deluxe King</option>
              <option value="Executive Suite">Executive Suite</option>
              <option value="Standard Queen">Standard Queen</option>
              <option value="Twin Classic">Twin Classic</option>
              <option value="Presidential Suite">Presidential Suite</option>
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              placeholder="Filter by Date"
            />
          </div>
        </div>

        {(searchQuery || statusFilter !== 'ALL' || roomTypeFilter !== 'ALL' || dateFilter) && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Filtering active: showing {filteredReservations.length} of {reservations.length} bookings</span>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setRoomTypeFilter('ALL');
                setDateFilter('');
              }}
              className="font-bold text-blue-600 hover:text-blue-800"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Guest Details</th>
                <th className="py-3 px-4">Stay Dates</th>
                <th className="py-3 px-4">Room Category</th>
                <th className="py-3 px-4">Assigned Room & Cleanliness</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Permitted Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReservations.length > 0 ? (
                filteredReservations.map((r) => {
                  const assignedRoomObj = rooms.find((rm) => rm.roomNumber === r.assignedRoom);

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Reference */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {r.reference}
                        <span className="block text-[10px] text-slate-400 font-sans font-normal">
                          {r.id}
                        </span>
                      </td>

                      {/* Guest Details */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {r.guestName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-slate-500 text-[11px]">
                          <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded text-[10px]">
                            {r.vipStatus}
                          </span>
                          <span>{r.phone}</span>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">
                          {r.arrivalDate} → {r.departureDate}
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {r.nights} {r.nights === 1 ? 'Night' : 'Nights'} • {r.adults} Adults
                        </span>
                      </td>

                      {/* Room Category */}
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {r.roomType}
                      </td>

                      {/* Assigned Room & Cleanliness */}
                      <td className="py-3 px-4">
                        {r.assignedRoom ? (
                          <div className="space-y-1">
                            <span className="font-bold text-slate-900 block text-xs">
                              Room {r.assignedRoom}
                            </span>
                            <StatusBadge
                              type="cleanliness"
                              value={assignedRoomObj?.cleanliness || 'Turnover Required'}
                              size="xs"
                            />
                          </div>
                        ) : (
                          <span className="text-amber-700 text-xs font-semibold bg-amber-50 px-2 py-0.5 rounded">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <StatusBadge type="reservation" value={r.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {r.status === 'Confirmed' && (
                            <button
                              onClick={() => handleOpenCheckIn(r)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs flex items-center gap-1 transition-colors"
                            >
                              <LogIn className="w-3.5 h-3.5" />
                              Check-In
                            </button>
                          )}

                          {r.status === 'Checked-In' && (
                            <button
                              onClick={() => handleOpenCheckOut(r)}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-2xs flex items-center gap-1 transition-colors"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              Check-Out
                            </button>
                          )}

                          {r.status === 'Checked-Out' && (
                            <span className="text-[11px] text-slate-400 italic">
                              Stay Completed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No reservations matching current search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateReservationModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <CheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        reservation={selectedRes}
      />

      <CheckOutModal
        isOpen={checkOutModalOpen}
        onClose={() => setCheckOutModalOpen(false)}
        reservation={selectedRes}
      />
    </div>
  );
}
