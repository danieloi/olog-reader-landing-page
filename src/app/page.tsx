import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import IntroSplash from "@/components/IntroSplash";

export default function Home() {
  return (
    <main className="relative z-10 min-h-screen" id="main-content">
      <div
        aria-hidden
        className="hero-radials fixed inset-0 pointer-events-none z-0 opacity-40"
      />
      <IntroSplash />
      <Header />
      <section id="hero" aria-label="Hero section">
        <Hero />
      </section>
      <Footer />
    </main>
  );
}
