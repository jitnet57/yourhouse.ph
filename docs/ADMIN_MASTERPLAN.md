# K-IREA Admin Dashboard - Master Plan
## 부동산 에이전트 관리 플랫폼 (Real Estate Agent Management Platform)

**Project:** K-IREA Admin Dashboard  
**Date Created:** April 17, 2026  
**Status:** Planning Phase  
**Target Launch:** 1 week from start  

---

## 📋 Executive Summary

### Vision
Build a **comprehensive admin dashboard** enabling real estate agents, managers, and admins to:
- Manage property listings with AI verification
- Track leads and conversion pipeline
- Monitor AI agent performance
- Control multi-channel messaging (SMS/WhatsApp/Voice)
- Analyze ROI and market trends
- Manage users and permissions
- Configure automated workflows

### Target Users
1. **Admin Users** - Full platform control, system configuration
2. **Agents** - Manage their listings and leads
3. **Managers** - Team oversight, performance metrics
4. **API Consumers** - Integration endpoints

### Success Metrics
- **Development Speed:** < 1 week
- **Feature Completeness:** 100% admin requirements
- **Performance:** <300ms response time on all dashboards
- **Accessibility:** WCAG AA compliant
- **Security:** Role-based access control + JWT auth

---

## 🎯 Phase Overview

### Phase 1: Foundation & Auth (2 days)
- Backend API setup (FastAPI)
- Database schema design
- Authentication & authorization system
- Admin user management

### Phase 2: Core Dashboards (2 days)
- Property management interface
- Lead pipeline dashboard
- Analytics & metrics views
- User role management

### Phase 3: AI Agent Controls (1.5 days)
- Agent configuration interface
- Performance monitoring
- Message history viewer
- Workflow automation setup

### Phase 4: Advanced Features (1 day)
- Bulk operations (import/export)
- Report generation
- API documentation
- Integration management

### Phase 5: Deployment & Optimization (0.5 days)
- Production build & testing
- Performance optimization
- Security audit
- Go-live preparation

**Total Duration:** 7 days (expedited)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│            Admin Dashboard (React/Next.js)          │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐            │
│  │Dashboard│ │Properties│ │  Leads   │            │
│  └────┬────┘ └────┬─────┘ └────┬─────┘            │
│       │            │            │                  │
└───────┼────────────┼────────────┼──────────────────┘
        │            │            │
        └────────────┴────────────┘
              ▼
    ┌──────────────────────┐
    │   Flask/FastAPI      │
    │   Backend API        │
    │  ┌────┐ ┌────┐      │
    │  │Auth│ │CMS │      │
    │  └────┘ └────┘      │
    └──────────┬───────────┘
               ▼
    ┌──────────────────────┐
    │   PostgreSQL DB      │
    │   (via Supabase)     │
    │  ┌─────────────────┐ │
    │  │ Properties      │ │
    │  │ Leads           │ │
    │  │ Users           │ │
    │  │ Messages        │ │
    │  │ Analytics       │ │
    │  └─────────────────┘ │
    └──────────────────────┘
```

### tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js | 15.5+ |
| **UI Framework** | React | 18.2+ |
| **Styling** | Tailwind CSS | 3.4+ |
| **State** | TanStack Query | Latest |
| **Auth** | NextAuth.js | Latest |
| **Backend** | FastAPI | Latest |
| **Database** | PostgreSQL | 15+ |
| **API Client** | Axios | Latest |
| **Charts** | Recharts | Latest |
| **Tables** | TanStack React Table | Latest |
| **Forms** | React Hook Form | Latest |
| **Validation** | Zod | Latest |

---

## 📊 Core Features

### 1. Dashboard & Analytics
```
Main Dashboard
├── Key Metrics (Cards)
│   ├── Active Listings
│   ├── Open Leads
│   ├── Conversion Rate %
│   ├── Revenue This Month
│   └── AI Response Time
├── Charts & Graphs
│   ├── Lead Pipeline (funnel)
│   ├── Conversion Trend (line)
│   ├── Top Properties (bar)
│   └── Agent Performance (pie)
└── Recent Activity Feed
    ├── New leads
    ├── Closed deals
    └── Agent updates
