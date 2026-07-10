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
- **Database:** MySQL (Hostinger-managed) with Prisma ORM (`@prisma/adapter-mariadb`)
- **Authentication:** Clerk
- **File Storage:** Uploadthing
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** TanStack Query + Zustand
- **Deployment:** Hostinger hPanel Node.js hosting (Git auto-deploy). `Dockerfile`/`docker-compose.yml` are kept for local Docker-based dev but are not used in production.

## Project Status

✅ **Completed:**
- Next.js project initialization with TypeScript and Tailwind CSS
- Database schema design (Users, Jobs, Bids, Messages, Reviews)
- Core dependencies installed
- Prisma configuration
- Utility files and constants

🚧 **In Progress:**
- Database setup (requires Hostinger MySQL connection)
- Clerk authentication configuration
- shadcn/ui component setup

📋 **Upcoming (Week 1):**
- Authentication flow (sign-in, sign-up, role selection)
- Onboarding forms (homeowner & handyman)
- Layout components (header, navigation, footer)

## Setup Instructions

### 1. Set Up Database (Hostinger-managed MySQL)

The app runs against MySQL via `@prisma/adapter-mariadb` (compatible with both MySQL and MariaDB servers).

1. In hPanel, go to Databases → MySQL Databases and create a database + user.
2. Create `.env` file in the project root:

```bash
# Copy .env.example to .env
cp .env.example .env
```

3. Set `DATABASE_URL` in `.env` using the host/user/password/db name from hPanel, e.g. `mysql://user:password@localhost:3306/dbname`.

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

- `DATABASE_URL` - MySQL connection string (Hostinger-managed)
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

### Deploy via Hostinger hPanel (Node.js auto-deploy)

Production deploys through hPanel's Git-connected Node.js hosting — it pulls the repo, runs `npm install` (which triggers `prisma generate` via `postinstall`) and `npm run build`, then starts the app itself. No Docker is involved in production.

Domain: **fixmyhome.pro**

1. In hPanel → Websites → Node.js, connect this repo (`https://github.com/seuth325/MyHomeProjects.git`) and set:
   - **Node version:** 22.x
   - **Application startup file:** `.next/standalone/server.js` (required because `next.config.ts` sets `output: "standalone"`)
   - **Environment variables:** `DATABASE_URL` (Hostinger MySQL connection string), Clerk keys, Uploadthing keys, `NEXT_PUBLIC_APP_URL=https://fixmyhome.pro`, `NODE_ENV=production` — see `.env.example` for the full list.
2. Run migrations once, via hPanel's terminal or SSH, from the app's build directory:

```bash
npx prisma migrate deploy
```

3. Point the Clerk webhook (Clerk Dashboard → Webhooks) at `https://fixmyhome.pro/api/webhooks/clerk`.
4. Trigger Deploy/Redeploy from hPanel. TLS is handled by Hostinger's own certificate management for the domain.

Re-deploy after pushing new code by hitting hPanel's Deploy button (or pushing to the connected branch, if auto-deploy-on-push is enabled), then re-run `npx prisma migrate deploy` if the schema changed.

If the build ever fails with a stale/corrupted checkout (e.g. permission errors under `.builds/source`), delete `~/domains/fixmyhome.pro/public_html/.builds` via SSH and redeploy to force a clean clone.

### Alternative: Docker (local dev only)

The repo also ships a multi-stage `Dockerfile` and `docker-compose.yml` (app + MySQL) for local development or a self-managed VPS instead of hPanel:

```bash
cp .env.example .env   # set MYSQL_PASSWORD and DATABASE_URL=mysql://fixmyhome:<pw>@db:3306/fixmyhome
docker compose up -d --build
docker compose run --rm migrate
```

This is not the path used for the fixmyhome.pro production deploy.

### Database Migrations

```bash
npx prisma migrate deploy
```

This runs all pending migrations without prompting. Inside Docker, use `docker compose run --rm migrate` instead.

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
