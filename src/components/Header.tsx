"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ShinyText from "./ShineyText";
import { handleGetStarted } from "@/hooks/use-download";

export function Header() {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFloating(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Static header in hero */}
      <header className="absolute top-0 inset-x-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto h-14 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Image src="/icon.webp" alt="Olog Reader" width={80} height={80} className="block dark:hidden" />
            <Image src="/icon-dark.webp" alt="Olog Reader" width={80} height={80} className="hidden dark:block" />
          </div>

          <nav className="hidden md:flex items-center gap-6">
              <a href="#benefits" className="text-lg md:text-xl font-medium text-text-secondary hover:text-text-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-lg md:text-xl font-medium text-text-secondary hover:text-text-primary transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-lg md:text-xl font-medium text-text-secondary hover:text-text-primary transition-colors">
                FAQ
              </a>
            </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={handleGetStarted}
              className="px-0 h-auto leading-none text-lg sm:text-xl md:text-2xl font-semibold text-primary cta-underline"
            >
              <ShinyText text="Get Started" speed={5} />
            </button>
          </div>
        </div>
      </header>

      {/* Floating header after hero */}
      <AnimatePresence>
        {isFloating && (
          <motion.header
            key="floating-header"
            className="fixed z-50 top-3 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 !w-[90%] max-w-4xl mx-auto bg-background-white/80 backdrop-blur-md shadow-soft border border-border/50 rounded-2xl"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="max-w-5xl mx-auto h-10 flex items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
              <Image src="/icon.webp" alt="Olog Reader" width={56} height={56} className="block dark:hidden" />
              <Image src="/icon-dark.webp" alt="Olog Reader" width={56} height={56} className="hidden dark:block" />
              </div>

              <nav className="hidden md:flex items-center gap-6">
                <a href="#benefits" className="text-lg md:text-xl font-medium text-text-secondary hover:text-text-primary transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-lg md:text-xl font-medium text-text-secondary hover:text-text-primary transition-colors">
                  Pricing
                </a>
                <a href="#faq" className="text-lg md:text-xl font-medium text-text-secondary hover:text-text-primary transition-colors">
                  FAQ
                </a>
              </nav>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleGetStarted}
                  className="px-0 h-auto leading-none text-lg sm:text-xl md:text-2xl font-semibold text-primary cta-underline"
                >
                  <ShinyText text="Get Started" speed={5} />
                </button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  );
}
