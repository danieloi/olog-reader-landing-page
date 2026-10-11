"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { FloatingPhone } from "./FloatingPhone";
import { FEATURE_SCREENS } from "./phone/FeatureScreens";
import { PhoneScreen, SheetStage, useClock, useInView, usePageVisible, useReducedMotionSafe } from "./phone/ReaderUI";

type Voice = {
  name: string;
  description: string;
  image: string;
  audio: string;
};

const voices: Voice[] = [
  { name: "Ashley", description: "A warm, natural female voice.", image: "/voices/avatars/Ashley.webp", audio: "/voices/Ashley.mp3" },
  { name: "Deborah", description: "A warm, peaceful female voice with a calm tone.", image: "/voices/avatars/Deborah.webp", audio: "/voices/Deborah.mp3" },
  { name: "Ronald", description: "Confident, British man with a deep, gravelly voice.", image: "/voices/avatars/Ronald.webp", audio: "/voices/Ronald.mp3" },
  { name: "Timothy", description: "Lively, upbeat American male voice", image: "/voices/avatars/Timothy.webp", audio: "/voices/Timothy.mp3" },
  { name: "Blake", description: "Rich, intimate male voice.", image: "/voices/avatars/Blake.webp", audio: "/voices/Blake.mp3" },
  { name: "Heart", description: "English female voice", image: "/voices/avatars/Heart.webp", audio: "/voices/Heart.mp3" },
];

const features = [
  {
    id: "voicechat",
    label: "Real-time Voice Chat",
    title: "Talk to your reading assistant out loud — ask about the page you're on and hear the answer instantly",
    isNew: true,
  },
  {
    id: "highlight",
    label: "Smart Highlighting",
    title: "Each word lights up in sync with the audio, helping you follow along and retain more",
  },
  {
    id: "speed",
    label: "Speed Control",
    title: "Listen at your speed — slow down for complex content or speed up to breeze through",
  },
  {
    id: "sync",
    label: "Sync Across Devices",
    title: "Pick up right where you left off on any device — your progress stays in sync",
  },
  {
    id: "formats",
    label: "Listen to Anything",
    title: "Upload PDFs, EPUBs, slides, or links and instantly turn them into natural speech",
  },
  {
    id: "offline",
    label: "Offline Mode",
    title: "Listen to your documents anytime — even without an internet connection",
  },
  {
    id: "voices",
    label: "Natural Voices",
    title: "The best most natural sounding voices in the world — pick from a huge list of voices",
    voices: true,
  },
  {
    id: "reflow",
    label: "Reflow Mode",
    title: "Text automatically adapts to your screen size for a comfortable reading experience",
  },
  {
    id: "notes",
    label: "Highlights & Notes",
    title: "Highlight passages and jot down notes as you listen — your thoughts stay attached to the text",
  },
] as const;

function FeaturePhone({ index, t, reduced }: { index: number; t: number; reduced: boolean }) {
  const feature = features[index];
  const screen = FEATURE_SCREENS[feature.id];
  const loop = Math.floor(t / screen.duration);
  const { Screen } = screen;
  return (
    <PhoneScreen label={`${feature.label} in Olog Reader: ${screen.summary}`} overlayStatus>
      <SheetStage screenKey={`${feature.id}-${loop}`} reduced={reduced}>
        <Screen t={reduced ? screen.still : t % screen.duration} reduced={reduced} />
      </SheetStage>
    </PhoneScreen>
  );
}

