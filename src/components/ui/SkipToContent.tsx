"use client";

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only absolute left-4 top-4 z-50 rounded bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      Skip to content
    </a>
  );
}
