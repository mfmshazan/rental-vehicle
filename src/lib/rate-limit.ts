import { headers } from "next/headers";

// Windows and thresholds for authentication throttling.
export const AUTH_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const MAX_LOGIN_FAILS_PER_EMAIL = 5;
export const MAX_LOGIN_FAILS_PER_IP = 20;
export const REGISTER_WINDOW_MS = 60 * 60 * 1000; // 1 hour
export const MAX_REGISTERS_PER_IP = 10;

// Best-effort client IP. Behind a trusted proxy this comes from the standard
// forwarding headers; locally it falls back to a shared "local" bucket.
export async function clientIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || "local"
  );
}
