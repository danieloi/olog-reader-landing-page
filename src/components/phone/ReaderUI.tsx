"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode, type RefObject } from "react";

export type Block =
  | { kind: "kicker" | "title" | "h2"; text: string }
  | { kind: "byline"; name: string; detail: string; avatar?: boolean }
  | { kind: "p"; sentences: string[]; dropcap?: boolean }
  | { kind: "checklist"; items: { text: string; done: boolean }[] }
  | { kind: "figure"; caption: string }
  | { kind: "folio"; text: string }
  | { kind: "slide"; counter: string; title: string; bullets: string[] }
  | { kind: "thumbs"; titles: string[]; active: number };

export type Doc = {
  label: string;
  format?: "pdf" | "slides" | "epub";
  page: string;
  total: number;
  progress: [number, number];
  startSentence: number;
  blocks: Block[];
};

export type Cursor = { sentence: number; word: number };

export const WORD_MS = 260;
export const LEAD_TICKS = 2;
export const EASE = [0.32, 0.72, 0, 1] as const;

export function sentencesOf(doc: Doc) {
  return doc.blocks.flatMap((b) =>
    b.kind === "p"
      ? b.sentences
      : b.kind === "checklist"
        ? b.items.map((i) => i.text)
        : b.kind === "slide"
          ? b.bullets
          : [],
  );
}

export function wordCount(doc: Doc) {
  return sentencesOf(doc)
    .slice(doc.startSentence)
    .reduce((n, s) => n + s.split(" ").length, 0);
}

export function cursorAt(doc: Doc, tick: number): Cursor {
  const sentences = sentencesOf(doc);
  let remaining = Math.max(0, tick - LEAD_TICKS);
  for (let s = doc.startSentence; s < sentences.length; s++) {
    const words = sentences[s].split(" ").length;
    if (remaining < words) return { sentence: s, word: remaining };
    remaining -= words;
  }
  const last = sentences.length - 1;
  return { sentence: last, word: sentences[last].split(" ").length - 1 };
}

export function formatTime(seconds: number) {
  const s = Math.floor(seconds);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function useReducedMotionSafe() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!reduce;
}

export function useInView<T extends Element>(ref: RefObject<T | null>, margin = "0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: margin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return inView;
}

export function usePageVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return visible;
}

export function useClock(running: boolean, resetKey: string | number, stepMs = 100) {
  const [state, setState] = useState({ key: resetKey, t: 0 });
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setState((p) => (p.key === resetKey ? { key: p.key, t: p.t + stepMs } : { key: resetKey, t: stepMs }));
    }, stepMs);
    return () => clearInterval(id);
  }, [running, resetKey, stepMs]);
  return state.key === resetKey ? state.t : 0;
}

export function PhoneScreen({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`reader-demo ${className}`} role="img" aria-label={label}>
      <div className="rd-screen" aria-hidden>
        <StatusBar />
        {children}
      </div>
    </div>
  );
}

export function StatusBar() {
  return (
    <div className="rd-status">
      <span>9:41</span>
      <span className="rd-island" />
      <span />
    </div>
  );
}

