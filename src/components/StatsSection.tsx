"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";

const stats = [
  { value: 3, suffix: "x", label: "Faster Reading", sub: "Users finish long documents significantly quicker" },
  { value: 50, suffix: "K+", label: "Hours Listened", sub: "Our community has consumed thousands of hours" },
  { value: 10, suffix: "+", label: "File Types", sub: "From PDFs to PowerPoint slides and web articles" },
];

function StatBlock({
  value,
  suffix,
  label,
  sub,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay }}
    >
      <p className="text-2xl sm:text-3xl md:text-6xl font-bold text-primary">
        {inView ? (
          <CountUp end={value} duration={2} delay={0.2} />
        ) : (
          "0"
        )}
        {suffix}
      </p>
      <p className="text-sm sm:text-lg md:text-xl font-semibold text-text-primary mt-1">{label}</p>
      <p className="text-xs sm:text-sm md:text-lg text-text-secondary mt-0.5 max-w-[160px] sm:max-w-[240px] mx-auto">
        {sub}
      </p>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section className="py-10 md:py-20 px-4 bg-background-card/50">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {stats.map((s, i) => (
          <StatBlock key={s.label} {...s} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}
