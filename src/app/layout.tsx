import type { Metadata } from "next";
import { Inter, Barriecito, Georama } from "next/font/google";
import "./globals.css";
import SkipToContent from "@/components/ui/SkipToContent";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

const georama = Georama({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-georama",
});

export const metadata: Metadata = {
  title: "Olog Reader",
  description: "Turn any PDF into an audio book",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
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
