"use client";

import { motion } from "framer-motion";

type Props = {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  duration?: number;
  stagger?: number;
};

export default function BlurText({
  text,
  className = "",
  as = "span",
  delay = 0,
  duration = 0.2,
  stagger = 0.04,
}: Props) {
  const Wrapper = as as any;
  return (
    <Wrapper className={`inline-flex flex-wrap overflow-visible ${className}`}>
      {Array.from(text).map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ y: 8, filter: "blur(8px)", opacity: 0 }}
          whileInView={{ y: 0, filter: "blur(0px)", opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration, delay: delay + i * stagger, ease: "backOut" }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </Wrapper>
  );
}
