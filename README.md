# Roam — Your island. Your way.

A vehicle rental marketplace for Sri Lanka. Owners publish vehicles; customers browse, compare daily rates in LKR, and contact owners directly. Roam does not take payments or reserve vehicles.

## Run locally

Use Node.js 22.13 or newer.

```sh
npm install
# On a fresh checkout: copy .env.example to .env and set a random AUTH_SECRET.
npm run db:setup
npm run dev
```

Open http://localhost:3000. Create an owner account at `/register`; there are no default account passwords.

The database is PostgreSQL via `DATABASE_URL` (and `DIRECT_URL` for migrations), read by `prisma/schema.prisma`. Locally, run a Postgres instance (for example `postgres:16` in Docker) or point at a Neon branch. Uploaded photos go to Vercel Blob (`BLOB_READ_WRITE_TOKEN`). Copy `.env.example` to `.env` and fill in the values; Auth.js uses `AUTH_SECRET`.

`db:setup` applies committed migrations and generates Prisma Client. It does not seed demo listings, so a fresh install starts empty. To load the six sample listings (also used by the automated tests), run `npm run db:seed`. Those demo owners have no passwords or phone numbers, demo listings cannot receive inquiries, and their imagery is illustrative.

## Implemented

- Responsive homepage with local vehicle photography and a locally hosted Plus Jakarta Sans font.
- Location, vehicle category, search text, transmission, daily budget, and drive-type filters; price and model-year sorting.
- Vehicle details with features, daily rates, and public owner contact details.
- Saved vehicles that persist on the current device through browser local storage.
- WhatsApp and telephone contact links for real listings.
- Validated customer inquiries stored in the owner's private dashboard; no automatic email/SMS delivery.
- Owner registration and login using bcrypt password hashes and Auth.js JWT sessions.
- Create and edit vehicle listings, JPEG/PNG/WebP photo uploads (maximum 5 MB), and publish/pause controls.
- Ownership checks on all listing mutations, edit pages, and inquiry access.
- Clear unavailable, empty, loading, success, and error states.
- Rental guidelines and an explanation of current data handling.

## Checks

```sh
npm run build
npm test
npm run lint
```

Playwright uses Microsoft Edge on Windows and Chromium elsewhere (`npx playwright install chromium` if required). Tests launch the production build on port 3100 against the separate `DATABASE_URL_TEST` Postgres database, which the global setup resets and seeds (`prisma migrate reset`) on each run. Test photo uploads are namespaced under the Blob `uploads/test/` prefix; application photos use `uploads/live/`.

Browser coverage includes filtering, saved vehicles across reloads, mobile overflow and navigation, demo contact restrictions, registration, invalid/valid login, uploading and publishing a vehicle, inquiry date validation, inquiry delivery, marking inquiries read, owner isolation, edits, pausing, and republishing. Screenshots are written under `test-results/`.

## Storage and deployment

The database (PostgreSQL) and uploads (Vercel Blob) are durable shared services, so the app deploys to serverless/ephemeral hosts and scales across instances. It is built for Vercel's free Hobby tier with Neon Postgres and Vercel Blob.

Deploy on Vercel: push to GitHub and import the project, add the Neon Postgres and Blob integrations (they inject `DATABASE_URL`, `DIRECT_URL`, and `BLOB_READ_WRITE_TOKEN`), then set `AUTH_SECRET`, `NEXT_PUBLIC_BASE_URL`, and optionally the Resend variables. The `vercel-build` script runs `prisma generate && prisma migrate deploy` before `next build`. This work has not deployed the site publicly.

Before a public launch, finish email ownership verification/password recovery, abuse protection and moderation, account deletion/export, and a dependency security review. The dependency audit currently flags a high-severity `deepmerge-ts` advisory through the existing Prisma configuration toolchain; its suggested automatic fix changes the Prisma version, so no forced downgrade was applied. Rental availability calendars, identity verification, payments, refunds, and automated notifications are not implemented. Availability and rental terms are arranged directly with owners.

## Main files

- `src/app/`: pages, server actions, and authentication routes.
- `src/components/`: marketplace, cards, owner forms, and shared UI.
- `src/lib/`: validation, search logic, database client, and photo storage.
- `prisma/`: marketplace schema, migration, and demo seed.
- `tests/`: end-to-end browser tests with an isolated database.
- `public/images/CREDITS.md`: photography sources and demo-image disclosures.
- `public/fonts/OFL.txt`: Plus Jakarta Sans font license.
