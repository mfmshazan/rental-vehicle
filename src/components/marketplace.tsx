"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  categories,
  cities,
  purposes,
  filterVehicles,
  type VehicleCardData,
} from "@/lib/marketplace";
import { Icon } from "./icon";
import { VehicleCard } from "./vehicle-card";
import { SelectMenu } from "./select-menu";
import { useFavorites } from "./favorites";

const purposeIcons: Record<string, string> = {
  "All services": "grid",
  "Events & Functions": "users",
  "Tours & Road trips": "pin",
};

export function Marketplace({
  vehicles,
  savedOnly = false,
}: {
  vehicles: VehicleCardData[];
  savedOnly?: boolean;
}) {
  const [city, setCity] = useState("");
  const [purpose, setPurpose] = useState("All services");
  const [category, setCategory] = useState("All vehicles");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [transmission, setTransmission] = useState("");
  const [driveType, setDriveType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const favorites = useFavorites();
  const source = savedOnly
    ? vehicles.filter((vehicle) => favorites.includes(vehicle.id))
    : vehicles;
  const filtered = filterVehicles(source, {
    city,
    purpose,
    category,
    query,
    sort,
    transmission,
    driveType,
    maxPrice: Number(maxPrice),
  });
  const activeFilterCount =
    [transmission, driveType, maxPrice].filter(Boolean).length +
    (category !== "All vehicles" ? 1 : 0);
  function reset() {
    setCity("");
    setPurpose("All services");
    setCategory("All vehicles");
    setQuery("");
    setTransmission("");
    setDriveType("");
    setMaxPrice("");
  }
  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {!savedOnly && (
        <section className="hero-section container">
          <div className="hero">
            <Image
              src="/images/hero.jpg"
              alt="A car ready for the open road"
              fill
              priority
              sizes="100vw"
              className="hero-image"
            />
            <div className="hero-shade" />
            <div className="hero-content">
              <div className="eyebrow hero-eyebrow">
                <span /> YOUR ISLAND. YOUR WAY.
              </div>
              <h1>
                A better ride.
                <br />A bigger <span>adventure.</span>
              </h1>
              <p>
                Find a vehicle you love, from a local owner.
                <br />
                From everyday errands to the road less travelled.
              </p>
              <a href="#explore" className="hero-explore">
                Find your next ride <Icon name="northeast" size={18} />
              </a>
            </div>
            <div className="hero-caption">
              <Icon name="pin" size={15} /> Good roads. Great company. Sri
              Lanka.
            </div>
            <div className="hero-index">
              <span>01</span>
              <span className="hero-index-line" /> THE OPEN ROAD COLLECTION
            </div>
          </div>
          <form className="search-panel" onSubmit={search}>
            <div className="search-field">
              <Icon name="pin" />
              <label htmlFor="location">
                Where are you headed?
                <select
                  id="location"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                >
                  <option value="">Anywhere in Sri Lanka</option>
                  {cities.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="search-field">
              <Icon name="car" />
              <label htmlFor="vehicle-type">
                Your kind of ride
                <select
                  id="vehicle-type"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="search-field search-drive">
              <Icon name="key" />
              <label htmlFor="drive-type">
                Make it your journey
                <select
                  id="drive-type"
                  value={driveType}
                  onChange={(event) => setDriveType(event.target.value)}
                >
                  <option value="">Self-drive or with a driver</option>
                  <option>Self-drive</option>
                  <option>With driver</option>
                </select>
              </label>
            </div>
            <button className="button button-green search-submit" type="submit">
              <Icon name="search" size={19} /> Find a vehicle
            </button>
          </form>
          <div className="trust-strip">
            <span>
              <Icon name="chat" size={17} /> Connect directly with owners
            </span>
            <span>
              <Icon name="check" size={17} /> No platform booking fees
            </span>
            <span>
              <Icon name="pin" size={17} /> Local rides, island-wide
            </span>
          </div>
        </section>
      )}

      <section
        className={`container explore-section ${savedOnly ? "saved-section" : ""}`}
        id="explore"
      >
        <div className="section-top">
          <div>
            <div className="eyebrow">
              {savedOnly ? "YOUR SHORTLIST" : "FIND YOUR PERFECT MATCH"}
            </div>
            <h2>
              {savedOnly
                ? "Good rides. Kept close."
                : "A ride for every kind of day."}
            </h2>
            <p>
              {savedOnly
                ? "Your favourites, saved on this device for your next adventure."
                : "A quick city trip or a slow coastal drive. There’s a vehicle for that."}
            </p>
          </div>
          {!savedOnly && (
            <a href="#vehicle-grid" className="text-link">
              Explore vehicles <Icon name="arrow" size={17} />
            </a>
          )}
        </div>
        <div className="category-row">
          {purposes.map((item) => (
            <button
              key={item}
              className={`category-tab ${purpose === item ? "active" : ""}`}
              onClick={() => setPurpose(item)}
              aria-pressed={purpose === item}
            >
              <Icon name={purposeIcons[item]} size={23} />
              {item}
            </button>
          ))}
        </div>
        <div className="listing-toolbar">
          <div className="listing-search">
            <Icon name="search" size={17} />
            <input
              type="search"
              placeholder="Search by vehicle or city"
              aria-label="Search vehicles"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="toolbar-right">
            <span className="result-count">
              {filtered.length} {filtered.length === 1 ? "vehicle" : "vehicles"}
            </span>
            <button
              className={`button filter-button ${filtersOpen ? "selected" : ""}`}
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <Icon name="filter" size={17} /> Filters
              {activeFilterCount > 0 && (
                <span className="filter-count">{activeFilterCount}</span>
              )}
            </button>
            <select
              className="sort-select"
              aria-label="Sort vehicles"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="year">Newest model</option>
            </select>
          </div>
        </div>
        {filtersOpen && (
          <div className="filter-panel">
            <div className="filter-field">
              <span className="filter-field-label">Vehicle type</span>
              <SelectMenu
                label="Vehicle type"
                value={category}
                onChange={setCategory}
                options={categories.map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            </div>
            <div className="filter-field">
              <span className="filter-field-label">Location</span>
              <SelectMenu
                label="Location"
                value={city}
                onChange={setCity}
                options={[
                  { value: "", label: "All locations" },
                  ...cities.map((item) => ({ value: item, label: item })),
                ]}
              />
            </div>
            <div className="filter-field">
              <span className="filter-field-label">Transmission</span>
              <SelectMenu
                label="Transmission"
                value={transmission}
                onChange={setTransmission}
                options={[
                  { value: "", label: "Any transmission" },
                  { value: "Automatic", label: "Automatic" },
                  { value: "Manual", label: "Manual" },
                ]}
              />
            </div>
            <div className="filter-field">
              <span className="filter-field-label">Daily budget</span>
              <SelectMenu
                label="Daily budget"
                value={maxPrice}
                onChange={setMaxPrice}
                options={[
                  { value: "", label: "Any price" },
                  { value: "10000", label: "Up to Rs. 10,000" },
                  { value: "20000", label: "Up to Rs. 20,000" },
                  { value: "30000", label: "Up to Rs. 30,000" },
                ]}
              />
            </div>
            <div className="filter-field">
              <span className="filter-field-label">Drive type</span>
              <SelectMenu
                label="Drive type"
                value={driveType}
                onChange={setDriveType}
                options={[
                  { value: "", label: "Any drive type" },
                  { value: "Self-drive", label: "Self-drive" },
                  { value: "With driver", label: "With driver" },
                ]}
              />
            </div>
            <button onClick={reset} className="text-link">
              Reset all
            </button>
          </div>
        )}
        {(city ||
          purpose !== "All services" ||
          category !== "All vehicles" ||
          query ||
          activeFilterCount > 0) && (
          <div className="active-filters">
            <span>
              Showing {city || "all locations"}
              {purpose !== "All services" ? ` · ${purpose}` : ""}
              {category !== "All vehicles" ? ` · ${category}` : ""}
              {query ? ` · “${query}”` : ""}
            </span>
            <button onClick={reset}>
              Clear filters <Icon name="close" size={13} />
            </button>
          </div>
        )}
        <div className="vehicle-grid" id="vehicle-grid">
          {filtered.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">
              <Icon name={savedOnly ? "heart" : "search"} size={32} />
            </span>
            <h3>
              {savedOnly && source.length === 0
                ? "Your next adventure is waiting."
                : "No rides found this time."}
            </h3>
            <p>
              {savedOnly && source.length === 0
                ? "Tap the heart on a vehicle to keep it here for later."
                : "Try another location, vehicle type, or price range."}
            </p>
            {savedOnly && source.length === 0 ? (
              <Link className="button button-green" href="/#explore">
                Explore vehicles <Icon name="arrow" size={17} />
              </Link>
            ) : (
              <button className="button button-green" onClick={reset}>
                Clear filters
              </button>
            )}
          </div>
        )}
        {filtered.some((vehicle) => vehicle.demo) && (
          <p className="demo-note">
            Explore the experience with our sample listings. Vehicles marked
            “Demo listing” use illustrative photos and aren’t available to rent.
          </p>
        )}
      </section>
      {!savedOnly && (
        <>
          <section className="how-section" id="how-it-works">
            <div className="container">
              <div className="section-top">
                <div>
                  <div className="eyebrow">LESS PLANNING. MORE GOING.</div>
                  <h2>Your next trip, in three simple steps.</h2>
                </div>
                <p className="section-aside">
                  You choose the ride.
                  <br />
                  The owner takes it from there.
                </p>
              </div>
              <div className="steps-grid">
                <div className="step">
                  <div className="step-top">
                    <span className="step-icon">
                      <Icon name="search" size={25} />
                    </span>
                    <span>01</span>
                  </div>
                  <h3>Find your kind of ride</h3>
                  <p>
                    Browse vehicles by location, style, and budget. Find the one
                    that fits your plans.
                  </p>
                </div>
                <div className="step">
                  <div className="step-top">
                    <span className="step-icon">
                      <Icon name="chat" size={25} />
                    </span>
                    <span>02</span>
                  </div>
                  <h3>Say hello to the owner</h3>
                  <p>
                    Call, send a WhatsApp message, or leave an inquiry. Get the
                    details, directly.
                  </p>
                </div>
                <div className="step">
                  <div className="step-top">
                    <span className="step-icon">
                      <Icon name="key" size={25} />
                    </span>
                    <span>03</span>
                  </div>
                  <h3>Agree, grab the keys, go</h3>
                  <p>
                    Arrange your dates and rental terms with the owner. Then
                    make the journey yours.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="container owner-section">
            <div className="owner-banner">
              <div className="owner-banner-copy">
                <div className="eyebrow">A LITTLE MORE FROM YOUR DRIVEWAY</div>
                <h2>
                  Your vehicle.
                  <br />
                  Someone’s next adventure.
                </h2>
                <p>
                  Turn parked days into possibilities. List your vehicle
                  <br className="desktop-break" /> and connect with people
                  looking for a ride like yours.
                </p>
                <Link href="/list-your-car" className="button button-lime">
                  List your vehicle <Icon name="northeast" size={18} />
                </Link>
                <span className="owner-small">
                  Free to list. You’re in the driver’s seat.
                </span>
              </div>
              <div className="owner-banner-visual">
                <Image
                  src="/images/suv.jpg"
                  alt="A vehicle ready for its next journey"
                  fill
                  sizes="(max-width: 700px) 100vw, 45vw"
                />
                <div className="owner-photo-overlay" />
                <span className="owner-photo-label">
                  <span className="live-dot" /> Park less. Possibility more.
                </span>
              </div>
            </div>
          </section>
          <section className="container faq-section">
            <div>
              <div className="eyebrow">BEFORE YOU HIT THE ROAD</div>
              <h2>
                A few things
                <br />
                you might be wondering.
              </h2>
              <Link href="/guidelines" className="text-link">
                Read our rental guidelines <Icon name="arrow" size={17} />
              </Link>
            </div>
            <div className="faq-list">
              {[
                [
                  "How does renting through Roam work?",
                  "Find a vehicle and contact its owner directly. You and the owner agree on availability, pickup, documents, deposits, and payment. Roam helps you make the connection; your rental agreement is with the owner.",
                ],
                [
                  "Can I rent with a driver?",
                  "Yes. Use the drive-type filter to find vehicles offered with a driver. Ask the owner whether the listed daily rate includes driver charges, fuel, and any overnight allowances.",
                ],
                [
                  "Does Roam charge a booking fee?",
                  "Roam currently charges no listing or booking fee. The owner sets the rental price and payment terms. Confirm the full cost, including any deposit, mileage limits, and fuel charges, before agreeing.",
                ],
                [
                  "Can I list my own vehicle?",
                  "Absolutely. Create an owner account, add your vehicle details and a clear photo, and publish your listing. You can edit or pause it anytime from your dashboard.",
                ],
              ].map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {question}
                    <Icon name="plus" size={18} />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
