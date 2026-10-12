import { NextResponse } from "next/server";

// A backend HTTP endpoint. This is "where the request arrives" on the server.
// GET http://localhost:3000/api/health
export async function GET(request: Request) {
  // This console.log prints in the TERMINAL (server), not the browser console.
  console.log(
    `[api/health] request received — ua=${request.headers.get("user-agent")?.slice(0, 40)}`,
  );

  // Whatever we return here is the HTTP response the browser receives.
  return NextResponse.json({
    status: "ok",
    message: "Hello from the backend 👋",
    time: new Date().toISOString(),
  });
}
