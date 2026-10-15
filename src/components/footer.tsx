import Link from "next/link";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link href="/" className="logo">
              roam<span className="logo-dot">.</span>
            </Link>
            <p>
              Good journeys start with the right ride.
              <br />
              Find yours, right here in Sri Lanka.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <span>EXPLORE</span>
              <Link href="/#explore">Find a vehicle</Link>
              <Link href="/saved">Saved vehicles</Link>
            </div>
            <div>
              <span>FOR OWNERS</span>
              <Link href="/list-your-car">List your vehicle</Link>
              <Link href="/dashboard">Owner dashboard</Link>
            </div>
            <div>
              <span>GOOD TO KNOW</span>
              <Link href="/#how-it-works">How it works</Link>
              <Link href="/guidelines">Rental guidelines</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Roam. Made for the open road.
          </span>
          <span>
            <span className="country-dot" /> Sri Lanka{" "}
            <span className="footer-separator">/</span> English{" "}
            <span className="footer-separator">/</span> LKR
          </span>
        </div>
      </div>
    </footer>
  );
}
