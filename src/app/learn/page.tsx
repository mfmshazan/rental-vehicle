import RequestTracerDemo from "./RequestTracerDemo";

// This is a SERVER COMPONENT (no "use client"). It renders on the server.
// Its own data-fetching would NOT appear in the browser Network tab.
export default function LearnPage() {
  // This log prints in the TERMINAL every time the page is server-rendered.
  console.log("[learn/page] server-rendered the /learn page");

  return (
    <main style={{ padding: 32, fontFamily: "system-ui", display: "grid", gap: 16 }}>
      <h1>Request tracer — study the flow</h1>
      <p style={{ maxWidth: 640 }}>
        Open <strong>DevTools → Network</strong> (F12) and keep the{" "}
        <strong>terminal running <code>npm run dev</code></strong> visible. Then click the
        button. Watch the same request show up in BOTH places:
      </p>
      <ol style={{ maxWidth: 640, lineHeight: 1.6 }}>
        <li>
          <strong>Browser (Network tab):</strong> a <code>GET /api/health</code> row — click it
          to inspect headers, response, timing.
        </li>
        <li>
          <strong>Terminal:</strong> <code>[proxy] GET /api/health</code> then{" "}
          <code>[api/health] request received</code>.
        </li>
      </ol>
      <RequestTracerDemo />
    </main>
  );
}
