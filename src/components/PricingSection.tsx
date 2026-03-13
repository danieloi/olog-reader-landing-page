"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { handleGetStarted } from "@/hooks/use-download";

/* ------------------------------------------------------------------ */
/*  Country detection for pricing                                      */
/* ------------------------------------------------------------------ */

function useCountryPricing() {
  const [pricing, setPricing] = useState<{
    currency: string;
    weekly: string;
    monthly: string;
    yearly: string;
    fromPrice: string;
  }>({
    currency: "$",
    weekly: "$2",
    monthly: "$5",
    yearly: "$55",
    fromPrice: "$5/mo",
  });

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.country_code === "NG") {
          setPricing({
            currency: "\u20A6",
            weekly: "\u20A62,000",
            monthly: "\u20A65,000",
            yearly: "\u20A655,000",
            fromPrice: "\u20A65,000/mo",
          });
        }
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
  { text: "Offline downloads", included: true },
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
        { text: "Premium voices", included: false },
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
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          Simple, Honest Pricing
        </h2>
        <p className="text-text-secondary text-lg max-w-lg mx-auto">
        Go Premium and enjoy full control of your listening.  Cancel anytime.
        </p>
      </motion.div>
      {/* Billing period tabs */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex rounded-lg bg-background-card p-1 max-w-xs mx-auto relative">
          {(["Weekly", "Monthly", "Yearly"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => animateToTab(tab)}
              className="flex-1 py-2 text-sm font-semibold rounded-md relative z-10 transition-colors duration-300"
              style={{ color: activeTab === tab ? "#fff" : undefined }}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="pricing-tab-indicator"
                  className="absolute inset-0 bg-neutral-700 rounded-md shadow-sm"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  style={{ zIndex: -1 }}
                />
              )}
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-6">
        {/* Free plan */}
        <motion.div
          className="relative rounded-2xl p-6 flex flex-col border border-border bg-background-white hover:shadow-soft transition-shadow duration-300"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          <h3 className="text-lg font-semibold text-text-primary">
            {freePlan.name}
          </h3>
          <div className="mt-2 mb-1">
            <span className="text-3xl font-bold text-text-primary">
              {freePlan.price}
            </span>
          </div>
          <p className="text-xs text-text-secondary mb-5">
            {freePlan.description}
          </p>
          <ul className="space-y-2.5 mb-6 flex-1">
            {freePlan.features.map((f) => (
              <li key={f.text} className="flex items-center gap-2">
                {f.included ? (
                  <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-text-secondary/30 mt-0.5 shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    f.included ? "text-text-primary" : "text-text-secondary/50"
                  }`}
                >
                  {f.text}
                </span>
              </li>
            ))}
          </ul>
          <button onClick={handleGetStarted} className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors bg-background-card text-text-primary hover:bg-background-card/80">
            {freePlan.cta}
          </button>
        </motion.div>

        {/* Premium plan (active tab) */}
        <motion.div
          className="relative rounded-2xl p-6 flex flex-col border border-primary shadow-medium bg-background-white"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <h3 className="text-lg font-semibold text-text-primary">
            Premium
          </h3>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="mt-2 mb-1">
                <span className="text-3xl font-bold text-text-primary">
                  {activePlan.price}
                </span>
                <span className="text-sm text-text-secondary">
                  {activePlan.period}
                </span>
              </div>
              <p className="text-xs text-text-secondary mb-5">
                {activePlan.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <ul className="space-y-2.5 mb-6 flex-1">
            {premiumFeatures.map((f) => (
              <li key={f.text} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span className="text-sm text-text-primary">{f.text}</span>
              </li>
            ))}
          </ul>

          <button onClick={handleGetStarted} className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors bg-primary text-white hover:bg-button-hover-primary">
            {activePlan.cta}
          </button>
        </motion.div>

        {/* Competitors comparison */}
        <motion.div
          className="relative rounded-2xl p-6 flex flex-col border border-border bg-background-card/40 hover:shadow-soft transition-shadow duration-300"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.16 }}
        >
          <h3 className="text-lg font-semibold text-text-primary">
            Others
          </h3>
          <div className="mt-2 mb-1">
            <span className="text-3xl font-bold text-text-secondary line-through decoration-2">
              $139
            </span>
            <span className="text-sm text-text-secondary">
              /year avg.
            </span>
          </div>
          <p className="text-xs text-text-secondary mb-5">
            What competitors charge for the same features
          </p>

          <ul className="space-y-2.5 mb-6 flex-1">
            {[
              { text: "Unlimited listening" },
              { text: "Unlimited file uploads" },
              { text: "All file types" },
              { text: "Premium AI voices" },
              { text: "Real-time highlighting" },
              { text: "Offline downloads" },
              { text: "Cross-device sync" },
              { text: "Priority support" },
              { text: "Cancel anytime" },
            ].map((f) => (
              <li key={f.text} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-text-secondary/40 mt-0.5 shrink-0" />
                <div className="flex-1 flex items-center justify-between gap-1">
                  <span className="text-sm text-text-secondary">
                    {f.text}
                  </span>

                </div>
              </li>
            ))}
          </ul>

          <div className="w-full py-2.5 rounded-xl text-sm font-semibold text-center text-text-secondary bg-background-card">
            Overpriced
          </div>
        </motion.div>
      </div>
    </section>
  );
}
