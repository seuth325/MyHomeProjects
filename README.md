# FixMyHome - Homeowner-Handyman Marketplace

A two-sided marketplace platform connecting Florida homeowners with local handymen for home repair jobs.

## Overview

FixMyHome allows:
- **Homeowners** to post jobs with budgets and receive competitive bids
- **Handymen** to browse local jobs and submit quotes to win work
- Both parties to message, complete jobs, and leave reviews

## Tech Stack

- **Framework:** Next.js 14+ (App Router, React Server Components)
- **Language:** TypeScript
- **Database:** Self-hosted PostgreSQL with Prisma ORM (`@prisma/adapter-pg`)
- **Authentication:** Clerk
- **File Storage:** Uploadthing
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** TanStack Query + Zustand
- **Deployment:** Docker on a self-managed VPS (Hostinger)

## Project Status

✅ **Completed:**
- Next.js project initialization with TypeScript and Tailwind CSS
- Database schema design (Users, Jobs, Bids, Messages, Reviews)
- Core dependencies installed
- Prisma configuration
- Utility files and constants

🚧 **In Progress:**
- Database setup (requires Neon/PostgreSQL connection)
- Clerk authentication configuration
- shadcn/ui component setup

📋 **Upcoming (Week 1):**
- Authentication flow (sign-in, sign-up, role selection)
- Onboarding forms (homeowner & handyman)
- Layout components (header, navigation, footer)

## Setup Instructions

### 1. Set Up Database (self-hosted PostgreSQL)

The app runs against a standard self-hosted PostgreSQL instance via `@prisma/adapter-pg` — no cloud-specific driver required. On a VPS this is the `db` service in `docker-compose.yml`.

1. Create `.env` file in the project root:

```bash
# Copy .env.example to .env
cp .env.example .env
```

2. Set `POSTGRES_PASSWORD` and `DATABASE_URL` in `.env` (see comments in `.env.example` for the Docker vs. bare-metal host difference).

### 2. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This creates all tables (User, Job, Bid, Message, Review, etc.) with proper indexes.

### 3. Set Up Clerk Authentication

1. Create a free account at [Clerk](https://clerk.com)
2. Create a new application called "FixMyHome"
3. In the Clerk Dashboard:
   - Go to **API Keys** and copy your keys
   - Add them to `.env`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

4. Configure redirect URLs in Clerk Dashboard:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/role-selection`
   - After sign-up: `/role-selection`

### 4. Set Up Uploadthing (for photo uploads)

1. Create account at [Uploadthing](https://uploadthing.com)
2. Create a new app
3. Copy your secret and app ID to `.env`:

```
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="..."
```

### 5. Install shadcn/ui Components

```bash
npx shadcn@latest init
```

When prompted:
- **Style:** Default
- **Base color:** Slate
- **CSS variables:** Yes

Then install base components:

```bash
npx shadcn@latest add button input textarea select card badge dialog dropdown-menu form label avatar separator skeleton toast
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Core Models

- **User** - Authentication & role management (HOMEOWNER | HANDYMAN)
- **HandymanProfile** - Extended profile for handymen (skills, radius, ratings)
- **Job** - Posted jobs with budget, location, category
- **JobPhoto** - Photos attached to jobs (up to 5)
- **Bid** - Handyman quotes on jobs
- **Message** - Thread-based messaging per bid
- **Review** - 1-5 star ratings after job completion

### Relationships

- One User can post many Jobs (homeowner)
- One User can submit many Bids (handyman)
- One Job has many Bids
- One Bid has many Messages
- One Job has one Review

## Project Structure

```
src/
├── app/
│   ├── (auth)/         # Auth routes
│   ├── (homeowner)/    # Homeowner dashboard, jobs
│   ├── (handyman)/     # Handyman browse, bids, profile
│   ├── (public)/       # Landing page
│   ├── api/            # API routes
│   └── layout.tsx
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── jobs/           # Job-related components
│   ├── bids/           # Bid components
│   ├── messaging/      # Message components
│   └── layout/         # Header, nav, footer
├── lib/
│   ├── db.ts           # Prisma client
│   ├── utils.ts        # Utility functions
│   ├── constants.ts    # App constants
│   ├── validations/    # Zod schemas
│   ├── actions/        # Server Actions
│   └── queries/        # Database queries
└── types/              # TypeScript types
```

## Development Workflow

### Week 1: Foundation ✅
- [x] Initialize project
- [x] Set up database schema
- [ ] Configure Clerk authentication
- [ ] Install shadcn/ui components
- [ ] Build authentication flow
- [ ] Create onboarding forms
- [ ] Implement layouts

### Week 2: Job Management
- [ ] Job posting form with photo upload
- [ ] Job list/feed
- [ ] Job detail page
- [ ] Job browsing for handymen
- [ ] Job filters (category, location, budget)

### Week 3: Bidding System
- [ ] Bid submission form
- [ ] Bid list on jobs
- [ ] Bid comparison UI
- [ ] Accept bid flow
- [ ] My Bids page

### Week 4: Messaging
- [ ] Message thread component
- [ ] Polling for real-time updates
- [ ] Conversation list
- [ ] Unread indicators

### Week 5: Completion & Reviews
- [ ] Mark job complete
- [ ] Review form (star rating + text)
- [ ] Display reviews on profiles
- [ ] Update handyman ratings

### Week 6: AI Recommendations
- [ ] Bid scoring algorithm
- [ ] Recommendation API
- [ ] Recommendation UI
- [ ] Claude API integration (optional)

### Week 7: Polish & Launch
- [ ] Role-based middleware
- [ ] Rate limiting
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] E2E testing
- [ ] Deploy to Vercel

