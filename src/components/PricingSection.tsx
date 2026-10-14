"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { handleGetStarted } from "@/hooks/use-download";

type Billing = "weekly" | "monthly" | "yearly";

type Pricing = {
  symbol: string;
  weekly?: number;
  monthly: number;
  yearly: number;
  competitorYearly: number;
  decimals: number;
};

const USD: Pricing = {
  symbol: "$",
  monthly: 6.99,
  yearly: 76.99,
  competitorYearly: 139,
  decimals: 2,
};

function useCountryPricing(): Pricing {
  const [pricing, setPricing] = useState<Pricing>(USD);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then(async (data) => {
        if (data.country_code !== "NG") return;

        let competitorYearly = USD.competitorYearly * 1500;
        try {
          const fx = await fetch("https://open.er-api.com/v6/latest/USD").then((r) => r.json());
          const rate = fx?.rates?.NGN;
          if (typeof rate === "number" && rate > 0) {
            competitorYearly = Math.round((USD.competitorYearly * rate) / 1000) * 1000;
          }
        } catch {}

        setPricing({
          symbol: "₦",
          weekly: 4900,
          monthly: 9900,
          yearly: 108900,
          competitorYearly,
          decimals: 0,
        });
      })
      .catch(() => {});
  }, []);

  return pricing;
}

function money(p: Pricing, value: number) {
  return `${p.symbol}${value.toLocaleString("en-US", {
    minimumFractionDigits: p.decimals,
    maximumFractionDigits: p.decimals,
  })}`;
}

const FREE_FEATURES = [
  "6,000 words a week",
  "3 documents in your library",
  "Every file type",
  "Real-time highlighting",
  "Standard voices",
  "Try real-time voice chat",
];

const PREMIUM_FEATURES = [
  "Unlimited listening",
  "Unlimited documents",
  "Premium AI voices",
  "Up to 3 hours of voice chat a week",
  "Offline listening",
  "Sync across devices",
  "Priority support",
];

