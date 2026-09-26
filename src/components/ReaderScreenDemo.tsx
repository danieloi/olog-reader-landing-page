"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DocPage,
  LEAD_TICKS,
  PhoneScreen,
  Player,
  SheetStage,
  TopBar,
  WORD_MS,
  cursorAt,
  useInView,
  usePageVisible,
  useReducedMotionSafe,
} from "@/components/phone/ReaderUI";
import { DOCS as ALL_DOCS } from "@/components/phone/docs";

const DOCS = [0, 3, 1, 4, 2, 5].map((i) => ALL_DOCS[i]);

const HOLD_MS = 5000;
const TICKS_PER_DOC = Math.round(HOLD_MS / WORD_MS);

export function ReaderScreenDemo({ label }: { label: string }) {
  const reduceMotion = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const pageVisible = usePageVisible();
  const [{ docIndex, tick }, setClock] = useState({ docIndex: 0, tick: 0 });
  const running = !reduceMotion && inView && pageVisible;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setClock(({ docIndex, tick }) =>
        tick + 1 >= TICKS_PER_DOC
          ? { docIndex: (docIndex + 1) % DOCS.length, tick: 0 }
          : { docIndex, tick: tick + 1 },
      );
    }, WORD_MS);
    return () => clearInterval(id);
  }, [running]);

  const doc = DOCS[reduceMotion ? 0 : docIndex];
  const effectiveTick = reduceMotion ? LEAD_TICKS + 3 : tick;
  const cursor = useMemo(() => cursorAt(doc, effectiveTick), [doc, effectiveTick]);
  const [from, to] = doc.progress;
  const progress = from + (to - from) * Math.min(1, effectiveTick / TICKS_PER_DOC);

  return (
    <div ref={ref} className="h-full">
      <PhoneScreen label={label}>
        <TopBar title={doc.label} animated />
        <SheetStage screenKey={doc.label} reduced={false}>
          <DocPage doc={doc} cursor={cursor} />
        </SheetStage>
        <Player page={doc.page} progress={progress} total={doc.total} animate={!reduceMotion && tick > 0} />
      </PhoneScreen>
    </div>
  );
}
