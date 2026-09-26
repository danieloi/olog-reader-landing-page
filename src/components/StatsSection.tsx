"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";

const headlineStat = {
  value: 3,
  suffix: "×",
  label: "Faster Reading",
  sub: "Users finish long documents significantly quicker — without losing comprehension.",
};

const supportingStats = [
  {
    value: 4.9,
    suffix: "M+",
    decimals: 1,
    label: "Words Listened To",
    sub: "Turned from text into natural speech for our readers.",
  },
  {
    value: 10,
    suffix: "+",
    label: "File Types",
    sub: "PDFs, EPUBs, slides, links, scans, and more.",
  },
];

function useCounter<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return { ref, inView };
}

function HeadlineStat() {
  const { ref, inView } = useCounter<HTMLSpanElement>();
  return (
    <motion.div
      className="relative md:col-span-3"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <span
        ref={ref}
        className="type-stat block text-primary"
        style={{ fontSize: "clamp(7rem, 20vw, 16rem)" }}
      >
        {inView ? <CountUp end={headlineStat.value} duration={1.6} /> : "0"}
        <span className="text-accent">{headlineStat.suffix}</span>
      </span>
      <div className="mt-2 md:mt-4 max-w-md">
        <p className="type-h3 text-text-primary">
          {headlineStat.label}
        </p>
        <p className="mt-2 text-lg md:text-xl text-text-secondary leading-relaxed">
          {headlineStat.sub}
        </p>
      </div>
    </motion.div>
  );
}

function SupportingStat({
  value,
  suffix,
  decimals = 0,
  label,
  sub,
  delay,
}: {
  value: number;
  suffix: string;
  decimals?: number;
  label: string;
  sub: string;
  delay: number;
}) {
  const { ref, inView } = useCounter<HTMLParagraphElement>();
  return (
    <motion.div
      className="border-t border-border pt-4 md:pt-6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay }}
    >
      <p
        ref={ref}
        className="type-stat text-4xl md:text-6xl text-text-primary"
      >
        {inView ? (
          <CountUp end={value} duration={1.6} separator="," decimals={decimals} />
        ) : (
          "0"
        )}
        <span className="text-accent">{suffix}</span>
      </p>
      <p className="mt-2 text-lg md:text-xl font-semibold tracking-[-0.01em] text-text-primary">
        {label}
      </p>
      <p className="text-base md:text-lg text-text-secondary mt-1">{sub}</p>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section className="py-12 md:py-28 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-8 md:gap-12 items-end">
        <HeadlineStat />
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6 md:gap-10">
          {supportingStats.map((s, i) => (
            <SupportingStat key={s.label} {...s} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
