// Google Tag Manager, only with consent. The container ID lives in brand.json (analytics.gtm);
// the Google Analytics tag is set up inside the container. While the ID is empty, the site shows
// no banner and loads nothing from Google. The container itself loads only after Accept, so no
// tag in it can run before consent.
import brand from "../../../brand.json";

export const gtmId: string = (brand as { analytics?: { gtm?: string } }).analytics?.gtm ?? "";
export const CONSENT_KEY = "open-ds-consent";
export type Consent = "granted" | "denied";
/** The footer link asks the banner to open again with this event. */
export const OPEN_CONSENT_EVENT = "open-ds:consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(v: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, v);
  } catch {
    // Private windows can block storage; the choice then lasts for this page only.
  }
}

/** Loads the Tag Manager container once. Called only after the visitor accepts. */
export function loadGtm() {
  if (!gtmId || window.gtag) return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // Consent commands must be pushed as the arguments object, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  // Measuring is allowed (the visitor accepted); ads stay off whatever the container holds.
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.appendChild(s);
}

/** Stops measuring and removes the Google Analytics cookies on this site. */
export function stopGa() {
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (name === "_ga" || name.startsWith("_ga_")) {
      for (const d of domains) {
        document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
      }
    }
  }
}
