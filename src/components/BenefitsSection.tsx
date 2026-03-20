"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { fileTypeItems } from "./icons";

const benefits = [
  {
    label: "Smart Highlighting",
    title: "Each word lights up in sync with the audio, helping you follow along and retain more",
    video: "/highlight_as_you_read_light.mp4",
    videoDark: "/highlight_as_you_read_dark.mp4",
  },
  {
    label: "Speed Control",
    title: "Listen at your speed — slow down for complex content or speed up to breeze through",
    screenshot: "/read_at_your_pace.webp",
    screenshotDark: "/read_at_your_pace_dark.webp",
  },
  {
    label: "Sync Across Devices",
    title: "Pick up right where you left off on any device — your progress stays in sync",
    screenshot: "/sync_progress.webp",
    screenshotDark: "/sync_progress_dark.webp",
  },
  {
    label: "Listen to Anything",
    title: "Upload PDFs, EPUBs, slides, or links and instantly turn them into natural speech",
    iconGrid: true,
  },
  {
    label: "Offline Mode",
    title: "Listen to your documents anytime — even without an internet connection",
    screenshot: "/offline_mode.webp",
    screenshotDark: "/offline_mode_dark.webp",
  },
  {
    label: "Natural Voices",
    title: "The best most natural sounding voices in the world — pick from a huge list of voices",
    screenshot: "/most_natural_sounding_voices.webp",
    screenshotDark: "/most_natural_sounding_voices_dark.webp",
  },
  {
    label: "Light & Dark Mode",
    title: "Switch seamlessly between light and dark themes to match your preference",
    video: "/light_to_dark_video.mp4",
    videoDark: "/light_to_dark_video.mp4",
  },
  {
    label: "Reflow Mode",
    title: "Text automatically adapts to your screen size for a comfortable reading experience",
    video: "/reflow-light.mp4",
    videoDark: "/reflow-mode-dark.mp4",
  },
];

function VolumeOnIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function VolumeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function VideoPlayer({ src, preloadSrc }: { src: string; preloadSrc?: string }) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevSrcRef = useRef(src);

  // Preload the alternate theme video so it's cached before the switch
  useEffect(() => {
    if (!preloadSrc) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = preloadSrc;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [preloadSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;


    if (prevSrcRef.current !== src) {
      const currentTime = video.currentTime;
      const wasPlaying = !video.paused;
      video.src = src;
      video.currentTime = currentTime;
      if (wasPlaying) video.play();
      prevSrcRef.current = src;
    } else if (!video.src) {
      video.src = src;
      video.play();
    }
  }, [src]);

  return (
    <div className="group/video absolute inset-0">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-contain"
      />
      <button
        onClick={() => setIsMuted((m) => !m)}
        className="absolute bottom-3 right-3 z-10 p-2 rounded-full bg-black/50 text-primary backdrop-blur-sm md:opacity-0 md:group-hover/video:opacity-100 transition-opacity duration-200 hover:bg-primary/80 cursor-pointer"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
      </button>
    </div>
  );
}

function FileTypeIconGrid() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="grid grid-cols-3 gap-4 md:gap-6 p-6">
        {fileTypeItems.map((item) => {
          const Icon = item.Icon;
          return (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-7 h-7 md:w-9 md:h-9 text-primary" />
              </div>
              <span className="text-xs md:text-sm font-medium text-text-secondary">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
  const videoSrc = b.video ? (isDark && b.videoDark ? b.videoDark : b.video) : undefined;
  const videoPreloadSrc = b.video && b.videoDark
    ? (isDark ? b.video : b.videoDark)
    : undefined;

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

      <div className="relative flex-1 min-h-[280px] md:min-h-[380px] rounded-xl overflow-hidden ">
        {b.iconGrid ? (
          <FileTypeIconGrid />
        ) : videoSrc ? (
          <VideoPlayer src={videoSrc} preloadSrc={videoPreloadSrc} />
        ) : (
            <img
              key={imageSrc}
              src={imageSrc}
              alt={`${b.title} screenshot`}
              className="absolute inset-0 w-full h-full object-contain "
              onError={(e) => {
                if (isDark && b.screenshot && e.currentTarget.src !== b.screenshot) {
                  e.currentTarget.src = b.screenshot;
                }
              }}
            />
        )}
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
          with the most natural sounding voices in the world while highlighting every word — so you never lose your place.
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
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-3 md:gap-4">
          {[benefits[4], benefits[5]].map((b, i) => (
            <BenefitCard key={b.title} benefit={b} index={i + 4} isDark={isDark} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-3 md:gap-4">
          {[benefits[6], benefits[7]].map((b, i) => (
            <BenefitCard key={b.title} benefit={b} index={i + 6} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}
