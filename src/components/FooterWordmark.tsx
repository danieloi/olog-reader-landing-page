"use client";

import { useEffect, useRef } from "react";

const REST_WEIGHT = 800;
const MIN_WEIGHT = 300;
const MAX_WEIGHT = 900;
const MAX_SCALE = 0.07;
const EASE = 0.12;

export function FooterWordmark({ text }: { text: string }) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const chars = Array.from(text);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reduce.matches || !fine.matches) return;

    const spans = charRefs.current.filter((s): s is HTMLSpanElement => !!s);
    const weight = spans.map(() => REST_WEIGHT);
    const scale = spans.map(() => 1);
    const pointer = { x: 0, y: 0, active: false };
    let raf = 0;

    const frame = () => {
      const rect = root.getBoundingClientRect();
      const radius = rect.width * 0.16;
      let moving = false;

      spans.forEach((span, i) => {
        let targetW = REST_WEIGHT;
        let targetS = 1;
        if (pointer.active) {
          const r = span.getBoundingClientRect();
          const dx = pointer.x - (r.left + r.width / 2);
          const dy = (pointer.y - (r.top + r.height / 2)) * 0.5;
          const f = Math.exp(-(dx * dx + dy * dy) / (radius * radius));
          targetW = MIN_WEIGHT + (MAX_WEIGHT - MIN_WEIGHT) * f;
          targetS = 1 + MAX_SCALE * f;
        }
        weight[i] += (targetW - weight[i]) * EASE;
        scale[i] += (targetS - scale[i]) * EASE;
        if (Math.abs(targetW - weight[i]) > 0.5 || Math.abs(targetS - scale[i]) > 0.0005) {
          moving = true;
        }
        span.style.fontVariationSettings = `'wght' ${weight[i].toFixed(1)}`;
        span.style.transform = `scale(${scale[i].toFixed(4)})`;
      });

      raf = moving || pointer.active ? requestAnimationFrame(frame) : 0;
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const pad = rect.height * 0.6;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top - pad &&
        e.clientY <= rect.bottom + pad;
      if (inside || pointer.active) {
        pointer.active = inside;
        wake();
      }
    };

    const onLeave = () => {
      pointer.active = false;
      wake();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      spans.forEach((span) => {
        span.style.fontVariationSettings = "";
        span.style.transform = "";
      });
    };
  }, []);

  return (
    <span ref={rootRef} aria-hidden className="footer-wordmark">
      {chars.map((char, i) =>
        char === " " ? (
          <span key={i} className="footer-wordmark-space" />
        ) : (
          <span
            key={i}
            ref={(el) => {
              charRefs.current[i] = el;
            }}
            className="footer-wordmark-char"
          >
            {char}
          </span>
        ),
      )}
    </span>
  );
}
