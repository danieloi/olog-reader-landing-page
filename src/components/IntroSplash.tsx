"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextPressure from "@/components/TextPressure";

gsap.registerPlugin(ScrollTrigger);

export function IntroSplash() {
  const wrapRef = useRef<HTMLElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const textWrap = textWrapRef.current;
    const cue = scrollCueRef.current;
    if (!wrap || !textWrap) return;

    const ctx = gsap.context(() => {
      // Autoplay write-in (mask reveal)
      gsap.fromTo(
        textWrap,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 1.5, ease: "power2.out" }
      );

      // Scroll-scrub: lift + slight scale, fade cue, fade splash
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "+=120%",
          scrub: true,
          pin: true,
        },
      });

      tl.to(textWrap, { y: -80, scale: 0.92, ease: "power1.out" }, 0);
      if (cue) tl.to(cue, { opacity: 0, y: -10, ease: "power1.out" }, 0.1);
      tl.to(wrap, { opacity: 0, ease: "none" }, 0.75);
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative z-[60] h-screen bg-transparent text-text-primary overflow-hidden"
      aria-label="Intro"
    >
      <div className="relative h-full flex flex-col items-center justify-center px-4">
        <div
          ref={textWrapRef}
          className="relative inline-block w-[90vw] max-w-7xl"
        >
          <TextPressure
            text="OLOG READER"
            textColor="var(--primary)"
            width={true}
            weight={true}
            italic={false}
            alpha={false}
            flex={false}
            scale={false}
            minFontSize={64}
            className="uppercase text-center"
          />
        </div>

        <div
          ref={scrollCueRef}
          className="mt-10 text-sm text-text-secondary flex items-center gap-2 select-none"
        >
          <span>Scroll</span>
          <span className="inline-block animate-bounce">↓</span>
        </div>
      </div>
    </section>
  );
}

export default IntroSplash;
