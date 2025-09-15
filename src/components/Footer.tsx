"use client";

import { useState } from "react";
import TextPressure from "@/components/TextPressure";

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
        </div>
      </div>
    </footer>
  );
}
