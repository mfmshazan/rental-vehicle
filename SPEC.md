# UDS Travels — Bus Booking Platform · Specification

**Status:** Draft v1 · **Date:** 2026-10-06
**Stack:** Next.js (App Router, full-stack) · PostgreSQL · Prisma ORM · Tailwind CSS · PayHere (payments)

---

## 1. Overview

UDS Travels offers two distinct services. The platform serves both, plus an admin back office.

| # | Service | Booking model | Payment |
|---|---------|---------------|---------|
| 1 | **Bus charter / hire** — rent a whole bus for a custom trip | Inquiry → quote → confirm | Deposit or offline/online |
| 2 | **Scheduled routes** — fixed timetabled trips (e.g. Colombo↔Kalpitiya, Puttalam↔Colombo) | Per-seat, self-service online | Online via PayHere |

The scheduled-route seat booking is the technically demanding part (live seat maps, concurrency, payment reliability). The charter side is mostly a structured inquiry + admin quote workflow.

---

## 2. Actors

- **Customer (public)** — browses routes, books seats, pays, gets an e-ticket; or submits a charter inquiry.
- **Admin / UDS staff** — manages buses, routes, schedules, trips, bookings, and charter quotes; views reports.
- **System (background jobs)** — releases expired seat holds, generates trips from schedules, sends tickets/notifications.

---

## 3. Core Concepts & Data Model

**Key principle:** A **Bus** has a fixed *seat layout* (a template). A **Trip** is one bus running one route at one date/time. **Seat availability is always per-Trip, never per-Bus.**

### Entities

```
User          id, name, email, phone, passwordHash, role (CUSTOMER|ADMIN), createdAt

Bus           id, name, registrationNo, type (AC|NON_AC|LUXURY|SEMI_LUXURY),
              totalSeats, seatLayout (JSON), amenities (JSON), active

Route         id, origin, destination, distanceKm, approxDurationMin, active

Schedule      id, routeId, busId, departureTime, arrivalTime,
              daysOfWeek (JSON e.g. [MON,WED,FRI]), basePrice, active
              // the recurring timetable template

Trip          id, scheduleId, travelDate, departureAt, status (SCHEDULED|DEPARTED|CANCELLED),
              priceOverride?   // a concrete run of a schedule on a date

SeatBooking   id, tripId, seatNo, status (HELD|BOOKED), bookingId?, userId?,
              heldAt, expiresAt
              // UNIQUE(tripId, seatNo) — the anti-double-booking guard

Booking       id, userId?, tripId, passengerName, passengerPhone, passengerEmail,
              seatNos (JSON), totalAmount, status (PENDING|CONFIRMED|CANCELLED|EXPIRED),
              eTicketRef, createdAt

Payment       id, bookingId, gatewayRef, amount, currency (LKR),
              status (INITIATED|SUCCESS|FAILED|REFUNDED), rawPayload (JSON), createdAt

CharterInquiry id, name, phone, email, tripDate, returnDate?, pickup, dropoff,
               passengers, busType, oneWay, notes,
               status (NEW|QUOTED|CONFIRMED|CLOSED), quotedAmount?, adminNotes
```

### Seat layout JSON (example)

```json
{
  "rows": 11,
  "columns": ["A", "B", "aisle", "C", "D"],
  "seats": [
    { "no": "1A", "row": 1, "col": "A", "type": "normal" },
    { "no": "1B", "row": 1, "col": "B", "type": "normal" }
  ],
  "disabled": ["driver"]
}
```

Availability for a trip = `layout.seats` **minus** every `SeatBooking` for that trip where
`status = BOOKED` OR (`status = HELD` AND `expiresAt > now`).

---

## 4. Feature Breakdown

### 4.1 Public — Scheduled route booking (Service 2)
1. **Search:** choose origin, destination, travel date → list matching trips (departure, bus type, price, seats remaining).
2. **Trip detail / seat map:** pick a trip → render interactive seat map (available / held / booked colour-coded).
3. **Seat selection:** select 1..n seats → system places **HELD** rows with a 10-minute expiry; a countdown shows in the UI.
4. **Passenger details:** name, phone, email (+ optional login/guest checkout).
5. **Payment:** redirect to PayHere; on success the booking is confirmed.
6. **E-ticket:** generate ticket with QR + booking reference; email/SMS it.

### 4.2 Public — Charter inquiry (Service 1)
1. Form: trip date(s), pickup/drop, passengers, bus type, one-way/return, notes.
2. Submit → `CharterInquiry (NEW)` + notify admin.
3. Admin reviews, sends a quote (status → QUOTED). Optional: online deposit link via PayHere.
4. Customer confirms → CONFIRMED.