function PlayGlyph({ playing }: { playing: boolean }) {
  return playing ? (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  ) : (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function VoiceSamples({ className = "" }: { className?: string }) {
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
    <div className={`flex flex-wrap gap-1 ${className}`}>
      <audio ref={audioRef} preload="none" />
      {voices.map((v) => {
        const isPlaying = playing === v.name;
        return (
          <button
            key={v.name}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggle(v);
            }}
            aria-label={isPlaying ? `Pause ${v.name}` : `Play a sample of ${v.name}, ${v.description}`}
            className={`inline-flex items-center gap-1 h-5 pl-[4px] pr-[14px] rounded-full border text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              isPlaying
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background-white border-border text-text-primary hover:border-primary/40"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.image} alt="" className="w-4 h-4 rounded-full object-cover bg-background-card" />
            {v.name}
            <PlayGlyph playing={isPlaying} />
          </button>
        );
      })}
    </div>
  );
}

function useFeatureClock(index: number, reduced: boolean) {
  const phoneRef = useRef<HTMLDivElement>(null);
  const inView = useInView(phoneRef);
  const pageVisible = usePageVisible();
  const t = useClock(inView && pageVisible && !reduced, index);
  return { phoneRef, t };
}

function DesktopShowcase({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const lockUntil = useRef(0);
  const { phoneRef, t } = useFeatureClock(active, reduced);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (performance.now() < lockUntil.current) return;
        const mid = window.innerHeight / 2;
        let best = -1;
        let bestDist = Infinity;
        itemRefs.current.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          if (r.height === 0) return;
          const d = Math.abs(r.top + r.height / 2 - mid);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        if (best >= 0) setActive(best);
      });
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const select = (i: number) => {
    setActive(i);
    lockUntil.current = performance.now() + (reduced ? 150 : 1000);
    itemRefs.current[i]?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  };

  return (
    <div className="hidden md:grid grid-cols-[auto_minmax(0,1fr)] gap-10 lg:gap-14 max-w-6xl mx-auto">
      <div className="relative">
        <div ref={phoneRef} className="sticky top-[max(96px,calc(50vh-302px))] flex flex-col items-center">
          <FloatingPhone>
            <FeaturePhone index={active} t={t} reduced={reduced} />
          </FloatingPhone>
        </div>
      </div>
      <ol className="py-[20vh]">
        {features.map((f, i) => {
          const isActive = i === active;
          return (
            <li
              key={f.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-active={isActive}
              onClick={() => select(i)}
              className="group relative min-h-[60vh] flex flex-col justify-center pl-4 lg:pl-5 cursor-pointer"
            >
              <span aria-hidden className="absolute left-0 inset-y-0 w-[2px] bg-border" />
              <span
                aria-hidden
                className={`absolute left-0 inset-y-[18%] w-[2px] rounded-full bg-primary origin-top transition-transform duration-500 ease-out ${
                  isActive ? "scale-y-100" : "scale-y-0"
                }`}
              />
              <p
                className={`type-eyebrow flex items-center gap-[12px] transition-colors duration-300 ${
                  isActive ? "text-primary-700" : "text-text-secondary"
                }`}
              >
                {f.label}
                {"isNew" in f && (
                  <span className="rounded-full bg-primary px-[8px] py-[2px] text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
                    New
                  </span>
                )}
              </p>
              <h3
                className={`type-h3 mt-2 max-w-xl transition-[color,opacity] duration-300 ${
                  isActive ? "text-text-primary opacity-100" : "text-text-secondary opacity-60 group-hover:opacity-90"
                }`}
              >
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={(e) => {
                    e.stopPropagation();
                    select(i);
                  }}
                  className="[font:inherit] tracking-[inherit] text-left cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  {f.title}
                </button>
              </h3>
              {"voices" in f && <VoiceSamples className="mt-3 max-w-xl" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function MobileShowcase({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState(0);
  const chipsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { phoneRef, t } = useFeatureClock(active, reduced);
  const duration = FEATURE_SCREENS[features[active].id].duration;
  const feature = features[active];

  useEffect(() => {
    if (!reduced && t >= duration) setActive((a) => (a + 1) % features.length);
  }, [t, duration, reduced]);

  useEffect(() => {
    const row = chipsRef.current;
    const chip = tabRefs.current[active];
    if (!row || !chip) return;
    row.scrollTo({
      left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [active, reduced]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const jump = e.key === "Home" ? 0 : e.key === "End" ? features.length - 1 : null;
    if (!delta && jump === null) return;
    e.preventDefault();
    const next = jump ?? (active + delta + features.length) % features.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="md:hidden">
      <div
        ref={chipsRef}
        role="tablist"
        aria-label="Olog Reader features"
        className="flex gap-1 overflow-x-auto scrollbar-hide -mx-4 px-4 py-1"
      >
        {features.map((f, i) => {
          const isActive = i === active;
          return (
            <button
              key={f.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`feature-tab-${f.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls="feature-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              className={`relative shrink-0 h-5 px-2 rounded-full overflow-hidden text-[15px] font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-background-card text-text-secondary border border-border"
              }`}
            >
              {f.label}
              {isActive && !reduced && (
                <span
                  aria-hidden
                  className="absolute left-[14px] right-[14px] bottom-[5px] h-[2px] rounded-full bg-primary-foreground/30 overflow-hidden"
                >
                  <span
                    className="block h-full bg-primary-foreground origin-left"
                    style={{ transform: `scaleX(${Math.min(1, t / duration)})`, transition: "transform 100ms linear" }}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div ref={phoneRef} className="flex justify-center mt-4">
        <FloatingPhone reduced size={{ width: 248, height: 535 }}>
          <FeaturePhone index={active} t={t} reduced={reduced} />
        </FloatingPhone>
      </div>

      <div
        id="feature-panel"
        role="tabpanel"
        aria-labelledby={`feature-tab-${feature.id}`}
        className="mt-4 min-h-[9.5rem] text-center"
      >
        <motion.div
          key={feature.id}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="type-eyebrow text-primary-700">{feature.label}</p>
          <h3 className="mt-1 text-xl font-semibold tracking-[-0.02em] leading-snug text-text-primary text-balance">
            {feature.title}
          </h3>
          {"voices" in feature && <VoiceSamples className="mt-3 justify-center" />}
        </motion.div>
      </div>
    </div>
  );
}

export function BenefitsSection() {
  const reduced = useReducedMotionSafe();

  return (
    <section className="py-10 md:py-24 px-4">
      <motion.div
        className="max-w-7xl mx-auto space-y-4 text-center mb-10 md:mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="type-h2 text-text-primary">
          Work Harder? <br className="md:hidden" /> <span className="text-primary">Listen Smarter!</span>
        </h2>
        <p className="type-lead text-text-secondary max-w-3xl mx-auto">
          Upload documents, paste links, or scan text. Our AI reads it aloud
          with the most natural sounding voices in the world while highlighting every word — so you never lose your place.
        </p>
      </motion.div>
      <DesktopShowcase reduced={reduced} />
      <MobileShowcase reduced={reduced} />
    </section>
  );
}
