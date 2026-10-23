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

The SQLite database uses `RENTAL_DATABASE_URL="file:./roam.db"`, relative to `prisma/schema.prisma`. The previous PostgreSQL `DATABASE_URL` is no longer used. Existing values in the developer's `.env` were preserved. Auth.js uses the existing `AUTH_SECRET`.

`db:setup` creates an empty database only when needed, applies committed migrations, generates Prisma Client, and adds six example listings without overwriting existing records. Example owners have no passwords or phone numbers; demo listings cannot receive inquiries. Their imagery and model specifications are illustrative.

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

Playwright uses Microsoft Edge on Windows and Chromium elsewhere (`npx playwright install chromium` if required). Tests launch the production build on port 3100 and use a separate `prisma/roam-test.db`. Test photos are kept under `data/uploads/test`; application photos use `data/uploads/live`. The test suite recreates only the test database.

Browser coverage includes filtering, saved vehicles across reloads, mobile overflow and navigation, demo contact restrictions, registration, invalid/valid login, uploading and publishing a vehicle, inquiry date validation, inquiry delivery, marking inquiries read, owner isolation, edits, pausing, and republishing. Screenshots are written under `test-results/`.

## Storage and deployment

This version runs locally or on a single Node.js server with persistent storage. Back up both `prisma/roam.db` and `data/uploads/live`. Run `npm run build` then `npm start` for production, with a strong `AUTH_SECRET` and HTTPS configured at your host. When using a trusted reverse proxy, configure Auth.js host trust for that deployment.

The current SQLite and filesystem storage are not suitable for ephemeral/serverless hosting or multiple independent instances. Before that deployment, move the database and uploads to durable shared services. This work has not deployed the site publicly.

Before a public launch, finish email ownership verification/password recovery, abuse protection and moderation, account deletion/export, and a dependency security review. The dependency audit currently flags a high-severity `deepmerge-ts` advisory through the existing Prisma configuration toolchain; its suggested automatic fix changes the Prisma version, so no forced downgrade was applied. Rental availability calendars, identity verification, payments, refunds, and automated notifications are not implemented. Availability and rental terms are arranged directly with owners.

## Main files

- `src/app/`: pages, server actions, authentication and photo routes.
- `src/components/`: marketplace, cards, owner forms, and shared UI.
- `src/lib/`: validation, search logic, database client, and photo storage.
- `prisma/`: marketplace schema, migration, and demo seed.
- `tests/`: end-to-end browser tests with an isolated database.
- `public/images/CREDITS.md`: photography sources and demo-image disclosures.
- `public/fonts/OFL.txt`: Plus Jakarta Sans font license.
