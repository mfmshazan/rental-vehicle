"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Reveals elements tagged with `data-reveal` (single block) or
// `data-reveal-group` (stagger its direct children) as they scroll into view.
// The `reveal-on` class is set on <html> before paint (see layout.tsx), so the
// initial hidden state only applies once JS is present — content stays visible
// for no-JS visitors and crawlers. Re-runs on route changes so client-side
// navigation animates the new page too.
export function ScrollReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-group]"),
    );
    if (elements.length === 0) return;

    // Respect reduced-motion: show everything immediately, no animation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
