"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ComponentType } from "react";
import {
  FileEpubIcon,
  FileLinkIcon,
  FilePdfIcon,
  FilePowerpointIcon,
  FileWordIcon,
} from "@/components/icons";
import {
  DocPage,
  EASE,
  PlayPauseGlyph,
  Player,
  ProgressTrack,
  Sentence,
  TopBar,
  WORD_MS,
  cursorAt,
  sentencesOf,
} from "./ReaderUI";
import { DOCS } from "./docs";

export type ScreenProps = { t: number; reduced: boolean };

const ARTICLE = DOCS[0];
const BLOG = DOCS[1];

const lerp = (a: number, b: number, p: number) => a + (b - a) * Math.min(1, Math.max(0, p));

function ScreenColumn({ children }: { children: React.ReactNode }) {
  return <div className="fx-col">{children}</div>;
}

function HighlightScreen({ t, reduced }: ScreenProps) {
  const cursor = cursorAt(ARTICLE, Math.floor(t / WORD_MS));
  return (
    <ScreenColumn>
      <TopBar title={ARTICLE.label} />
      <div className="fx-body">
        <DocPage doc={ARTICLE} cursor={cursor} />
      </div>
      <Player
        page={ARTICLE.page}
        progress={lerp(0.16, 0.26, t / 9000)}
        total={ARTICLE.total}
        animate={!reduced && t > 0}
        stepMs={100}
      />
    </ScreenColumn>
  );
}

const MIN_WPM = 80;
const MAX_WPM = 600;
const SPEEDS = [1, 1.5, 2];
const PRESETS = [
  { label: "Slow", wpm: 160 },
  { label: "Normal", wpm: 200 },
  { label: "Fast", wpm: 300 },
  { label: "Speedster", wpm: 500 },
];

function speedLabel(wpm: number) {
  if (wpm <= 180) return "Slow";
  if (wpm <= 250) return "Normal";
  if (wpm < 450) return "Fast";
  return "Speedster";
}

function SpeedScreen({ t }: ScreenProps) {
  const speed = SPEEDS[Math.min(SPEEDS.length - 1, Math.floor(t / 3000))];
  const wpm = Math.round(speed * 200);
  const fill = (wpm - MIN_WPM) / (MAX_WPM - MIN_WPM);
  const boost = Math.round((speed - 1) * 100);
  const minutesLeft = Math.round(18 / speed);
  return (
    <ScreenColumn>
      <TopBar title={ARTICLE.label} />
      <div className="fx-body fx-dimmed">
        <DocPage doc={ARTICLE} cursor={null} />
      </div>
      <div className="fx-scrim" />
      <div className="fx-bottom-sheet fx-speed">
        <span className="fx-grabber" />
        <div className="fx-speed-row">
          <div className="fx-speed-main">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={speedLabel(wpm)}
                className="fx-speed-label"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18 }}
              >
                {speedLabel(wpm)}
              </motion.p>
            </AnimatePresence>
            <p className="fx-speed-left">{minutesLeft} min left</p>
            <span className="fx-boost" data-visible={boost > 0}>
              <svg viewBox="0 0 12 12" fill="none">
                <path d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {boost}% productivity boost
            </span>
            <div className="fx-speed-stepper">
              <span className="fx-step">−</span>
              <span className="fx-speed-num">{speed.toFixed(1)}×</span>
              <span className="fx-step">+</span>
            </div>
            <p className="fx-wpm">{wpm} words per minute</p>
            <div className="fx-presets">
              {PRESETS.map((p) => (
                <span key={p.label} className="fx-preset" data-active={p.wpm === wpm}>
                  {p.label}
                </span>
              ))}
            </div>
          </div>
          <div className="fx-vslider">
            <span className="fx-vslider-fill" style={{ height: `${fill * 100}%` }}>
              <span className="fx-vslider-thumb" />
            </span>
          </div>
        </div>
      </div>
    </ScreenColumn>
  );
}

