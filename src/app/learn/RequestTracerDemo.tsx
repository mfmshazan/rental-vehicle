"use client"; // This component runs in the BROWSER — so its fetch() is a real HTTP request you can see in DevTools → Network.

import { useState } from "react";

export default function RequestTracerDemo() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function ping() {
    setLoading(true);
    // 1) Browser sends an HTTP GET to our backend route handler.
    const res = await fetch("/api/health");
    // 2) We read the JSON the backend sent back.
    const data = await res.json();
    setResult(`HTTP ${res.status}\n\n` + JSON.stringify(data, null, 2));
    setLoading(false);
  }

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 480 }}>
      <button
        onClick={ping}
        disabled={loading}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          border: "1px solid #888",
          cursor: "pointer",
          width: "fit-content",
        }}
      >
        {loading ? "Sending…" : "Send request → /api/health"}
      </button>
      {result && (
        <pre
          style={{
            background: "#111",
            color: "#0f0",
            padding: 12,
            borderRadius: 8,
            whiteSpace: "pre-wrap",
          }}
        >
          {result}
        </pre>
      )}
    </div>
  );
}
