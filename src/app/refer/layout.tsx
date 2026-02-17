import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You've been invited to Olog Reader",
  description:
    "Someone invited you to Olog Reader. Turn any book, web article, or link into audio while you read along.",
  openGraph: {
    title: "You've been invited to Olog Reader",
    description:
      "Someone invited you to Olog Reader. Turn any book, web article, or link into audio while you read along.",
    images: [
      {
        url: "/LinkPreview.png",
        width: 1200,
        height: 630,
        alt: "Olog Reader - Turn any book into audio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "You've been invited to Olog Reader",
    description:
      "Someone invited you to Olog Reader. Turn any book, web article, or link into audio while you read along.",
    images: ["/LinkPreview.png"],
  },
};

export default function ReferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
