"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import BlurText from "./BlurText";
import TiltedCard from "@/components/TiltedCard";
import { useIsMobile } from "@/hooks/use-mobile";

const STORE_URLS = {
  ios: "https://apps.apple.com/us/app/olog-reader/id6744651101?itscg=30200&itsct=apps_box_link&mttnsubad=6744651101",
  android:
    "https://play.google.com/store/apps/details?id=me.olog.reader",
} as const;

export function Hero() {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("referralCode");

  const handleDownload = (platform: "ios" | "android") => {
    if (referralCode) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/referral/deferred/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            referralCode,
            platform,
            userAgent: navigator.userAgent,
          }),
        }
      ).catch(() => {});
    }
    window.open(STORE_URLS[platform], "_blank");
  };
  

  // Mobile Layout Component
  const MobileHeroLayout = () => (
    <section className="relative overflow-hidden bg-transparent pt-6 sm:pt-7 md:pt-8">
      <div className="max-w-[360px] sm:max-w-[480px] md:max-w-[640px] mx-auto px-3 sm:px-4 md:px-5 w-full py-6 sm:py-7 md:py-8 text-center">
        <motion.div
          className="space-y-6 sm:space-y-7 md:space-y-8 georama-text flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Mobile Text Content - Now first */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-[3.25rem] font-bold text-text-primary leading-tight mx-auto text-center">
              <BlurText
                text={"Read\u00A0anywhere. Listen\u00A0everywhere."}
                as="span"
                className="justify-center text-primary"
                groupByWord
              />
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-text-secondary max-w-[280px] sm:max-w-sm md:max-w-md mx-auto leading-relaxed">
              Take your stories, notes, and textbooks on the go, listen hands
              free, anytime you want.
            </p>

            {/* Mobile CTA - More prominent */}
            <div className="pt-4 sm:pt-5 md:pt-6 space-y-3 sm:space-y-4">
              <p className="text-base sm:text-lg font-semibold text-text-primary text-center">
                Begin your first listen
              </p>
              <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 flex-nowrap">
                <button
                  onClick={() => handleDownload("ios")}
                  className="flex items-center justify-center hover:opacity-90 transition-opacity"
                  aria-label="Download on the App Store"
                >
                  <img
                    src="/black.svg"
                    alt="Download on the App Store"
                    className="h-10 w-auto sm:h-12 max-w-[120px]"
                  />
                </button>
                <button
                  onClick={() => handleDownload("android")}
                  className="flex items-center justify-center hover:opacity-90 transition-opacity"
                  aria-label="Get it on Google Play"
                >
                  <img
                    src="/GetItOnGooglePlay_Badge_Web_color_English.png"
                    alt="Get it on Google Play"
                    className="h-8 sm:h-10 w-auto object-contain max-w-[120px]"
                    style={{ maxWidth: "135px" }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Phone Mockup - Now second */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          >
            <div className="relative">
              <TiltedCard
                imageSrc="/reader-screen.png"
                altText="Olog Reader mobile app"
                containerWidth={isMobile ? "180px" : "200px"}
                containerHeight={isMobile ? "389px" : "432px"}
                imageWidth={isMobile ? "180px" : "200px"}
                imageHeight={isMobile ? "389px" : "432px"}
                scaleOnHover={1.03}
                rotateAmplitude={5}
                showMobileWarning={false}
                showTooltip={false}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );

  // Desktop Layout Component (existing layout)
  const DesktopHeroLayout = () => (
    <section className="relative overflow-hidden bg-transparent pt-6 md:pt-8">
      <div className="max-w-2xl md:max-w-4xl lg:max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full py-8 md:py-10 lg:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Left */}
          <motion.div
            id="beta"
            className="space-y-6 md:space-y-7 lg:space-y-8 georama-text"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="space-y-4 md:space-y-2 lg:space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
                <BlurText
                  text={"Read\u00A0anywhere. Listen\u00A0everywhere."}
                  as="span"
                  className="text-primary"
                  groupByWord
                />
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-text-secondary max-w-md md:max-w-lg leading-relaxed">
                Take your stories, notes, and textbooks on the go, listen hands
                free, anytime you want.
              </p>

              <div className="pt-4 md:pt-5 lg:pt-6 space-y-3 md:space-y-4">
                <p className="text-base md:text-lg font-semibold text-text-primary">
                  Begin your first listen
                </p>
                <div className="flex gap-4 md:gap-5">
                  <button
                    onClick={() => handleDownload("ios")}
                    className="hover:opacity-90 transition-opacity"
                    aria-label="Download on the App Store"
                  >
                    <img
                      src="/black.svg"
                      alt="Download on the App Store"
                      className="h-8 w-auto md:max-h-[50px]"
                    />
                  </button>
                  <button
                    onClick={() => handleDownload("android")}
                    className="hover:opacity-90 transition-opacity"
                    aria-label="Get it on Google Play"
                  >
                    <img
                      src="/GetItOnGooglePlay_Badge_Web_color_English.png"
                      alt="Get it on Google Play"
                      className="h-8 w-auto md:max-h-[50px]"
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right – phone mock */}
          <motion.div
            className="flex justify-center md:justify-end"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="relative">
              <TiltedCard
                imageSrc="/reader-screen.png"
                altText="Olog Reader mobile app"
                containerWidth="220px"
                containerHeight="475px"
                imageWidth="220px"
                imageHeight="475px"
                scaleOnHover={1.06}
                rotateAmplitude={10}
                showMobileWarning={false}
                showTooltip={false}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );

  return isMobile ? <MobileHeroLayout /> : <DesktopHeroLayout />;
}
