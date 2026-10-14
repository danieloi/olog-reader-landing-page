"use client";

import { motion } from "framer-motion";

type Variant = "accent" | "primary";

type Audience = {
  label: string;
  heading: string;
  description: string;
  variant: Variant;
  glyph: React.ReactNode;
};

function GlyphRipple() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full stroke-current">
      <circle cx="60" cy="60" r="10" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="24" strokeWidth="1.2" opacity="0.7" />
      <circle cx="60" cy="60" r="40" strokeWidth="1" opacity="0.45" />
      <circle cx="60" cy="60" r="56" strokeWidth="0.8" opacity="0.2" />
    </svg>
  );
}

function GlyphFlow() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full stroke-current">
      {[20, 38, 56, 74, 92].map((y, i) => (
        <path
          key={y}
          d={`M 8 ${y} Q 30 ${y - 4 + i * 1.5} 60 ${y} T 112 ${y}`}
          strokeWidth={i === 2 ? "1.8" : "1.2"}
          opacity={i === 2 ? 1 : 0.4}
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </svg>
  );
}

function GlyphWave() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full stroke-current">
      {Array.from({ length: 18 }).map((_, i) => {
        const x = 8 + i * 6;
        const h = [14, 28, 18, 40, 22, 52, 30, 60, 36, 64, 42, 56, 28, 44, 20, 36, 14, 24][i];
        return (
          <line
            key={i}
            x1={x}
            x2={x}
            y1={60 - h / 2}
            y2={60 + h / 2}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={i === 7 || i === 8 ? 1 : 0.55}
          />
        );
      })}
    </svg>
  );
}

const audiences: Audience[] = [
  {
    label: "ADHD",
    heading: "Stay focused, effortlessly",
    description:
      "Audio narration works with real-time highlighting to anchor your gaze — so you absorb more without the mental strain of re-reading.",
    variant: "accent",
    glyph: <GlyphRipple />,
  },
  {
    label: "Dyslexia",
    heading: "Read without the struggle",
    description:
      "Hear text as it's highlighted in real time. Reflow mode reshapes pages to your screen, reducing visual clutter so every document feels approachable.",
    variant: "primary",
    glyph: <GlyphFlow />,
  },
  {
    label: "Visual Impairments",
    heading: "Your eyes can rest",
    description:
      "Natural-sounding voices turn any document into an audiobook. Adjustable speed, offline access, and dark mode let you consume content on your terms.",
    variant: "accent",
    glyph: <GlyphWave />,
  },
];

const variantStyles: Record<
  Variant,
  { border: string; bg: string; text: string; label: string }
> = {
  accent: {
    border: "border-accent/30",
    bg: "bg-accent/8 dark:bg-accent/10",
    text: "text-accent",
    label: "text-accent-700",
  },
  primary: {
    border: "border-primary/30",
    bg: "bg-primary/8 dark:bg-primary/10",
    text: "text-primary",
    label: "text-primary-700",
  },
};

function AudienceCard({ a, index }: { a: Audience; index: number }) {
  const v = variantStyles[a.variant];
  return (
    <motion.article
      className={`relative rounded-3xl border ${v.border} ${v.bg} p-4 md:p-6 flex flex-col overflow-hidden h-full`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        aria-hidden
        className={`absolute -right-6 -bottom-6 w-40 h-40 md:w-48 md:h-48 opacity-25 ${v.text}`}
      >
        {a.glyph}
      </div>
      <div className="relative z-10 flex flex-col">
        <p className={`type-eyebrow mb-2 md:mb-3 ${v.label}`}>{a.label}</p>
        <h3 className="type-h3 text-text-primary mb-2">
          {a.heading}
        </h3>
        <p className="text-base md:text-lg text-text-secondary leading-relaxed">
          {a.description}
        </p>
      </div>
    </motion.article>
  );
}

export function AccessibilitySection() {
  return (
    <section className="py-12 md:py-28 px-4">
      <motion.div
        className="max-w-7xl mx-auto mb-10 md:mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <p className="type-eyebrow text-primary-700 mb-2">
          Designed for everyone
        </p>
        <h2 className="type-h2 text-text-primary max-w-4xl">
          Reading should be accessible to all.
        </h2>
        <p className="type-lead mt-3 text-text-secondary max-w-2xl">
          Olog helps you move past the limitations — so nothing stands between
          you and the content you love.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 md:gap-8 items-stretch">
        {audiences.map((a, i) => (
          <AudienceCard key={a.label} a={a} index={i} />
        ))}
      </div>
    </section>
  );
}