## Key Features

### Homeowner Features
- Post jobs with photos, budget, and preferred dates
- Receive and compare bids from local handymen
- View AI-recommended bids (best value)
- Message handymen before awarding
- Award job to best bid (auto-declines others)
- Mark job complete
- Rate and review handymen

### Handyman Features
- Create profile with skills, service radius, hourly rate
- Browse open jobs with filters
- Submit competitive bids with quotes
- Message homeowners
- Receive notifications when bid is accepted
- Build reputation through ratings

### Platform Features
- **Role-based access** - Homeowners and handymen see different dashboards
- **AI bid recommendations** - Weighted scoring (price, rating, timeline, capacity)
- **Messaging** - Threaded conversations per bid
- **Reviews** - 1-5 star ratings update handyman averages
- **Security** - Server-side validation, rate limiting, SQL injection prevention

## Environment Variables

See `.env.example` for all required environment variables:

- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `UPLOADTHING_SECRET` - Uploadthing secret
- `UPLOADTHING_APP_ID` - Uploadthing app ID
- `ANTHROPIC_API_KEY` - (Optional) For AI bid explanations

## Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma migrate dev       # Run migrations
npx prisma generate          # Generate Prisma client
npx prisma studio            # Open Prisma Studio GUI
npx prisma db push           # Push schema changes (development)

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier (if configured)
```

## Testing

### Manual Testing Checklist

**Homeowner Flow:**
1. Sign up → Select homeowner role
2. Complete onboarding (location)
3. Post job with photos and budget
4. View job detail page
5. Compare bids from handymen
6. Accept best bid
7. Message handyman
8. Mark job complete
9. Leave review

**Handyman Flow:**
1. Sign up → Select handyman role
2. Complete profile (skills, radius, rate)
3. Browse open jobs with filters
4. Submit bid with quote
5. Message homeowner
6. Receive bid acceptance
7. View review on profile

## Deployment

### Deploy to a VPS (Docker)

The app ships with a multi-stage `Dockerfile` (Next.js `output: "standalone"`) and a `docker-compose.yml` that runs the app alongside a self-hosted PostgreSQL container. The app container only binds to `127.0.0.1:3000` — Nginx on the host handles the public-facing domain and TLS.

Domain: **fixmyhome.pro** (must already have an A record pointing at the VPS's IP).

1. Install Docker + the Compose plugin, and Nginx + certbot:

```bash
curl -fsSL https://get.docker.com | sh
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
```

2. Clone the repo and create `.env` from `.env.example` (set `POSTGRES_PASSWORD` and all other secrets — Clerk, Uploadthing, etc.):

```bash
git clone https://github.com/seuth325/MyHomeProjects.git fixmyhome
cd fixmyhome
cp .env.example .env
nano .env   # fill in real secrets
```

3. Start Postgres and the app:

```bash
docker compose up -d --build
```

4. Run migrations against the running database (one-off container using the `builder` stage, which has the Prisma CLI):

```bash
docker compose run --rm migrate
```

5. Wire up Nginx and get a TLS cert:

```bash
sudo cp deploy/nginx/fixmyhome.conf /etc/nginx/sites-available/fixmyhome
sudo ln -s /etc/nginx/sites-available/fixmyhome /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d fixmyhome.pro -d www.fixmyhome.pro
```

certbot rewrites the Nginx config in place to add the HTTPS server block and sets up auto-renewal.

6. Point the Clerk webhook (Clerk Dashboard → Webhooks) at `https://fixmyhome.pro/api/webhooks/clerk`.

Re-deploy after pulling new code:

```bash
git pull
docker compose up -d --build
docker compose run --rm migrate   # only if the schema changed
```

### Database Migrations

For production database:

```bash
npx prisma migrate deploy
```

This runs all pending migrations without prompting. Inside Docker, use `docker compose run --rm migrate` instead (see above).

## Support & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Clerk Docs:** https://clerk.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Uploadthing:** https://docs.uploadthing.com

## License

Private project - All rights reserved

---

Built with ❤️ using Next.js, Prisma, and Clerk
