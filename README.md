# LeadFlow — AI-Powered CSV Importer

> Intelligently maps any CSV format into GrowEasy CRM fields using AI

**Live Demo:** https://leadflow.mayankcodes.dev  
**GitHub:** https://github.com/mayankcodes-dev/LeadFlow

---

## What is LeadFlow?

LeadFlow is a full-stack AI-powered CSV importer built for GrowEasy. It accepts CSV files from any source — Facebook Lead Exports, Google Ads, Excel sheets, Real Estate CRMs, or manual spreadsheets — and intelligently extracts and maps them to GrowEasy CRM format using Google Gemini AI.

---

## Features

- 📂 **Drag & Drop or File Picker** upload
- 👁️ **CSV Preview Table** with sticky headers, horizontal & vertical scroll
- 🤖 **AI Field Extraction** via Google Gemini (batched processing)
- 📊 **Real-time Progress Bar** during AI processing
- ✅ **Results Table** with imported/skipped counts
- 🔄 **Retry Mechanism** with exponential backoff for failed AI batches
- 🌙 **Dark Mode** support
- 📱 **Fully Responsive** design

---

## Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | Next.js 14, TypeScript, Tailwind CSS |
| Backend    | Node.js, Express, TypeScript  |
| AI         | Google Gemini (gemini-1.5-flash) |
| Deployment | Vercel (frontend), Railway (backend) |

---

## Project Structure

```
leadflow/
├── frontend/          # Next.js 14 App
├── backend/           # Express API
├── docker-compose.yml # Docker setup
└── README.md
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- npm
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/mayankcodes-dev/LeadFlow.git
cd LeadFlow
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm run dev
```

Backend runs on `http://localhost:3001`

### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local if backend URL differs
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## Docker Setup

```bash
# From root directory
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

---

## Environment Variables

### Backend (`backend/.env`)
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## API Reference

### `POST /api/import`

Upload a CSV file for AI-powered CRM extraction.

**Request:** `multipart/form-data`
- `file` — the CSV file

**Response:**
```json
{
  "success": true,
  "data": {
    "imported": [
      {
        "created_at": "2026-05-13 14:20:48",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "country_code": "+91",
        "mobile_without_country_code": "9876543210",
        "company": "GrowEasy",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "lead_owner": "test@gmail.com",
        "crm_status": "GOOD_LEAD_FOLLOW_UP",
        "crm_note": "Client is asking to reschedule demo",
        "data_source": "",
        "possession_time": "",
        "description": ""
      }
    ],
    "skipped": [],
    "totalImported": 4,
    "totalSkipped": 0
  }
}
```

---

## CRM Fields Extracted

| Field | Description |
|-------|-------------|
| `created_at` | Lead creation date |
| `name` | Lead name |
| `email` | Primary email |
| `country_code` | Country code (e.g. +91) |
| `mobile_without_country_code` | Mobile number |
| `company` | Company name |
| `city` | City |
| `state` | State |
| `country` | Country |
| `lead_owner` | Lead owner |
| `crm_status` | One of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE |
| `crm_note` | Notes, remarks, extra emails/phones |
| `data_source` | One of: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots |
| `possession_time` | Property possession time |
| `description` | Additional description |

---

## Submission

- **Position:** Software Developer Intern
- **Submitted to:** varun@groweasy.ai
- **Deadline:** 12 July 2026
