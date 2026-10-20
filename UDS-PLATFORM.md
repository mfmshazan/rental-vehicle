# UDS — Multi-Provider Bus Platform (target architecture)

**Status:** Plan v1 · evolves the current Roam marketplace codebase.

A marketplace where multiple bus **operators** (UDS is one) each offer **two services**:

1. **Scheduled routes (routine)** — fixed routes on a timetable. Passengers browse *where-to-where* + *available dates*, then **book specific seats online and pay**.
2. **Tour (charter)** — a whole bus for a custom trip. Passengers **contact/inquire** with the operator (custom requirements, price agreed off-platform).

Passengers can open an operator (e.g. UDS) and choose between its two services, **or** run a **cross-provider tour search** that lists tour buses from *all* operators with where each is based and its details.

## Decisions locked

- **Tour booking:** inquiry / call the operator (no online payment).
- **Scheduled booking:** online **seat selection + payment**.
- **Seat layouts:** preset SL **templates + a custom builder** to match each real bus.
- **Payments:** build behind a **mock payment step first**; plug in **PayHere** (Sri Lanka) later.

## Reuse map (current Roam → platform)

| Current (Roam) | Becomes |
|---|---|
| `User` (OWNER) + dashboard | **Operator** account |
| `Vehicle` + multi-photo + CRUD | **Bus** (+ seat capacity, bus type, seat-layout JSON, service tags) |
| Marketplace search across all owners | **Cross-provider tour search** (+ service-type filter, operator location) |
| `BlockedPeriod` + availability calendar + overlap warning | **Unified fleet availability** (shared by both services) |
| `Inquiry` | **Tour booking request** |
| Auth, ownership checks, rate limiting, security headers | Reused as-is |

## Target data model (additions in **bold**)

- **Operator** — enrich `User`: operator name, base city, logo, description.
- **Bus** (extends `Vehicle`): `seatCapacity`, `busType`, **`seatLayout` (JSON)**, **`serviceTypes`** (`SCHEDULED` / `TOUR` / both), photos.
- **Route** — `origin`, `destination`, distance, duration; belongs to operator.
- **Trip** — a `Route` + `Bus` on a `departureAt` date/time, with price-per-seat; the thing passengers browse by from→to→date.
- **SeatBooking** — `tripId`, `seatId`, `status` (HELD/BOOKED), `expiresAt`. **`UNIQUE(tripId, seatId)`** is the anti-double-booking guard.
- **Booking** — passenger + trip + seats + total + status + e-ticket ref.
- **Payment** — mock now (status INITIATED/SUCCESS), PayHere fields later.
- **Inquiry / TourBooking** — tour requests (reuse current `Inquiry`, add service context).
- Reused: `BlockedPeriod` (now the shared "bus busy" layer), `AuthAttempt`.

## Seat layouts (the accuracy problem)

SL buses vary (2+2 ~54-seater, 2+3, 2+1 luxury/semi-luxury, wide back rows, door gaps). So:

- Each **Bus** stores a flexible **seat-layout JSON** — rows of cells, each cell a seat (with label + class) or a gap/aisle:
  ```json
  {
    "name": "Luxury 2+1 (49)",
    "rows": [
      { "cells": ["1A", "gap", "1B", "1C"] },
      { "cells": ["back", "5A", "5B", "5C", "5D", "5E"] }
    ],
    "seatMeta": { "1A": { "class": "window" } }
  }
  ```
- Operators **pick a preset template** then **tweak it in a visual builder** to match their actual bus.
- **Availability is per Trip, never per Bus:** render the bus layout, grey out seats with a `SeatBooking` for *that* trip.

### Booking + (mock) payment flow — scheduled
```
pick seats → HELD rows (expiresAt = now + 10 min)   ← UNIQUE(tripId,seatId) blocks races
   → create Booking (PENDING) → mock payment step
   → success: HELD→BOOKED, Booking CONFIRMED, issue e-ticket
   → cancel/timeout: a job releases expired HELD seats
(Swap the mock step for PayHere redirect + webhook later.)
```

### Shared fleet availability
A bus on a scheduled Trip that day is unavailable for tours; a confirmed tour blocks it from routine. Trips and tour bookings both feed the unified availability a bus exposes.

## Pages / routes

- **Operator landing** `/operators/[id]` — shows the operator's two services to choose from.
- **Scheduled search** — from + to + date → trips with available dates → **trip detail with seat map** → book + pay.
- **Tour search** — today's marketplace filtered to tour buses, showing operator + base location + details → bus detail → inquiry.
- **Service selector** entry point on home / operator page.
- **Operator dashboard** — buses (+ seat-layout builder), routes, trips/timetable, bookings, inquiries.

## Phased plan

| Phase | Deliverable |
|-------|-------------|
| **1** | Operator profile fields; rename Vehicle→Bus with `seatCapacity`/`busType`/`serviceTypes`; service-type filter on tour search; operator landing with the 2-service choice |
| **2** | Seat-layout JSON + preset templates + visual builder in the dashboard |
| **3** | `Route` + `Trip` + scheduled search (from→to→date) + trip detail seat map (read-only availability) |
| **4** | Seat **hold** + **mock payment** + Booking + e-ticket; expiry release job |
| **5** | Unified fleet availability across both services; tour inquiry context |
| **6** | Swap mock payment → PayHere (redirect + webhook); hardening |

## Open items

- Keep tour "inquiry only" or later add structured tour booking statuses?
- Seat pricing: flat per trip, or per seat class (window/premium)?
- Guest checkout vs account required for seat booking?
- E-ticket format (QR/PDF) and delivery (email/SMS) — later phase.
