"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { fileTypeItems } from "./icons";

type Voice = {
  name: string;
  description: string;
  image: string;
  audio: string;
};

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
    voiceCard: true,
    voices: [
      
      {
        name: "Ashley",
        description: "A warm, natural female voice.",
        image: "/voices/avatars/Ashley.webp",
        audio: "/voices/Ashley.mp3",
      },
      {
        name: "Deborah",
        description: "A warm, peaceful female voice with a calm tone.",
        image: "/voices/avatars/Deborah.webp",
        audio: "/voices/Deborah.mp3",
      }
      ,
      {
        name: "Ronald",
        description: "Confident, British man with a deep, gravelly voice.",
        image: "/voices/avatars/Ronald.webp",
        audio: "/voices/Ronald.mp3",
      },
      {
        name: "Timothy",
        description: "Lively, upbeat American male voice",
        image: "/voices/avatars/Timothy.webp",
        audio: "/voices/Timothy.mp3",
      },
      {
        name: "Blake",
        description: "Rich, intimate male voice.",
        image: "/voices/avatars/Blake.webp",
        audio: "/voices/Blake.mp3",
      },
      { name:"Heart",
        description: "English female voice",
        image: "/voices/avatars/Heart.webp",
        audio: "/voices/Heart.mp3",
      },
      

      
    ] as Voice[],
  },

  {
    label: "Reflow Mode",
    title: "Text automatically adapts to your screen size for a comfortable reading experience",
    video: "/reflow-light.mp4",
    videoDark: "/reflow-mode-dark.mp4",
    hideMuteButton: true,
  },
  {
    label: "Highlights & Notes",
    title: "Highlight passages and jot down notes as you listen — your thoughts stay attached to the text",
    screenshot: "/annotation-light.webp",
    screenshotDark: "/annotation-dark.webp",
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

function VideoPlayer({ src, preloadSrc, showMuteButton = true }: { src: string; preloadSrc?: string; showMuteButton?: boolean }) {
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
      {showMuteButton && (
        <button
          onClick={() => setIsMuted((m) => !m)}
          className="absolute bottom-3 right-3 z-10 p-2 rounded-full bg-black/50 text-primary backdrop-blur-sm md:opacity-0 md:group-hover/video:opacity-100 transition-opacity duration-200 hover:bg-primary/80 cursor-pointer"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
        </button>
      )}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function VoiceShowcase({ voices }: { voices: Voice[] }) {
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setPlaying(null);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  const toggle = (v: Voice) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing === v.name) {
      audio.pause();
      setPlaying(null);
      return;
    }
    audio.src = v.audio;
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setPlaying(v.name))
      .catch(() => setPlaying(null));
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-start gap-2 md:gap-3 p-1 md:p-2 overflow-y-auto scrollbar-hide">
      <audio ref={audioRef} preload="none" />
      {voices.map((v) => {
        const isPlaying = playing === v.name;
        return (
          <button
            key={v.name}
            type="button"
            onClick={() => toggle(v)}
            aria-label={isPlaying ? `Pause ${v.name}` : `Play sample of ${v.name}`}
            className={`flex items-center gap-1 md:gap-2 rounded-2xl p-1 md:p-2  text-left transition-colors cursor-pointer ${
              isPlaying
                ? "bg-primary/10 border border-primary/40"
                : "bg-background-white/70 border border-border hover:border-primary/30"
            }`}
          >
            <img
              src={v.image}
              alt={v.name}
              className="w-4 h-4 md:w-6 md:h-6 rounded-full object-cover shrink-0 bg-background-card"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-text-primary text-base md:text-lg leading-tight truncate">
                {v.name}
              </p>
              <p className="text-sm text-text-secondary leading-snug mt-1 line-clamp-2">
                {v.description}
              </p>
            </div>
            <span
              className={`shrink-0 w-4 h-4 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-colors ${
                isPlaying ? "bg-primary text-white" : "bg-primary/10 text-primary"
              }`}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FileTypeIconGrid() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="grid grid-cols-3 gap-4 md:gap-6 md:p-6">
        {fileTypeItems.map((item) => {
          const Icon = item.Icon;
          return (
            <div key={item.label} className="flex flex-col items-center gap-1 md:gap-2">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-7 h-7 md:w-9 md:h-9" />
              </div>
              <span className="text-lg md:text-lg font-medium text-text-secondary">
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
  toned,
}: {
  benefit: (typeof benefits)[number];
  index: number;
  isDark: boolean;
  toned?: "primary" | "accent" | null;
}) {
  const imageSrc = isDark ? b.screenshotDark : b.screenshot;
  const videoSrc = b.video ? (isDark && b.videoDark ? b.videoDark : b.video) : undefined;
  const videoPreloadSrc = b.video && b.videoDark
    ? (isDark ? b.video : b.videoDark)
    : undefined;

  const tonedBg =
    toned === "primary"
      ? "bg-primary/10 dark:bg-primary/15 border-primary/20"
      : toned === "accent"
      ? "bg-accent/15 dark:bg-accent/12 border-accent/25"
      : "bg-background-card border-border";

  const numberLabel = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      className={`group relative rounded-2xl md:rounded-3xl overflow-hidden border p-4 md:p-6 flex flex-col ${tonedBg}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <p className="font-mono text-xs md:text-sm uppercase tracking-[0.18em] text-text-secondary mb-2 md:mb-3">
        <span className="text-primary">{numberLabel}</span>
        <span className="mx-2 opacity-40">/</span>
        {b.label}
      </p>
      <h3 className="text-lg md:text-2xl font-semibold text-text-primary leading-snug mb-4 md:mb-6">
        {b.title}
      </h3>

      <div className="relative flex-1 min-h-[280px] md:min-h-[380px] rounded-xl overflow-hidden ">
        {b.voiceCard && b.voices ? (
          <VoiceShowcase voices={b.voices} />
        ) : b.iconGrid ? (
          <FileTypeIconGrid />
        ) : videoSrc ? (
          <VideoPlayer src={videoSrc} preloadSrc={videoPreloadSrc} showMuteButton={!b.hideMuteButton} />
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
        <h2 className="text-3xl md:text-6xl font-bold text-text-primary leading-tight">
          Work Harder? <br className="md:hidden" /> <span className="text-primary">Listen Smarter!</span>
        </h2>
        <p className="text-lg md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
          Upload documents, paste links, or scan text. Our AI reads it aloud
          with the most natural sounding voices in the world while highlighting every word — so you never lose your place.
        </p>
      </motion.div>
      <div className="max-w-7xl mx-auto flex flex-col gap-3 md:gap-4">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-3 md:gap-4">
          <BenefitCard benefit={benefits[0]} index={0} isDark={isDark} toned={null} />
          <BenefitCard benefit={benefits[1]} index={1} isDark={isDark} toned="primary" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-3 md:gap-4">
          <BenefitCard benefit={benefits[2]} index={2} isDark={isDark} toned="accent" />
          <BenefitCard benefit={benefits[3]} index={3} isDark={isDark} toned={null} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-3 md:gap-4">
          <BenefitCard benefit={benefits[4]} index={4} isDark={isDark} toned={null} />
          <BenefitCard benefit={benefits[5]} index={5} isDark={isDark} toned="accent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-3 md:gap-4">
          <BenefitCard benefit={benefits[6]} index={6} isDark={isDark} toned="primary" />
          <BenefitCard benefit={benefits[7]} index={7} isDark={isDark} toned={null} />
        </div>
      </div>
    </section>
  );
}
