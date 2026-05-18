"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Where does the name “olog” come from?",
    answer:
      "Just like a blog is a web log and a vlog is a video log, an olog is an audio log — your reading, narrated.",
  },
  {
    question: "What file types does Olog Reader support?",
    answer:
      "Olog Reader supports PDFs, EPUBs, PowerPoint files, Word documents, web links, scanned images, and plain text. We're constantly adding more formats.",
  },
  {
    question: "How natural do the voices sound?",
    answer:
      "We use the latest AI text-to-speech models to deliver voices that sound remarkably human — with natural pacing, intonation, and rhythm.",
  },
  {
    question: "Does the highlighting work with all file types?",
    answer:
      "Yes. Whether you upload a PDF, paste a link, or scan an image, the app highlights each word in real time as it's read aloud.",
  },
  {
    question: "Can I sync my progress across devices?",
    answer:
      "Absolutely. Your reading progress, bookmarks, and settings sync seamlessly across all your devices so you can pick up right where you left off.",
  },
  {
    question: "Is Olog Reader free to use?",
    answer:
      "Olog Reader offers a free tier with generous usage. Premium plans unlock unlimited listening, additional voices, and priority processing.",
  },
  {
    question: "Does it work offline?",
    answer:
      "There are a variety of offline voices you can pick from to enjoy the best offline experience.",
  },
];

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
      className="border-b border-border"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        aria-expanded={open}
      >
        <span className="text-lg md:text-xl font-medium text-text-primary">
          {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-text-secondary" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-lg md:text-xl text-text-secondary leading-relaxed">
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
    <section id="faq" className="py-10 md:py-24 px-4">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-text-secondary text-lg md:text-xl max-w-lg mx-auto">
          Everything you need to know about Olog Reader.
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        {faqs.map((faq, i) => (
          <FaqItem key={i} question={faq.question} answer={faq.answer} index={i} />
        ))}
      </div>
    </section>
  );
}
