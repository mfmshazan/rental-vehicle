import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const manrope = localFont({
  src: "../../public/fonts/manrope.ttf",
  variable: "--font-manrope",
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
    <html lang="en" className={manrope.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
