"use client";

import { useRef, useEffect } from "react";

type NoiseProps = {
  patternRefreshInterval?: number; // lower = faster flicker
  patternAlpha?: number; // 0–255 (opacity of noise pixels)
  className?: string;
};

export function NoiseBackground({
  patternRefreshInterval = 2,
  patternAlpha = 15,
  className = "",
}: NoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const size = 1024;
    let frame = 0;
    let raf = 0;

    const resize = () => {
      canvas.width = size;
      canvas.height = size;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    };

    const draw = () => {
      const image = ctx.createImageData(size, size);
      const data = image.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = patternAlpha;
      }
      ctx.putImageData(image, 0, 0);
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) draw();
      frame++;
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 ${className}`}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
