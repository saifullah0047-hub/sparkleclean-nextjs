# SparkleClean

A modern, full-stack cleaning service website built with **Next.js 16**, featuring a secure admin dashboard, PostgreSQL database integration, AI-powered cleaning assistance, and a complete booking system.

---

## 🎯 Project Overview

SparkleClean is a production-ready cleaning service platform that demonstrates modern full-stack development practices. It combines a beautiful public-facing website with a powerful admin panel for managing customer inquiries, newsletter subscriptions, and service bookings — all backed by a type-safe PostgreSQL database.

---

## ✨ Key Features

### Public Website
- **Home Page** — Hero section, services showcase, testimonials, stats, and CTA
- **About Page** — Company story, team members, certifications
- **Services Page** — Detailed service offerings with pricing
- **Team Page** — Staff profiles with roles and bios
- **Testimonials Page** — Customer reviews carousel
- **Contact Page** — Validated contact form with database storage
- **Booking Page** — Service booking with real-time availability checking

### Admin Dashboard (`/admin`)
- **Secure Authentication** — JWT with HttpOnly cookies, bcrypt password hashing (12 rounds)
- **Dashboard** — Real-time statistics for contacts, newsletter, and bookings
- **Contact Management** — View, search, filter, sort, edit status/notes, delete submissions
- **Newsletter Management** — View subscriptions, toggle active/unsubscribed, delete
- **Booking Management** — View and manage service bookings
- **Protected Routes** — All admin pages require valid authentication

### AI Assistant
- **Gemini-Powered Chat** — Context-aware cleaning advice using Google Generative AI
- **Streaming Responses** — Real-time token streaming for better UX
- **Fallback Handling** — Graceful degradation when AI service is unavailable

### Database & Backend
- **Neon PostgreSQL** — Serverless, scalable database
- **Drizzle ORM** — Type-safe SQL queries with full TypeScript inference
- **Migrations** — Version-controlled schema changes
- **Seed Scripts** — Admin user creation and data initialization

---

## 🛠 Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js (App Router) | 16.x |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS + PostCSS | 3.4 |
| **Database** | Neon PostgreSQL + Drizzle ORM | 0.45 |
| **Auth** | JWT (jose) + bcryptjs | 6.x / 3.x |
| **AI** | Google Generative AI (Gemini) | 0.24 |
| **Email** | Resend | Latest |
| **Validation** | Zod | 4.x |
| **Linting** | ESLint + eslint-config-next | 9.x |
| **Build Tool** | Turbopack / Next.js built-in | — |

---

## 📁 Project Architecture

