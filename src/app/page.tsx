import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { SimpleFeatures } from "@/components/ProductFeatures";

export default function Home() {
  return (
    <main className="min-h-screen" id="main-content">
      <Header />
      <section id="hero" aria-label="Hero section">
        <Hero />
      </section>
      {/* <section id="features" aria-label="Features">
        <SimpleFeatures />
      </section> */}
      <Footer />
    </main>
  );
}
