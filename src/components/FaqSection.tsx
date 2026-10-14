"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { faqs } from "@/data/faqs";

function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="border-t border-border last:border-b py-6 md:py-8 grid md:grid-cols-[1fr_1.4fr] gap-4 md:gap-12 items-start md:min-h-[200px]"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-start gap-4 group"
        aria-expanded={open}
      >
        <span className="text-xl md:text-2xl lg:text-3xl font-semibold text-text-primary leading-tight tracking-[-0.025em] group-hover:text-primary transition-colors flex-1">
          {question}
        </span>
        <span className="shrink-0 text-text-secondary group-hover:text-primary transition-colors">
          {open ? (
            <Minus className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className=""
          >
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="py-12 md:py-28 px-4">
      <motion.div
        className="max-w-7xl mx-auto mb-10 md:mb-16 grid md:grid-cols-[1fr_1.4fr] gap-4 md:gap-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <p className="type-eyebrow text-primary-700 mb-2">
            FAQ
          </p>
          <h2 className="type-h2 text-text-primary">
            Questions, answered.
          </h2>
        </div>
        <p className="text-text-secondary text-lg md:text-xl leading-relaxed md:pt-4 max-w-xl">
          Everything you need to know about Olog Reader, before you press play.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {faqs.map((faq, i) => (
          <FaqItem
            key={i}
            question={faq.question}
            answer={faq.answer}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
