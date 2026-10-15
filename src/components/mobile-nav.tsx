"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "./icon";
export function MobileNav({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-nav">
      <button
        className="icon-button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>
      {open && (
        <nav
          aria-label="Mobile navigation"
          className="mobile-menu"
          onClick={() => setOpen(false)}
        >
          <Link href="/#explore">Find a vehicle</Link>
          <Link href="/saved">Saved vehicles</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href={signedIn ? "/dashboard" : "/login"}>
            {signedIn ? "Dashboard" : "Log in"}
          </Link>
          <Link href="/list-your-car">List your vehicle ↗</Link>
        </nav>
      )}
    </div>
  );
}
