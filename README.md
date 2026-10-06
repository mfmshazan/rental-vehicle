# UDS Travels — Bus Booking Platform

Full-stack booking platform for UDS Travels with two services:

1. **Bus charter / hire** — inquiry → quote → confirm.
2. **Scheduled routes** — timetabled trips with online per-seat booking + PayHere payment.

See [SPEC.md](SPEC.md) for the full specification and data model.

## Stack

Next.js 16 (App Router) · TypeScript · PostgreSQL · Prisma 6 · Tailwind CSS 4 · Auth.js · PayHere

## Getting started

### 1. Install deps

```bash
npm install
```

### 2. Provide a PostgreSQL database

Pick one and put its connection string in `.env` as `DATABASE_URL`:

- **Neon / Supabase (cloud, free tier)** — create a project, copy the connection string. Easiest, no local install.
- **Docker (local)**:
  ```bash
  docker run --name uds-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=uds -p 5432:5432 -d postgres:16
  ```
  Then use `postgresql://postgres:postgres@localhost:5432/uds?schema=public`.

Copy `.env.example` to `.env` and fill in values. Generate an auth secret with `npx auth secret`.

### 3. Create the schema

```bash
npx prisma migrate dev --name init   # once a DATABASE_URL is set
npx prisma generate
```

### 4. Run

```bash
npm run dev          # http://localhost:3000
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npx prisma studio` | Browse the database |

## Build roadmap

Phase 0 (setup) ✅ → Phase 1 (admin core) → Phase 2 (search + seat map) → Phase 3 (booking + PayHere) → Phase 4 (charter) → Phase 5 (notifications/reports) → Phase 6 (go-live). Details in [SPEC.md](SPEC.md#8-milestones).
