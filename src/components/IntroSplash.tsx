"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextPressure from "@/components/TextPressure";
import { useIsMobile } from "@/hooks/use-mobile";

gsap.registerPlugin(ScrollTrigger);

export function IntroSplash() {
  const wrapRef = useRef<HTMLElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const runningRef = useRef(false);
  const animationIdRef = useRef<number | null>(null);
  const startTimeoutRef = useRef<number | null>(null);
  const isMobile = useIsMobile();

  // Detect real user interactions and stop the auto cursor animation
  useEffect(() => {
    if (userHasInteracted) return;

    const handleRealInteraction = (event: Event) => {
      if (!event.isTrusted) return; // ignore synthetic events
      runningRef.current = false;
      setUserHasInteracted(true);
      if (animationIdRef.current != null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      if (startTimeoutRef.current != null) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
    };

    window.addEventListener("pointerdown", handleRealInteraction, {
      passive: true,
    });
    window.addEventListener("pointermove", handleRealInteraction, {
      passive: true,
    });
    window.addEventListener("touchstart", handleRealInteraction, {
      passive: true,
    });
    window.addEventListener("touchmove", handleRealInteraction, {
      passive: true,
    });
    window.addEventListener("mousemove", handleRealInteraction, {
      passive: true,
    });
    window.addEventListener("scroll", handleRealInteraction, { passive: true });
    window.addEventListener("keydown", handleRealInteraction, {
      passive: true,
    });
    window.addEventListener("click", handleRealInteraction, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleRealInteraction);
      window.removeEventListener("pointermove", handleRealInteraction);
      window.removeEventListener("touchstart", handleRealInteraction);
      window.removeEventListener("touchmove", handleRealInteraction);
      window.removeEventListener("mousemove", handleRealInteraction);
      window.removeEventListener("scroll", handleRealInteraction);
      window.removeEventListener("keydown", handleRealInteraction);
      window.removeEventListener("click", handleRealInteraction);
    };
  }, [userHasInteracted]);

  // Auto cursor sweep for mobile devices - moves from O to R
  useEffect(() => {
    if (!isMobile || !fontLoaded || userHasInteracted) return;

    let startTime: number;
    const cycleDuration = 8000; // 8 seconds for complete back-and-forth cycle

    runningRef.current = true;

    // Easing function for smooth movement
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    // Linear interpolation
    const lerp = (start: number, end: number, t: number): number => {
      return start + (end - start) * t;
    };

    const simulateCursorSweep = (timestamp: number) => {
      if (!runningRef.current) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Get the text container bounds
      const textWrap = textWrapRef.current;
      if (!textWrap) {
        if (runningRef.current) {
          animationIdRef.current = requestAnimationFrame(simulateCursorSweep);
        }
        return;
      }

      // Try to get individual character spans from TextPressure
      const textPressureElement = textWrap.querySelector(
        ".text-pressure-title"
      );
      const characterSpans = textPressureElement?.querySelectorAll("span");

      if (!characterSpans || characterSpans.length === 0) {
        if (runningRef.current) {
          animationIdRef.current = requestAnimationFrame(simulateCursorSweep);
        }
        return;
      }

      // Get positions of first and last characters
      const firstChar = characterSpans[0] as HTMLElement;
      const lastChar = characterSpans[characterSpans.length - 1] as HTMLElement;

      const firstRect = firstChar.getBoundingClientRect();
      const lastRect = lastChar.getBoundingClientRect();

      // Calculate sweep boundaries
      const leftmostX = firstRect.left + firstRect.width / 2;
      const rightmostX = lastRect.left + lastRect.width / 2;
      const baseY = firstRect.top + firstRect.height / 2;

      // Create smooth back-and-forth motion using sine wave
      // This creates a continuous pendulum motion: left -> right -> left -> right...
      const cycleProgress = (elapsed % cycleDuration) / cycleDuration;

      // Use sine wave for smooth back-and-forth motion
      // sin(0) = 0 (left), sin(π/2) = 1 (right), sin(π) = 0 (left), sin(3π/2) = -1 (right), sin(2π) = 0 (left)
      const sineWave = Math.sin(cycleProgress * Math.PI * 2);

      // Convert sine wave (-1 to 1) to position (0 to 1)
      // This creates smooth transitions: 0 -> 1 -> 0 -> 1 -> 0...
      const normalizedPosition = (sineWave + 1) / 2;

      // Apply easing to the normalized position for even smoother motion
      const easedPosition = easeInOutCubic(normalizedPosition);

      // Interpolate horizontal position
      const x = lerp(leftmostX, rightmostX, easedPosition);

      // Add subtle vertical variation that follows the horizontal movement
      const verticalVariation = 6; // pixels
      // Use a different phase for vertical movement to create natural motion
      const verticalWave = Math.sin(cycleProgress * Math.PI * 4); // Faster vertical oscillation
      const y = baseY + verticalWave * verticalVariation;

      // Dispatch synthetic mouse event
      const syntheticEvent = new MouseEvent("mousemove", {
        clientX: x,
        clientY: y,
        bubbles: true,
      });

      window.dispatchEvent(syntheticEvent);

      if (runningRef.current) {
        animationIdRef.current = requestAnimationFrame(simulateCursorSweep);
      }
    };

    // Start the animation after a short delay to ensure everything is rendered
    startTimeoutRef.current = window.setTimeout(() => {
      if (runningRef.current) {
        animationIdRef.current = requestAnimationFrame(simulateCursorSweep);
      }
    }, 1500); // Longer delay to ensure font and layout are ready

    return () => {
      if (startTimeoutRef.current != null) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
      if (animationIdRef.current != null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      runningRef.current = false;
    };
  }, [isMobile, fontLoaded, userHasInteracted]);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const textWrap = textWrapRef.current;
    const cue = scrollCueRef.current;
    if (!wrap || !textWrap || !fontLoaded) return;

    const ctx = gsap.context(() => {
      // Set initial state - text is visible but clipped
      gsap.set(textWrap, {
        clipPath: "inset(0 100% 0 0)",
        opacity: 1,
      });

      // Autoplay write-in (mask reveal) - only start after font is loaded
      gsap.fromTo(
        textWrap,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.5,
          ease: "power2.out",
          delay: 0.2, // Small delay to ensure font is fully rendered
        }
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

    const section = wrap; // the splash <section>

    const activeST = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=120%",
      onEnter: () => section.classList.add("is-active"),
      onEnterBack: () => section.classList.add("is-active"),
      onLeave: () => section.classList.remove("is-active"),
      onLeaveBack: () => section.classList.remove("is-active"),
    });

    return () => {
      activeST.kill();
      section.classList.remove("is-active");
      ctx.revert();
    };
  }, [fontLoaded]);

  return (
    <section
      id="intro-splash"
      ref={wrapRef}
      className="relative z-[60] h-screen bg-transparent text-text-primary overflow-hidden"
      aria-label="Intro"
    >
      <div className="relative h-full flex flex-col items-center justify-center px-4">
        <div
          ref={textWrapRef}
          className="relative inline-block w-[90vw] max-w-7xl"
          style={{ opacity: fontLoaded ? 1 : 0 }}
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
            onFontLoaded={setFontLoaded}
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
