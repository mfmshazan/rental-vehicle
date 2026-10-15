import Link from "next/link";
import { auth } from "@/auth";
import { Icon } from "./icon";
import { MobileNav } from "./mobile-nav";

export async function Header() {
  const session = await auth();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo" aria-label="Roam home">
          <span className="logo-symbol">
            <span />
            <span />
            <span />
          </span>
          roam<span className="logo-dot">.</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/#explore">Find a vehicle</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/list-your-car">For owners</Link>
        </nav>
        <div className="header-actions">
          <Link className="saved-nav" href="/saved" aria-label="Saved vehicles">
            <Icon name="heart" />
            <span>Saved</span>
          </Link>
          <span className="nav-divider" />
          <Link
            className="signin-link"
            href={session ? "/dashboard" : "/login"}
          >
            {session ? "Dashboard" : "Log in"}
          </Link>
          <Link
            className="button button-dark header-list"
            href="/list-your-car"
          >
            List your vehicle <Icon name="northeast" size={16} />
          </Link>
          <MobileNav signedIn={!!session} />
        </div>
      </div>
    </header>
  );
}
