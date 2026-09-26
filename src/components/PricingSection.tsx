"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { handleGetStarted } from "@/hooks/use-download";

/* ------------------------------------------------------------------ */
/*  Country detection for pricing                                      */
/* ------------------------------------------------------------------ */

const COMPETITOR_USD = 139;

function useCountryPricing() {
  const [pricing, setPricing] = useState<{
    currency: string;
    weekly: string;
    monthly: string;
    yearly: string;
    fromPrice: string;
    competitorPrice: string;
  }>({
    currency: "$",
    weekly: "$2.49",
    monthly: "$4.99",
    yearly: "$49.99",
    fromPrice: "$5/mo",
    competitorPrice: `$${COMPETITOR_USD}`,
  });

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then(async (data) => {
        if (data.country_code !== "NG") return;

        let competitorPrice = `\u20A6${(COMPETITOR_USD * 1500).toLocaleString()}`;
        try {
          const fx = await fetch("https://open.er-api.com/v6/latest/USD").then((r) => r.json());
          const rate = fx?.rates?.NGN;
          if (typeof rate === "number" && rate > 0) {
            const rounded = Math.round((COMPETITOR_USD * rate) / 1000) * 1000;
            competitorPrice = `\u20A6${rounded.toLocaleString()}`;
          }
        } catch {}

        setPricing({
          currency: "\u20A6",
          weekly: "\u20A62,000",
          monthly: "\u20A65,000",
          yearly: "\u20A655,000",
          fromPrice: "\u20A65,000/mo",
          competitorPrice,
        });
      })
      .catch(() => {});
  }, []);

  return pricing;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const premiumFeatures = [
  { text: "Unlimited listening", included: true },
  { text: "Unlimited file uploads", included: true },
  { text: "All 10+ file types", included: true },
  { text: "Premium AI voices", included: true },
  { text: "Real-time highlighting", included: true },
  { text: "Offline Listening", included: true },
  { text: "Cross-device sync", included: true },
  { text: "Priority customer support", included: true },
  { text: "Cancel anytime", included: true },
];

