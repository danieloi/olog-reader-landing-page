import type { Metadata } from "next";
import { Fraunces, Bricolage_Grotesque } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SkipToContent from "@/components/ui/SkipToContent";
import { ThemeProvider } from "@/components/theme-provider";
import StructuredData from "@/components/StructuredData";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz", "wdth"],
});

const SITE_TITLE = "Olog Reader — Listen to Any Document with Natural AI Voices";
const SITE_DESCRIPTION =
  "Turn PDFs, EPUBs, Word docs, PowerPoint, web links, and scans into natural-sounding audio. Read anywhere, listen everywhere with the most natural AI voices — real-time highlighting, speed control, offline mode, and cross-device sync. Free on iOS & Android.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ologreader.com"),
  title: {
    default: SITE_TITLE,
    template: "%s — Olog Reader",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Olog Reader",
  keywords: [
    "text to speech",
    "AI voice reader",
    "listen to PDF",
    "PDF to audio",
    "document reader",
    "read aloud app",
    "EPUB reader",
    "natural AI voices",
    "audiobook converter",
    "TTS app",
    "dyslexia reading app",
    "accessibility reading",
  ],
  authors: [{ name: "Olog Reader" }],
  creator: "Olog Reader",
  publisher: "Olog Reader",
  category: "productivity",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: "Olog Reader",
    locale: "en_US",
    url: "https://ologreader.com",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/LinkPreview.webp",
        width: 1200,
        height: 630,
        alt: "Olog Reader — Listen to any document with natural AI voices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@OlogReader",
    creator: "@OlogReader",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/LinkPreview.webp"],
  },
  itunes: {
    appId: "6744651101",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "google-play-app": "app-id=me.olog.reader",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="preload"
          href="https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${bricolage.variable} ${fraunces.variable} antialiased`}>
        <StructuredData />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-G1J25G5MG0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G1J25G5MG0');
          `}
        </Script>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <SkipToContent />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
