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

function ReferContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const referralCode = searchParams.get("referralCode") || searchParams.get("code");

  useEffect(() => {
    const platform = getPlatform();

    if (platform === "desktop") {
      router.replace("/");
      return;
    }

    if (referralCode) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/referral/deferred/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            referralCode,
            platform,
            userAgent: navigator.userAgent,
          }),
        }
      ).catch(() => {});
    }

    // Try to open the app directly via custom URL scheme
    const params = referralCode ? `?referralCode=${encodeURIComponent(referralCode)}` : "";
    const deepLink = `olog-reader://auth/register${params}`;

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
  }, [referralCode, router]);

  return null;
}

export default function ReferPage() {
  return (
    <Suspense>
      <ReferContent />
    </Suspense>
  );
}
