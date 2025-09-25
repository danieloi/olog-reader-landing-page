import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main
      className="relative z-10 min-h-[100svh] flex flex-col"
      id="main-content"
    >
      <div
        aria-hidden
        className="hero-radials fixed inset-0 pointer-events-none z-0 opacity-40"
      />
      {/* <Header /> */}
      <section id="hero" className="flex-1" aria-label="Hero section">
        <Hero />
      </section>
      <Footer />
    </main>
  );
}
