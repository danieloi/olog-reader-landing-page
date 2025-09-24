import type { Metadata } from "next";
import { Inter, Barriecito, Georama } from "next/font/google";
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
  title: "Olog Reader",
  description: "Turn any PDF into an audio book",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Olog Reader",
    description: "Turn any PDF into an audio book",
    images: [
      {
        url: "https://ologreader.com/ologLinkPreview2.png",
        width: 1200,
        height: 630,
        alt: "Olog Reader - Turn any PDF into an audio book",
      },
    ],
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <SkipToContent />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
