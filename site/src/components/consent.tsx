"use client";
// The cookie banner. It asks once, before any Google Analytics cookie is set. Accept and Reject
// are equal buttons. "Cookie settings" in the footer opens it again. Without a measurement ID
// (brand.json analytics.ga4) it renders nothing.
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  type Consent,
  OPEN_CONSENT_EVENT,
  gaId,
  loadGa,
  readConsent,
  saveConsent,
  stopGa,
} from "@/lib/analytics";

export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!gaId) return;
    const c = readConsent();
    if (c === "granted") loadGa();
    if (c === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!gaId || !open) return null;

  const choose = (v: Consent) => {
    saveConsent(v);
    if (v === "granted") loadGa();
    else stopGa();
    setOpen(false);
  };

  const btn = "rounded-[4px] px-4 py-[10px] text-[15px] font-semibold";
  return (
    <section
      role="region"
      aria-label="Cookie choice"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-[720px] flex-col gap-3 rounded-[8px] border border-line bg-white p-5 shadow-lg md:flex-row md:items-center md:gap-5"
    >
      <p className="text-[15px] leading-[1.5] text-body">
        May we count visits with Google Analytics? It sets cookies to tell us which pages people
        read. No ads, nothing sold.{" "}
        <Link href="/privacy/#cookies" className="font-semibold text-accent-text underline">
          Privacy
        </Link>
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          className={`${btn} border border-ink text-ink`}
          onClick={() => choose("denied")}
        >
          Reject
        </button>
        <button
          type="button"
          className={`${btn} border border-ink bg-ink text-paper`}
          onClick={() => choose("granted")}
        >
          Accept
        </button>
      </div>
    </section>
  );
}

/** The footer item that opens the banner again. Hidden while there is no measurement ID. */
export function CookieSettingsLink({ className }: { className?: string }) {
  if (!gaId) return null;
  return (
    <li>
      <button
        type="button"
        className={className}
        onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      >
        Cookie settings
      </button>
    </li>
  );
}