function RollingPrice({ value, pricing }: { value: number; pricing: Pricing }) {
  const text = money(pricing, value);
  return (
    <span className="relative inline-flex overflow-hidden align-baseline" aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ y: "70%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-70%", opacity: 0, filter: "blur(6px)" }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="inline-block"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function BillingToggle({
  billing,
  onChange,
  savePct,
  options,
}: {
  billing: Billing;
  onChange: (b: Billing) => void;
  savePct: number;
  options: Billing[];
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Billing period"
      className="relative mx-auto flex w-fit items-center gap-1 rounded-full bg-background-card p-1"
    >
      {options.map((b) => {
        const active = billing === b;
        return (
          <button
            key={b}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(b)}
            className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              active ? "text-white" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {active && (
              <motion.span
                layoutId="billing-pill"
                className="absolute inset-0 -z-10 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            {b === "weekly" ? "Weekly" : b === "monthly" ? "Monthly" : "Yearly"}
            {b === "yearly" && savePct > 0 && (
              <span
                className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold transition-colors duration-200 ${
                  active ? "bg-white/20 text-white" : "bg-primary-50 text-primary-700"
                }`}
              >
                Save {savePct}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function CompareBars({ pricing }: { pricing: Pricing }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const ours = pricing.yearly / pricing.competitorYearly;
  const lessPct = Math.round((1 - ours) * 100);
  const grow = (to: number, delay = 0) =>
    reduce
      ? { initial: { width: `${to * 100}%` }, animate: { width: `${to * 100}%` } }
      : {
          initial: { width: "0%" },
          animate: { width: inView ? `${to * 100}%` : "0%" },
          transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay },
        };

  return (
    <div ref={ref} className="mx-auto mt-10 max-w-3xl rounded-3xl border border-border bg-background-white p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="type-h3 text-text-primary">A year of Premium</p>
        <p className="text-base font-semibold text-primary-700">
          {lessPct}% less than the usual reading app
        </p>
      </div>
      <div className="mt-6 space-y-4">
        <div>
          <div className="mb-1.5 flex justify-between text-sm font-semibold">
            <span className="text-text-primary">Olog Reader</span>
            <span className="type-stat text-text-primary">{money(pricing, pricing.yearly)}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-background-card">
            <motion.div className="h-full rounded-full bg-primary" {...grow(ours, 0.35)} />
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex justify-between text-sm font-semibold">
            <span className="text-text-secondary">Typical text-to-speech app</span>
            <span className="type-stat text-text-secondary">
              {money({ ...pricing, decimals: 0 }, pricing.competitorYearly)}
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-background-card">
            <motion.div className="h-full rounded-full" style={{ background: "var(--text-secondary)", opacity: 0.35 }} {...grow(1)} />
          </div>
        </div>
      </div>
      <p className="mt-5 text-sm text-text-secondary">
        Average yearly price of comparable apps with unlimited listening and premium voices.
      </p>
    </div>
  );
}

export function PricingSection() {
  const pricing = useCountryPricing();
  const [billing, setBilling] = useState<Billing>("yearly");
  const savePct = Math.round((1 - pricing.yearly / (pricing.monthly * 12)) * 100);
  const options: Billing[] = pricing.weekly ? ["weekly", "monthly", "yearly"] : ["monthly", "yearly"];
  const yearlyAsMonthly = savePct > 0;
  const shown =
    billing === "weekly"
      ? { value: pricing.weekly ?? pricing.monthly, unit: "/ week" }
      : billing === "monthly"
        ? { value: pricing.monthly, unit: "/ month" }
        : yearlyAsMonthly
          ? { value: pricing.yearly / 12, unit: "/ month" }
          : { value: pricing.yearly, unit: "/ year" };

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay },
  });

  return (
    <section id="pricing" className="px-4 py-12 md:py-24">
      <motion.div className="mx-auto mb-8 max-w-2xl text-center" {...reveal()}>
        <p className="type-eyebrow mb-2 text-primary-700">Pricing</p>
        <h2 className="type-h2 mb-3 text-text-primary">Start free. Listen without limits.</h2>
        <p className="type-lead mx-auto max-w-lg text-text-secondary">
          Everything you need to get going is free. Premium unlocks unlimited listening and our best
          voices. Cancel anytime.
        </p>
      </motion.div>

      <motion.div className="mb-8" {...reveal(0.05)}>
        <BillingToggle billing={billing} onChange={setBilling} savePct={savePct} options={options} />
      </motion.div>

      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-[1fr_1.15fr] md:items-stretch">
        <motion.div
          className="flex flex-col rounded-3xl border border-border bg-background-white p-6 md:p-8"
          {...reveal(0.1)}
        >
          <p className="type-eyebrow text-text-secondary">Free</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="type-stat text-6xl text-text-primary md:text-7xl">
              {money({ ...pricing, decimals: 0 }, 0)}
            </span>
            <span className="text-base font-medium text-text-secondary">forever</span>
          </div>
          <p className="mt-3 text-base text-text-secondary md:text-lg">
            Try Olog on your own documents, no card needed.
          </p>
          <ul className="mt-6 flex-1 space-y-3">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-base text-text-primary md:text-lg">
                <Check className="h-5 w-5 shrink-0 text-text-secondary" />
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={handleGetStarted}
            className="mt-8 w-full rounded-xl bg-background-card py-3 text-lg font-semibold text-text-primary transition-colors hover:bg-background-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Get started free
          </button>
        </motion.div>

        <motion.div
          className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-primary bg-background-white p-6 shadow-medium md:p-8"
          {...reveal(0.16)}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="flex items-center justify-between">
            <p className="type-eyebrow text-primary-700">Premium</p>
            <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary-700">
              Most popular
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="type-stat text-6xl text-text-primary md:text-8xl">
              <RollingPrice value={shown.value} pricing={pricing} />
            </span>
            <span className="text-base font-medium text-text-secondary">{shown.unit}</span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={billing}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="mt-3 text-base text-text-secondary md:text-lg"
            >
              {billing === "yearly" ? (
                yearlyAsMonthly ? (
                  <>
                    Billed {money(pricing, pricing.yearly)} once a year
                    <span className="font-semibold text-primary-700"> · save {savePct}%</span>
                  </>
                ) : (
                  <>Billed once a year · one payment, all year</>
                )
              ) : billing === "weekly" ? (
                <>Billed weekly · cancel anytime</>
              ) : (
                <>Billed monthly · switch plans anytime</>
              )}
            </motion.p>
          </AnimatePresence>
          <p className="mt-6 text-sm font-semibold text-text-secondary">Everything in Free, plus</p>
          <ul className="mt-3 flex-1 space-y-3">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-base text-text-primary md:text-lg">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={handleGetStarted}
            className="mt-8 w-full rounded-xl bg-primary py-3 text-lg font-semibold text-white transition-colors hover:bg-button-hover-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {`Get Premium ${billing}`}
          </button>
        </motion.div>
      </div>

      <motion.div {...reveal(0.1)}>
        <CompareBars pricing={pricing} />
      </motion.div>
    </section>
  );
}
