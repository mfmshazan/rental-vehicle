"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container empty-state not-found">
      <span className="eyebrow">A BUMP IN THE ROAD</span>
      <h1>Let’s try that again.</h1>
      <p>We couldn’t load this page. Please try again in a moment.</p>
      <button className="button button-green" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
