"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ShinyText from "./ShineyText";
import { handleGetStarted } from "@/hooks/use-download";

const NAV_LINKS = [
  { href: "#benefits", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

function HeaderInner({ floating = false }: { floating?: boolean }) {
  const logoSize = floating ? 56 : 80;

  return (
    <div className="relative">
      <div
        className={`mx-auto flex items-center justify-between px-2 sm:px-6 lg:px-8 ${
          floating ? "max-w-5xl h-10" : "max-w-7xl h-14"
        }`}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/icon.webp"
            alt="Olog Reader"
            width={logoSize}
            height={logoSize}
            className="block dark:hidden"
          />
          <Image
            src="/icon-dark.webp"
            alt="Olog Reader"
            width={logoSize}
            height={logoSize}
            className="hidden dark:block"
          />
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-lg md:text-xl font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleGetStarted}
            className="px-0 h-auto leading-none text-lg sm:text-xl md:text-2xl font-semibold text-primary cta-underline"
          >
            <ShinyText text="Get Started" speed={5} />
          </button>
        </div>
      </div>
    </div>
  );
}

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
        <HeaderInner />
      </header>

      {/* Floating header after hero */}
      <AnimatePresence>
        {isFloating && (
          <motion.header
            key="floating-header"
            className="fixed z-50 top-3 inset-x-0 mx-auto w-[90%] max-w-4xl bg-background-white/80 backdrop-blur-md shadow-soft border border-border/50 rounded-2xl"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <HeaderInner floating />
          </motion.header>
        )}
      </AnimatePresence>
    </>
  );
}
