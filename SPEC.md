# Roam vehicle rental marketplace

The project has pivoted from UDS bus booking to a Sri Lankan vehicle rental directory. Brand: **Roam**. Currency: **LKR**. Language: **English**.

## Customer journey

1. Browse or search active vehicle listings.
2. Filter by location, vehicle type, daily budget, transmission, or self-drive/with-driver rental.
3. Compare photos, features, and daily rates; save interesting vehicles on the current device.
4. Open a detail page and contact a real owner by phone, WhatsApp, or an inquiry.
5. Agree dates, availability, pickup, insurance, deposits, and payment directly with the owner.

## Owner journey

1. Register with name, email, Sri Lankan mobile number, and password.
2. Publish a vehicle with its city, specifications, daily rate, rental type, description, features, and a photo.
3. Receive customer inquiries in a private dashboard and reply through the supplied contact details.
4. Edit, pause, or republish owned listings.

## Data

- **User:** owner profile, public phone/name, private email and bcrypt password hash.
- **Vehicle:** owner relation, specifications, description, price, photo path, features, published and demo flags.
- **Inquiry:** vehicle relation, customer contact details, requested dates, message, read status, timestamp.

SQLite provides durable local storage. Uploaded photos are served from a controlled local directory. A separate test database and upload folder isolate automated QA from real owners and listings.

## Product boundaries

Roam connects people; it does not take rental payments or guarantee availability. Inquiries do not create reservations. There are no claims that owners are verified, no fabricated reviews, and no active contact links on demo listings. Prices and vehicle details on examples are illustrative.

## Next launch work

Choose production hosting and durable storage; add email verification and account recovery; implement account data controls, moderation, and stronger abuse prevention; review dependencies and rental policies. Add multiple listing photos, more locations, and owner availability calendars when needed.