```

### 2. Property Management
```
Properties List
├── Table View
│   ├── Address
│   ├── Price
│   ├── Status (Active/Sold/Draft)
│   ├── AI Verification Score
│   ├── Views/Inquiries
│   └── Posted Date
├── Filters
│   ├── Status
│   ├── Price Range
│   ├── Location
│   ├── Agent
│   └── Verification Score
├── Bulk Actions
│   ├── Archive Listed
│   ├── Update Status
│   ├── Assign Agent
│   └── Export Data
└── Detail View
    ├── Full property info
    ├── Images gallery
    ├── AI analysis report
    ├── Historical data
    └── Inquiry log
```

### 3. Lead Management
```
Leads Pipeline
├── Kanban View
│   ├── New (1 day old)
│   ├── Contacted (Follow-up needed)
│   ├── Interested (Showing scheduled)
│   ├── Negotiating (Offer made)
│   └── Closed (Deal signed)
├── List View (with filters)
├── Lead Details Card
│   ├── Contact info
│   ├── Interaction history
│   ├── Property preferences
│   ├── AI chatbot transcript
│   └── Next action reminder
├── Bulk Actions
│   ├── Send Email/SMS
│   ├── Assign Agent
│   ├── Change Status
│   └── Schedule Follow-up
└── Analytics
    ├── Conversion rate by agent
    ├── Average response time
    ├── Lead source breakdown
    └── Closing rate trends
```

### 4. AI Agent Control Center
```
AI Agents Dashboard
├── Agent Status (Active/Inactive)
├── Configuration
│   ├── Greeting message
│   ├── Response style (formal/casual)
│   ├── Available hours
│   ├── Fallback handling
│   └── Knowledge base settings
├── Performance Metrics
│   ├── Total conversations
│   ├── Average resolution time
│   ├── Customer satisfaction
│   ├── Error rate
│   └── Knowledge base accuracy
├── Message Management
│   ├── View conversation history
│   ├── Change channel (SMS/WhatsApp/Voice)
│   ├── Override with human agent
│   └── Export transcripts
└── Testing & Training
    ├── Test conversation
    ├── Feedback loop
    ├── Model updates
    └── Knowledge injection
```

### 5. User & Permission Management
```
Users Management
├── User List
│   ├── Name
│   ├── Email
│   ├── Role (Admin/Manager/Agent/Viewer)
│   ├── Status (Active/Inactive)
│   ├── Last Login
│   └── Actions (Edit/Deactivate)
├── Add/Edit User
│   ├── Basic Info (name, email)
│   ├── Role Assignment
│   ├── Permissions Matrix
│   ├── Team Assignment
│   └── Commission Settings
├── Role Management
│   ├── Predefined Roles
│   │   ├── Admin - Full access
│   │   ├── Manager - Team oversight
│   │   ├── Agent - Own listings/leads
│   │   └── Viewer - Read-only
│   └── Custom Roles
│       ├── Permission builder
│       └── Template save
└── Activity Log
    ├── Login/logout history
    ├── Data access logs
    ├── Changes made
    └── Export audit trail
```

### 6. Reports & Export
```
Reports Module
├── Pre-built Reports
│   ├── Monthly performance
│   ├── Agent comparison
│   ├── Market analysis
│   ├── Lead source ROI
│   └── Property performance
├── Custom Reports
│   ├── Report builder
│   ├── Metrics selector
│   ├── Date range
│   └── Filter options
├── Export Formats
│   ├── PDF (formatted)
│   ├── Excel (pivot-ready)
│   ├── CSV (raw data)
│   └── Email delivery
└── Scheduling
    ├── Weekly/monthly generation
    ├── Auto-email recipients
    └── Archive & history
```

### 7. Integrations Hub
```
Third-party Integrations
├── Twilio (SMS/WhatsApp)
│   ├── Account status
│   ├── Message usage
│   └── Configuration
├── ElevenLabs (Voice)
│   ├── Voice selection
│   ├── Quality settings
│   └── Usage metrics
├── Cal.com (Calendars)
│   ├── Connected agents
│   ├── Sync status
│   └── Availability rules
├── Supabase (Database)
│   ├── Connection status
│   ├── Backup settings
│   └── Data usage
└── Custom APIs
    ├── API keys management
    ├── Webhook configuration
    └── Rate limiting
