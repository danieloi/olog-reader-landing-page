"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";

/**
 * A wrapped bubble keeps the width of its widest possible line, leaving a gap
 * after the text. Narrow it until one more pixel would add a line. Layout
 * pixels, not screen rects, so the phone's 3D tilt cannot skew it.
 */
export function FitBubble({
  text,
  className,
  style,
}: {
  text: string;
  className: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.width = "";
    const height = el.offsetHeight;
    // Rounded up: offsetWidth rounds a fractional width down, and that
    // shortfall alone can push the last word onto a new line.
    let hi = Math.ceil(parseFloat(getComputedStyle(el).width));
    let lo = 0;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      el.style.width = `${mid}px`;
      if (el.offsetHeight > height) lo = mid;
      else hi = mid;
    }
    el.style.width = `${hi}px`;
  }, [text]);
  return (
    <p ref={ref} className={className} style={{ ...style, boxSizing: "border-box" }}>
      {text}
    </p>
  );
}
