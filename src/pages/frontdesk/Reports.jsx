import React, { useState, useMemo } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  BedDouble,
  DollarSign,
  Filter
} from 'lucide-react';
import KPICard from '../../components/frontdesk/KPICard';

export default function Reports() {
  const context = useTaskContext() || {};
  const reservations = context.reservations || [];
  const rooms = context.rooms || [];
  const tasks = context.tasks || [];
  const complaints = context.complaints || [];
  const frontDeskGuestRequests = context.frontDeskGuestRequests || tasks;
  const frontDeskCases = context.frontDeskCases || complaints;
  const wakeUpCalls = context.wakeUpCalls || [];
  const folios = context.folios || [];
  const frontDeskMetrics = context.frontDeskMetrics || {};

  const [dateRange, setDateRange] = useState('today'); // 'today' | '7days' | 'month'
  const [activeTab, setActiveTab] = useState('operations'); // 'operations' | 'service' | 'financial'

  // Computed metrics from actual data
  const reportData = useMemo(() => {
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    
    const arrivalsExpected = reservations.filter(r => r.arrivalDate === '2026-10-22').length;
    const arrivalsCheckedIn = reservations.filter(r => r.arrivalDate === '2026-10-22' && r.status === 'Checked-In').length;
    const arrivalCompletion = arrivalsExpected > 0 ? Math.round((arrivalsCheckedIn / arrivalsExpected) * 100) : 100;

    const departuresExpected = reservations.filter(r => r.departureDate === '2026-10-22').length;
    const departuresCheckedOut = reservations.filter(r => r.departureDate === '2026-10-22' && r.status === 'Checked-Out').length;
    const departureCompletion = departuresExpected > 0 ? Math.round((departuresCheckedOut / departuresExpected) * 100) : 100;

    // Requests resolution
    const reqs = frontDeskGuestRequests || tasks || [];
    const totalRequests = reqs.length;
    const completedRequests = reqs.filter(r => r.workStatus === 'Completed').length;
    const escalatedRequests = reqs.filter(r => r.escalationState?.isEscalated).length;
    const unassignedRequests = reqs.filter(r => r.assignmentStatus === 'Unassigned').length;

    // Cases / Complaints breakdown by category
    const cases = frontDeskCases || complaints || [];
    const casesByCategory = cases.reduce((acc, c) => {
      if (c && c.category) {
        acc[c.category] = (acc[c.category] || 0) + 1;
      }
      return acc;
    }, {});

    // Financial revenue summary from folios
    const totalBilled = folios.reduce((acc, f) => acc + (Number(f?.totalAmount) || 0), 0);
    const totalCollected = folios.reduce((acc, f) => acc + (Number(f?.paidAmount) || 0), 0);
    const outstandingBalance = folios.reduce((acc, f) => acc + (Number(f?.balance) || 0), 0);

    return {
      occupancyRate,
      occupiedRooms,
      totalRooms,
      arrivalsExpected,
      arrivalsCheckedIn,
      arrivalCompletion,
      departuresExpected,
      departuresCheckedOut,
      departureCompletion,
      totalRequests,
      completedRequests,
      escalatedRequests,
      unassignedRequests,
      casesByCategory,
      totalBilled,
      totalCollected,
      outstandingBalance
    };
  }, [reservations, rooms, frontDeskGuestRequests, tasks, frontDeskCases, complaints, folios]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Metric,Value\n" +
      `Occupancy Rate,${reportData.occupancyRate}%\n` +
      `Occupied Rooms,${reportData.occupiedRooms}/${reportData.totalRooms}\n` +
      `Arrivals Checked In,${reportData.arrivalsCheckedIn}/${reportData.arrivalsExpected}\n` +
      `Departures Checked Out,${reportData.departuresCheckedOut}/${reportData.departuresExpected}\n` +
      `Total Requests,${reportData.totalRequests}\n` +
      `Completed Requests,${reportData.completedRequests}\n` +
      `Escalated Requests,${reportData.escalatedRequests}\n` +
      `Total Collected Revenue,$${reportData.totalCollected.toFixed(2)}\n` +
      `Outstanding Balance,$${reportData.outstandingBalance.toFixed(2)}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FrontDesk_Report_${dateRange}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              Operations & Audit
            </span>
            <span className="text-xs text-slate-500 font-medium">Verified Operational Metrics</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Front Desk Operational Reports</h1>
          <p className="text-sm text-slate-500">
            Daily logs, room occupancy, guest request resolution times, and service recovery audits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setDateRange('today')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                dateRange === 'today'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today (Oct 22)
            </button>
            <button
              onClick={() => setDateRange('7days')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                dateRange === '7days'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                dateRange === 'month'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month to Date
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg border border-slate-200 transition-colors"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('operations')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'operations'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BedDouble className="w-4 h-4" />
          Occupancy & Arrivals Summary
        </button>
        <button
          onClick={() => setActiveTab('service')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'service'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          Service Requests & Escalations
        </button>
        <button
          onClick={() => setActiveTab('financial')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'financial'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Settlement & Recovery Summary
        </button>
      </div>

      {/* Tab 1: Operations */}
      {activeTab === 'operations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Current In-House Occupancy"
              value={`${reportData.occupancyRate}%`}
              subtitle={`${reportData.occupiedRooms} of ${reportData.totalRooms} rooms active`}
              icon={BedDouble}
              color="blue"
            />
            <KPICard
              title="Arrivals Conversion"
              value={`${reportData.arrivalsCheckedIn}/${reportData.arrivalsExpected}`}
              subtitle={`${reportData.arrivalCompletion}% checked in today`}
              icon={TrendingUp}
              color="emerald"
            />
            <KPICard
              title="Departures Processed"
              value={`${reportData.departuresCheckedOut}/${reportData.departuresExpected}`}
              subtitle={`${reportData.departureCompletion}% departures cleared`}
              icon={CheckCircle}
              color="purple"
            />
            <KPICard
              title="Rooms Under Turnover"
              value={rooms.filter(r => r.status === 'Turnover').length}
              subtitle="Housekeeping tasks active"
              icon={Clock}
              color="amber"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Room Inventory Status Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-blue-600" />
                Room Inventory & Cleanliness Status
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Room Type</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Occupied</th>
                      <th className="py-2.5 px-3">Ready</th>
                      <th className="py-2.5 px-3">Turnover / Dirty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {['Deluxe King', 'Executive Suite', 'Standard Queen', 'Presidential Suite'].map((type) => {
                      const typeRooms = rooms.filter(r => r.type === type);
                      const occ = typeRooms.filter(r => r.status === 'Occupied').length;
                      const ready = typeRooms.filter(r => r.cleanliness === 'Clean' && r.status === 'Available').length;
                      const dirty = typeRooms.filter(r => r.cleanliness === 'Dirty' || r.status === 'Turnover').length;
                      return (
                        <tr key={type} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 font-medium text-slate-800">{type}</td>
                          <td className="py-2.5 px-3 text-slate-600">{typeRooms.length}</td>
                          <td className="py-2.5 px-3 font-semibold text-blue-600">{occ}</td>
                          <td className="py-2.5 px-3 font-semibold text-emerald-600">{ready}</td>
                          <td className="py-2.5 px-3 font-semibold text-amber-600">{dirty}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Daily Operational Timeline */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Arrivals & Departures Schedule (Today)
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-blue-900">Morning Shift (07:00 - 15:00)</span>
                    <p className="text-blue-700 mt-0.5">Focus: Rapid check-outs, express folio settlement, luggage holding.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-200/60 text-blue-800 font-bold rounded">Completed</span>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-emerald-900">Afternoon Shift (15:00 - 23:00)</span>
                    <p className="text-emerald-700 mt-0.5">Focus: Peak check-ins, VIP amenity verification, ID capture.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-200/60 text-emerald-800 font-bold rounded">Active Now</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">Night Audit (23:00 - 07:00)</span>
                    <p className="text-slate-600 mt-0.5">Focus: Room charges posting, wake-up calls queue, daily rollover.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-medium rounded">Upcoming</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Service & Complaints */}
      {activeTab === 'service' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Service Requests"
              value={reportData.totalRequests}
              subtitle="Logged this cycle"
              icon={FileText}
              color="blue"
            />
            <KPICard
              title="Completed Requests"
              value={reportData.completedRequests}
              subtitle={`${Math.round((reportData.completedRequests / (reportData.totalRequests || 1)) * 100)}% resolution rate`}
              icon={CheckCircle}
              color="emerald"
            />
            <KPICard
              title="Escalated Requests"
              value={reportData.escalatedRequests}
              subtitle="Transferred to Supervisor"
              icon={AlertTriangle}
              color="rose"
            />
            <KPICard
              title="Unassigned In Queue"
              value={reportData.unassignedRequests}
              subtitle="Requiring immediate dispatch"
              icon={Clock}
              color="amber"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Complaint Root Causes */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Complaints by Category
              </h3>
              <div className="space-y-3">
                {Object.entries(reportData.casesByCategory).map(([category, count]) => {
                  const casesTotal = (frontDeskCases || complaints || []).length || 1;
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-700">
                        <span>{category}</span>
                        <span className="font-bold">{count} ({Math.round((count / casesTotal) * 100)}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full"
                          style={{ width: `${Math.min(100, Math.round((count / casesTotal) * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                {Object.keys(reportData.casesByCategory).length === 0 && (
                  <p className="text-xs text-slate-400 py-4 text-center">No complaints recorded</p>
                )}
              </div>
            </div>

            {/* Wake-up Calls Reliability */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                Wake-Up Calls Reliability Report
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100 text-xs">
                  <div>
                    <span className="font-semibold text-purple-900">Total Wake-up Calls Logged</span>
                    <p className="text-purple-700 mt-0.5">Across all hotel guest rooms</p>
                  </div>
                  <span className="text-lg font-bold text-purple-900">{wakeUpCalls.length}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <span className="font-bold text-emerald-800 text-base">
                      {wakeUpCalls.filter(w => w.status === 'Completed').length}
                    </span>
                    <p className="text-emerald-700 mt-1 font-medium">Completed</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <span className="font-bold text-amber-800 text-base">
                      {wakeUpCalls.filter(w => w.status === 'Pending').length}
                    </span>
                    <p className="text-amber-700 mt-1 font-medium">Pending</p>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
                    <span className="font-bold text-rose-800 text-base">
                      {wakeUpCalls.filter(w => w.status === 'Failed').length}
                    </span>
                    <p className="text-rose-700 mt-1 font-medium">Failed/No Answer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Financial */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard
              title="Total Billed Folio Volume"
              value={`$${reportData.totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              subtitle="Active stays and historical"
              icon={DollarSign}
              color="blue"
            />
            <KPICard
              title="Total Payments Collected"
              value={`$${reportData.totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              subtitle="Card, Cash, and Terminal"
              icon={CheckCircle}
              color="emerald"
            />
            <KPICard
              title="Outstanding Balances"
              value={`$${reportData.outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              subtitle="Pending checkout settlements"
              icon={AlertTriangle}
              color="amber"
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Settlement Status by Guest Folio
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Real-time balance breakdown across all current registered guest folios.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Folio ID</th>
                    <th className="py-2.5 px-3">Guest Name</th>
                    <th className="py-2.5 px-3">Room</th>
                    <th className="py-2.5 px-3">Total Charges</th>
                    <th className="py-2.5 px-3">Paid Amount</th>
                    <th className="py-2.5 px-3">Balance Due</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {folios.map((folio) => {
                    const total = Number(folio.totalAmount || 0);
                    const paid = Number(folio.paidAmount || 0);
                    const balance = Number(folio.balance !== undefined ? folio.balance : (total - paid));
                    return (
                      <tr key={folio.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{folio.id}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-900">{folio.guestName}</td>
                        <td className="py-2.5 px-3 text-slate-600">Room {folio.roomNumber}</td>
                        <td className="py-2.5 px-3 text-slate-700">${total.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-emerald-600 font-semibold">${paid.toFixed(2)}</td>
                        <td className={`py-2.5 px-3 font-bold ${balance > 0 ? 'text-amber-600' : 'text-slate-600'}`}>
                          ${balance.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            folio.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-700'
                              : folio.status === 'Open'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {folio.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
