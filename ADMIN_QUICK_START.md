# K-IREA Admin Dashboard - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies

#### Admin Frontend (Next.js)
```bash
cd e:\yourhouse.ph\apps\admin
npm install
```

#### Backend API (FastAPI)
```bash
cd e:\yourhouse.ph\apps\api
pip install -r requirements_admin.txt
```

---

### Step 2: Start Development Servers

#### Terminal 1: Admin Frontend
```bash
cd e:\yourhouse.ph\apps\admin
npm run dev
# Admin Dashboard will be at: http://localhost:3001
```

#### Terminal 2: Backend API
```bash
cd e:\yourhouse.ph\apps\api
python main_updated.py
# API will be at: http://localhost:8000
# Health check: http://localhost:8000/health
```

#### Terminal 3: Original Landing Page (if needed)
```bash
cd e:\yourhouse.ph\apps\web
npm run dev
# Landing page: http://localhost:3000
```

---

### Step 3: Access Admin Dashboard

**URL:** http://localhost:3001

### Default Navigation
- 📊 **Dashboard** - Overview with metrics and charts
- 🏠 **Properties** - Manage listings
- 👥 **Leads** - Track lead pipeline
- 🤖 **Agents** - AI agent control (next)
- 👤 **Users** - User management (next)
- 📈 **Reports** - Analytics & reports (next)
- ⚙️ **Settings** - Configuration

---

## 📁 Project Structure

```
e:\yourhouse.ph\
├── apps/
│   ├── web/              (Landing Page - Existing)
│   │   └── npm run dev   (Port 3000)
│   │
│   ├── admin/            (Admin Dashboard - NEW)
│   │   └── npm run dev   (Port 3001)
│   │
│   └── api/              (Backend API)
│       └── python main_updated.py (Port 8000)
│
├── docs/
│   ├── ADMIN_MASTERPLAN.md
│   ├── ADMIN_PHASE1_STATUS.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── API_SPECIFICATION.md
│
└── shared/
    └── (Shared types & constants)
```

---

## 🔌 API Endpoints

### Health Check
```bash
GET http://localhost:8000/health
# Response: {"status": "healthy", "database": "connected"}
```

### Authentication
```bash
# Login (TODO: Implement)
POST http://localhost:8000/api/auth/login
{
  "email": "admin@yourhouse.ph",
  "password": "password"
}

# Get Current User
GET http://localhost:8000/api/auth/me
Headers: Authorization: Bearer <token>
```

### Properties
```bash
# List Properties
GET http://localhost:8000/api/properties?skip=0&limit=10

# Get Property Detail
GET http://localhost:8000/api/properties/{id}

# Create Property
POST http://localhost:8000/api/properties
# Body: property data

# Update Property
PUT http://localhost:8000/api/properties/{id}
# Body: updated property data

# Delete Property
DELETE http://localhost:8000/api/properties/{id}
```

### Leads
```bash
# List Leads
GET http://localhost:8000/api/leads?skip=0&limit=10

# Get Lead Detail
GET http://localhost:8000/api/leads/{id}

# Create Lead
POST http://localhost:8000/api/leads
# Body: lead data

# Update Lead
PUT http://localhost:8000/api/leads/{id}
# Body: lead updates

# Assign Lead to Agent
POST http://localhost:8000/api/leads/{id}/assign
# Body: { "agent_id": "..." }

# Get Lead Messages
GET http://localhost:8000/api/leads/{id}/messages

# Send Bulk Email
POST http://localhost:8000/api/leads/bulk/email
# Body: { "lead_ids": [...], "subject": "...", "body": "..." }
```

---

## 🛠️ Development

### Add New Admin Page

1. Create file: `apps/admin/app/{feature}/page.tsx`
2. Add to navigation in `app/layout.tsx`
3. Create components: `components/{feature}/`
4. Add API methods to `lib/api.ts`

### Add New API Endpoint

1. Create file: `apps/api/app/routes/{feature}.py`
2. Import in `main_updated.py`
3. Add to router: `app.include_router(router)`
4. Add API client method in `lib/api.ts`

### Database Changes

1. Update models in `app/models/database_models.py`
2. Run migration: `alembic upgrade head` (when alembic is setup)
3. Update API endpoints to use new tables

---

## 🔑 Environment Variables

### Admin Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=K-IREA Admin
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=dev-secret-key
```

### Backend API (.env)
```bash
DEBUG=True
DATABASE_URL=postgresql://postgres:password@localhost:5432/yourhouse_admin
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
```

---

## 📊 Dashboard Features

### Metrics Display
- Active Listings count
- Open Leads count
- Conversion Rate %
- Monthly Revenue
- Average Response Time

### Charts
- Lead Pipeline (funnel view)
- Conversion Trend (line chart)
- Property Performance (bar chart)
- Analytics (pie chart)

### Recent Activity Feed
- New leads
- Closed deals
- Agent updates
- System notifications

---

## 🔒 Security Features

- JWT Token-based authentication
- Refresh token rotation
- HTTPS ready (for production)
- CORS configured
- Password hashing (bcrypt)
- Audit logging (designed)

---

## 🚀 Next Steps

1. **Database Setup**
   - Install PostgreSQL locally or use Docker
   - Create `yourhouse_admin` database
   - Run migrations

2. **Authentication**
   - Implement login page UI
   - Connect to backend auth endpoints
   - Add session management

3. **Real Data Integration**
   - Replace mock data with API calls
   - Implement data fetching with React Query
   - Add loading and error states

4. **Additional Features**
   - User management UI
   - Agent control center
   - Reports builder
   - Integration hub

5. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests

6. **Deployment**
   - Docker setup
   - Deploy to Vercel (frontend)
   - Deploy to Railway/Fly.io (backend)

---

## 🐛 Troubleshooting

### Admin Frontend Won't Start
```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

### API Connection Error
```bash
# Check if API is running on port 8000
curl http://localhost:8000/health

# Check CORS configuration in main_updated.py
# Ensure http://localhost:3001 is in origins list
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
# Check DATABASE_URL in .env file
# Ensure database exists: yourhouse_admin
```

---

## 📚 Documentation

- [Admin Master Plan](./ADMIN_MASTERPLAN.md) - Full feature specification
- [Phase 1 Status](./ADMIN_PHASE1_STATUS.md) - Implementation progress
- [API Specification](./API_SPECIFICATION.md) - Detailed endpoint docs
- [Database Schema](./DATABASE_SCHEMA.md) - Table definitions

---

## 🎨 UI Components Available

- **MetricCard** - Display KPI with trend
- **ChartWidget** - Multi-type charts
- **Sidebar** - Navigation menu
- **Header** - Top bar with user menu
- **Tables** - Data display with sorting
- **Forms** - Input fields, selects, buttons
- **Modals** - Dialog boxes
- **Badges** - Status indicators
- **Toast** - Notifications

---

## 🔄 Running All Services Simultaneously

### Option 1: Multiple Terminal Windows
```bash
# Terminal 1
cd apps/admin && npm run dev          # Port 3001

# Terminal 2
cd apps/api && python main_updated.py # Port 8000

# Terminal 3 (optional)
cd apps/web && npm run dev            # Port 3000
```

### Option 2: concurrently (if using npm scripts)
```bash
# Add to root package.json
"dev": "concurrently \"npm run dev:admin\" \"npm run dev:api\" \"npm run dev:web\""

npm run dev
```

---

**Ready to build!** 🚀

For questions, refer to the comprehensive Master Plan or check the status report.

---

Generated: April 17, 2026
Version: 1.0 - Initial Setup
