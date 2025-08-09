"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FluidBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Initial (splash): soft brand tint → white
      gsap.set(el, {
        "--bg1": "rgb(217,239,255)", // matches background-hero
        "--bg2": "rgb(255,255,255)",
        "--angle": "180deg",
      } as any);

      // Transition as hero enters: subtle to pure white
      gsap.to(el, {
        "--bg1": "rgb(255,255,255)",
        "--bg2": "rgb(255,255,255)",
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top bottom",
          end: "top center",
          scrub: true,
        },
      } as any);

      // Transition near footer: white → very light gray
      gsap.to(el, {
        "--bg1": "rgb(255,255,255)",
        "--bg2": "rgb(240,242,247)", // similar to var(--gray-950)
        ease: "none",
        scrollTrigger: {
          trigger: "#footer",
          start: "top bottom",
          end: "top center",
          scrub: true,
        },
      } as any);
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={bgRef}
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background:
          "linear-gradient(var(--angle, 180deg), var(--bg1, #d9efff) 0%, var(--bg2, #ffffff) 100%)",
      }}
    />
  );
}
