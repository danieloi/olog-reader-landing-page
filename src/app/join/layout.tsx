import type { Metadata } from "next";

/**
 * The preview card IS the invitation in WhatsApp/iMessage; without this it
 * inherits the root layout's marketing title. Mirrors refer/layout.tsx.
 *
 * Static, though `?c=` carries the circle's name: per-request metadata would
 * make the page dynamic and put attacker-supplied text in an OG tag.
 */
const TITLE = "You've been invited to a reading circle";
const DESCRIPTION =
  "Join a reading circle on Olog Reader. Everyone reads the same book, and your notes appear beside theirs.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/LinkPreview.png",
        width: 1200,
        height: 630,
        alt: "Olog Reader - Join a reading circle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/LinkPreview.png"],
  },
};

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
