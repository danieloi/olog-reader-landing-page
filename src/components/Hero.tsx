"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BlurText from "./BlurText";
import TiltedCard from "@/components/TiltedCard";
import { Button } from "@/components/ui/button";
import ShinyText from "./ShineyText";
import { BetaSignupForm } from "./BetaSignupForm";
import { useIsMobile } from "@/hooks/use-mobile";

export function Hero() {
  const [showBetaForm, setShowBetaForm] = useState(false);
  const isMobile = useIsMobile();

  // Mobile Layout Component
  const MobileHeroLayout = () => (
    <section className="relative overflow-hidden bg-transparent pt-8">
      <div className="max-w-sm mx-auto px-6 w-full py-12 text-center">
        <motion.div
          className="space-y-8 georama-text flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Mobile Phone Mockup - Smaller and centered */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          >
            <div className="relative">
              <TiltedCard
                imageSrc="/reader-screen.png"
                altText="Olog Reader mobile app"
                containerWidth="200px"
                containerHeight="432px"
                imageWidth="200px"
                imageHeight="432px"
                scaleOnHover={1.03}
                rotateAmplitude={5}
                showMobileWarning={false}
                showTooltip={false}
              />
            </div>
          </motion.div>

          {/* Mobile Text Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-text-primary leading-tight max-w-[16ch] mx-auto text-center">
              <BlurText
                text="Turn any PDF into an Audio Book"
                as="span"
                className="[&>span:nth-child(n+21)]:text-primary text-wrap justify-center"
              />
            </h1>
            <p className="text-base text-text-secondary max-w-xs mx-auto leading-relaxed">
              Transform your favorite books, articles, and documents into
              high‑quality audiobooks.
            </p>

            {/* Mobile CTA - More prominent */}
            <div className="pt-4">
              <Button
                variant="default"
                size="lg"
                className="w-full max-w-xs mx-auto h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg"
                onClick={() => setShowBetaForm(true)}
                aria-label="Open beta signup form"
              >
                <ShinyText text="Get Beta Access" speed={5} />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );

  // Desktop Layout Component (existing layout)
  const DesktopHeroLayout = () => (
    <section className="relative overflow-hidden bg-transparent pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <motion.div
            id="beta"
            className="space-y-6 georama-text"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-6xl lg:text-6xl font-bold text-text-primary max-w-[14ch] leading-tight">
                <BlurText
                  text="Turn any PDF into an Audio Book"
                  as="span"
                  className="[&>span:nth-child(n+21)]:text-primary text-wrap"
                />
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-text-secondary max-w-lg leading-relaxed">
                Love reading but short on time? Transform your favorite books,
                articles, and documents into high‑quality audiobooks and listen
                anywhere, anytime.
              </p>

              <div className="pt-2">
                <Button
                  variant="link"
                  className="px-0 h-auto leading-none text-lg sm:text-xl font-semibold text-primary no-underline hover:no-underline cta-underline"
                  onClick={() => setShowBetaForm(true)}
                  aria-label="Open beta signup form"
                >
                  <ShinyText text="Get Beta Access" speed={5} />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right – phone mock */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div className="relative">
              <TiltedCard
                imageSrc="/reader-screen.png"
                altText="Olog Reader mobile app"
                containerWidth="260px"
                containerHeight="562px"
                imageWidth="260px"
                imageHeight="562px"
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

  return (
    <>
      {showBetaForm && (
        <BetaSignupForm onClose={() => setShowBetaForm(false)} />
      )}
      {isMobile ? <MobileHeroLayout /> : <DesktopHeroLayout />}
    </>
  );
}