```

---

## 🗄️ Database Schema

### Users Table
```sql
users
├── id (UUID)
├── email (unique)
├── password_hash
├── name
├── role (enum: admin, manager, agent, viewer)
├── avatar_url
├── phone
├── is_active
├── created_at
├── updated_at
└── last_login
```

### Properties Table
```sql
properties
├── id (UUID)
├── title
├── description
├── address
├── city
├── price
├── property_type (enum)
├── status (active, sold, draft)
├── owner_id (foreign key → users)
├── agent_id (foreign key → users)
├── ai_verification_score (0-100)
├── images_array
├── views_count
├── inquiries_count
├── created_at
├── updated_at
└── verified_at
```

### Leads Table
```sql
leads
├── id (UUID)
├── name
├── email
├── phone
├── property_id (foreign key)
├── status (new, contacted, interested, negotiating, closed)
├── source (organic, ai_chatbot, referral, api)
├── assigned_agent_id (foreign key)
├── interaction_count
├── last_interaction_at
├── ai_transcript
├── notes
├── created_at
├── updated_at
└── closed_at
```

### Messages Table
```sql
messages
├── id (UUID)
├── lead_id (foreign key)
├── channel (sms, whatsapp, voice, email)
├── sender_type (user, ai_agent, system)
├── content
├── metadata (duration for voice, etc)
├── created_at
└── delivery_status
```

### Analytics Table
```sql
analytics_events
├── id (UUID)
├── event_type (property_view, lead_inquiry, conversion, etc)
├── user_id (foreign key, nullable)
├── property_id (foreign key, nullable)
├── lead_id (foreign key, nullable)
├── metadata (json)
├── timestamp
└── source (app, api, web)
```

---

## 🔐 Security & Authentication

### Authentication Flow
```
User → Login Page
    ↓
Email + Password → Backend /auth/login
    ↓
JWT Token Generated (access + refresh)
    ↓
Store in Secure HttpOnly Cookie
    ↓
Include in Authorization Header
    ↓
Backend Validates JWT + Role/Permissions
    ↓
Grant/Deny Access
```

### Authorization Levels
```
Admin
├── All dashboard access
├── User management
├── System configuration
├── Role management
└── Billing & settings

Manager
├── Team reports
├── Agent monitoring
├── Agent performance
├── Lead pipeline overview
└── Team statistics

Agent
├── Own listings
├── Own leads
├── Personal statistics
└── Message history

Viewer
└── Read-only access to reports
```

### Security Features
- ✅ JWT token-based auth
- ✅ Refresh token rotation
- ✅ HTTPS enforced
- ✅ CORS properly configured
- ✅ Rate limiting on API
- ✅ SQL injection prevention (ORM)
- ✅ XSS protection (React escaping)
- ✅ CSRF tokens on sensitive operations
- ✅ Audit logging for all actions
- ✅ 2FA support (optional setup)

---

## 🎨 UI/UX Design System

### Color Scheme (TrusTech Theme)
```
Primary:     #001F3F (Deep Navy)
Secondary:   #0074D9 (Electric Blue)
Accent:      #FFD700 (Gold)
Success:     #2ECC40 (Green)
Warning:     #FF4136 (Red)
Background:  #F8FAFC (Light Gray)
Surface:     #FFFFFF (White)
Text:        #2C3E50 (Dark Gray)
```

### Component Library
```
Navigation
├── Sidebar (collapsible)
├── Top navbar (with user menu)
└── Breadcrumbs

Data Display
├── Tables (sortable, filterable, paginated)
├── Cards (metrics, property previews)
├── Charts (line, bar, pie, funnel)
├── Lists (leads, messages)
└── Kanban boards (lead pipeline)

Forms
├── Input fields (text, email, tel, number)
├── Select dropdowns
├── Checkboxes & radio buttons
├── Date pickers
├── Rich text editor
└── File upload

