"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { InstagramIcon, PlayStoreIcon, AppStoreIcon } from "@/components/icons";
import BorderGlow from "@/components/BorderGlow/BorderGlow";

type Testimonial = {
  quote: string;
  name: string;
  handle?: string;
  source: "instagram" | "playstore" | "appstore";
};

const testimonials: Testimonial[] = [
  {
    quote:
      "I tried Olog in January when I was preparing for my masters examination and it made reading easy for lazy reading days. I was still getting the information I needed while doing other chores.",
    name: "always_reen3",
    handle: "always_reen3",
    source: "instagram",
  },
  
  {
    quote:
      "This app enhanced my reading. 3 books in January is actually an achievement because of my tight schedule — so thanks to @ologreader.",
    name: "kayode_ot",
    handle: "kayode_ot",
    source: "instagram",
  },
  {
    quote:
      "Using this app to read isn't that I am lazy, I just believe Olog was made for effectiveness — nothing more, nothing less.",
    name: "Dieke David",
    source: "playstore",
  },
  {
    quote:
      "What makes this app stand out is how natural the voices are. The interface is easy to use and navigate. Makes learning much easier.",
    name: "Le_fraiche",
    source: "appstore",
  },
  {
    quote:
      "I don't usually write reviews, but this app is actually so useful. I can turn my notes, PDFs and slides into audio and just listen on the go. It's made studying and reading and prepping for meetings so much easier for me. If you're someone that's always busy but still wants to learn or read more, this app is actually worth it.",
    name: "YuRume",
    source: "appstore",
  },
  {
    quote:
      "Currently using this to read books. The best reading app I've used so far. I love the voices — it makes listening more enjoyable.",
    name: "Chidinma Romanus",
    source: "playstore",
  },
];

function SourceMark({ source }: { source: Testimonial["source"] }) {
  if (source === "instagram") {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-text-primary text-background">
        <InstagramIcon />
      </span>
    );
  }
  if (source === "appstore") {
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-border text-text-secondary">
        <AppStoreIcon />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-border text-text-secondary">
      <PlayStoreIcon  />
    </span>
  );
}

function sourceLabel(source: Testimonial["source"]) {
  if (source === "instagram") return "on Instagram";
  if (source === "appstore") return "App Store review";
  return "Play Store review";
}

function FeaturedCard({ t }: { t: Testimonial }) {
  return (
    <motion.div
      className="md:col-span-2 md:row-span-2 h-full"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <BorderGlow
        className="h-full"
        backgroundColor="var(--background-white)"
        glowColor="210 100 60"
        borderRadius={24}
        glowRadius={48}
        glowIntensity={1.2}
        coneSpread={30}
        edgeSensitivity={25}
        fillOpacity={0.35}
        colors={["#007AFF", "#B8851F", "#5AA6FF"]}
      >
        <figure className="relative p-8 md:p-12 flex flex-col justify-between overflow-hidden h-full">
          <span
            aria-hidden
            className="absolute top-4 right-6 md:top-8 md:right-12 font-display text-[10rem] md:text-[14rem] leading-none text-primary/15 select-none pointer-events-none"
          >
            &ldquo;
          </span>
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
          </div>
          <blockquote className="font-display text-2xl md:text-4xl lg:text-5xl text-text-primary leading-[1.15] tracking-tight mb-8 relative z-10 max-w-3xl">
            {t.quote}
          </blockquote>
          <figcaption className="flex items-center gap-3 relative z-10">
            <SourceMark source={t.source} />
            <div className="flex flex-col">
              <span className="font-semibold text-text-primary text-base md:text-lg">
                {t.source === "instagram" && t.handle ? `@${t.handle}` : t.name}
              </span>
              <span className="font-mono text-xs text-text-secondary">
                {sourceLabel(t.source)}
              </span>
            </div>
          </figcaption>
        </figure>
      </BorderGlow>
    </motion.div>
  );
}

function SecondaryCard({ t, delay }: { t: Testimonial; delay: number }) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay }}
    >
      <BorderGlow
        className="h-full"
        backgroundColor="var(--background-white)"
        glowColor="42 70 55"
        borderRadius={24}
        glowRadius={32}
        glowIntensity={1.0}
        coneSpread={25}
        edgeSensitivity={28}
        fillOpacity={0.3}
        colors={["#B8851F", "#007AFF", "#DFB243"]}
      >
        <figure className="relative p-6 md:py-7 md:px-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <SourceMark source={t.source} />
          </div>
          <blockquote className="text-text-primary text-base md:text-lg leading-relaxed mb-5 flex-1">
            {t.quote}
          </blockquote>
          <figcaption className="flex flex-col">
            <span className="font-semibold text-text-primary text-sm md:text-base">
              {t.source === "instagram" && t.handle ? `@${t.handle}` : t.name}
            </span>
            <span className="font-mono text-xs text-text-secondary">
              {sourceLabel(t.source)}
            </span>
          </figcaption>
        </figure>
      </BorderGlow>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const [featured, ...rest] = testimonials;

  return (
    <section className="py-12 md:py-28 px-4 bg-background-card/40">
      <motion.div
        className="max-w-7xl mx-auto mb-10 md:mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-xs md:text-sm uppercase tracking-[0.22em] text-primary mb-3">
          What listeners say
        </p>
        <h2 className="font-display text-4xl md:text-6xl text-text-primary leading-[1.05] tracking-tight max-w-3xl">
          Loved by readers, students &amp;{" "}
          <em className="not-italic text-accent">professionals</em>.
        </h2>
      </motion.div>

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Top region: featured (2×2) + 2 stacked secondaries on the right */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6">
          <FeaturedCard t={featured} />
          {rest.slice(0, 2).map((t, i) => (
            <SecondaryCard key={t.name} t={t} delay={0.1 + i * 0.08} />
          ))}
        </div>
        {/* Bottom row: 2fr / 3fr / 2fr — YuRume gets more horizontal room */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr_2fr] gap-6">
          {rest.slice(2).map((t, i) => (
            <SecondaryCard key={t.name} t={t} delay={0.05 + i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
