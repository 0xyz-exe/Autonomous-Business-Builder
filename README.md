# 🤖 Autonomous Business Builder

> Transform a business idea into a complete business package in minutes using 5 specialized AI agents.

![Tech Stack](https://img.shields.io/badge/Next.js-16-black?style=flat-square) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square)

**Status: MVP complete** — 5 agents, full UI, mock mode, SQLite local dev, Docker for production.

---

## 🎯 What It Does

Submit a business idea and watch 5 AI agents work in sequence to produce:

| Output | Agent |
|---|---|
| Market analysis, competitors, customer personas, SWOT | 📊 Market Research Agent |
| Brand name, tagline, colors, positioning | ✨ Branding Agent |
| Website copy, social media posts, email templates | ✍️ Content Agent |
| Pricing tiers, sales funnel, acquisition channels | 📈 Sales Agent |
| KPIs, 90-day roadmap, growth recommendations | 🚀 Analytics Agent |

---

## 🏗️ Project Structure

```
Autonomous-Business-Builder/
├── frontend/          # Next.js 16 + TypeScript + Tailwind CSS
├── backend/           # FastAPI + SQLAlchemy + OpenAI + agent validation
├── scripts/           # start-dev.ps1 (Windows one-command dev)
├── docker-compose.yml # Postgres + API + UI
└── .cursor/rules/     # Cursor Agent project rules (token-efficient prompts)
```

---

## 🚀 Quick Start

### Option A — Windows script (fastest, no Docker)

```powershell
cd Autonomous-Business-Builder
.\scripts\start-dev.ps1
```

Uses **SQLite** + **mock AI** by default. Open http://localhost:3000

---

### Option B — Docker Compose (PostgreSQL)

**Prerequisites:** Docker + Docker Compose installed.

```bash
# 1. Clone and enter the project
cd Autonomous-Business-Builder

# 2. (Optional) Set your OpenAI API key — leave as "mock" to use demo data
echo "OPENAI_API_KEY=your-key-here" > .env
echo "OPENAI_MODEL=gpt-4o-mini" >> .env

# 3. Start everything
docker-compose up --build

# 4. Open the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

### Option C — Local Development (manual)

#### Backend Setup

**Prerequisites:** Python 3.12+ (PostgreSQL optional — SQLite works out of the box)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env and set your DATABASE_URL and OPENAI_API_KEY

# Start the API
uvicorn app.main:app --reload --port 8000
```

> **Mock Mode:** Set `OPENAI_API_KEY=mock` in `.env` to use realistic demo data without any API costs.

#### Frontend Setup

**Prerequisites:** Node.js 18+

```bash
cd frontend

# Install dependencies
npm install

# Configure environment (already set for local)
# .env.local already contains: NEXT_PUBLIC_API_URL=http://localhost:8000

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `sqlite+aiosqlite:///./business_builder.db` | SQLite (local) or PostgreSQL URL for Docker |
| `OPENAI_API_KEY` | `mock` | OpenAI API key — set to `mock` for demo mode |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model to use |
| `APP_ENV` | `development` | App environment |
| `FRONTEND_URL` | `http://localhost:3000` | Frontend URL (for CORS) |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL |

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check + API info |
| `POST` | `/projects` | Create project & start agent pipeline |
| `GET` | `/projects` | List all projects |
| `GET` | `/projects/:id` | Get project + all results |
| `GET` | `/results/:project_id` | Get all agent results |
| `POST` | `/agents/run` | Run a single agent on demand |

Full interactive docs: **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## 🤖 Agent Pipeline

```
User submits form
     │
     ▼
POST /projects   ──► DB record created (status: pending)
     │
     ▼
Background task starts
     │
     ├─► [1] MarketResearchAgent  → saves result
     ├─► [2] BrandingAgent        → uses market result as context
     ├─► [3] ContentAgent         → uses brand name/UVP as context
     ├─► [4] SalesAgent           → uses brand + UVP as context
     └─► [5] AnalyticsAgent       → uses revenue projections as context
                                      │
                                      ▼
                              project status → "completed"

Frontend polls GET /projects/:id every 3 seconds
```

---

## 🎨 Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero, agent showcase, CTA |
| New Business | `/new-business` | 4-field intake form |
| Projects | `/projects` | List past projects, resume results |
| Results Dashboard | `/results/:id` | Landing preview, pipeline, export JSON |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Backend | FastAPI, SQLAlchemy (async), Pydantic output validation |
| Database | PostgreSQL 16 with JSONB for agent outputs |
| AI | OpenAI API (gpt-4o-mini by default) |
| Infrastructure | Docker Compose |

---

## 🧪 Mock Mode

When `OPENAI_API_KEY=mock`, all agents return rich, realistic structured data without any API calls. This lets you:
- Demo the full workflow instantly
- Develop the UI without API costs
- Test the pipeline end-to-end

---

## 📦 Data Models

```sql
-- business_projects
id            UUID PRIMARY KEY
business_idea TEXT
target_market VARCHAR(255)
country       VARCHAR(100)
budget        VARCHAR(100)
status        ENUM(pending, running, completed, failed)
created_at    TIMESTAMPTZ

-- agent_results
id            UUID PRIMARY KEY
project_id    UUID REFERENCES business_projects(id)
agent_name    ENUM(market, branding, content, sales, analytics)
result_json   JSONB
created_at    TIMESTAMPTZ
```

---

## 📄 License

MIT — build, fork, and ship freely.
