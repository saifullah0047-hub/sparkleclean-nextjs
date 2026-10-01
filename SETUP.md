# SparkleClean - Neon PostgreSQL + Admin Dashboard Setup Guide

## Overview
This project now includes a complete Neon PostgreSQL integration with Drizzle ORM and a fully functional Admin Dashboard.

## Features Implemented

### Database Integration
- **Neon PostgreSQL** with Drizzle ORM
- **Tables**: Contact Submissions, Newsletter Subscriptions, Admins
- **Migrations** in `drizzle/` folder
- **Type-safe queries** in `lib/db/queries.ts`

### Admin Dashboard (`/admin`)
- **Secure Login** at `/admin/login` with JWT authentication (HttpOnly cookies)
- **Dashboard** with statistics for contacts and newsletter
- **Contact Submissions Management** at `/admin/contacts`:
  - View all submissions with pagination
  - Search by name, email, message, service type
  - Filter by status (new, in_progress, resolved, spam)
  - Sort by any column
  - View details modal
  - Edit status, notes, and all fields
  - Delete submissions
- **Newsletter Management** at `/admin/newsletter`:
  - View all subscriptions
  - Search by email
  - Filter by status (active, unsubscribed)
  - Toggle status (activate/unsubscribe)
  - Delete subscriptions
- **Protected Routes** - all admin routes require authentication

### Public Forms Connected to Database
- **Contact Form** (homepage panel & contact page) → stores in `contact_submissions`
- **Newsletter Form** (footer) → stores in `newsletter_subscriptions`
- Proper loading, error, and success states
- Form validation (client + server-side)

## Setup Instructions

### 1. Create a Neon PostgreSQL Database
1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project (or use existing)
3. Copy the connection string (looks like: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`)

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and update:

```bash
# Database - REPLACE WITH YOUR NEON CONNECTION STRING
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"

# Admin Authentication - Generate a secure secret:
# Run: openssl rand -base64 32
ADMIN_JWT_SECRET="your-super-secret-jwt-key-min-32-chars-long-change-this"

# Admin credentials (will be hashed on first run via db:seed)
ADMIN_EMAIL="admin@sparkleclean.com"
ADMIN_PASSWORD="admin123"
ADMIN_NAME="Admin"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Initialize Database
```bash
# Push schema to database (creates tables)
npm run db:push

# Or run migrations if you prefer
npm run db:generate  # Generate migration files
npm run db:push      # Apply migrations
```

The booking migration is additive and creates `bookings` plus indexes and an overlap exclusion constraint. It does not modify or remove existing contact/newsletter data. Apply it with `npm run db:migrate` (or your normal migration runner). Verify the existing table row counts before and after applying the migration.

### Booking notifications
Set `RESEND_API_KEY`, `BOOKING_FROM_EMAIL`, and `BOOKING_ADMIN_EMAIL` to enable admin/customer booking emails. Without these values, bookings still work and are retained in the database.

### 4. Create Admin User
```bash
npm run db:seed
```
This creates the admin user with the credentials from `.env`.

### 5. Run Development Server
```bash
npm run dev
```

### 6. Access Admin Dashboard
1. Go to `http://localhost:3000/admin/login`
2. Login with:
   - Email: `admin@sparkleclean.com`
   - Password: `admin123` (or whatever you set in `.env`)
3. You'll be redirected to `/admin` dashboard

## Project Structure

```
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout with sidebar
│   │   ├── page.tsx            # Dashboard with stats
│   │   ├── login/page.tsx      # Login page
│   │   ├── contacts/page.tsx   # Contact submissions management
│   │   └── newsletter/page.tsx # Newsletter management
│   └── api/
│       ├── contact/route.ts    # Contact form submission
│       ├── newsletter/route.ts # Newsletter subscription
│       └── admin/
│           ├── auth/
│           │   ├── login/route.ts
│           │   ├── logout/route.ts
│           │   └── me/route.ts
│           ├── contacts/route.ts
│           ├── contacts/[id]/route.ts
│           ├── newsletter/route.ts
│           ├── newsletter/[id]/route.ts
│           └── stats/route.ts
├── components/
│   ├── admin/
│   │   ├── AdminAuthProvider.tsx  # Auth context
│   │   └── AdminLayout.tsx        # Sidebar layout
│   ├── ContactForm.tsx       # Updated to use API
│   └── NewsletterForm.tsx    # Updated to use API
├── lib/
│   ├── db/
│   │   ├── index.ts          # Drizzle connection
│   │   ├── schema.ts         # Database schema
│   │   └── queries.ts        # Type-safe queries
│   └── auth/
│       └── index.ts          # JWT utilities
├── drizzle/
│   └── 0000_dear_venus.sql   # Migration file
├── scripts/
│   └── seed-admin.ts         # Admin user seeder
└── .env                      # Environment variables
```

## API Endpoints

### Public
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter` - Subscribe to newsletter

### Admin (Requires Authentication)
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout
- `GET/POST /api/admin/auth/me` - Get current admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/contacts` - List contacts (with pagination, search, filter, sort)
- `GET /api/admin/contacts/:id` - Get single contact
- `PATCH /api/admin/contacts/:id` - Update contact
- `DELETE /api/admin/contacts/:id` - Delete contact
- `GET /api/admin/newsletter` - List subscriptions
- `PATCH /api/admin/newsletter/:id` - Update subscription
- `DELETE /api/admin/newsletter/:id` - Delete subscription

## Security Features
- **JWT Authentication** with HttpOnly cookies
- **Password Hashing** with bcrypt (12 rounds)
- **Protected Routes** - all admin API routes verify token
- **Input Validation** with Zod schemas
- **SQL Injection Prevention** - Drizzle ORM parameterized queries
- **CORS** - Same-origin by default

## Customization

### Adding New Admin Pages
1. Create page in `app/admin/your-page/page.tsx`
2. Add navigation item in `components/admin/AdminLayout.tsx`
3. Create API routes in `app/api/admin/your-resource/`

### Modifying Database Schema
1. Edit `lib/db/schema.ts`
2. Run `npm run db:generate` to create migration
3. Run `npm run db:push` to apply

### Changing Admin Credentials
1. Update `.env` with new `ADMIN_EMAIL` and `ADMIN_PASSWORD`
2. Run `npm run db:seed` (will skip if email exists)
3. Or manually update in database

## Production Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Database Migration on Deploy
Add to build script or run separately:
```bash
npm run db:push
```

### Security Checklist for Production
- [ ] Use strong `ADMIN_JWT_SECRET` (32+ chars)
- [ ] Change default admin password
- [ ] Enable HTTPS (Vercel does this automatically)
- [ ] Set `NODE_ENV=production`
- [ ] Configure Neon IP allowlist if needed
- [ ] Set up database backups in Neon console

## Troubleshooting

### "DATABASE_URL not set"
- Ensure `.env` file exists in project root
- Check that `DATABASE_URL` is correctly formatted

### "Invalid credentials" on login
- Run `npm run db:seed` to create admin user
- Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`

### Build fails with TypeScript errors
- Run `npm run build` to see full errors
- Ensure all dependencies installed: `npm install`

### Database connection timeout
- Check Neon connection string format
- Verify IP allowlist in Neon console (or disable for dev)
- Ensure `sslmode=require` in connection string

## License
This project is based on the SparkleClean template with added database and admin functionality.