Feedback
├── Toast notifications
├── Modal dialogs
├── Loading spinners
├── Empty states
└── Error messages

Buttons
├── Primary (action)
├── Secondary (alternative)
├── Danger (delete)
└── Disabled states
```

### Responsive Design
```
Mobile (< 640px)
├── Single column layout
├── Bottom navigation
├── Full-width modals
└── Stacked components

Tablet (640px - 1024px)
├── 2-column layout
├── Sidebar visible
├── Compact tables
└── Side-by-side cards

Desktop (> 1024px)
├── Full sidebar + content
├── Multi-column layouts
├── Expanded tables
└── Dashboard grid
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login           - User login
POST   /api/auth/logout          - User logout
POST   /api/auth/refresh         - Refresh JWT token
POST   /api/auth/forgot-password - Password reset request
POST   /api/auth/reset-password  - Reset with token
GET    /api/auth/me              - Current user info
```

### Properties
```
GET    /api/properties           - List all properties
POST   /api/properties           - Create property
GET    /api/properties/:id       - Get property detail
PUT    /api/properties/:id       - Update property
DELETE /api/properties/:id       - Delete property
POST   /api/properties/:id/verify - Trigger AI verification
GET    /api/properties/:id/views - Get view analytics
POST   /api/properties/bulk/import - Bulk import from CSV
```

### Leads
```
GET    /api/leads               - List leads (with filters)
POST   /api/leads               - Create lead manually
GET    /api/leads/:id           - Lead detail
PUT    /api/leads/:id           - Update lead status/notes
DELETE /api/leads/:id           - Delete lead
GET    /api/leads/:id/messages  - Get lead conversations
POST   /api/leads/:id/assign    - Assign to agent
POST   /api/leads/bulk/email    - Send bulk emails
```

### AI Agents
```
GET    /api/agents              - List AI agents
GET    /api/agents/:id          - Agent configuration
PUT    /api/agents/:id          - Update agent settings
GET    /api/agents/:id/stats    - Performance metrics
GET    /api/agents/:id/history  - Conversation history
POST   /api/agents/:id/test     - Test agent response
POST   /api/agents/:id/train    - Inject training data
```

### Users & Permissions
```
GET    /api/users               - List users
POST   /api/users               - Create user
GET    /api/users/:id           - User detail
PUT    /api/users/:id           - Update user
DELETE /api/users/:id           - Deactivate user
GET    /api/roles               - List roles
POST   /api/roles               - Create custom role
GET    /api/permissions         - Available permissions
```

### Analytics & Reports
```
GET    /api/analytics/dashboard - Dashboard metrics
GET    /api/analytics/leads     - Lead conversion analytics
GET    /api/analytics/properties - Property performance
GET    /api/analytics/agents    - Agent performance
POST   /api/reports/generate    - Generate custom report
GET    /api/reports/:id/download - Download report (PDF/Excel)
```

### Integrations
```
GET    /api/integrations        - List connected integrations
GET    /api/integrations/:id    - Integration details
PUT    /api/integrations/:id    - Update integration settings
POST   /api/integrations/:id/test - Test integration
GET    /api/webhooks            - List webhooks
POST   /api/webhooks            - Create webhook
DELETE /api/webhooks/:id        - Delete webhook
```

---

## 📁 Project Structure

```
e:\yourhouse.ph\
├── apps/
│   ├── api/                    (FastAPI Backend)
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   ├── app/
│   │   │   ├── __init__.py
│   │   │   ├── routes/
│   │   │   │   ├── auth.py
│   │   │   │   ├── properties.py
│   │   │   │   ├── leads.py
│   │   │   │   ├── agents.py
│   │   │   │   ├── users.py
│   │   │   │   ├── analytics.py
│   │   │   │   ├── reports.py
│   │   │   │   └── integrations.py
│   │   │   ├── models/
│   │   │   │   ├── user.py
│   │   │   │   ├── property.py
│   │   │   │   ├── lead.py
│   │   │   │   ├── message.py
│   │   │   │   └── analytics.py
│   │   │   ├── schemas/
│   │   │   │   ├── auth.py
│   │   │   │   ├── property.py
│   │   │   │   └── lead.py
│   │   │   ├── database/
│   │   │   │   ├── connection.py
│   │   │   │   └── models.py
│   │   │   ├── middleware/
│   │   │   │   ├── auth.py
│   │   │   │   ├── cors.py
│   │   │   │   └── logging.py
│   │   │   ├── services/
│   │   │   │   ├── auth_service.py
│   │   │   │   ├── property_service.py
│   │   │   │   ├── lead_service.py
│   │   │   │   ├── ai_service.py
│   │   │   │   └── analytics_service.py
│   │   │   ├── utils/
│   │   │   │   ├── jwt_handler.py
│   │   │   │   ├── validators.py
│   │   │   │   └── helpers.py
│   │   │   └── integrations/
│   │   │       ├── twilio_client.py
│   │   │       ├── elevenlabs_client.py
│   │   │       ├── supabase_client.py
│   │   │       └── cal_com_sync.py
│   │   └── tests/
│   │       ├── test_auth.py
│   │       ├── test_properties.py
│   │       └── test_leads.py
│   │
│   ├── web/                    (Landing Page - Existing)
│   │   ├── app/
│   │   └── ...
│   │
│   └── admin/                  (Admin Dashboard - New)
│       ├── app/
│       │   ├── (app)/
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   └── globals.css
│       │   ├── dashboard/
│       │   │   ├── page.tsx
│       │   │   └── layout.tsx
│       │   ├── properties/
│       │   │   ├── page.tsx
│       │   │   ├── [id]/
│       │   │   └── new/
│       │   ├── leads/
│       │   │   ├── page.tsx
│       │   │   ├── [id]/
│       │   │   └── pipeline/
│       │   ├── agents/
│       │   │   ├── page.tsx
│       │   │   └── [id]/
│       │   ├── users/
│       │   │   ├── page.tsx
│       │   │   ├── [id]/
│       │   │   └── roles/
│       │   ├── reports/
│       │   │   ├── page.tsx
│       │   │   └── [id]/
│       │   ├── settings/
│       │   │   ├── page.tsx
│       │   │   ├── integrations/
│       │   │   └── webhooks/
│       │   └── auth/
│       │       ├── login/
│       │       ├── register/
│       │       └── forgot-password/
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Sidebar.tsx
│       │   │   ├── Header.tsx
│       │   │   └── Navigation.tsx
│       │   ├── dashboard/
│       │   │   ├── MetricCard.tsx
│       │   │   ├── ChartWidget.tsx
│       │   │   └── ActivityFeed.tsx
│       │   ├── properties/
│       │   │   ├── PropertyTable.tsx
│       │   │   ├── PropertyCard.tsx
│       │   │   └── PropertyForm.tsx
│       │   ├── leads/
│       │   │   ├── KanbanBoard.tsx
│       │   │   ├── LeadCard.tsx
│       │   │   └── LeadForm.tsx
│       │   ├── common/
│       │   │   ├── Modal.tsx
│       │   │   ├── Button.tsx
│       │   │   ├── Table.tsx
│       │   │   ├── Form.tsx
│       │   │   └── Notification.tsx
│       │   └── charts/
│       │       ├── PipelineChart.tsx
│       │       ├── PerformanceChart.tsx
│       │       └── TrendChart.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useApi.ts
│       │   └── useForm.ts
│       ├── lib/
│       │   ├── api.ts
│       │   ├── auth.ts
│       │   └── utils.ts
│       ├── styles/
│       │   ├── tailwind.css
│       │   └── variables.css
│       ├── public/
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.js
│       └── README.md
│
├── docs/
│   ├── ADMIN_MASTERPLAN.md     (This file)
│   ├── API_SPECIFICATION.md
│   ├── DATABASE_SCHEMA.md
│   └── DEPLOYMENT_GUIDE.md
│
└── shared/
    ├── types/
    │   ├── common.ts
    │   ├── api.ts
    │   └── domain.ts
    └── constants/
        └── config.ts