```
sparkleclean-nextjs/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin dashboard pages
│   │   ├── layout.tsx           # Admin layout with sidebar navigation
│   │   ├── page.tsx             # Dashboard with statistics
│   │   ├── login/page.tsx       # Login page
│   │   ├── contacts/page.tsx    # Contact submissions management
│   │   ├── newsletter/page.tsx  # Newsletter subscriptions management
│   │   └── bookings/page.tsx    # Booking management
│   ├── api/                      # API routes
│   │   ├── admin/               # Protected admin endpoints
│   │   │   ├── auth/            # Login, logout, me
│   │   │   ├── contacts/        # CRUD for contact submissions
│   │   │   ├── newsletter/      # CRUD for subscriptions
│   │   │   ├── bookings/        # Booking management
│   │   │   └── stats/           # Dashboard statistics
│   │   ├── contact/route.ts     # Public contact form submission
│   │   ├── newsletter/route.ts  # Public newsletter subscription
│   │   ├── bookings/            # Booking availability & creation
│   │   └── ai-assistant/route.ts # AI chat endpoint
│   ├── book/page.tsx            # Public booking page
│   ├── contact/page.tsx         # Public contact page
│   └── ...                      # Other public pages
├── components/                   # Reusable React components
│   ├── admin/                   # Admin-specific components
│   │   ├── AdminAuthProvider.tsx # Auth context provider
│   │   └── AdminLayout.tsx      # Sidebar + header layout
│   ├── ContactForm.tsx          # Validated contact form
│   ├── NewsletterForm.tsx       # Newsletter subscription form
│   ├── BookingFlow.tsx          # Multi-step booking wizard
│   ├── AICleaningAssistant.tsx  # AI chat interface
│   └── ...                      # UI components (Button, Card, Modal, etc.)
├── lib/                          # Core utilities
│   ├── auth/index.ts            # JWT token creation/validation
│   ├── booking/                 # Booking logic & validation
│   │   ├── config.ts            # Booking configuration
│   │   ├── validation.ts        # Zod schemas
│   │   └── notifications.ts     # Email notifications (Resend)
│   └── db/                      # Database layer
│       ├── index.ts             # Drizzle client
│       ├── schema.ts            # Table definitions
│       └── queries.ts           # Type-safe query functions
├── drizzle/                      # SQL migration files
│   ├── 0000_dear_venus.sql      # Initial schema (admins, contacts, newsletter)
│   └── 0001_cloudy_slyde.sql    # Booking tables & constraints
├── scripts/                      # Database utility scripts
│   ├── seed-admin.ts            # Create admin user
│   ├── reset-admin.ts           # Reset admin password
│   ├── apply-booking-constraint.ts
│   └── verify-db.ts             # Verify database connection
├── data/                         # Static data
│   ├── data.json                # Services, team, testimonials
│   └── types.ts                 # TypeScript types for static data
├── public/                       # Static assets (images, fonts, libs)
└── .env.example                  # Environment template
```

---

## 🚀 Local Setup

### Prerequisites
- **Node.js** 20+
- **PostgreSQL** database (Neon recommended for serverless)
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/saifullah0047-hub/sparkleclean-nextjs.git
cd sparkleclean-nextjs

# Install dependencies
npm install
```

### Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#-environment-variables) below).

### Database Setup

```bash
# Push schema to database (creates tables)
npm run db:push

# Create admin user (uses ADMIN_EMAIL/ADMIN_PASSWORD from .env)
npm run db:seed
```

### Development

```bash
npm run dev
```

- **Website**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin (after login)

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `ADMIN_JWT_SECRET` | ✅ | JWT signing secret (32+ chars, generate with `openssl rand -base64 32`) |
| `ADMIN_EMAIL` | ✅ | Admin login email |
| `ADMIN_PASSWORD` | ✅ | Admin login password (will be hashed) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Application URL (e.g., `http://localhost:3000`) |
| `GEMINI_API_KEY` | ⚠️ | Google AI Studio API key for AI Assistant |
| `RESEND_API_KEY` | ⚠️ | Resend API key for booking emails |
| `BOOKING_FROM_EMAIL` | ⚠️ | Sender email for booking notifications |
| `BOOKING_ADMIN_EMAIL` | ⚠️ | Admin email for booking notifications |
| `BOOKING_TIME_ZONE` | ⚠️ | Timezone for booking slots (default: UTC) |

> ⚠️ = Optional — features work without but with reduced functionality

**Never commit real secrets.** Use `.env.example` as a template only.

---

## 🗄 Database Setup

### Neon PostgreSQL (Recommended)

