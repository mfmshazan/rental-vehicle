import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next 16 renamed the old `middleware` convention to `proxy`.
// Runs on the SERVER before every matched request reaches a page or route handler.
// This is your single "access log": watch it print in the terminal running `npm run dev`.
export function proxy(request: NextRequest) {
  console.log(
    `[proxy] ${request.method} ${request.nextUrl.pathname} ${new Date().toISOString()}`,
  );
  return NextResponse.next();
}

// Don't log Next's internal/static asset requests — only real pages & API calls.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
