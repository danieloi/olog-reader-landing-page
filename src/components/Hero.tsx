"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";
import { FloatingPhone } from "@/components/FloatingPhone";

const STORE_URLS = {
  ios: "https://apps.apple.com/us/app/olog-reader/id6744651101?itscg=30200&itsct=apps_box_link&mttnsubad=6744651101",
  android: "https://play.google.com/store/apps/details?id=me.olog.reader",
} as const;

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
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-10 w-full py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center md:items-center gap-8 md:gap-10 lg:gap-1">
          {/* Type-led headline column */}
          <motion.div
            id="beta"
            className="flex-1 relative w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >

            <h1 className="font-display text-text-primary leading-[0.92] md:leading-[0.88] tracking-[-0.04em]">
              <span
                className="block"
                style={{ fontSize: "clamp(4.25rem, 9vw, 8.5rem)" }}
              >
                Read
              </span>
              <span
                className="block italic text-accent pl-[0.1em]"
                style={{
                  fontSize: "clamp(4rem, 8vw, 7.5rem)",
                  fontVariationSettings: '"opsz" 144, "SOFT" 80, "WONK" 1',
                }}
              >
                anywhere.
              </span>
              <span
                className="block mt-1"
                style={{ fontSize: "clamp(4.25rem, 9vw, 8.5rem)" }}
              >
                Listen
              </span>
              <span
                className="block italic text-primary pl-[0.1em]"
                style={{
                  fontSize: "clamp(4rem, 8vw, 7.5rem)",
                  fontVariationSettings: '"opsz" 144, "SOFT" 80, "WONK" 1',
                }}
              >
                everywhere.
              </span>
            </h1>

            <motion.div
              className="mt-8 md:mt-12 max-w-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              <p className="text-lg md:text-xl lg:text-2xl text-text-secondary leading-relaxed">
                Your AI reading assistant with the most natural voices in the
                world. Take your stories, notes, and textbooks anywhere —
                hands-free, any time.
              </p>

              <div className="mt-6 md:mt-10 flex items-center gap-3 md:gap-5">
                <button
                  onClick={() => handleDownload("ios")}
                  className="flex-1 md:flex-none min-w-0 hover:opacity-90 transition-opacity"
                  aria-label="Download on the App Store"
                >
                  <img
                    src={appStoreBadge}
                    alt="Download on the App Store"
                    className="block w-full h-auto md:w-auto md:h-[52px]"
                  />
                </button>
                <button
                  onClick={() => handleDownload("android")}
                  className="flex-1 md:flex-none min-w-0 hover:opacity-90 transition-opacity"
                  aria-label="Get it on Google Play"
                >
                  <img
                    src={googlePlayBadge}
                    alt="Get it on Google Play"
                    className="block w-full h-auto md:w-auto md:h-[52px]"
                  />
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Auto-moving 3D phone column */}
          <motion.div
            className="shrink-0 flex justify-center relative"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          >
            <FloatingPhone
              imageSrc="/reader-screen.webp"
              altText="Olog Reader mobile app"
              reduced={isMobile}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
