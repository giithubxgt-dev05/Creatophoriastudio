export interface Lead {
  id: string;
  name: string;
  contact: string;
  email: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  status: 'new' | 'contacted' | 'in_discussion' | 'booked' | 'archived';
  notes?: string;
  createdAt: string;
  formattedDate?: string;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  inDiscussion: number;
  booked: number;
  topService: string;
  services: Record<string, number>;
}

export function validateLeadInput(input: Partial<Lead>): { valid: boolean; error?: string } {
  if (!input.name || !input.name.trim()) {
    return { valid: false, error: 'Name is required' };
  }
  const hasContact = input.contact && input.contact.trim();
  const hasEmail = input.email && input.email.trim();
  if (!hasContact && !hasEmail) {
    return { valid: false, error: 'At least one contact method (phone/WhatsApp or email) is required' };
  }
  if (!input.service || !input.service.trim()) {
    return { valid: false, error: 'Service required must be selected' };
  }
  if (!input.message || !input.message.trim()) {
    return { valid: false, error: 'Project vision / brief is required' };
  }
  return { valid: true };
}

export function generateLeadId(): string {
  return 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
}

export function escapeCSV(str: unknown): string {
  if (str === null || str === undefined) return '""';
  const clean = String(str).replace(/"/g, '""').replace(/[\r\n]+/g, ' ');
  return `"${clean}"`;
}

export function leadsToCSV(leads: Lead[]): string {
  const headers = 'ID,Date,Name,Contact,Email,Service,Budget,Timeline,Message,Status,Notes\n';
  const rows = leads.map(l => [
    escapeCSV(l.id),
    escapeCSV(l.createdAt || ''),
    escapeCSV(l.name || ''),
    escapeCSV(l.contact || ''),
    escapeCSV(l.email || ''),
    escapeCSV(l.service || ''),
    escapeCSV(l.budget || ''),
    escapeCSV(l.timeline || ''),
    escapeCSV(l.message || ''),
    escapeCSV(l.status || 'new'),
    escapeCSV(l.notes || '')
  ].join(',')).join('\n');
  return headers + rows;
}

export function filterLeads(
  leads: Lead[],
  status: string = 'all',
  service: string = 'all',
  searchQuery: string = ''
): Lead[] {
  let result = leads;

  if (status && status !== 'all') {
    result = result.filter(l => (l.status || 'new').toLowerCase() === status.toLowerCase());
  }

  if (service && service !== 'all') {
    result = result.filter(l => (l.service || '').toLowerCase() === service.toLowerCase());
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(l =>
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.contact && l.contact.toLowerCase().includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.service && l.service.toLowerCase().includes(q)) ||
      (l.message && l.message.toLowerCase().includes(q)) ||
      (l.notes && l.notes.toLowerCase().includes(q))
    );
  }

  return result;
}

export function calculateLeadStats(leads: Lead[]): LeadStats {
  const stats: LeadStats = {
    total: leads.length,
    new: leads.filter(l => (l.status || 'new') === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    inDiscussion: leads.filter(l => l.status === 'in_discussion').length,
    booked: leads.filter(l => l.status === 'booked').length,
    topService: 'None yet',
    services: {}
  };

  leads.forEach(l => {
    const s = l.service || 'Other';
    stats.services[s] = (stats.services[s] || 0) + 1;
  });

  let top = 'None yet';
  let max = 0;
  for (const s in stats.services) {
    if (stats.services[s] > max) {
      max = stats.services[s];
      top = s;
    }
  }
  stats.topService = top;

  return stats;
}
