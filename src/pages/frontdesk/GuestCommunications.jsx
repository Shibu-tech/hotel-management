import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  Send,
  Smartphone,
  Mail,
  PhoneCall,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  ShieldCheck
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import SendCommunicationModal from '../../components/frontdesk/SendCommunicationModal';

export default function GuestCommunications() {
  const { guestCommunications, frontDeskProfile } = useTasks();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');

  const filteredComms = guestCommunications.filter((g) => {
    const matchesSearch =
      !searchQuery.trim() ||
      g.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.roomNumber.includes(searchQuery) ||
      g.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesChannel = channelFilter === 'ALL' || g.channel === channelFilter;

    return matchesSearch && matchesChannel;
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Guest Communications & Messaging Gateway
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {filteredComms.length} Transmissions Logged
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Multi-channel guest outreach via SMS, WhatsApp, In-App Concierge, and official email templates.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Send Guest Message
        </button>
      </div>

      {/* Simulated Gateway Disclaimer */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>
            <strong>Simulated Communication Integration:</strong> Operates in audit-simulation mode. Messages are stamped in real-time without dispatching external SMS/email.
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-blue-200/80 text-blue-900 text-[10px] font-bold uppercase whitespace-nowrap">
          Live Gateway Mock
        </span>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by guest name, room, message keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          <div>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium"
            >
              <option value="ALL">All Communication Channels</option>
              <option value="SMS">SMS Cellular</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="In-App Concierge">In-App Concierge Chat</option>
              <option value="Email">Official Hotel Email</option>
              <option value="Phone Call Log">Phone Call Log</option>
            </select>
          </div>
        </div>
      </div>

      {/* Communications Stream */}
      <div className="space-y-3">
        {filteredComms.length > 0 ? (
          filteredComms.map((g) => (
            <div
              key={g.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-sm transition-all space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {g.id}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{g.guestName}</span>
                  <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                    Room {g.roomNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {g.channel}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Category: <strong>{g.category}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {g.status}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-800 leading-relaxed font-medium">
                "{g.message}"
              </div>

              {/* Footer info */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Dispatched by: {g.actor}</span>
                <span>{new Date(g.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs text-slate-500">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            No guest messages found matching current filters.
          </div>
        )}
      </div>

      <SendCommunicationModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