```

---

## 📋 Implementation Roadmap

### **Week 1: Core Admin Dashboard**

#### Day 1-2: Foundation
- [ ] Set up Next.js admin app in `/apps/admin`
- [ ] Configure TypeScript, Tailwind CSS, ESLint
- [ ] Design component library (buttons, cards, inputs)
- [ ] Set up authentication flow (NextAuth.js)
- [ ] Create layout components (Sidebar, Header)

#### Day 2-3: Backend & Database
- [ ] FastAPI project setup
- [ ] PostgreSQL schema design
- [ ] User & role management endpoints
- [ ] Authentication endpoints (JWT)
- [ ] CORS & security middleware

#### Day 3-4: Dashboard & Properties
- [ ] Dashboard page with key metrics
- [ ] Property list & filter interface
- [ ] Property detail & edit views
- [ ] Bulk import CSV functionality
- [ ] Basic charts & analytics

#### Day 4-5: Leads Management
- [ ] Lead list view with filters
- [ ] Kanban pipeline board
- [ ] Lead detail & notes
- [ ] Bulk actions (email, assign, status)
- [ ] Lead analytics

#### Day 5-6: AI Agents & Users
- [ ] Agent configuration interface
- [ ] Agent performance dashboard
- [ ] User management (CRUD)
- [ ] Role & permission management
- [ ] Activity audit log

#### Day 6-7: Polish & Deploy
- [ ] Reports & export functionality
- [ ] Integration management UI
- [ ] Testing & bug fixes
- [ ] Performance optimization
- [ ] Production deployment

---

## 🚀 Deployment Plan

### Architecture
```
Admin Dashboard → Vercel (auto-deploy from GitHub)
API Backend → Railway.app or Fly.io (Docker)
Database → Supabase (PostgreSQL)
Hosting → Global CDN with auto-scaling
```

### Environments
```
Development
├── Local environment: http://localhost:3001
├── API: http://localhost:8000
└── Database: Local PostgreSQL

