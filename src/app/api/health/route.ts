import { NextResponse } from "next/server";

// Process health only; this does not probe the database or external services.
export function GET() {
  return NextResponse.json({ status: "ok", app: "Roam" });
}