type IconType = ComponentType<{ className?: string }>;

function ScanIcon({ className }: { className?: string }) {
  return (
    <span className={className}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M7 12h10" />
      </svg>
    </span>
  );
}

function FileBadge({ Icon, tone }: { Icon: IconType; tone: string }) {
  return (
    <span className="fx-file" data-tone={tone}>
      <Icon className="fx-file-icon" />
    </span>
  );
}

const LIBRARY = [
  { title: "The reading brain in a digital age", meta: "Article · 6 min", Icon: FileLinkIcon, tone: "blue", from: 0.24, to: 0.62 },
  { title: "Q3 strategy memo", meta: "PDF · 14 pages", Icon: FilePdfIcon, tone: "red", from: 0.08, to: 0.36 },
  { title: "Pride and Prejudice", meta: "EPUB · Chapter 12", Icon: FileEpubIcon, tone: "green", from: 0.41, to: 0.47 },
  { title: "Welcome to the team", meta: "Doc · 8 pages", Icon: FileWordIcon, tone: "indigo", from: 0.14, to: 0.14 },
];

function SyncScreen({ t, reduced }: ScreenProps) {
  const synced = t >= 1700;
  const toast = t >= 3600;
  return (
    <ScreenColumn>
      <TopBar title="Library" />
      <div className="fx-body fx-pad">
        <div className="fx-sync" data-synced={synced}>
          <span className="fx-sync-icon">
            {synced ? (
              <svg viewBox="0 0 16 16" fill="none">
                <path d="m4 8.4 2.6 2.4L12 5.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="none" className={reduced ? "" : "fx-spin"}>
                <path d="M13 8a5 5 0 0 1-8.5 3.5M3 8a5 5 0 0 1 8.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M11.8 2v2.6H9.2M4.2 14v-2.6h2.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span>{synced ? "Up to date with your iPad" : "Syncing from your iPad…"}</span>
        </div>
        <ul className="fx-list">
          {LIBRARY.map((item, i) => {
            const value = synced ? item.to : item.from;
            return (
              <li key={item.title} className="fx-row" data-active={toast && i === 0}>
                <FileBadge Icon={item.Icon} tone={item.tone} />
                <div className="fx-row-main">
                  <p className="fx-row-title">{item.title}</p>
                  <div className="fx-row-progress">
                    <div className="fx-mini-track">
                      <span
                        className="fx-mini-fill"
                        style={{ width: `${value * 100}%`, transitionDelay: reduced ? "0ms" : `${i * 140}ms` }}
                      />
                    </div>
                    <span className="fx-row-pct">{Math.round(value * 100)}%</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fx-resume"
            initial={reduced ? false : { y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p className="fx-resume-kicker">Picking up where you left off</p>
            <p className="fx-resume-title">{LIBRARY[0].title}</p>
            <ProgressTrack value={lerp(0.62, 0.66, (t - 3600) / 4400)} animate={!reduced} stepMs={100} />
            <div className="fx-resume-foot">
              <span>Page 4 · 02:43 left</span>
              <span className="fx-play-sm">
                <PlayPauseGlyph playing />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenColumn>
  );
}

const IMPORTS = [
  { title: "Lecture 7 notes.pdf", meta: "PDF · 22 pages", Icon: FilePdfIcon, tone: "red" },
  { title: "The Great Gatsby", meta: "EPUB · 9 chapters", Icon: FileEpubIcon, tone: "green" },
  { title: "Q3 all-hands", meta: "Slides · 31 slides", Icon: FilePowerpointIcon, tone: "orange" },
  { title: "Why we sleep less", meta: "Link · longreads.blog", Icon: FileLinkIcon, tone: "blue" },
  { title: "Scanned page", meta: "Scan · Chapter 3", Icon: ScanIcon, tone: "indigo" },
];

const IMPORT_GAP = 1100;
const IMPORT_START = 150;

function FormatsScreen({ t, reduced }: ScreenProps) {
  const count = Math.min(IMPORTS.length, Math.floor((t + IMPORT_GAP - IMPORT_START) / IMPORT_GAP));
  const visible = IMPORTS.slice(0, Math.max(0, count)).reverse();
  return (
    <ScreenColumn>
      <TopBar
        title="Library"
        right={
          <span className="fx-add">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        }
      />
      <div className="fx-body fx-pad">
        <div className="fx-chips">
          {["All", "PDF", "EPUB", "Slides", "Links", "Scans"].map((c, i) => (
            <span key={c} className="fx-chip" data-active={i === 0}>
              {c}
            </span>
          ))}
        </div>
        <ul className="fx-list">
          <AnimatePresence initial={false}>
            {visible.map((item, i) => {
              const index = IMPORTS.indexOf(item);
              const age = t - (index * IMPORT_GAP + IMPORT_START);
              const ready = reduced || age > 1000;
              return (
                <motion.li
                  key={item.title}
                  layout={!reduced}
                  className="fx-row"
                  data-active={i === 0 && !reduced}
                  initial={reduced ? false : { opacity: 0, y: -18, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                >
                  <FileBadge Icon={item.Icon} tone={item.tone} />
                  <div className="fx-row-main">
                    <p className="fx-row-title">{item.title}</p>
                    {ready ? (
                      <p className="fx-row-meta">{item.meta}</p>
                    ) : (
                      <p className="fx-row-meta fx-preparing">Preparing audio…</p>
                    )}
                  </div>
                  <span className="fx-play-sm" data-ready={ready}>
                    <PlayPauseGlyph playing={false} />
                  </span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </ScreenColumn>
  );
}

function Ring({ value }: { value: number }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <svg className="fx-ring" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r={r} className="fx-ring-bg" />
      <circle
        cx="12"
        cy="12"
        r={r}
        className="fx-ring-fg"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value)}
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span className="fx-toggle" data-on={on}>
      <span className="fx-toggle-knob" />
    </span>
  );
}

function OfflineScreen({ t, reduced }: ScreenProps) {
  const on = t >= 900;
  const dl = lerp(0, 1, (t - 1300) / 2800);
  const done = dl >= 1;
  const playing = t >= 4300;
  return (
    <ScreenColumn>
      <TopBar title="Offline listening" />
      <div className="fx-body fx-pad">
        <div className="fx-card">
          <div className="fx-setting">
            <span className="fx-setting-icon" data-on={on}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0" />
                <circle cx="12" cy="19" r="1" fill="currentColor" />
                {on && <path d="M3 3l18 18" />}
              </svg>
            </span>
            <div className="fx-row-main">
              <p className="fx-row-title">Offline mode</p>
              <p className="fx-row-meta">Listen without a connection</p>
            </div>
            <Toggle on={on} />
          </div>
        </div>
        <motion.div
          className="fx-card"
          initial={false}
          animate={{ opacity: on ? 1 : 0.45 }}
          transition={{ duration: reduced ? 0 : 0.3 }}
        >
          <p className="fx-card-label">Offline voice</p>
          <div className="fx-setting">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/voices/avatars/Ashley.webp" alt="" className="fx-avatar" />
            <div className="fx-row-main">
              <p className="fx-row-title">Ashley</p>
              <p className="fx-row-meta">{done ? "Downloaded · 48 MB" : on ? `Downloading · ${Math.round(dl * 100)}%` : "48 MB"}</p>
            </div>
            <span className="fx-ring-wrap" data-done={done}>
              <Ring value={dl} />
              {done && (
                <svg className="fx-ring-check" viewBox="0 0 16 16" fill="none">
                  <path d="m4 8.4 2.6 2.4L12 5.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          </div>
        </motion.div>
        <div className="fx-card">
          <p className="fx-card-label">Saved for offline</p>
          {LIBRARY.slice(0, 3).map((item) => (
            <div key={item.title} className="fx-saved">
              <FileBadge Icon={item.Icon} tone={item.tone} />
              <p className="fx-row-title">{item.title}</p>
              <svg className="fx-saved-check" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="currentColor" />
                <path d="m5 8.2 2 1.9 4-4.2" stroke="var(--rd-bg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {playing && (
          <motion.div
            className="fx-resume"
            initial={reduced ? false : { y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p className="fx-offline-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M3 3l18 18" />
              </svg>
              No connection · still playing
            </p>
            <p className="fx-resume-title">{LIBRARY[0].title}</p>
            <ProgressTrack value={lerp(0.3, 0.36, (t - 4300) / 4700)} animate={!reduced} stepMs={100} />
            <div className="fx-resume-foot">
              <span>Ashley · offline voice</span>
              <span className="fx-play-sm">
                <PlayPauseGlyph playing />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenColumn>
  );
}

const VOICES = [
  { name: "Ashley", description: "A warm, natural female voice." },
  { name: "Ronald", description: "Confident, British man with a deep, gravelly voice." },
  { name: "Deborah", description: "A warm, peaceful female voice with a calm tone." },
  { name: "Timothy", description: "Lively, upbeat American male voice" },
  { name: "Blake", description: "Rich, intimate male voice." },
];

const VOICE_MS = 2400;

function VoicesScreen({ t, reduced }: ScreenProps) {
  const active = Math.floor(t / VOICE_MS) % 4;
  return (
    <ScreenColumn>
      <TopBar title="Voices" />
      <div className="fx-body fx-pad">
        <div className="fx-chips">
          {["All", "Female", "Male", "British", "American"].map((c, i) => (
            <span key={c} className="fx-chip" data-active={i === 0}>
              {c}
            </span>
          ))}
        </div>
        <ul className="fx-list fx-voices">
          {VOICES.map((v, i) => {
            const on = i === active;
            return (
              <motion.li
                key={v.name}
                className="fx-row fx-voice"
                data-active={on}
                initial={false}
                animate={{ scale: on ? 1.04 : 1 }}
                transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 22 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/voices/avatars/${v.name}.webp`} alt="" className="fx-avatar" />
                <div className="fx-row-main">
                  <p className="fx-row-title">{v.name}</p>
                  <p className="fx-row-meta fx-clamp">{v.description}</p>
                </div>
                {on ? (
                  <span className="fx-wave" data-paused={reduced}>
                    {[0, 1, 2, 3, 4].map((b) => (
                      <span key={b} style={{ animationDelay: `${b * -0.18}s` }} />
                    ))}
                  </span>
                ) : (
                  <span className="fx-play-sm fx-play-ghost">
                    <PlayPauseGlyph playing={false} />
                  </span>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </ScreenColumn>
  );
}

const REFLOW_AT = 2600;

function ReflowScreen({ t, reduced }: ScreenProps) {
  const reflowed = t >= REFLOW_AT;
  const cursor = cursorAt(ARTICLE, Math.floor((t - REFLOW_AT - 400) / WORD_MS));
  const sentences = sentencesOf(ARTICLE);
  return (
    <ScreenColumn>
      <TopBar
        title=""
        left={<span className="fx-topbar-doc">Research.pdf</span>}
        right={
          <span className="fx-seg">
            <span data-active={!reflowed}>Page</span>
            <span data-active={reflowed}>Reflow</span>
          </span>
        }
      />
      <div className="fx-body fx-reflow-stage">
        <AnimatePresence initial={false} mode="popLayout">
          {reflowed ? (
            <motion.div
              key="reflow"
              className="fx-reflow"
              initial={reduced ? false : { opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <DocPage doc={ARTICLE} cursor={t >= REFLOW_AT + 400 ? cursor : null} />
            </motion.div>
          ) : (
            <motion.div
              key="page"
              className="fx-pdf-wrap"
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <div className="fx-pdf">
                <p className="fx-pdf-kicker">{(ARTICLE.blocks[0] as { text: string }).text}</p>
                <p className="fx-pdf-title">{(ARTICLE.blocks[1] as { text: string }).text}</p>
                <div className="fx-pdf-cols">
                  <p>
                    {sentences.join(" ")} {sentences.slice(0, 2).join(" ")}
                  </p>
                  <p>
                    {sentences.slice(1).join(" ")} {sentences.join(" ")}
                  </p>
                </div>
                <div className="fx-pdf-figure" />
                <div className="fx-pdf-cols">
                  <p>{sentences.slice(2).join(" ")}</p>
                  <p>{sentences.slice(0, 3).join(" ")}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Player
        page="3/12"
        progress={lerp(0.21, 0.27, t / 9000)}
        total={612}
        animate={!reduced && t > 0}
        playing={reflowed}
        stepMs={100}
      />
    </ScreenColumn>
  );
}

const NOTE_TEXT = "Try this on my commute tomorrow.";
const NOTE_COLORS = ["yellow", "green", "blue", "pink"];

function NotesScreen({ t, reduced }: ScreenProps) {
  const sentences = sentencesOf(BLOG);
  const cursor = cursorAt(BLOG, Math.floor(t / WORD_MS));
  const state = t < 1100 ? "none" : t < 2900 ? "selected" : "highlighted";
  const toolbar = t >= 1600 && t < 2900;
  const sheet = t >= 3500 && t < 7400;
  const typed = NOTE_TEXT.slice(0, Math.max(0, Math.floor((t - 4000) / 70)));
  const noted = t >= 7400;
  const titleBlock = BLOG.blocks.find((b) => b.kind === "title") as { text: string };
  return (
    <ScreenColumn>
      <TopBar title={BLOG.label} />
      <div className="fx-body">
        <div className="rd-page">
          <div className="rd-byline">
            <span className="rd-avatar" />
            <span className="rd-byline-name">Jess Lin</span>
            <span className="rd-byline-dot" />
            <span>Sep 12 · 4 min</span>
          </div>
          <p className="rd-title">{titleBlock.text}</p>
          <p className="rd-body">
            <span className="fx-anchor">
              <AnimatePresence>
                {toolbar && (
                  <motion.span
                    className="fx-toolbar"
                    initial={reduced ? false : { opacity: 0, y: 6, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    {NOTE_COLORS.map((c, i) => (
                      <span key={c} className="fx-dot" data-color={c} data-picked={i === 0 && t >= 2500} />
                    ))}
                    <span className="fx-toolbar-sep" />
                    <span className="fx-toolbar-note">Note</span>
                  </motion.span>
                )}
              </AnimatePresence>
              {noted && (
                <motion.span
                  className="fx-note-pin"
                  initial={reduced ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 18 }}
                >
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M3 2.5h10a1 1 0 0 1 1 1v6.2a1 1 0 0 1-.3.7l-2.8 2.8a1 1 0 0 1-.7.3H3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Zm7 8v2.3L12.3 10.5H10Z" />
                  </svg>
                </motion.span>
              )}
            </span>
            <span className="fx-mark" data-state={state}>
              {sentences[0]}
            </span>{" "}
            {sentences.slice(1).map((text, i) => (
              <span key={i}>
                {i > 0 && " "}
                <Sentence text={text} cursor={cursor} index={i + 1} />
              </span>
            ))}
          </p>
          <AnimatePresence>
            {noted && (
              <motion.div
                className="fx-note-card"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span className="fx-note-bar" />
                <p>{NOTE_TEXT}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Player
        page={BLOG.page}
        progress={lerp(0.38, 0.47, t / 9600)}
        total={BLOG.total}
        animate={!reduced && t > 0}
        stepMs={100}
      />
      <AnimatePresence>
        {sheet && (
          <motion.div
            className="fx-bottom-sheet fx-note-sheet"
            initial={reduced ? false : { y: "105%" }}
            animate={{ y: 0 }}
            exit={{ y: "105%" }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <span className="fx-grabber" />
            <div className="fx-note-head">
              <span className="fx-note-cancel">Cancel</span>
              <span className="fx-note-heading">Add note</span>
              <span className="fx-note-save" data-ready={typed.length === NOTE_TEXT.length}>
                Save
              </span>
            </div>
            <p className="fx-note-quote">{sentences[0]}</p>
            <p className="fx-note-input">
              {typed}
              <span className="fx-caret" />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenColumn>
  );
}

export type TalkTiming = {
  prompt: number;
  tap: number;
  open: number;
  listen: number;
  think: number;
  speak: number;
  questionWordMs: number;
  answerWordMs: number;
};

const TALK: TalkTiming = {
  prompt: 400,
  tap: 1400,
  open: 1700,
  listen: 2400,
  think: 4500,
  speak: 5100,
  questionWordMs: 260,
  answerWordMs: 190,
};
const TALK_QUESTION = "Why do we remember less when we skim?";
const TALK_ANSWER =
  "Skimming skips the slow, word-by-word reading that builds memory. The author\u2019s fix: let a voice set the pace while your eyes follow along.";

function wordsShown(text: string, elapsed: number, perWord: number) {
  const words = text.split(" ");
  const n = Math.max(0, Math.min(words.length, Math.floor(elapsed / perWord) + 1));
  return elapsed < 0 ? "" : words.slice(0, n).join(" ");
}

function talkLevel(t: number, i: number) {
  return 0.35 + 0.65 * Math.abs(Math.sin(t / 140 + i * 1.3) * Math.cos(t / 330 + i * 0.7));
}

function TalkOrb({ t, phase, reduced }: { t: number; phase: "connecting" | "listening" | "thinking" | "speaking"; reduced: boolean }) {
  const live = phase === "listening" || phase === "speaking";
  const swell = live && !reduced ? 1 + 0.08 * talkLevel(t, 2) : 1;
  return (
    <span className="fx-talk-orb" style={{ transform: `scale(${swell})` }}>
      {live ? (
        <span className="fx-talk-bars">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ height: `${reduced ? 50 : 22 + 78 * talkLevel(t, i)}%` }} />
          ))}
        </span>
      ) : (
        <span className="fx-talk-dots" data-paused={reduced}>
          <span />
          <span />
          <span />
        </span>
      )}
    </span>
  );
}

export function VoiceChatScreen({ t, reduced, timing = TALK }: ScreenProps & { timing?: TalkTiming }) {
  const sheetOpen = t >= timing.open;
  const phase =
    t < timing.listen ? "connecting" : t < timing.think ? "listening" : t < timing.speak ? "thinking" : "speaking";
  const label =
    phase === "connecting"
      ? "Connecting\u2026"
      : phase === "listening"
        ? "Listening\u2026"
        : phase === "thinking"
          ? "Thinking\u2026"
          : "Speaking \u00b7 tap to interrupt";
  const question = wordsShown(TALK_QUESTION, t - timing.listen - 300, timing.questionWordMs);
  const answer = wordsShown(TALK_ANSWER, t - timing.speak - 200, timing.answerWordMs);
  const pressed = t >= timing.tap && t < timing.open;
  return (
    <ScreenColumn>
      <TopBar title={ARTICLE.label} />
      <div className={`fx-body ${sheetOpen ? "fx-dimmed" : ""}`}>
        <DocPage doc={ARTICLE} cursor={{ sentence: 2, word: 0 }} />
      </div>
      <Player page={ARTICLE.page} progress={0.24} total={ARTICLE.total} animate={false} playing={false} />
      <AnimatePresence>
        {!sheetOpen && t >= timing.prompt && (
          <motion.span
            key="prompt"
            className="fx-talk-prompt"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, scale: pressed ? 0.94 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <span className="fx-talk-prompt-icon" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span key={i} />
              ))}
            </span>
            Talk about this page
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              key="scrim"
              className="fx-scrim"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              key="sheet"
              className="fx-bottom-sheet fx-talk-sheet"
              initial={reduced ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <span className="fx-grabber" />
              <p className="fx-talk-title">Ask AI</p>
              <span className="fx-talk-context">{ARTICLE.label} · Page 1</span>
              <div className="fx-talk-thread">
                {question && <p className="fx-talk-bubble fx-talk-user">{question}</p>}
                {answer && <p className="fx-talk-bubble fx-talk-ai">{answer}</p>}
              </div>
              <div className="fx-talk-panel">
                <TalkOrb t={t} phase={phase} reduced={reduced} />
                <div className="fx-talk-status">
                  <p className="fx-talk-label">{label}</p>
                  <p className="fx-talk-topic">Talking about this document</p>
                </div>
                <span className="fx-talk-btn" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 19 12h-2Z" />
                  </svg>
                </span>
                <span className="fx-talk-btn fx-talk-end" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 9c-2.6 0-5.1.5-7.4 1.5-.8.3-1.3 1.1-1.3 2v2.3c0 .7.7 1.2 1.4 1l3-.9c.6-.2 1-.7 1-1.3v-1.4c1.1-.3 2.2-.4 3.3-.4s2.2.1 3.3.4v1.4c0 .6.4 1.1 1 1.3l3 .9c.7.2 1.4-.3 1.4-1v-2.3c0-.9-.5-1.7-1.3-2C17.1 9.5 14.6 9 12 9Z" />
                  </svg>
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ScreenColumn>
  );
}

export type FeatureScreen = {
  Screen: ComponentType<ScreenProps>;
  duration: number;
  still: number;
  summary: string;
};

export const FEATURE_SCREENS: Record<string, FeatureScreen> = {
  voicechat: {
    Screen: VoiceChatScreen,
    duration: 11000,
    still: 8200,
    summary: "Tapping \u201cTalk about this page\u201d while reading, then asking out loud why we remember less when we skim and hearing Ask AI answer about the article",
  },
  highlight: {
    Screen: HighlightScreen,
    duration: 9000,
    still: 5 * WORD_MS,
    summary: "The reader highlighting the current sentence and each spoken word as a news article is read aloud",
  },
  speed: {
    Screen: SpeedScreen,
    duration: 9000,
    still: 3200,
    summary: "The playback speed sheet stepping from 1.0× to 1.5× to 2.0×, with words per minute and a vertical speed slider",
  },
  sync: {
    Screen: SyncScreen,
    duration: 8000,
    still: 5000,
    summary: "The library syncing from an iPad, progress bars catching up, and playback resuming where you left off",
  },
  formats: {
    Screen: FormatsScreen,
    duration: 8000,
    still: 7000,
    summary: "A PDF, an EPUB, slides, a link and a scanned page landing in the library, ready to listen",
  },
  offline: {
    Screen: OfflineScreen,
    duration: 9000,
    still: 6000,
    summary: "Offline mode switching on, an offline voice finishing its download, and playback continuing with no connection",
  },
  voices: {
    Screen: VoicesScreen,
    duration: 9600,
    still: 0,
    summary: "A list of natural voices, each one swelling with a live waveform as its sample plays",
  },
  reflow: {
    Screen: ReflowScreen,
    duration: 9000,
    still: 5000,
    summary: "A dense PDF page reflowing into large, readable text that fits the phone screen",
  },
  notes: {
    Screen: NotesScreen,
    duration: 9600,
    still: 8200,
    summary: "A sentence being highlighted and a note typed and attached to it while the article keeps playing",
  },
};
