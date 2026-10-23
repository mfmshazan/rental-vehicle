import { headers } from "next/headers";

// Windows and thresholds for authentication throttling.
export const AUTH_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const MAX_LOGIN_FAILS_PER_EMAIL = 5;
export const MAX_LOGIN_FAILS_PER_IP = 20;
export const REGISTER_WINDOW_MS = 60 * 60 * 1000; // 1 hour
export const MAX_REGISTERS_PER_IP = 10;

export const INQUIRY_WINDOW_MS = 60 * 60 * 1000; // 1 hour
export const MAX_INQUIRIES_PER_EMAIL = 5;
export const MAX_INQUIRIES_PER_IP = 10; // higher: an IP may be a shared office/campus

export const MAX_RESETS_PER_IP = 5; // password-reset requests per IP per AUTH_WINDOW_MS

// Best-effort client IP. Behind a trusted proxy this comes from the standard
// forwarding headers; locally it falls back to a shared "local" bucket.
export async function clientIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || "local"
  );
}