export function TopBar({
  title,
  animated = false,
  left,
  right,
}: {
  title: string;
  animated?: boolean;
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="rd-topbar">
      {left && <span className="rd-topbar-side rd-topbar-left">{left}</span>}
      {animated ? (
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={title}
            className="rd-topbar-title"
            initial={{ y: "120%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-120%", opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
          >
            {title}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span className="rd-topbar-title">{title}</span>
      )}
      {right && <span className="rd-topbar-side rd-topbar-right">{right}</span>}
    </div>
  );
}

export function Sentence({
  text,
  cursor,
  index,
}: {
  text: string;
  cursor: Cursor | null;
  index: number;
}) {
  const active = cursor?.sentence === index;
  const words = text.split(" ");
  return (
    <span className="rd-sent" data-active={active}>
      {words.map((w, i) => (
        <span key={i}>
          {i > 0 && " "}
          <span className="rd-word" data-active={active && cursor?.word === i}>
            {w}
          </span>
        </span>
      ))}
    </span>
  );
}

export function DocPage({ doc, cursor }: { doc: Doc; cursor: Cursor | null }) {
  let s = 0;
  return (
    <div className="rd-page" data-format={doc.format}>
      {doc.blocks.map((block, bi) => {
        switch (block.kind) {
          case "kicker":
            return (
              <p key={bi} className="rd-kicker">
                {block.text}
              </p>
            );
          case "title":
            return (
              <p key={bi} className="rd-title">
                {block.text}
              </p>
            );
          case "h2":
            return (
              <p key={bi} className="rd-h2">
                {block.text}
              </p>
            );
          case "byline":
            return (
              <div key={bi} className="rd-byline">
                {block.avatar && <span className="rd-avatar" />}
                <span className="rd-byline-name">{block.name}</span>
                <span className="rd-byline-dot" />
                <span>{block.detail}</span>
              </div>
            );
          case "p":
            return (
              <p key={bi} className="rd-body" data-dropcap={block.dropcap}>
                {block.sentences.map((text, i) => (
                  <span key={i}>
                    {i > 0 && " "}
                    <Sentence text={text} cursor={cursor} index={s++} />
                  </span>
                ))}
              </p>
            );
          case "checklist":
            return (
              <ul key={bi} className="rd-checklist">
                {block.items.map((item, i) => (
                  <li key={i}>
                    <span className="rd-check" data-done={item.done}>
                      {item.done && (
                        <svg viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6.2 5 8.6l4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="rd-body">
                      <Sentence text={item.text} cursor={cursor} index={s++} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "figure":
            return (
              <figure key={bi} className="rd-figure">
                <div className="rd-figure-plot">
                  {[0.42, 0.68, 0.55, 0.86].map((h, i) => (
                    <span key={i} style={{ height: `${h * 100}%` }} />
                  ))}
                </div>
                <figcaption>{block.caption}</figcaption>
              </figure>
            );
          case "folio":
            return (
              <p key={bi} className="rd-folio">
                {block.text}
              </p>
            );
          case "slide":
            return (
              <div key={bi} className="rd-slide-wrap">
                <p className="rd-slide-counter">{block.counter}</p>
                <div className="rd-slide">
                  <p className="rd-slide-title">{block.title}</p>
                  <div className="rd-slide-cols">
                    <ul className="rd-slide-bullets">
                      {block.bullets.map((text, i) => (
                        <li key={i}>
                          <Sentence text={text} cursor={cursor} index={s++} />
                        </li>
                      ))}
                    </ul>
                    <div className="rd-slide-chart">
                      {[0.35, 0.55, 0.72, 0.95].map((h, i) => (
                        <span key={i} style={{ height: `${h * 100}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          case "thumbs":
            return (
              <div key={bi} className="rd-thumbs">
                {block.titles.map((title, i) => (
                  <div key={i} className="rd-thumb" data-active={i === block.active}>
                    <span className="rd-thumb-title">{title}</span>
                    <span className="rd-thumb-line" />
                    <span className="rd-thumb-line rd-thumb-line--short" />
                  </div>
                ))}
              </div>
            );
        }
      })}
    </div>
  );
}

export function ProgressTrack({ value, animate, stepMs = WORD_MS }: { value: number; animate: boolean; stepMs?: number }) {
  return (
    <div className="rd-track">
      <motion.div
        className="rd-fill"
        initial={false}
        animate={{ width: `${Math.min(1, Math.max(0, value)) * 100}%` }}
        transition={animate ? { duration: stepMs / 1000, ease: "linear" } : { duration: 0 }}
      />
    </div>
  );
}

export function PlayPauseGlyph({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <rect x="6.5" y="5" width="4" height="14" rx="1.4" />
      <rect x="13.5" y="5" width="4" height="14" rx="1.4" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.6v12.8a1 1 0 0 0 1.5.86l10.2-6.4a1 1 0 0 0 0-1.72L9.5 4.74A1 1 0 0 0 8 5.6Z" />
    </svg>
  );
}

export function Player({
  page,
  progress,
  total,
  animate,
  speed = "1.3×",
  playing = true,
  stepMs,
}: {
  page: string;
  progress: number;
  total: number;
  animate: boolean;
  speed?: string;
  playing?: boolean;
  stepMs?: number;
}) {
  return (
    <div className="rd-player">
      <span className="rd-page-pill">{page}</span>
      <ProgressTrack value={progress} animate={animate} stepMs={stepMs} />
      <div className="rd-times">
        <span>{formatTime(progress * total)}</span>
        <span>{formatTime(total)}</span>
      </div>
      <div className="rd-controls">
        <span className="rd-listen">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3a9 9 0 0 0-9 9v5.5A2.5 2.5 0 0 0 5.5 20H7a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5v-1a7 7 0 0 1 14 0v1h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.5a2.5 2.5 0 0 0 2.5-2.5V12a9 9 0 0 0-9-9Z" />
          </svg>
        </span>
        <svg className="rd-skip" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11 6.5v11a1 1 0 0 1-1.6.8L2.6 13a1.2 1.2 0 0 1 0-2l6.8-5.3a1 1 0 0 1 1.6.8Zm10 0v11a1 1 0 0 1-1.6.8L12.6 13a1.2 1.2 0 0 1 0-2l6.8-5.3a1 1 0 0 1 1.6.8Z" />
        </svg>
        <span className="rd-play">
          <PlayPauseGlyph playing={playing} />
        </span>
        <svg className="rd-skip" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 6.5v11a1 1 0 0 0 1.6.8l6.8-5.3a1.2 1.2 0 0 0 0-2l-6.8-5.3a1 1 0 0 0-1.6.8Zm-10 0v11a1 1 0 0 0 1.6.8l6.8-5.3a1.2 1.2 0 0 0 0-2L4.6 5.7A1 1 0 0 0 3 6.5Z" />
        </svg>
        <span className="rd-speed">{speed}</span>
      </div>
    </div>
  );
}

export function SheetStage({
  screenKey,
  reduced,
  children,
}: {
  screenKey: string | number;
  reduced: boolean;
  children: ReactNode;
}) {
  return (
    <div className="rd-content">
      <AnimatePresence initial={false}>
        {reduced ? (
          <motion.div
            key={screenKey}
            className="rd-sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key={screenKey}
            className="rd-sheet"
            initial={{ y: "100%", borderTopLeftRadius: 22, borderTopRightRadius: 22, zIndex: 2 }}
            animate={{ y: 0, scale: 1, opacity: 1, borderTopLeftRadius: 0, borderTopRightRadius: 0, zIndex: 2 }}
            exit={{ y: "-4%", scale: 0.9, opacity: 0, zIndex: 1 }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
