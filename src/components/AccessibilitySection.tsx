"use client";

import { motion } from "framer-motion";
import { Brain, Eye, BookOpen } from "lucide-react";

const audiences = [
  {
    icon: Brain,
    label: "ADHD",
    heading: "Stay focused, effortlessly",
    description:
      "Word-by-word highlighting and audio narration work together to anchor your attention — so you absorb more without the mental strain of re-reading.",
  },
  {
    icon: BookOpen,
    label: "Dyslexia",
    heading: "Read without the struggle",
    description:
      "Listen along while text is highlighted in real time. Reflow mode adapts text to your screen, reducing visual clutter and making every page approachable.",
  },
  {
    icon: Eye,
    label: "Visual Impairments",
    heading: "Your eyes can rest",
    description:
      "Natural-sounding voices turn any document into an audiobook. Adjustable speed, offline access, and dark mode let you consume content on your terms.",
  },
];

export function AccessibilitySection() {
  return (
    <section className="py-10 md:py-24 px-4">
      <motion.div
        className="max-w-7xl mx-auto text-center mb-10 md:mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-lg md:text-xl font-semibold text-primary uppercase tracking-wider mb-3">
          Designed for everyone
        </p>
        <h2 className="text-3xl md:text-6xl font-bold text-text-primary leading-tight mb-4">
          Reading should be{" "}
          <span className="text-primary">accessible to all</span>
        </h2>
        <p className="text-lg md:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Olog helps you beat the limitations — so nothing stands between you
          and the content you love.
        </p>
      </motion.div>

      <div className="max-w-[1440px] mx-auto grid md:grid-cols-3 gap-6 md:gap-8">
        {audiences.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.div
              key={a.label}
              className="relative rounded-2xl md:rounded-3xl border border-border bg-background-card p-6 md:p-8 flex flex-col"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-lg md:text-lg font-semibold text-primary uppercase tracking-wider mb-2">
                {a.label}
              </span>
              <h3 className="text-xl md:text-3xl font-semibold text-text-primary mb-3">
                {a.heading}
              </h3>
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
                {a.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
