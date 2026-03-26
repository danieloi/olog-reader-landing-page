import type { Metadata } from "next";
import { Inter, Barriecito, Georama } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SkipToContent from "@/components/ui/SkipToContent";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

const georama = Georama({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-georama",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ologreader.com"),
  title: "Olog Reader",
  description: "Listen to your documents",
  icons: {
    icon: "/icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: "Olog Reader",
    locale: "en_US",
    url: "https://ologreader.com",
    title: "Olog Reader",
    description: "Listen to your documents",
    images: [
      {
        url: "/LinkPreview.png",
        width: 1200,
        height: 630,
        alt: "Olog Reader - Listen to your documents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Olog Reader",
    description: "Listen to your documents",
    images: ["/LinkPreview.png"],
  },
  itunes: {
    appId: "6744651101",
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
      <body className={`${inter.className} ${georama.variable} antialiased`}>
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
