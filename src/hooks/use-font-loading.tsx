"use client";

import { useEffect, useState } from "react";

interface UseFontLoadingOptions {
  fontFamily: string;
  fontUrl: string;
  timeout?: number;
}

export function useFontLoading({
  fontFamily,
  fontUrl,
  timeout = 5000,
}: UseFontLoadingOptions) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let fontFace: FontFace | null = null;

    const loadFont = async () => {
      try {
        // Check if font is already loaded
        if (document.fonts.check(`16px "${fontFamily}"`)) {
          setIsLoaded(true);
          return;
        }

        // Create and load the font
        fontFace = new FontFace(fontFamily, `url(${fontUrl})`);

        // Set timeout for font loading
        timeoutId = setTimeout(() => {
          setIsError(true);
          setIsLoaded(true); // Allow fallback to proceed
        }, timeout);

        const loadedFont = await fontFace.load();
        document.fonts.add(loadedFont);

        // Wait for font to be ready
        await document.fonts.ready;

        clearTimeout(timeoutId);
        setIsLoaded(true);
      } catch (error) {
        console.warn(`Failed to load font ${fontFamily}:`, error);
        clearTimeout(timeoutId);
        setIsError(true);
        setIsLoaded(true); // Allow fallback to proceed
      }
    };

    loadFont();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [fontFamily, fontUrl, timeout]);

  return { isLoaded, isError };
}