1. Create a project at [Neon Console](https://console.neon.tech)
2. Copy the connection string
3. Add to `.env` as `DATABASE_URL`

### Schema

```sql
-- Core tables
admins                  # Admin users with roles
contact_submissions     # Public contact form entries
newsletter_subscriptions # Footer newsletter signups
bookings                # Service bookings with overlap constraints
```

### Migrations

```bash
# Generate new migration after schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Or push schema directly (development)
npm run db:push

# Open Drizzle Studio for visual DB management
npm run db:studio
```

---

## 👨‍💼 Admin Dashboard

### Access
1. Navigate to `/admin/login`
2. Enter credentials from `.env`
3. Redirected to `/admin` dashboard

### Pages

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard with stats cards |
| `/admin/contacts` | Contact submissions table (pagination, search, filters, sort) |
| `/admin/newsletter` | Newsletter subscriptions (status toggle, delete) |
| `/admin/bookings` | Booking management |

### Security
- JWT tokens stored in **HttpOnly cookies** (XSS protection)
- Passwords hashed with **bcrypt (12 rounds)**
- All admin API routes verify token via middleware
- Input validation with **Zod** on every endpoint

---

## 🤖 AI Assistant

### Features
- Streaming chat responses via Server-Sent Events
- Context-aware cleaning advice
- Fallback responses when API unavailable
- Rate limiting ready

### Configuration
- Requires `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Model: `gemini-1.5-flash` (configurable in `app/api/ai-assistant/route.ts`)

---

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel Dashboard
4. Deploy

### Build Command
```bash
npm run build
```

### Database on Deploy
Add to build script or run separately:
```bash
npm run db:push
```

### Environment Variables for Production
Set all variables from [Environment Variables](#-environment-variables) in Vercel Dashboard. Use strong, unique values for:
- `ADMIN_JWT_SECRET`
- `ADMIN_PASSWORD`
- `DATABASE_URL` (production Neon branch)

---

## 🔒 Security Notes

- ✅ **No secrets in source code** — all credentials via environment variables
- ✅ **HttpOnly cookies** for JWT — prevents XSS token theft
- ✅ **bcrypt (12 rounds)** for password hashing
- ✅ **Parameterized queries** via Drizzle ORM — prevents SQL injection
- ✅ **Zod validation** on all API inputs
- ✅ **CORS** — same-origin by default
- ✅ **Protected routes** — middleware validates auth on every admin request

### Production Checklist
- [ ] Generate strong `ADMIN_JWT_SECRET` (32+ chars)
- [ ] Use unique admin credentials
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set `NODE_ENV=production`
- [ ] Configure Neon IP allowlist or use Neon's built-in security
- [ ] Enable automated database backups in Neon
- [ ] Set up monitoring/alerting (Vercel Analytics, Sentry, etc.)

---

## 🔮 Future Improvements

- [ ] **Email Templates** — HTML email templates for booking confirmations
- [ ] **Role-Based Access** — Editor, Viewer roles for admin panel
- [ ] **Audit Logs** — Track admin actions
- [ ] **Export Data** — CSV/PDF export for contacts & bookings
- [ ] **Webhooks** — Integrate with CRM (HubSpot, etc.)
- [ ] **Multi-language** — i18n support for international markets
- [ ] **PWA** — Offline support, installable app
- [ ] **Tests** — Unit (Vitest), Integration (Playwright), E2E
- [ ] **CI/CD** — GitHub Actions for lint, typecheck, test, deploy

---

## 📸 Screenshots

> **Placeholder** — Add screenshots here after deployment

| Page | Screenshot |
|------|------------|
| Home | `![Home](docs/screenshots/home.png)` |
| Services | `![Services](docs/screenshots/services.png)` |
| Booking | `![Booking](docs/screenshots/booking.png)` |
| Admin Dashboard | `![Admin Dashboard](docs/screenshots/admin-dashboard.png)` |
| Admin Contacts | `![Admin Contacts](docs/screenshots/admin-contacts.png)` |
| Admin Newsletter | `![Admin Newsletter](docs/screenshots/admin-newsletter.png)` |
| AI Assistant | `![AI Assistant](docs/screenshots/ai-assistant.png)` |

---

## 🌐 Live Demo

> **Placeholder** — Add live URL after deployment

- **Website**: `https://sparkleclean.vercel.app`
- **Admin Demo**: `https://sparkleclean.vercel.app/admin/login` (credentials in project docs)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👤 Author

**Saifullah** — [GitHub](https://github.com/saifullah0047-hub)

Built as a portfolio project demonstrating modern full-stack development with Next.js, TypeScript, PostgreSQL, and AI integration.