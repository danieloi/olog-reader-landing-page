import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StatsSection } from "@/components/StatsSection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { AccessibilitySection } from "@/components/AccessibilitySection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PricingSection } from "@/components/PricingSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main
      className="relative z-10 min-h-[100svh] flex flex-col overflow-x-clip"
      id="main-content"
    >
      <div
        aria-hidden
        className="hero-radials fixed inset-0 pointer-events-none z-0 opacity-40"
      />
      <Header />
      <section id="hero" aria-label="Hero section">
        <Suspense>
          <Hero />
        </Suspense>
      </section>
      <div className="georama-text">
        <StatsSection />
        <section id="benefits" aria-label="Core benefits">
          <BenefitsSection />
        </section>
        <AccessibilitySection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
      </div>
      <Footer />
    </main>
  );
}
