import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductFeatures } from "@/components/ProductFeatures";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { StatsRow } from "@/components/StatsRow";

export default function Home() {
  return (
    <main className="min-h-screen" id="main-content">
      <Header />

      {/* Hero Section */}
      <section id="hero" aria-label="Hero section">
        <Hero />
      </section>

      {/* stats section */}
      <section id="stats">
        <StatsRow />
      </section>

      {/* Features Section */}
      <section id="features">
        <ProductFeatures />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works">
        <HowItWorks />
      </section>

      {/* Pricing Section */}
      <section id="pricing">
        <Pricing />
      </section>

      {/* FAQ Section */}
      <section id="faq">
        <FAQ />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