Staging
├── URL: https://admin-staging.yourhouse.ph
├── API: https://api-staging.yourhouse.ph
└── Database: Supabase (staging)

Production
├── URL: https://admin.yourhouse.ph
├── API: https://api.yourhouse.ph
└── Database: Supabase (production)
```

### Deployment Steps
1. Build Next.js admin app (`npm run build`)
2. Deploy to Vercel (auto from GitHub)
3. Build FastAPI Docker image
4. Deploy to Railway/Fly.io
5. Run database migrations
6. Configure environment variables
7. Set up SSL/TLS certificates
8. Configure custom domains
9. Enable monitoring & logging
10. Go-live

---

## 📊 Success Metrics

### Development
- ✅ 100% feature completion in 7 days
- ✅ Zero critical bugs at launch
- ✅ All endpoints tested & documented
- ✅ Performance: <300ms response time

### User Experience
- ✅ Intuitive navigation (< 3 clicks to any feature)
- ✅ Mobile responsive admin interface
- ✅ WCAG AA accessibility compliance
- ✅ Help documentation & tooltips

### Security
- ✅ JWT authentication working
- ✅ Role-based access control enforced
- ✅ Audit logging for all actions
- ✅ No security vulnerabilities (OWASP top 10)

### Operations
- ✅ Admin can manage 1000+ properties
- ✅ Process 100+ leads without slowdown
- ✅ Generate reports in <5 seconds
- ✅ Export data in multiple formats

---

## 🔄 Next Steps

1. ✅ Approve this master plan
2. ⏳ Set up project structure
3. ⏳ Create database schema
4. ⏳ Implement authentication
5. ⏳ Build core dashboards
6. ⏳ Implement features
7. ⏳ Testing & QA
8. ⏳ Deploy to production

---

## 📞 Questions?

Ask about:
- Feature priorities or customization
- Timeline adjustments
- Technology preferences
- Integration specific requirements
- Design/branding guidelines
- Scaling expectations

---

**Status:** Ready to start Phase 1 🚀

**Created:** April 17, 2026  
**Updated:** April 17, 2026  
**Version:** 1.0 - Master Plan
