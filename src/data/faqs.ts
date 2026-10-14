export interface Faq {
  question: string;
  answer: string;
}

// Single source of truth for FAQs — consumed by both FaqSection (UI)
// and the FAQPage JSON-LD in layout.tsx, so the two never drift.
export const faqs: Faq[] = [
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
    question: "Can I talk to Olog Reader about what I'm reading?",
    answer:
      "Yes. Tap “Talk about this page” or the mic in Ask AI and just speak. It answers out loud in real time, knows the page you're on, and can jump you to the part of the book you're asking about. Every conversation is saved to your chats. Free accounts get 2 minutes of voice chat a week to try it; Premium includes up to 3 hours a week.",
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
