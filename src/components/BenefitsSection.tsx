"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const benefits = [
  {
    label: "Smart Highlighting",
    title: "Every word is highlighted as it's spoken so you stay focused and retain more",
    screenshot: "/highlight_text_as_you_read.jpeg",
    screenshotDark: "/highlight_text_as_you_read_dark.png",
  },
  {
    label: "Speed Control",
    title: "Listen at your speed — slow down for complex content or speed up to breeze through",
    screenshot: "/read_at_your_pace.jpeg",
    screenshotDark: "/read_at_your_pace_dark.png",
  },
  {
    label: "Sync Across Devices",
    title: "Pick up right where you left off on any device — your progress stays in sync",
    screenshot: "/sync_progress.png",
    screenshotDark: "/sync_progress_dark.png",
  },
  {
    label: "Listen to Anything",
    title: "Upload PDFs, EPUBs, slides, or links and instantly turn them into natural speech",
    screenshot: "/acceptable_file_type.png",
    screenshotDark: "/acceptable_file_type_dark.png",
  },
];

function BenefitCard({
  benefit: b,
  index,
  isDark,
}: {
  benefit: (typeof benefits)[number];
  index: number;
  isDark: boolean;
}) {
  const imageSrc = isDark ? b.screenshotDark : b.screenshot;

  return (
    <motion.div
      className="group relative rounded-2xl md:rounded-3xl overflow-hidden bg-background-card border border-border p-4 md:p-6 flex flex-col"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <p className="text-[10px] md:text-xs font-medium text-text-secondary mb-1 md:mb-2">
        {b.label}
      </p>
      <h3 className="text-sm md:text-xl font-semibold text-text-primary leading-snug mb-4 md:mb-6">
        {b.title}
      </h3>

      <div className="relative flex-1 min-h-[280px] md:min-h-[400px] rounded-xl overflow-hidden bg-background-white border border-border">
        <AnimatePresence mode="wait">
          <motion.img
            key={imageSrc}
            src={imageSrc}
            alt={`${b.title} screenshot`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onError={(e) => {
              if (isDark && e.currentTarget.src !== b.screenshot) {
                e.currentTarget.src = b.screenshot;
              }
            }}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function BenefitsSection() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <section className="py-10 md:py-24 px-4">
      <motion.div
        className="max-w-7xl mx-auto space-y-4 text-center mb-10 md:mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold text-text-primary leading-tight">
          Work Harder? <span className="text-primary">Listen Smarter!</span>
        </h2>
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Upload documents, paste links, or scan text. Our AI reads it aloud
          with the most natural sounding voices while highlighting every word — so you never lose your place.
        </p>
      </motion.div>
      <div className="max-w-7xl mx-auto flex flex-col gap-3 md:gap-4">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-3 md:gap-4">
          {[benefits[0], benefits[1]].map((b, i) => (
            <BenefitCard key={b.title} benefit={b} index={i} isDark={isDark} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-3 md:gap-4">
          {[benefits[2], benefits[3]].map((b, i) => (
            <BenefitCard key={b.title} benefit={b} index={i + 2} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}
