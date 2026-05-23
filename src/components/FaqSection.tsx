"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Where does the name “olog” come from?",
    answer:
      "Just like a blog is a web log and a vlog is a video log, an olog is an audio log — your reading, narrated.",
  },
  {
    question: "What file types does Olog Reader support?",
    answer:
      "Olog Reader supports PDFs, EPUBs, PowerPoint files, Word documents, web links, scanned images, and plain text. Honestly, we doubt there's a format left we don't support.",
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
    question: "Does Olog Reader support dark mode?",
    answer:
      "Yes. Olog Reader has both light and dark themes — switch between them anytime to match your preference or system settings.",
  },
  {
    question: "Can I sync my progress across devices?",
    answer:
      "Absolutely. Your reading progress, highlights, notes, and settings sync seamlessly across all your devices so you can pick up right where you left off.",
  },
  {
    question: "Is Olog Reader free to use?",
    answer:
      "Olog Reader offers a free tier with generous usage. Premium plans unlock unlimited listening.",
  },
  {
    question: "Does it work offline?",
    answer:
      "There are a variety of offline voices you can pick from to enjoy the best offline experience.",
  },
  {
    question: "What is text-to-speech (TTS)?",
    answer:
      "Text-to-speech is technology that converts written words into spoken audio. Olog Reader uses it to read your documents, books, and articles aloud — so you can listen instead of read.",
  },
  {
    question: "What is an AI voice?",
    answer:
      "A synthetic voice trained on human speech to capture natural pacing, emphasis, and emotion — far beyond older robotic readers, which is why Olog's voices sound so lifelike.",
  },
  {
    question: "Who is Olog Reader for?",
    answer:
      "Students, professionals, multitaskers, people with ADHD, dyslexia, or visual impairments — and really, anyone who wants a smarter, more stress-free way to read.",
  },
  {
    question: "How is Olog Reader different from Siri or my phone's built-in read-aloud?",
    answer:
      "Those are built for quick commands — they don't read your documents. Olog Reader turns your PDFs, EPUBs, and articles into studio-quality narration with real-time highlighting, speed control, and cross-device sync.",
  },
  {
    question: "How do I get started?",
    answer:
      "Download Olog Reader from the App Store or Google Play, upload a document or paste a link, pick a voice, and press play. You can start listening within seconds — no setup required.",
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
  const num = String(index + 1).padStart(2, "0");

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
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-text-secondary pt-2 shrink-0">
          {num}
        </span>
        <span className="font-display text-2xl md:text-3xl lg:text-4xl text-text-primary leading-tight tracking-tight group-hover:text-primary transition-colors flex-1">
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
          <p className="font-mono text-xs md:text-sm uppercase tracking-[0.22em] text-primary mb-3">
            FAQ
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-text-primary leading-[1.05] tracking-tight">
            Questions, <em className="not-italic text-accent">answered</em>.
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
