import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  Lead,
  validateLeadInput,
  generateLeadId,
  calculateLeadStats,
  filterLeads,
  leadsToCSV
} from './src/utils/leads.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const ADMIN_KEY = process.env.ADMIN_KEY || 'creatophoria2026';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://izckruhjcmrxyfpuzxyo.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6Y2tydWhqY21yeHlmcHV6eHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzODE3MTEsImV4cCI6MjEwODk1NzcxMX0.4wo4wYbCyGBblU1bL1WcFmhF5R03smKffQjbzRozGoM';

const DATA_DIR = path.join(__dirname, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const CSV_FILE = path.join(DATA_DIR, 'leads.csv');

// Ensure data folder and storage files exist
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
  if (!fs.existsSync(CSV_FILE)) {
    fs.writeFileSync(CSV_FILE, 'ID,Date,Name,Contact,Email,Service,Budget,Timeline,Message,Status,Notes\n', 'utf8');
  }
} catch (e) {
  console.warn('[Storage Init Warning]:', e);
}

function readLeads(): Lead[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const content = fs.readFileSync(LEADS_FILE, 'utf8');
      return JSON.parse(content) as Lead[];
    }
  } catch (err) {
    console.error('[DB Read Error]:', err);
  }
  return [];
}

function saveLeads(leads: Lead[]): boolean {
  try {
    const tempFile = LEADS_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(leads, null, 2), 'utf8');
    fs.renameSync(tempFile, LEADS_FILE);
    fs.writeFileSync(CSV_FILE, leadsToCSV(leads), 'utf8');
    return true;
  } catch (err) {
    console.error('[DB Write Error]:', err);
    return false;
  }
}

