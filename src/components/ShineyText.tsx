import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Base visible text (inherits color from parent, e.g. text-primary) */}
      <span className="relative z-[1]">{text}</span>

      {/* Shiny overlay */}
      {!disabled && (
        <span
          aria-hidden="true"
          className="absolute inset-0 z-[2] pointer-events-none bg-clip-text text-transparent animate-shine"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(255,255,255,0) 42%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 58%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            animationDuration,
            mixBlendMode: "screen",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
};

export default ShinyText;
