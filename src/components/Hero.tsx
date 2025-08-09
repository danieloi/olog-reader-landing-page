"use client";

import { motion } from "framer-motion";
import BlurText from "./BlurText";
import TiltedCard from "@/components/TiltedCard";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16">
      <div className="hero-radials" aria-hidden />
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
              <h1 className="text-5xl sm:text-6xl lg:text-6xl font-bold text-text-primary leading-tight">
                <BlurText text="Turn any PDF into an" as="span" />{" "}
                <BlurText
                  text="Audio Book"
                  as="span"
                  className="text-primary whitespace-nowrap"
                  delay={1.0}
                />
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-text-secondary max-w-lg leading-relaxed">
                Love reading but short on time? Transform your favorite books,
                articles, and documents into high‑quality audiobooks and listen
                anywhere, anytime.
              </p>
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
}
