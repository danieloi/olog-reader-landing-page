"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { AppStoreIcon, PlayStoreIcon } from "@/components/icons";

const STORE_URLS = {
  ios: "https://apps.apple.com/us/app/olog-reader/id6744651101?itscg=30200&itsct=apps_box_link&mttnsubad=6744651101",
  android: "https://play.google.com/store/apps/details?id=me.olog.reader",
} as const;

type Platform = "ios" | "android" | "desktop";

function getPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

/**
 * The circle's name comes from a URL anyone can hand-write. Strips controls and
 * bidi overrides — the characters React's escaping cannot help with. Mirrors
 * `sanitizeInviteLabel` in packages/app/components/circles/invite-link.ts.
 */
const LABEL_MAX = 48;

function sanitizeLabel(raw: string | null): string | null {
  if (!raw) return null;

  const cleaned = Array.from(raw)
    .filter((char) => {
      const cp = char.codePointAt(0) ?? 0;
      if (cp <= 0x1f) return false;
      if (cp >= 0x7f && cp <= 0x9f) return false;
      if (cp >= 0x202a && cp <= 0x202e) return false;
      if (cp >= 0x2066 && cp <= 0x2069) return false;
      return true;
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();

  const clamped = cleaned.slice(0, LABEL_MAX).trim();
  return clamped.length > 0 ? clamped : null;
}

/** Secure-context clipboard, with the pre-`navigator.clipboard` fallback. */
async function copyText(text: string): Promise<void> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    // Fall through to the textarea below.
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
  } catch {
    // Nothing else to try. The server-side IP match is the primary path.
  }
  document.body.removeChild(textarea);
}

const ICON_SWAP = { type: "spring", duration: 0.3, bounce: 0 } as const;

/**
 * Copy ↔ check. Both icons stay mounted and cross-fade, so a second tap while
 * the first swap is still settling retargets the spring instead of restarting
 * from zero the way an unmount/remount (or a keyframe) would.
 */
function CopyStateIcon({ copied }: { copied: boolean }) {
  // Reduced motion keeps the state change legible but drops the movement.
  const reduce = useReducedMotion() ?? false;
  const hidden = reduce
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.25, filter: "blur(4px)" };
  const shown = reduce
    ? { opacity: 1 }
    : { opacity: 1, scale: 1, filter: "blur(0px)" };

  return (
    <span aria-hidden className="relative block h-[18px] w-[18px]">
      <motion.span
        className="absolute inset-0 text-text-secondary"
        initial={false}
        animate={copied ? hidden : shown}
        transition={ICON_SWAP}
      >
        <Copy size={18} strokeWidth={1.75} />
      </motion.span>
      <motion.span
        className="absolute inset-0 text-success"
        initial={false}
        animate={copied ? shown : hidden}
        transition={ICON_SWAP}
      >
        <Check size={18} strokeWidth={2} />
      </motion.span>
    </span>
  );
}

/**
 * Where a circle invite lands when the app did not take the link.
 *
 * Renders a body, unlike /refer, /redeem and /gift which bounce: a clipboard
 * write needs a user gesture, and `/join` is in the AASA so an iOS user WITH
 * the app never gets here — this page's only audience is someone installing.
 *
 * For the same reason it does not auto-fire `olog-reader://`. Without the app
 * that navigation raises Safari's "Cannot Open Page" over this page. It is a
 * button instead, for the one case that lands here installed: an Android build
 * whose App Links verification failed.
 */
function JoinContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");
  const label = useMemo(
    () => sanitizeLabel(searchParams.get("c")),
    [searchParams],
  );

  const [platform, setPlatform] = useState<Platform | null>(null);
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    const detected = getPlatform();

    if (detected === "desktop") {
      router.replace("/");
      return;
    }

    setPlatform(detected);

    if (!code) return;

    // Register against this IP so the app can claim it on first launch — the
    // store round trip drops the code, and this is the only copy that survives.
    // Fire-and-forget like /refer: a failure costs the match, not the page.
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/circles/deferred/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        platform: detected,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {});
  }, [code, router]);

  const inviteUrl = useMemo(() => {
    if (!code) return null;
    const base = `https://ologreader.com/join?code=${encodeURIComponent(code)}`;
    return label ? `${base}&c=${encodeURIComponent(label)}` : base;
  }, [code, label]);

  const getTheApp = useCallback(async () => {
    // Must start inside this gesture. The whole URL, not a bare code: the app
    // parses it with `inviteCodeFromUrl`, so the path makes it self-identifying
    // and a stray clipboard string cannot be mistaken for an invite.
    if (inviteUrl) {
      await copyText(inviteUrl);
      setCopied(true);
    }
    if (platform === "ios" || platform === "android") {
      window.location.href = STORE_URLS[platform];
    }
  }, [inviteUrl, platform]);

  /**
   * The bare code, not `inviteUrl`: this is the string someone pastes into the
   * app's join field, and it is what the card shows. `getTheApp` still writes
   * the full URL, and it runs last on the only path that leaves this page — so
   * the app's clipboard claim keeps the form `inviteCodeFromUrl` expects.
   */
  const copyCode = useCallback(() => {
    if (!code) return;
    // Not awaited: `copyText` swallows its own failures, so the await could only
    // delay the confirmation, never contradict it — and staying inside the click
    // keeps the state change at discrete priority, so the check lands instantly.
    void copyText(code);
    setCodeCopied(true);
  }, [code]);

  useEffect(() => {
    if (!codeCopied) return;
    const timer = setTimeout(() => setCodeCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [codeCopied]);

  const openInApp = useCallback(() => {
    if (!code) return;
    // Carries `c=` too — the app's join screen titles itself from it.
    const params = new URLSearchParams({ code });
    if (label) params.set("c", label);
    window.location.href = `olog-reader://join?${params.toString()}`;
  }, [code, label]);

  // Desktop is mid-redirect, and platform is unknowable until the client runs.
  if (!platform) return null;

  const heading = label
    ? `You've been invited to ${label}`
    : "You've been invited to a reading circle";

  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-background-hero px-2 py-6"
    >
      <div className="w-full max-w-md text-center">
        <p className="font-sans text-caption uppercase tracking-[0.18em] text-text-secondary">
          Olog Reader
        </p>

        <h1 className="mt-2 text-balance font-display text-h2 font-semibold leading-tight text-text-primary">
          {heading}
        </h1>

        <p className="mt-1 text-pretty font-sans text-body text-text-secondary">
          Everyone reads the same book, and your notes appear beside theirs.
        </p>

        {code ? (
          <>
            <button
              type="button"
              onClick={copyCode}
              aria-label={`Copy invite code ${code}`}
              // `select-none` + no tap highlight: the card is a control, so a
              // tap should press it, not raise a selection or iOS's grey flash.
              className="relative mt-3 block w-full select-none rounded-lg border border-border bg-background-card px-2 py-2 transition-transform duration-150 ease-out-strong [-webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-hero active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              <span className="block text-center font-sans text-caption font-normal leading-snug text-text-secondary">
                Invite code
              </span>
              {/* `pl-[0.2em]` cancels the trailing letter-space `tracking` leaves
                  after the last character, so the code sits optically centred. */}
              <span className="mt-1 block pl-[0.2em] text-center font-mono text-h2 tabular-nums tracking-[0.2em] text-text-primary">
                {code}
              </span>
              {/* Vertically centred on the card, which lands it on the code row. */}
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                <CopyStateIcon copied={codeCopied} />
              </span>
            </button>

            <span aria-live="polite" className="sr-only">
              {codeCopied ? "Invite code copied" : ""}
            </span>
          </>
        ) : (
          <p className="mt-3 font-sans text-caption text-text-secondary">
            This link is missing its invite code. Ask whoever sent it for a
            fresh one.
          </p>
        )}

        <button
          type="button"
          onClick={getTheApp}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-button-primary px-3 py-2 font-sans text-body font-semibold text-text-light transition-[background-color,transform] duration-150 ease-out-strong hover:bg-button-hover-primary active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          {/* Intrinsic ~14px. PlayStoreIcon takes no props — Google brand colours. */}
          {platform === "ios" ? <AppStoreIcon /> : <PlayStoreIcon />}
          Get the app to join
        </button>

        {code ? (
          <p
            aria-live="polite"
            className="mt-1 h-3 font-sans text-caption text-text-secondary"
          >
            {copied
              ? "Invite copied — it'll be waiting when you open the app."
              : ""}
          </p>
        ) : null}

        {code ? (
          <button
            type="button"
            onClick={openInApp}
            className="relative mt-1 font-sans text-caption font-medium text-text-secondary underline underline-offset-4 transition-colors before:absolute before:inset-x-0 before:inset-y-[-10px] before:content-[''] hover:text-text-primary active:text-text-primary"
          >
            {/* The 21px text line is under the 40px minimum touch target, so
                `before:` pads the hit area out without moving the baseline. */}
            Already have the app? Open it
          </button>
        ) : null}
      </div>
    </main>
  );
}

export default function JoinPage() {
  return (
    <Suspense>
      <JoinContent />
    </Suspense>
  );
}
