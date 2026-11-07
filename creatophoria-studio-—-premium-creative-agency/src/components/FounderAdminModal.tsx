import React, { useState, useEffect, useCallback } from 'react';
import { Lead, LeadStats, calculateLeadStats, filterLeads } from '../utils/leads';

interface FounderAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FounderAdminModal: React.FC<FounderAdminModalProps> = ({ isOpen, onClose }) => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<LeadStats>({
    total: 0,
    new: 0,
    contacted: 0,
    inDiscussion: 0,
    booked: 0,
    topService: 'None yet',
    services: {}
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const getAdminKey = () => sessionStorage.getItem('creatophoria_admin_key') || '';

  const fetchLeads = useCallback(async () => {
    const key = getAdminKey();
    if (!key) return;

    try {
      const res = await fetch('/api/leads', {
        headers: { 'x-admin-key': key }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setLeads(data.leads || []);
          setStats(calculateLeadStats(data.leads || []));
          return;
        }
      }
    } catch (e) {
      console.warn('API error, reading local leads buffer:', e);
    }

    // Fallback: local storage buffer
    try {
      const local = JSON.parse(localStorage.getItem('creatophoria_offline_leads') || '[]');
      setLeads(local);
      setStats(calculateLeadStats(local));
    } catch (e) {}
  }, []);

  useEffect(() => {
    const saved = getAdminKey();
    if (saved === 'creatophoria2026') {
      setIsAuthenticated(true);
      fetchLeads();
    }
  }, [fetchLeads, isOpen]);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'creatophoria2026') {
      sessionStorage.setItem('creatophoria_admin_key', passcode.trim());
      setIsAuthenticated(true);
      setAuthError(false);
      showToast('Access Granted · Welcome Founder');
      fetchLeads();
    } else {
      setAuthError(true);
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem('creatophoria_admin_key');
    setIsAuthenticated(false);
    setPasscode('');
    showToast('Portal Locked');
  };

  const handleStatusChange = async (id: string, newStatus: Lead['status']) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': getAdminKey()
        },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {}

    // Update state
    setLeads(prev => {
      const updated = prev.map(l => (l.id === id ? { ...l, status: newStatus } : l));
      setStats(calculateLeadStats(updated));
      return updated;
    });
    showToast(`Status updated to ${newStatus}`);
  };

  const handleNotesChange = async (id: string, notes: string) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': getAdminKey()
        },
        body: JSON.stringify({ notes })
      });
    } catch (e) {}

    setLeads(prev => prev.map(l => (l.id === id ? { ...l, notes } : l)));
    showToast('Notes saved');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead inquiry?')) return;
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': getAdminKey() }
      });
    } catch (e) {}

    setLeads(prev => {
      const updated = prev.filter(l => l.id !== id);
      setStats(calculateLeadStats(updated));
      return updated;
    });
    showToast('Lead deleted');
  };

  const filtered = filterLeads(leads, statusFilter, serviceFilter, searchQuery);

  return (
    <div className="fixed inset-0 z-[100000] bg-[#07070A]/95 backdrop-blur-2xl overflow-y-auto p-4 sm:p-8 flex flex-col justify-start">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100002] px-5 py-3 rounded-xl bg-[#0E1016] border border-[#00E5A8] text-white text-xs font-semibold shadow-xl shadow-[#00E5A8]/20 animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Lock Gate Modal if not authenticated */}
      {!isAuthenticated ? (
        <div className="min-h-full flex items-center justify-center py-12">
          <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-white/[0.04] border border-white/10 shadow-2xl shadow-black/80 text-center relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-[#00E5A8]/10 border border-[#00E5A8]/30 text-[#00E5A8] text-2xl flex items-center justify-center mx-auto mb-6">
              🔒
            </div>
            <h2 className="font-['Syne'] text-2xl font-bold text-white mb-2">Creatophoria Studio</h2>
            <p className="text-xs text-[#AEB4C2] leading-relaxed mb-6">
              Private Founder Access. Enter your secret passcode to unlock client inquiries.
            </p>

            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
              <input
                type="password"
                value={passcode}
                onChange={e => {
                  setPasscode(e.target.value);
                  setAuthError(false);
                }}
                placeholder="••••••••••••"
                required
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-center text-white text-base tracking-[0.2em] focus:outline-none focus:border-[#00E5A8]"
              />
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#00E5A8] text-[#07070A] font-bold text-sm hover:bg-[#1affbf] transition-all flex items-center justify-center gap-2"
              >
                <span>Unlock Portal</span>
                <span>→</span>
              </button>
              {authError && (
                <div className="text-xs text-red-400 font-medium">⚠️ Access Denied: Incorrect passcode</div>
              )}
            </form>

            <button
              onClick={onClose}
              className="mt-6 text-xs text-[#6D7482] hover:text-white underline cursor-pointer"
            >
              Back to Live Website
            </button>
          </div>
        </div>
      ) : (
        /* Full Dashboard View */
        <div className="max-w-7xl mx-auto w-full py-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5 flex-shrink-0">
                <img
                  src="/creatophoria_logo.png"
                  alt="Creatophoria Emblem"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(0,229,168,0.5)]"
                />
              </div>
              <div>
                <h1 className="font-['Syne'] text-2xl font-bold text-white">Creatophoria Studio</h1>
                <div className="flex items-center gap-2 text-xs text-[#AEB4C2]">
                  <span className="w-2 h-2 rounded-full bg-[#00E5A8] animate-ping" />
                  <span>Founder Leads Engine · Secure Portal</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchLeads}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-all flex items-center gap-1.5"
              >
                ↻ Refresh
              </button>
              <a
                href={`/api/leads/export?key=${encodeURIComponent(getAdminKey())}`}
                download="creatophoria_leads.csv"
                className="px-4 py-2 rounded-lg bg-[#00E5A8] text-[#07070A] text-xs font-bold hover:bg-[#1affbf] transition-all flex items-center gap-1.5 shadow-md shadow-[#00E5A8]/20"
              >
                ↓ Export CSV
              </a>
              <button
                onClick={handleLock}
                className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold hover:bg-red-500/20 transition-all"
              >
                Lock
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all"
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <div className="text-[10px] uppercase tracking-wider text-[#6D7482] font-semibold mb-2">
                Total Inquiries
              </div>
              <div className="font-['Syne'] text-4xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-[#AEB4C2] mt-1">Lifetime leads collected</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <div className="text-[10px] uppercase tracking-wider text-[#6D7482] font-semibold mb-2">
                New / Action Required
              </div>
              <div className="font-['Syne'] text-4xl font-bold text-[#00E5A8]">{stats.new}</div>
              <div className="text-xs text-[#AEB4C2] mt-1">Awaiting client response</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <div className="text-[10px] uppercase tracking-wider text-[#6D7482] font-semibold mb-2">
                In Discussion / Booked
              </div>
              <div className="font-['Syne'] text-4xl font-bold text-[#7B61FF]">
                {stats.inDiscussion + stats.booked}
              </div>
              <div className="text-xs text-[#AEB4C2] mt-1">Active client dialogues</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <div className="text-[10px] uppercase tracking-wider text-[#6D7482] font-semibold mb-2">
                Top Service
              </div>
              <div className="font-['Syne'] text-xl font-bold text-[#FFB800] truncate">
                {stats.topService}
              </div>
              <div className="text-xs text-[#AEB4C2] mt-1">Highest client demand</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/10 overflow-x-auto">
              {(['all', 'new', 'contacted', 'in_discussion', 'booked', 'archived'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-white/15 text-white'
                      : 'text-[#6D7482] hover:text-white'
                  }`}
                >
                  {st === 'all' ? 'All Leads' : st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-grow sm:flex-grow-0 sm:w-96">
              <select
                value={serviceFilter}
                onChange={e => setServiceFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#0E1016] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00E5A8]"
              >
                <option value="all">All Services</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Video Editing">Video Editing</option>
                <option value="Motion Graphics">Motion Graphics</option>
                <option value="Brand Identity">Brand Identity</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Social Media Design">Social Media Design</option>
                <option value="Thumbnail Design">Thumbnail Design</option>
                <option value="Creative Strategy">Creative Strategy</option>
                <option value="Complete Creative Package">Complete Package</option>
              </select>

              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, email..."
                className="flex-grow px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00E5A8]"
              />
            </div>
          </div>

          {/* Leads List */}
          <div className="flex flex-col gap-4">
            {filtered.length === 0 ? (
              <div className="p-16 rounded-3xl bg-white/[0.02] border border-dashed border-white/10 text-center flex flex-col items-center justify-center">
                <div className="text-4xl mb-3 opacity-40">📂</div>
                <div className="font-['Syne'] text-lg font-bold text-white mb-1">
                  No Client Inquiries Found
                </div>
                <div className="text-xs text-[#6D7482]">
                  Try adjusting your search criteria or submit a test inquiry from the contact form.
                </div>
              </div>
            ) : (
              filtered.map(lead => {
                const initials = (lead.name || 'C')
                  .split(' ')
                  .map(n => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                const cleanPhone = (lead.contact || '').replace(/[^0-9]/g, '');
                const waLink = cleanPhone
                  ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      `Hi ${lead.name}, this is Creatophoria Studio regarding your inquiry for ${lead.service}!`
                    )}`
                  : '';

                return (
                  <div
                    key={lead.id}
                    className={`p-6 rounded-2xl bg-white/[0.035] border border-white/10 flex flex-col gap-5 hover:border-white/20 transition-all ${
                      lead.status === 'new'
                        ? 'border-l-4 border-l-[#00E5A8]'
                        : lead.status === 'in_discussion'
                        ? 'border-l-4 border-l-[#53F3FF]'
                        : lead.status === 'booked'
                        ? 'border-l-4 border-l-[#7B61FF]'
                        : 'border-l-4 border-l-white/20'
                    }`}
                  >
                    {/* Lead Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#53F3FF]/15 to-[#00E5A8]/15 border border-white/10 flex items-center justify-center font-bold text-[#53F3FF] text-sm">
                          {initials}
                        </div>
                        <div>
                          <div className="font-['Syne'] font-bold text-white text-base">
                            {lead.name}
                          </div>
                          <div className="text-[11px] text-[#6D7482]">
                            {lead.formattedDate || new Date(lead.createdAt).toLocaleDateString()} · ID: {lead.id.slice(-6)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#00E5A8]/10 border border-[#00E5A8]/20 text-[#00E5A8] text-xs font-semibold">
                          ◈ {lead.service}
                        </span>
                        {lead.budget && (
                          <span className="px-3 py-1 rounded-full bg-[#7B61FF]/10 border border-[#7B61FF]/20 text-[#7B61FF] text-xs font-semibold">
                            💎 {lead.budget}
                          </span>
                        )}
                        {lead.timeline && (
                          <span className="px-3 py-1 rounded-full bg-[#53F3FF]/10 border border-[#53F3FF]/20 text-[#53F3FF] text-xs font-semibold">
                            ⏱ {lead.timeline}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Lead Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Contacts */}
                      <div className="lg:col-span-3 flex flex-col gap-2">
                        {lead.contact && (
                          <a
                            href={`tel:${lead.contact}`}
                            className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-[#AEB4C2] hover:text-white"
                          >
                            <span>📞</span>
                            <span className="truncate">{lead.contact}</span>
                          </a>
                        )}

                        {waLink && (
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2.5 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-xs text-[#25D366] hover:bg-[#25D366]/20 font-semibold"
                          >
                            <span>💬</span>
                            <span>WhatsApp Chat</span>
                          </a>
                        )}

                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}?subject=Creatophoria%20Studio%20x%20${encodeURIComponent(lead.name)}`}
                            className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-[#AEB4C2] hover:text-white"
                          >
                            <span>✉️</span>
                            <span className="truncate">{lead.email}</span>
                          </a>
                        )}
                      </div>

                      {/* Message Brief */}
                      <div className="lg:col-span-6 p-4 rounded-xl bg-black/40 border border-white/5 text-xs sm:text-sm text-[#D6DAE4] leading-relaxed">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-[#6D7482] mb-1.5">
                          Project Vision &amp; Brief
                        </div>
                        {lead.message || 'No project description provided.'}
                      </div>

                      {/* Admin Controls */}
                      <div className="lg:col-span-3 flex flex-col gap-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-[#6D7482] mb-1">
                            Status
                          </label>
                          <select
                            value={lead.status || 'new'}
                            onChange={e => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                            className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-[#00E5A8]"
                          >
                            <option value="new">🟢 New Inquiry</option>
                            <option value="contacted">💬 Contacted</option>
                            <option value="in_discussion">🔵 In Discussion</option>
                            <option value="booked">🟣 Booked / Active</option>
                            <option value="archived">⚪ Archived</option>
                          </select>
                        </div>

                        <textarea
                          defaultValue={lead.notes || ''}
                          onBlur={e => handleNotesChange(lead.id, e.target.value)}
                          placeholder="Studio notes (autosaves on blur)..."
                          rows={2}
                          className="w-full p-2 rounded-lg bg-white/[0.02] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00E5A8] resize-none"
                        />

                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="text-left text-xs text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 self-start"
                        >
                          <span>🗑</span>
                          <span>Delete Lead</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
