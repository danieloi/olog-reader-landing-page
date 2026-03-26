"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

const STORE_URLS = {
  ios: "https://apps.apple.com/us/app/olog-reader/id6744651101?itscg=30200&itsct=apps_box_link&mttnsubad=6744651101",
  android:
    "https://play.google.com/store/apps/details?id=me.olog.reader",
} as const;

function getPlatform(): "ios" | "android" | "desktop" {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

function OpenContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = searchParams.get("path");

  useEffect(() => {
    const platform = getPlatform();

    if (platform === "desktop") {
      router.replace("/");
      return;
    }

    const deepLink = path
      ? `olog-reader://${encodeURIComponent(path)}`
      : "olog-reader://open";

    let dialogShown = false;
    let appOpened = false;

    const onVisibilityChange = () => {
      if (document.hidden) appOpened = true;
    };
    const onBlur = () => {
      dialogShown = true;
    };
    const onFocus = () => {
      if (dialogShown && !appOpened) {
        window.location.href = STORE_URLS[platform];
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    window.location.href = deepLink;

    const timeout = setTimeout(() => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      if (!appOpened && !dialogShown) {
        window.location.href = STORE_URLS[platform];
      }
    }, 3500);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, [path, router]);

  return null;
}

export default function OpenPage() {
  return (
    <Suspense>
      <OpenContent />
    </Suspense>
  );
}
