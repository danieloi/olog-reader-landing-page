"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";

const tiltSpring = { damping: 28, stiffness: 120, mass: 1.4 };

export function FloatingPhone({
  imageSrc,
  altText,
  reduced,
}: {
  imageSrc: string;
  altText: string;
  reduced?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [interacting, setInteracting] = useState(false);

  // Pointer-driven tilt, layered on top of the CSS auto-rotation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);
  const springRotateX = useSpring(rotateX, tiltSpring);
  const springRotateY = useSpring(rotateY, tiltSpring);
  const springScale = useSpring(scale, tiltSpring);

  const amplitude = reduced ? 9 : 16;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    rotateX.set(((py - rect.height / 2) / (rect.height / 2)) * -amplitude);
    rotateY.set(((px - rect.width / 2) / (rect.width / 2)) * amplitude);
  };

  const handleEnter = () => {
    setInteracting(true);
    scale.set(reduced ? 1.03 : 1.06);
  };

  const handleLeave = () => {
    setInteracting(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <div
      ref={wrapRef}
      className="phone-3d-perspective"
      style={{
        width: reduced ? "220px" : "280px",
        height: reduced ? "475px" : "604px",
      }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onPointerCancel={handleLeave}
    >
      {/* Pointer-tilt layer */}
      <motion.div
        className="phone-3d-tilt"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          scale: springScale,
        }}
      >
        {/* Auto-rotation layer (CSS) — paused while interacting */}
        <div className="phone-3d-stage" data-interacting={interacting}>
          {/* Back plate — receding shadow plinth */}
          <div className="phone-3d-plate" aria-hidden />
          {/* Decorative frame ring */}
          <div className="phone-3d-frame" aria-hidden />
          {/* Phone image */}
          <div className="phone-3d-screen">
            <img
              src={imageSrc}
              alt={altText}
              className="block w-full h-full object-contain rounded-[36px]"
              draggable={false}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
