"use client";

import { motion } from "framer-motion";

type Props = {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  duration?: number;
  stagger?: number;
  // When true, prevent line breaks inside words while keeping per-letter animation
  groupByWord?: boolean;
  // Optionally apply a class to letters from this index onward (0-based)
  highlightFromIndex?: number;
  highlightClassName?: string;
};

export default function BlurText({
  text,
  className = "",
  as = "span",
  delay = 0,
  duration = 0.2,
  stagger = 0.04,
  groupByWord = false,
  highlightFromIndex,
  highlightClassName,
}: Props) {
  const Wrapper = as as any;
  if (!groupByWord) {
    return (
      <Wrapper
        className={`inline-flex flex-wrap overflow-visible ${className}`}
      >
        {Array.from(text).map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            initial={{ y: 8, filter: "blur(8px)", opacity: 0 }}
            whileInView={{ y: 0, filter: "blur(0px)", opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: "backOut",
            }}
            className={`inline-block ${
              highlightFromIndex !== undefined && i >= highlightFromIndex
                ? highlightClassName ?? ""
                : ""
            }`}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </Wrapper>
    );
  }

  // Group by words to prevent intra-word line breaks
  const words = text.split(" ");
  let globalIndex = 0;

  return (
    <Wrapper className={`inline-flex flex-wrap overflow-visible ${className}`}>
      {words.map((word, wi) => (
        <span
          key={`word-${wi}`}
          className="inline-flex whitespace-nowrap mr-[0.35ch] last:mr-0"
        >
          {Array.from(word).map((char, ci) => {
            const i = globalIndex++;
            return (
              <motion.span
                key={`${char}-${wi}-${ci}`}
                initial={{ y: 8, filter: "blur(8px)", opacity: 0 }}
                whileInView={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration,
                  delay: delay + i * stagger,
                  ease: "backOut",
                }}
                className={`inline-block ${
                  highlightFromIndex !== undefined && i >= highlightFromIndex
                    ? highlightClassName ?? ""
                    : ""
                }`}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </Wrapper>
  );
}
