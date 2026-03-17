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

function RedeemContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  useEffect(() => {
    const platform = getPlatform();

    if (platform === "desktop") {
      router.replace("/");
      return;
    }

    // Try to open the app directly via custom URL scheme
    const params = code ? `?code=${encodeURIComponent(code)}` : "";
    const deepLink = `olog-reader://redeem${params}`;

    let dialogShown = false;
    let appOpened = false;

    const onVisibilityChange = () => {
      if (document.hidden) appOpened = true;
    };
    const onBlur = () => {
      dialogShown = true;
    };
    const onFocus = () => {
      // User returned to the page — they cancelled the dialog or the app closed quickly.
      // If the page never went hidden, the app didn't actually open — redirect to store.
      if (dialogShown && !appOpened) {
        window.location.href = STORE_URLS[platform];
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    window.location.href = deepLink;

    // Fall back to store if nothing happened at all (app not installed, no dialog)
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
  }, [code, router]);

  return null;
}

export default function RedeemPage() {
  return (
    <Suspense>
      <RedeemContent />
    </Suspense>
  );
}
