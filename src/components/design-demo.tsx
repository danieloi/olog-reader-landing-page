/**
 * Design System Demo Component
 * Demonstrates the implemented design requirements:
 * - Background gradients (pale blue to white / deep navy to dark)
 * - Typography hierarchy (serif for H1/H2, sans-serif for other text)
 * - Text colors (primary/secondary)
 * - 8-pixel rhythm spacing
 */

import React from "react";

export default function DesignDemo() {
  return (
    <div className="min-h-screen">
      {/* Hero section with gradient background */}
      <section
        className="py-16 px-8"
        style={{ background: "var(--background-gradient-hero)" }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Display headlines using serif fonts */}
          <h1 className="text-6xl font-serif font-semibold text-text-primary mb-6">
            Beautiful Book-Inspired Design
          </h1>
          <h2 className="text-3xl font-serif font-medium text-text-primary mb-8">
            Elegant Typography Meets Modern Functionality
          </h2>

          {/* Body text using sans-serif with proper spacing */}
          <div className="space-y-6">
            <p className="text-lg text-text-primary leading-relaxed">
              This design system follows a clean 8-pixel rhythm for consistent
              spacing and uses elegant serif fonts for headlines to evoke the
              feeling of classic literature.
            </p>
            <p className="text-base text-text-secondary leading-relaxed">
              Secondary text uses a muted color for less prominent information,
              while maintaining excellent readability in both light and dark
              modes.
            </p>
          </div>
        </div>
      </section>

      {/* Content area demonstrating spacing and colors */}
      <section className="bg-background-content py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8">
            {/* Typography samples */}
            <div className="space-y-6">
              <h3 className="text-2xl font-sans font-medium text-text-primary">
                Typography Hierarchy
              </h3>
              <div className="space-y-4">
                <div className="p-6 bg-background-card rounded-lg">
                  <h4 className="text-xl font-sans font-medium text-text-primary mb-2">
                    Sans-serif for Modern Legibility
                  </h4>
                  <p className="text-text-secondary">
                    All body text, labels, and interactive elements use Inter
                    for optimal readability.
                  </p>
                </div>
              </div>
            </div>

            {/* Spacing demonstration */}
            <div className="space-y-6">
              <h3 className="text-2xl font-sans font-medium text-text-primary">
                8-Pixel Rhythm
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div
                    className="h-2 bg-primary-300 rounded"
                    style={{ marginBottom: "8px" }}
                  ></div>
                  <div
                    className="h-2 bg-primary-400 rounded"
                    style={{ marginBottom: "16px" }}
                  ></div>
                  <div
                    className="h-2 bg-primary-500 rounded"
                    style={{ marginBottom: "24px" }}
                  ></div>
                  <div
                    className="h-2 bg-primary-600 rounded"
                    style={{ marginBottom: "32px" }}
                  ></div>
                </div>
                <div className="text-text-secondary text-sm space-y-1">
                  <p>8px spacing</p>
                  <p>16px spacing</p>
                  <p>24px spacing</p>
                  <p>32px spacing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
