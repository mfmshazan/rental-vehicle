import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import "./globals.css";

const jakarta = localFont({
  src: "../../public/fonts/plus-jakarta-sans.ttf",
  variable: "--font-jakarta",
  display: "swap",
});
export const metadata: Metadata = {
  title: { default: "Roam — Your island. Your way.", template: "%s | Roam" },
  description:
    "Find your next ride in Sri Lanka. Explore vehicles from local owners, compare daily rates, and connect directly. Your island, your way.",
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        {/* Enable scroll-reveal before first paint so tagged elements start
            hidden only when JS is present (keeps content visible without JS). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('reveal-on')",
          }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  );
}
