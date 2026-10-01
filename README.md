# SparkleClean

A modern cleaning service website built with Next.js 16, featuring an admin dashboard, PostgreSQL database integration, and AI-powered cleaning assistance.

## Features

- **Public Website**: Home, About, Services, Team, Testimonials, Contact, Booking pages
- **Admin Dashboard** (`/admin`):
  - Secure JWT authentication with HttpOnly cookies
  - Contact submissions management (view, search, filter, edit, delete)
  - Newsletter subscriptions management
  - Dashboard statistics
- **Database Integration**: Neon PostgreSQL with Drizzle ORM
- **Forms**: Contact form and newsletter subscription with validation
- **AI Assistant**: Google Gemini-powered cleaning advice chat
- **Booking System**: Service booking with availability checking

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 + PostCSS |
| Database | Neon PostgreSQL + Drizzle ORM |
| Auth | JWT (jose) + bcryptjs |
| AI | Google Generative AI |
| Email | Resend |
| Validation | Zod 4 |
| Linting | ESLint 9 |

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── book/              # Booking page
│   └── ...
├── components/            # React components
│   ├── admin/             # Admin UI components
│   └── ...
├── lib/                   # Core utilities
│   ├── auth/              # JWT authentication
│   ├── booking/           # Booking logic
│   └── db/                # Drizzle schema & queries
├── drizzle/               # SQL migrations
├── public/                # Static assets
├── scripts/               # Database scripts
└── data/                  # Static data files
```

## Getting Started

### Prerequisites

- Node.js 20+
- Neon PostgreSQL database (or any PostgreSQL)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sparkleclean

# Install dependencies
npm install
```

### Environment Setup

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database - Your Neon PostgreSQL connection string
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"

# Admin Authentication - Generate with: openssl rand -base64 32
ADMIN_JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# Admin credentials (will be hashed on first run)
ADMIN_EMAIL="admin@sparkleclean.com"
ADMIN_PASSWORD="your-secure-password"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI Assistant - Get from https://aistudio.google.com/app/apikey
GEMINI_API_KEY="your_gemini_api_key_here"

# Email (Resend) - Optional, for booking notifications
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxx"
BOOKING_FROM_EMAIL="SparkleClean <bookings@yourdomain.com>"
BOOKING_ADMIN_EMAIL="admin@sparkleclean.com"
```

### Database Setup

```bash
# Push schema to database
npm run db:push

# Create admin user
npm run db:seed
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` for the website and `http://localhost:3000/admin/login` for the admin dashboard.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Generate migration files |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Create admin user |
| `npm run db:booking-constraint` | Apply booking constraint migration |

## Admin Dashboard

1. Navigate to `/admin/login`
2. Login with credentials from `.env`
3. Access dashboard at `/admin`

### Admin Features

- **Dashboard** (`/admin`): Overview statistics
- **Contacts** (`/admin/contacts`): Manage contact form submissions
- **Newsletter** (`/admin/newsletter`): Manage newsletter subscriptions

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Database Migration on Deploy

Add to build process or run separately:

```bash
npm run db:push
```

## Security Checklist for Production

- [ ] Use strong `ADMIN_JWT_SECRET` (32+ characters)
- [ ] Change default admin password
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set `NODE_ENV=production`
- [ ] Configure Neon IP allowlist if needed
- [ ] Set up database backups in Neon console

## License

MIT License - feel free to use for your own projects.