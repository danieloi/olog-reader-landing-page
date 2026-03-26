"use client";

export const STORE_URLS = {
  ios: "https://apps.apple.com/us/app/olog-reader/id6744651101?itscg=30200&itsct=apps_box_link&mttnsubad=6744651101",
  android:
    "https://play.google.com/store/apps/details?id=me.olog.reader",
} as const;

export function handleGetStarted() {
  const isIos = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
  const url = isIos ? STORE_URLS.ios : STORE_URLS.android;
  window.open(url, "_blank");
}
