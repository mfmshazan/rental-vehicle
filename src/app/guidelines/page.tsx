import Link from "next/link";
export const metadata = { title: "Rental guidelines" };
export default function GuidelinesPage() {
  return (
    <article className="container prose-page">
      <Link href="/" className="back-link">
        ← Back to Roam
      </Link>
      <div className="eyebrow">GOOD JOURNEYS START WITH CLEAR DETAILS</div>
      <h1>
        A little clarity.
        <br />A better journey.
      </h1>
      <p className="lead">
        Roam connects vehicle owners and renters across Sri Lanka. The rental
        itself is agreed directly between you.
      </p>
      <h2>For renters</h2>
      <p>
        Contact the owner to confirm your dates, pickup location, vehicle
        condition, and total price. Ask what is included: mileage, fuel,
        insurance, a driver, and any deposit. Agree cancellation terms before
        paying.
      </p>
      <p>
        Inspect the vehicle together at pickup. Record its condition and agree
        how and when it will be returned. Ask the owner which driving licence
        and identity documents they require.
      </p>
      <h2>For owners</h2>
      <p>
        Only list a vehicle you own or are authorised to rent out. Use an
        accurate description, a current photo, and a price that reflects your
        offer. Confirm that the vehicle and your insurance cover the rental you
        are offering.
      </p>
      <p>
        Respond to inquiries using the contact information provided. Keep
        customers’ information private and use it only to discuss their rental.
        Pause a listing whenever you are no longer accepting inquiries.
      </p>
      <h2>How Roam works</h2>
      <p>
        Roam currently charges no listing or booking fee and does not collect
        rental payments or deposits. Sending an inquiry does not reserve a
        vehicle. Roam does not verify owners or guarantee vehicle availability;
        confirm the details directly before making an agreement.
      </p>
      <h2>About sample listings</h2>
      <p>
        Listings marked “Demo listing” are examples to help you explore the
        website. Their photos are illustrative, their owners are fictional, and
        they cannot receive inquiries or be rented.
      </p>
      <Link href="/#explore" className="button button-green">
        Find your next ride →
      </Link>
    </article>
  );
}