### 4.3 Admin dashboard
- **Buses:** CRUD + visual seat-layout builder.
- **Routes:** CRUD.
- **Schedules:** recurring timetable per route+bus (departure time, days, price).
- **Trips:** auto-generate from schedules (e.g. next 30 days) + manual create/cancel.
- **Bookings:** view/search, cancel/refund, manual booking (counter sales).
- **Charter inquiries:** inbox, quote, status updates.
- **Reports:** revenue, occupancy per trip/route, upcoming departures.

---

## 5. Seat-Locking & Payment Flow (critical path)

```
Select seats
   │  INSERT SeatBooking(status=HELD, expiresAt=now+10m)   ← UNIQUE(tripId,seatNo) blocks races
   ▼
Create Booking(status=PENDING)  +  Payment(status=INITIATED)
   │  redirect to PayHere checkout (hash-signed)
   ▼
PayHere  ──success──► server webhook (notify_url)  ──► verify signature
   │                        │ SUCCESS: SeatBooking HELD→BOOKED, Booking→CONFIRMED, issue e-ticket
   │                        │ FAIL:    release holds, Booking→CANCELLED
   └──cancel/timeout──► background job releases expired HELD seats back to pool
```

**Concurrency rule:** the `UNIQUE(tripId, seatNo)` constraint is the real guard — two simultaneous requests for the same seat: one INSERT wins, the other fails and the UI re-renders the map. Never rely on a "seats remaining" counter alone.

**Expiry job:** a scheduled task (cron / Next.js route hit by a scheduler, or `pg_cron`) deletes/releases `HELD` rows past `expiresAt` every minute.

---

## 6. PayHere Integration Notes

- **Mode:** Checkout redirect + server-to-server webhook (`notify_url`). Never trust the browser return URL alone.
- **Config needed from UDS:** Merchant ID, Merchant Secret, (sandbox first).
- **Request hash:** `md5(merchant_id + order_id + amount + currency + md5(merchant_secret))` — generated server-side.
- **Webhook verification:** recompute `md5sig` from `merchant_id + order_id + payhere_amount + payhere_currency + status_code + md5(merchant_secret)` and compare before confirming.
- **Currency:** LKR. Amounts formatted to 2 decimals.
- **Flow:** start in **sandbox**, switch to live after UDS provides live merchant credentials and completes PayHere approval.

---

## 7. Tech & Project Structure

```
bus-booking/
├─ app/
│  ├─ (public)/            routes, search, seat-map, charter, checkout
│  ├─ (admin)/             dashboard (protected)
│  ├─ api/
│  │   ├─ trips/           search, seat availability
│  │   ├─ bookings/        hold seats, create booking
│  │   ├─ payments/payhere/  start + notify (webhook)
│  │   └─ charter/
├─ lib/                    prisma client, payhere, auth, ticket (QR/PDF)
├─ prisma/schema.prisma
├─ components/             SeatMap, TripCard, etc.
└─ jobs/                   expire-holds, generate-trips
```

- **Auth:** NextAuth / Auth.js (email+password or OTP). Admin routes gated by role. Guest checkout allowed for customers.
- **Validation:** Zod on all API inputs.
- **E-ticket:** QR (booking ref) + PDF; email via Resend/SMTP, SMS via a Sri Lankan provider (e.g. Dialog/Mspace/Text.lk) — optional phase.
- **Hosting:** Vercel (app) + managed Postgres (Neon/Supabase/Railway), or a VPS. All viable from Sri Lanka.

---

## 8. Milestones

| Phase | Deliverable |
|-------|-------------|
| **0. Setup** | Next.js + Prisma + Postgres + Tailwind + auth skeleton, base schema migrated |
| **1. Admin core** | Bus (with seat-layout builder), Route, Schedule CRUD; trip generation |
| **2. Public search + seat map** | Route search, trip list, interactive seat map, seat HELD logic + expiry job |
| **3. Booking + PayHere (sandbox)** | Booking creation, payment start/webhook, confirm, e-ticket |
| **4. Charter flow** | Public inquiry form, admin quote workflow |
| **5. Notifications & reports** | Email/SMS tickets, occupancy/revenue reports |
| **6. Hardening & go-live** | Live PayHere, error handling, refunds/cancellations, polish, deploy |

---

## 9. Open Questions (need UDS input)

1. **Login required** to book, or allow **guest checkout**? (Recommend guest + optional account.)
2. **Seat pricing** — flat per trip, or seat-type tiers (window/front)?
3. **Cancellation / refund policy** — self-service or admin-only?
4. **Hold duration** — 10 minutes OK?
5. **Languages** — English only, or Sinhala/Tamil too?
6. **SMS tickets** — required at launch or later? (adds a paid SMS provider)
7. **Charter** — fixed price list by bus+distance, or always manual quote?
8. **Counter/offline bookings** — do staff sell seats in person that must sync with online availability? (affects admin manual-booking feature)
```
