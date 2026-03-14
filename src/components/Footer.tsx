"use client";

import { useState } from "react";
import TextPressure from "@/components/TextPressure";
import { XIcon, InstagramIcon, LinkedInIcon } from "@/components/icons";

export function Footer() {
  const [fontLoaded, setFontLoaded] = useState(false);

  return (
    <footer className="relative bg-transparent overflow-hidden">
      <div className="relative px-4 sm:px-6 lg:px-8 georama-text">
        <div className="">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a href="/" className="w-[100px] h-[100px] flex items-center">
                <div
                  className="scale-[0.25] origin-left"
                  style={{ opacity: fontLoaded ? 1 : 0 }}
                >
                  <TextPressure
                    text="OLOG READER"
                    textColor="var(--primary)"
                    width={true}
                    weight={true}
                    italic={false}
                    alpha={false}
                    flex={false}
                    scale={false}
                    minFontSize={128}
                    className="uppercase whitespace-nowrap"
                    onFontLoaded={setFontLoaded}
                  />
                </div>
              </a>
            </div>

            <div className="flex items-center gap-5 text-sm text-text-secondary">
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
            </div>
          </div>

          {/* Social links */}
          <div className="border-t border-border py-4 flex items-center justify-between">
            <p className="text-xs text-text-secondary">
              &copy; {new Date().getFullYear()} Olog Reader. All rights reserved.
            </p>
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
              {/* <a
                href="https://tiktok.com/@ologreader"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text-primary transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a> */}
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
      </div>
    </footer>
  );
}