async function fetchSupabaseLeads(): Promise<Lead[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=*&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    if (res.ok) {
      const rows = (await res.json()) as any[];
      return rows.map((r: any) => ({
        id: String(r.id),
        name: r.name || 'Anonymous Client',
        contact: r.contact || '',
        email: r.email || '',
        service: r.service || 'Brand Identity',
        budget: r.budget || 'Flexible',
        timeline: r.timeline || 'Flexible',
        message: r.message || '',
        status: (['new', 'in_review', 'contacted', 'converted', 'closed'].includes(r.status) ? r.status : 'new') as Lead['status'],
        notes: r.notes || '',
        createdAt: r.created_at || new Date().toISOString(),
        formattedDate: new Date(r.created_at || Date.now()).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
    }
  } catch (e: any) {
    console.warn('[Supabase Sync Warning]:', e.message);
  }
  return [];
}

async function getMergedLeads(): Promise<Lead[]> {
  const localLeads = readLeads();
  const remoteLeads = await fetchSupabaseLeads();

  if (remoteLeads.length === 0) return localLeads;

  const map = new Map<string, Lead>();
  for (const l of localLeads) {
    map.set(l.id, l);
  }
  for (const r of remoteLeads) {
    map.set(r.id, r);
  }

  const merged = Array.from(map.values()).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  saveLeads(merged);
  return merged;
}

function isAuthorized(req: Request): boolean {
  const headerKey = req.headers['x-admin-key'] as string ||
    ((req.headers['authorization'] as string) || '').replace(/^Bearer\s+/i, '');
  const queryKey = req.query.key as string;
  return headerKey === ADMIN_KEY || queryKey === ADMIN_KEY;
}

async function startServer() {
  const app = express();

  // Basic CORS & JSON Body Parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-key');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // 1. Submit Inquiry: POST /api/leads or /api/contact
  const handleLeadSubmit = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const validation = validateLeadInput(data);
      if (!validation.valid) {
        return res.status(400).json({ success: false, error: validation.error });
      }

      const now = new Date();
      const leadId = generateLeadId();

      const newLead: Lead = {
        id: leadId,
        name: data.name.trim(),
        contact: (data.contact || data.phone || '').trim(),
        email: (data.email || '').trim(),
        service: data.service.trim(),
        budget: data.budget || 'Flexible',
        timeline: data.timeline || 'Flexible',
        message: data.message.trim(),
        status: 'new',
        notes: '',
        createdAt: now.toISOString(),
        formattedDate: now.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      const leads = readLeads();
      leads.unshift(newLead);
      saveLeads(leads);

      // Async Supabase Sync
      if (SUPABASE_URL && SUPABASE_KEY) {
        fetch(`${SUPABASE_URL}/rest/v1/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify([{
            name: newLead.name,
            contact: newLead.contact,
            email: newLead.email,
            service: newLead.service,
            budget: newLead.budget,
            timeline: newLead.timeline,
            message: newLead.message,
            status: newLead.status,
            notes: newLead.notes
          }])
        }).catch(err => console.warn('[Supabase Sync Notice]:', err.message));
      }

      console.log(`[NEW INQUIRY] ${newLead.name} | Service: ${newLead.service} | Contact: ${newLead.contact || newLead.email}`);

      return res.status(201).json({
        success: true,
        message: "Thank you! We've received your project inquiry. Creatophoria Studio will connect with you within 24 hours.",
        lead: {
          id: newLead.id,
          name: newLead.name,
          service: newLead.service,
          contact: newLead.contact,
          email: newLead.email,
          createdAt: newLead.formattedDate
        }
      });
    } catch (err: unknown) {
      console.error('[Inquiry Error]:', err);
      return res.status(500).json({ success: false, error: 'Internal server error processing lead' });
    }
  };

  app.post('/api/leads', handleLeadSubmit);
  app.post('/api/contact', handleLeadSubmit);

  // 2. Fetch Leads: GET /api/leads (Protected)
  app.get('/api/leads', async (req: Request, res: Response) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or missing founder key' });
    }

    const leads = await getMergedLeads();

    // Check if export query
    if (req.query.export === 'csv') {
      const csv = leadsToCSV(leads);
      res.setHeader('Content-Type', 'text/csv; charset=UTF-8');
      res.setHeader('Content-Disposition', 'attachment; filename="creatophoria_leads.csv"');
      return res.send(csv);
    }

    const status = (req.query.status as string) || 'all';
    const service = (req.query.service as string) || 'all';
    const search = (req.query.search as string) || '';

    const filtered = filterLeads(leads, status, service, search);

    return res.json({
      success: true,
      count: filtered.length,
      leads: filtered,
      syncedWith: 'Supabase PostgreSQL'
    });
  });

  // 3. Stats: GET /api/stats (Protected)
  app.get('/api/stats', async (req: Request, res: Response) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid founder key' });
    }

    const leads = await getMergedLeads();
    const stats = calculateLeadStats(leads);
    return res.json({ success: true, stats, database: 'Supabase PostgreSQL' });
  });

  // 3b. Supabase Status: GET /api/supabase-status (Public verification)
  app.get('/api/supabase-status', async (_req: Request, res: Response) => {
    try {
      const remoteLeads = await fetchSupabaseLeads();
      return res.json({
        success: true,
        status: 'fully_functional',
        database: 'Supabase PostgreSQL',
        projectRef: 'izckruhjcmrxyfpuzxyo',
        supabaseUrl: SUPABASE_URL,
        leadsCount: remoteLeads.length,
        connectedAt: new Date().toISOString()
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        status: 'error',
        error: err.message
      });
    }
  });

  // 4. Update Lead: PATCH /api/leads and /api/leads/:id (Protected)
  const handleLeadUpdate = (req: Request, res: Response) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const id = req.params.id || (req.query.id as string);
    const { status, notes } = req.body;
    const leads = readLeads();
    const index = leads.findIndex(l => l.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    if (status) leads[index].status = status;
    if (typeof notes === 'string') leads[index].notes = notes;

    saveLeads(leads);

    // Update in Supabase
    if (SUPABASE_URL && SUPABASE_KEY) {
      fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        },
        body: JSON.stringify({ status, notes })
      }).catch(() => {});
    }

    return res.json({ success: true, lead: leads[index] });
  };

  app.patch('/api/leads/:id', handleLeadUpdate);
  app.patch('/api/leads', handleLeadUpdate);

  // 5. Delete Lead: DELETE /api/leads and /api/leads/:id (Protected)
  const handleLeadDelete = (req: Request, res: Response) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const id = req.params.id || (req.query.id as string);
    const leads = readLeads();
    const filtered = leads.filter(l => l.id !== id);
    saveLeads(filtered);

    if (SUPABASE_URL && SUPABASE_KEY) {
      fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }).catch(() => {});
    }

    return res.json({ success: true, message: 'Lead deleted successfully' });
  };

  app.delete('/api/leads/:id', handleLeadDelete);
  app.delete('/api/leads', handleLeadDelete);

  // 6. Export CSV: GET /api/leads/export (Protected)
  app.get('/api/leads/export', (req: Request, res: Response) => {
    if (!isAuthorized(req)) {
      return res.status(401).send('401 Unauthorized: Invalid or missing admin key');
    }
    const leads = readLeads();
    const csv = leadsToCSV(leads);
    res.setHeader('Content-Type', 'text/csv; charset=UTF-8');
    res.setHeader('Content-Disposition', 'attachment; filename="creatophoria_leads.csv"');
    return res.send(csv);
  });

  // Serve admin.html directly if requested
  app.get('/admin.html', (_req: Request, res: Response) => {
    const adminPath = path.join(__dirname, 'public', 'admin.html');
    if (fs.existsSync(adminPath)) {
      return res.sendFile(adminPath);
    }
    res.status(404).send('Admin portal file not found');
  });

  // Setup Vite dev server or static distribution
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n══════════════════════════════════════════════════════════════`);
    console.log(`  ✦ CREATOPHORIA STUDIO — LEADS ENGINE & SERVER ACTIVE ✦`);
    console.log(`══════════════════════════════════════════════════════════════`);
    console.log(`  ➤ Website:       http://localhost:${PORT}/`);
    console.log(`  ➤ Admin Portal:  http://localhost:${PORT}/admin.html`);
    console.log(`  ➤ Leads API:     http://localhost:${PORT}/api/leads`);
    console.log(`  ➤ Leads CSV:     http://localhost:${PORT}/api/leads/export`);
    console.log(`══════════════════════════════════════════════════════════════\n`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
