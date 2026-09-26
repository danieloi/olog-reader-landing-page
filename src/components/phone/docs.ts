import type { Doc } from "./ReaderUI";

export const DOCS: Doc[] = [
  {
    label: "Your news article",
    page: "1/3",
    total: 262,
    progress: [0.16, 0.24],
    startSentence: 1,
    blocks: [
      { kind: "kicker", text: "Science · 6 min read" },
      { kind: "title", text: "The reading brain in a digital age" },
      { kind: "byline", name: "Amara Osei", detail: "Sept 24" },
      {
        kind: "p",
        sentences: [
          "Scientists who study reading have noticed a quiet shift.",
          "We skim more than we used to, and remember less of it.",
          "The fix may be older than the screen itself.",
          "Slow down, and let a voice carry the words while your eyes follow.",
        ],
      },
    ],
  },
  {
    label: "Your blog post",
    page: "2/5",
    total: 248,
    progress: [0.38, 0.47],
    startSentence: 1,
    blocks: [
      { kind: "byline", name: "Jess Lin", detail: "Sep 12 · 4 min", avatar: true },
      { kind: "title", text: "I stopped doomscrolling and started listening" },
      {
        kind: "p",
        sentences: [
          "Last spring I had forty-one tabs I swore I would read.",
          "So every morning, my phone read me one on the walk to the train.",
          "Three months later, the tabs are gone.",
          "And I actually remember what was in them.",
        ],
      },
    ],
  },
  {
    label: "Your onboarding doc",
    page: "1/8",
    total: 185,
    progress: [0.05, 0.14],
    startSentence: 1,
    blocks: [
      { kind: "kicker", text: "Northwind · People team" },
      { kind: "title", text: "Welcome to the team" },
      { kind: "h2", text: "Your first week" },
      {
        kind: "p",
        sentences: [
          "We are glad you are here.",
          "This doc walks you through the basics, one step at a time.",
        ],
      },
      { kind: "h2", text: "Before Friday" },
      {
        kind: "checklist",
        items: [
          { text: "Set up your laptop and email.", done: true },
          { text: "Meet your onboarding buddy.", done: false },
          { text: "Read the product handbook.", done: false },
        ],
      },
    ],
  },
  {
    label: "Any PDF",
    format: "pdf",
    page: "3/14",
    total: 540,
    progress: [0.18, 0.25],
    startSentence: 0,
    blocks: [
      { kind: "kicker", text: "Research report · Section 2" },
      { kind: "title", text: "Sleep and memory consolidation" },
      {
        kind: "p",
        sentences: [
          "Participants who slept after studying recalled more the next day.",
          "The effect was strongest for material learned late in the evening.",
        ],
      },
      { kind: "figure", caption: "Figure 2. Recall scores by group" },
      { kind: "folio", text: "3" },
    ],
  },
  {
    label: "Any PowerPoint",
    format: "slides",
    page: "3/12",
    total: 320,
    progress: [0.2, 0.27],
    startSentence: 0,
    blocks: [
      {
        kind: "slide",
        counter: "Slide 3 of 12",
        title: "Q3 growth plan",
        bullets: ["Three new markets", "Team plan in October", "Onboarding time halved"],
      },
      { kind: "thumbs", titles: ["Q2 recap", "Q3 growth plan", "Hiring"], active: 1 },
    ],
  },
  {
    label: "Any EPUB",
    format: "epub",
    page: "47/312",
    total: 1260,
    progress: [0.15, 0.2],
    startSentence: 0,
    blocks: [
      { kind: "kicker", text: "Chapter 4" },
      { kind: "title", text: "The lighthouse keeper" },
      {
        kind: "p",
        dropcap: true,
        sentences: [
          "The storm came in low over the water just after dusk.",
          "Mara lit the lamp the way her father had taught her, slowly and without fear.",
          "Far out on the dark sea, a small light answered back.",
        ],
      },
      { kind: "folio", text: "47" },
    ],
  },
];