function getPricingPlans(pricing: ReturnType<typeof useCountryPricing>) {
  return [
    {
      name: "Free",
      price: `${pricing.currency}0`,
      period: "",
      description: "Get started with the basics",
      features: [
        { text: "6,000 words per week", included: true },
        { text: "3 file uploads", included: true },
        { text: "All file types supported", included: true },
        { text: "Standard voices", included: true },
        { text: "Real-time highlighting", included: true },
        { text: "Unlimited listening", included: false },
        { text: "Unlimited uploads", included: false },
        { text: "Priority support", included: false },
      ],
      highlighted: false,
      cta: "Get Started Free",
    },
    {
      name: "Weekly",
      price: pricing.weekly,
      period: "/week",
      description: "Try premium with full access",
      features: premiumFeatures,
      highlighted: false,
      cta: "Start Weekly",
    },
    {
      name: "Monthly",
      price: pricing.monthly,
      period: "/month",
      description: "Most popular — save over 50% vs weekly",
      features: premiumFeatures,
      highlighted: true,
      cta: "Start Monthly",
    },
    {
      name: "Yearly",
      price: pricing.yearly,
      period: "/year",
      description: "Best value — save over 80% vs weekly",
      features: premiumFeatures,
      highlighted: false,
      cta: "Start Yearly",
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PricingSection() {
  const pricing = useCountryPricing();
  const pricingPlans = getPricingPlans(pricing);
  const [activeTab, setActiveTab] = useState<"Weekly" | "Monthly" | "Yearly">("Monthly");
  const [isAnimating, setIsAnimating] = useState(false);

  const tabOrder: ("Weekly" | "Monthly" | "Yearly")[] = ["Weekly", "Monthly", "Yearly"];

  const animateToTab = (target: "Weekly" | "Monthly" | "Yearly") => {
    if (isAnimating || target === activeTab) return;

    const currentIndex = tabOrder.indexOf(activeTab);
    const targetIndex = tabOrder.indexOf(target);
    const step = targetIndex > currentIndex ? 1 : -1;
    const steps = tabOrder.slice(
      Math.min(currentIndex, targetIndex),
      Math.max(currentIndex, targetIndex) + 1
    );
    if (step < 0) steps.reverse();

    setIsAnimating(true);
    steps.slice(1).forEach((tab, i) => {
      setTimeout(() => {
        setActiveTab(tab);
        if (i === steps.length - 2) setIsAnimating(false);
      }, (i + 1) * 200);
    });
  };

  const freePlan = pricingPlans.find((p) => p.name === "Free")!;
  const premiumPlans = pricingPlans.filter((p) => p.name !== "Free");
  const activePlan = premiumPlans.find((p) => p.name === activeTab)!;

  return (
    <section id="pricing" className="py-10 md:py-24 px-4">
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <p className="type-eyebrow text-primary-700 mb-2">
          Pricing
        </p>
        <h2 className="type-h2 text-text-primary mb-3">
          Simple, honest pricing.
        </h2>
        <p className="type-lead text-text-secondary max-w-lg mx-auto">
          Go Premium and enjoy full control of your listening. <br /> Cancel
          anytime.
        </p>
      </motion.div>
      {/* Billing period tabs */}
      <div className="sticky top-[72px] z-20 md:relative md:top-auto max-w-3xl mx-auto mb-2 py-3 -mx-4 px-4" style={{ background: "color-mix(in srgb, var(--background) 80%, transparent)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div className="flex rounded-lg bg-background-card p-1 max-w-xs mx-auto relative">
          {(["Weekly", "Monthly", "Yearly"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => animateToTab(tab)}
              className="flex-1 py-2 text-lg md:text-lg font-semibold rounded-md relative z-10 transition-colors duration-300"
              style={{ color: activeTab === tab ? "#fff" : undefined }}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="pricing-tab-indicator"
                  className="absolute inset-0 bg-accent rounded-md shadow-sm"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  style={{ zIndex: -1 }}
                />
              )}
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto grid sm:grid-cols-3 gap-6">
        {/* Free plan */}
        <motion.div
          className="relative rounded-2xl p-2  md:p-6 flex flex-col border border-border bg-background-white hover:shadow-soft transition-shadow duration-300"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          <p className="type-eyebrow text-text-secondary mb-1">
            {freePlan.name}
          </p>
          <div className="mt-1 mb-3 flex items-baseline gap-1">
            <span className="type-stat text-6xl md:text-7xl text-text-primary">
              {freePlan.price}
            </span>
          </div>
          <p className="text-base md:text-lg text-text-secondary mb-6">
            {freePlan.description}
          </p>
          <ul className="space-y-2.5 mb-6 flex-1">
            {freePlan.features.map((f) => (
              <li key={f.text} className="flex items-center gap-2">
                {f.included ? (
                  <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-text-secondary/30 mt-0.5 shrink-0" />
                )}
                <span
                  className={`text-lg md:text-lg ${
                    f.included ? "text-text-primary" : "text-text-secondary/50"
                  }`}
                >
                  {f.text}
                </span>
              </li>
            ))}
          </ul>
          <button onClick={handleGetStarted} className="w-full py-2.5 rounded-xl text-lg md:text-lg font-semibold transition-colors bg-background-card text-text-primary hover:bg-background-card/80">
            {freePlan.cta}
          </button>
        </motion.div>

        {/* Premium plan (active tab) */}
        <motion.div
          className="relative rounded-2xl px-2 py-4 md:p-8 flex flex-col border-2 border-primary shadow-medium bg-background-white sm:scale-[1.02] sm:-translate-y-1"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <span className="absolute top-0 right-6 -translate-y-1/2 text-sm font-bold bg-accent text-accent-foreground px-3 py-1 rounded-full">
            Recommended
          </span>
          <p className="type-eyebrow text-primary-700 mb-1">
            Premium
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="mt-1 mb-3 flex items-baseline gap-1.5">
                <span className="type-stat text-6xl md:text-8xl text-text-primary">
                  {activePlan.price}
                </span>
                <span className="text-base md:text-lg font-medium text-text-secondary">
                  {activePlan.period}
                </span>
              </div>
              <p className="text-base md:text-lg text-text-secondary mb-6">
                {activePlan.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <ul className="space-y-2.5 mb-6 flex-1">
            {premiumFeatures.map((f) => (
              <li key={f.text} className="flex items-center gap-2">
                <Check className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <span className="text-lg md:text-lg text-text-primary">{f.text}</span>
              </li>
            ))}
          </ul>

          <button onClick={handleGetStarted} className="w-full py-2.5 rounded-xl text-lg md:text-lg font-semibold transition-colors bg-primary text-white hover:bg-button-hover-primary">
            {activePlan.cta}
          </button>
        </motion.div>

        {/* Competitors comparison — visually defeated */}
        <motion.div
          className="relative rounded-2xl p-2 flex flex-col border border-dashed border-border bg-transparent opacity-60 hover:opacity-80 transition-opacity duration-300 sm:scale-[0.96] origin-top"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 0.6, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.16 }}
        >
          <p className="text-sm font-semibold text-text-secondary/80 mb-1">
            Competitors
          </p>
          <div className="mt-1 mb-3 flex items-baseline gap-1.5">
            <span className="type-stat text-4xl md:text-5xl text-text-secondary line-through decoration-2 decoration-text-secondary/60">
              {pricing.competitorPrice}
            </span>
            <span className="text-sm font-medium text-text-secondary/70">
              /yr avg.
            </span>
          </div>
          <p className="text-sm md:text-base text-text-secondary/80 mb-5 leading-relaxed">
            What others charge for the same features.
          </p>

          <ul className="space-y-1.5 mb-5 flex-1">
            {[
              "Unlimited listening",
              "Unlimited file uploads",
              "All file types",
              "Premium AI voices",
              "Real-time highlighting",
              "Cross-device sync",
              "Priority support",
              "Cancel anytime",
            ].map((text) => (
              <li key={text} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-text-secondary/30 shrink-0" />
                <span className="text-sm md:text-base text-text-secondary/70 line-through decoration-text-secondary/30">
                  {text}
                </span>
              </li>
            ))}
          </ul>

          <div className="w-full py-1.5 rounded-lg text-sm font-semibold text-center text-text-secondary/80 border border-dashed border-text-secondary/30">
            Overpriced
          </div>
        </motion.div>
      </div>
    </section>
  );
}
