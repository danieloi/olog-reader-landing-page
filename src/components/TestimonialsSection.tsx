"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "I tried Olog in January when I was preparing for my masters examination and it made reading easy for lazy reading days. I was still getting the information I needed while doing other chores.",
    name: "@always_reen3",
  },
  {
    quote:
      "This app enhanced my reading 3 books in January. Reading 3 books in a month is actually an achievement because of my tight schedule so thanks to @ologreader",
    name: "@kayode_ot",
  },
  {
    quote:
      "Currently using this to read books. The best reading app I've used so far. I love the voices on the app; it makes listening more enjoyable. ",
    name: "@CHIDINMA ROMANUS",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-10 md:py-24 px-4 bg-background-card/30">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-3">
          Loved by Readers, Students & Professionals
        </h2>
        <p className="text-text-secondary text-lg md:text-xl max-w-lg mx-auto">
          See why thousands trust Olog Reader for their daily content.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="rounded-2xl p-6 bg-background-white border border-border shadow-soft"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
          >
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star
                  key={s}
                  className="w-5 h-5 fill-accent-500 text-accent-500"
                />
              ))}
            </div>

            <p className="text-text-primary text-lg md:text-xl leading-relaxed mb-5 italic">
              &ldquo;{t.quote}&rdquo;
            </p>

            <p className="text-lg md:text-xl font-semibold text-text-primary">
              {t.name}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
