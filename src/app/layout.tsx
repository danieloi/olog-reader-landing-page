import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SkipToContent from "@/components/ui/SkipToContent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Olog Reader - Turn any PDF into an audiobook",
  description:
    "Transform any PDF into an audiobook with AI voices. Study hands-free, reduce eye strain, and save time. Just $5/month.",
  keywords:
    "PDF to audiobook, AI voices, text to speech, study tools, accessibility, mobile reading",
  openGraph: {
    title: "Olog Reader - Turn any PDF into an audiobook",
    description:
      "Transform any PDF into an audiobook with AI voices. Study hands-free, reduce eye strain, and save time. Just $5/month.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Olog Reader - Turn any PDF into an audiobook",
    description:
      "Transform any PDF into an audiobook with AI voices. Study hands-free, reduce eye strain, and save time. Just $5/month.",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <SkipToContent />
        {children}
      </body>
    </html>
  );
}
