"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";
import { FloatingPhone } from "@/components/FloatingPhone";
import { ReaderScreenDemo } from "@/components/ReaderScreenDemo";

const STORE_URLS = {
  ios: "https://apps.apple.com/us/app/olog-reader/id6744651101?itscg=30200&itsct=apps_box_link&mttnsubad=6744651101",
  android: "https://play.google.com/store/apps/details?id=me.olog.reader",
} as const;

const HEADLINE_LINES = [
  { words: ["Read", "anywhere."], className: "text-text-primary" },
  { words: ["Listen", "everywhere."], className: "text-primary" },
];
const HEADLINE_TEXT = HEADLINE_LINES.map((l) => l.words.join(" ")).join(" ");
const WORD_COUNT = HEADLINE_LINES.reduce((n, l) => n + l.words.length, 0);

const READ_START_DELAY = 900;
const WORD_DURATION = 560;
const LOOP_PAUSE = 4200;

function useReadAlong(enabled: boolean) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const step = (i: number) => {
      if (i >= WORD_COUNT) {
        setActive(null);
        timer = setTimeout(() => step(0), LOOP_PAUSE);
        return;
      }
      setActive(i);
      timer = setTimeout(() => step(i + 1), WORD_DURATION);
    };
    timer = setTimeout(() => step(0), READ_START_DELAY);
    return () => clearTimeout(timer);
  }, [enabled]);

  return active;
}

function ReadAlongHeadline() {
  const reduceMotion = useReducedMotion();
  const active = useReadAlong(!reduceMotion);
  let wordIndex = 0;

  return (
    <h1 className="type-display">
      <span className="sr-only">{HEADLINE_TEXT}</span>
      <span aria-hidden className="block">
        {HEADLINE_LINES.map((line) => (
          <span key={line.words.join(" ")} className={`block ${line.className}`}>
            {line.words.map((word, wi) => {
              const index = wordIndex++;
              return (
                <span key={word}>
                  {wi > 0 && " "}
                  <span className="hero-word">
                    <AnimatePresence>
                      {active === index && (
                        <motion.span
                          layoutId="hero-read-mark"
                          className="hero-word-mark"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            layout: { type: "spring", stiffness: 420, damping: 38 },
                            opacity: { duration: 0.25 },
                          }}
                        />
                      )}
                    </AnimatePresence>
                    {word}
                  </span>
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </h1>
  );
}

export function Hero() {
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("referralCode");

  const appStoreBadge = resolvedTheme === "dark" ? "/white.svg" : "/black.svg";
  const googlePlayBadge =
    resolvedTheme === "dark" ? "/google_play_white.webp" : "/google_play_dark.webp";

  const handleDownload = (platform: "ios" | "android") => {
    if (referralCode) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/referral/deferred/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralCode,
          platform,
          userAgent: navigator.userAgent,
        }),
      }).catch(() => {});
    }
    window.open(STORE_URLS[platform], "_blank");
  };

  return (
    <section className="relative overflow-hidden bg-transparent min-h-[100svh] flex items-center pt-20 md:pt-24">
      <div className="max-w-[1280px] mx-auto px-3 md:px-6 lg:px-10 w-full py-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] items-center gap-8 md:gap-10 lg:gap-12">
          <motion.div
            id="beta"
            className="relative w-full max-w-[40rem] mx-auto lg:max-w-[58rem] lg:mx-0"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <ReadAlongHeadline />

            <p className="type-lead mt-3 md:mt-4 max-w-[34rem] text-text-secondary">
              Your AI reading assistant with the most natural voices in the
              world. Take your stories, notes, and textbooks anywhere —
              hands-free, any time.
            </p>

            <div className="mt-4 md:mt-5 flex items-center gap-2 md:gap-3">
              <button
                onClick={() => handleDownload("ios")}
                className="flex-none rounded-[10px] transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Download on the App Store"
              >
                <img
                  src={appStoreBadge}
                  alt="Download on the App Store"
                  className="block h-[46px] w-auto md:h-[52px]"
                />
              </button>
              <button
                onClick={() => handleDownload("android")}
                className="flex-none rounded-[10px] transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Get it on Google Play"
              >
                <img
                  src={googlePlayBadge}
                  alt="Get it on Google Play"
                  className="block h-[46px] w-auto md:h-[52px]"
                />
              </button>
            </div>

            <p className="mt-2 md:mt-3 flex flex-wrap items-center gap-x-[10px] gap-y-0.5 text-[0.9375rem] md:text-base font-medium text-text-secondary">
              <span>Free on iOS &amp; Android</span>
              <span aria-hidden className="hidden sm:block h-[4px] w-[4px] rounded-full bg-current opacity-50" />
              <span>PDFs, EPUBs, slides, links &amp; scans</span>
            </p>
          </motion.div>

          <motion.div
            className="shrink-0 flex justify-center relative py-2 lg:py-0"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          >
            <FloatingPhone reduced={isMobile}>
              <ReaderScreenDemo label="Olog Reader on a phone, reading a news article, a blog post and an onboarding doc aloud, highlighting each sentence and word in sync" />
            </FloatingPhone>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
