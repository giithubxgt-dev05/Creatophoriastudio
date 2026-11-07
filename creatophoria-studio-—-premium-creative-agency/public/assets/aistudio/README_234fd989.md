# ✦ Creatophoria Studio — Full-Stack Leads Engine & Backend

A world-class, ultra-fast client inquiry and lead management backend for **Creatophoria Studio**.

---

## ⚡ Quick Start

### Option 1: Double-Click Launcher (Windows)
Double-click `start-server.bat` in the project folder. It will start the backend server and open the website in your browser!

### Option 2: Terminal / VS Code
```bash
# Start server
node server.js

# Or using npm
npm start
```

Once running:
- **Client Website:** [http://localhost:3000/](http://localhost:3000/)
- **Leads Admin Dashboard:** [http://localhost:3000/admin.html](http://localhost:3000/admin.html)
- **Leads REST API:** [http://localhost:3000/api/leads](http://localhost:3000/api/leads)
- **Export CSV File:** [http://localhost:3000/api/leads/export](http://localhost:3000/api/leads/export)

---

## 📊 Data Collected from Clients

The backend is specifically engineered to collect high-intent inquiry data from prospective clients:

| Field | Description | Required |
|---|---|---|
| `name` | Client / Brand Name | **Yes** |
| `contact` | Phone / WhatsApp Number | **Yes** |
| `email` | Client Email Address | **Yes** |
| `service` | Creative Service Required *(Graphic Design, Video Editing, Motion Graphics, Brand Identity, UI/UX, Social Media, etc.)* | **Yes** |
| `message` | Project Vision & Detailed Brief | **Yes** |
| `budget` | Estimated Budget Tier | Optional |
| `timeline` | Project Urgency / Delivery Deadline | Optional |
| `createdAt` | Submission Timestamp & Formatted Date | Auto |
| `status` | Lead Status (`new`, `contacted`, `in_discussion`, `booked`, `archived`) | Auto |

---

## 🛰️ REST API Reference

### 1. Submit New Client Inquiry
- **Endpoint:** `POST /api/leads` (or `POST /api/contact`)
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "name": "Alex Rivera",
  "contact": "+91 98765 43210",
  "email": "alex@riveramedia.com",
  "service": "Brand Identity",
  "budget": "₹75,000 - ₹1,50,000 ($1,000 - $2,000)",
  "timeline": "Within 2-3 weeks",
  "message": "We need a complete luxury rebrand and 3D motion graphics for our launch."
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Thank you! We've received your project inquiry...",
  "lead": {
    "id": "lead_1729123456789_a1b2",
    "name": "Alex Rivera",
    "service": "Brand Identity",
    "contact": "+91 98765 43210",
    "email": "alex@riveramedia.com",
    "createdAt": "28 Oct 2026, 12:35 AM"
  }
}
```

### 2. Fetch Leads (Admin)
- **Endpoint:** `GET /api/leads`
- **Query Filters:**
  - `?status=new` (or `contacted`, `in_discussion`, `booked`, `archived`)
  - `?service=Motion Graphics`
  - `?search=Alex`

### 3. Update Lead Status & Notes
- **Endpoint:** `PATCH /api/leads/:id`
- **Body:**
```json
{
  "status": "in_discussion",
  "notes": "Discussed deliverables on WhatsApp call. Proposal due Friday."
}
```

### 4. Delete Lead
- **Endpoint:** `DELETE /api/leads/:id`

### 5. Export to Excel / CSV
- **Endpoint:** `GET /api/leads/export`
- Triggers automatic file download: `creatophoria_leads.csv`

---

## 💎 Features & Architecture

1. **Zero-Dependency Native Architecture:** Runs out-of-the-box using native Node.js HTTP and FS modules. No heavy external dependencies required to start.
2. **Dual-Layer Persistence:**
   - `data/leads.json`: Atomic writes prevent file corruption during sudden restarts.
   - `data/leads.csv`: Real-time spreadsheet backup ready for Excel / Google Sheets import.
3. **Offline Buffer Protection:** If the frontend is previewed statically without the server running, `app.js` saves the lead to `localStorage` and provides a direct WhatsApp connection button so no lead is ever lost.
4. **Interactive Studio Admin Dashboard (`admin.html`):**
   - Live metrics (Total Inquiries, New/Action Required, In Discussion, Top Service)
   - One-click WhatsApp Direct Chat (`https://wa.me/...`)
   - One-click Phone Call (`tel:...`)
   - One-click Email (`mailto:...`)
   - Instant status toggle and auto-saving internal studio notes
   - Instant search and service filtering
   - Instant CSV export
