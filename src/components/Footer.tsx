"use client";

import Image from "next/image";
import { useState } from "react";
import TextPressure from "@/components/TextPressure";
import { XIcon, InstagramIcon, LinkedInIcon } from "@/components/icons";

export function Footer() {
  const [fontLoaded, setFontLoaded] = useState(false);

  return (
    <footer className="relative bg-transparent overflow-hidden georama-text">
      {/* Top bar — small icon, nav, copyright, socials */}
      <div className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="border-b border-border py-6 md:py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <a href="/" className="flex items-center" aria-label="Olog Reader home">
              <Image
                src="/icon.webp"
                alt="Olog Reader"
                width={48}
                height={48}
                className="block dark:hidden"
              />
              <Image
                src="/icon-dark.webp"
                alt="Olog Reader"
                width={48}
                height={48}
                className="hidden dark:block"
              />
            </a>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary ">
              An audio log. Your reading, narrated.
            </p>
          </div>

          <div className="flex items-center gap-5 md:gap-8 text-base text-text-secondary">
            <a
              href="/privacy"
              className="hover:text-text-primary transition-colors"
            >
              Privacy
            </a>
            <a
              href="mailto:contact@olog.me"
              className="hover:text-text-primary transition-colors"
            >
              Support
            </a>
            <span className="hidden md:inline w-px h-4 bg-border" />
            <div className="flex items-center gap-4">
              <a
                href="https://x.com/OlogReader"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text-primary transition-colors"
                aria-label="X (Twitter)"
              >
                <XIcon />
              </a>
              <a
                href="https://instagram.com/ologreader"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.linkedin.com/company/olog-me/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>
        </div>

        <p className="py-4 text-xs md:text-sm text-text-secondary">
          &copy; {new Date().getFullYear()} Olog Reader. All rights reserved.
        </p>
      </div>

      {/* Full-bleed kinetic wordmark — page finale */}
      <a
        href="/"
        aria-label="Olog Reader"
        className="block relative w-full select-none cursor-default overflow-hidden"
      >
        <div
          className="w-full"
          style={{ opacity: fontLoaded ? 1 : 0, transition: "opacity 400ms ease" }}
        >
          <TextPressure
            text="OLOG READER"
            textColor="var(--primary)"
            width={true}
            weight={true}
            italic={false}
            alpha={false}
            flex={true}
            scale={false}
            minFontSize={120}
            className="uppercase whitespace-nowrap leading-none"
            onFontLoaded={setFontLoaded}
          />
        </div>
      </a>
    </footer>
  );
}
