"use client";
// The light and dark switch in the nav. The site follows the device by default. One click
// switches to the other theme and remembers it; the next click goes back to following the device
// (Yonatan's rule from 3dyonic.com: dark device → light → dark is follow-device again).
// The choice lives in localStorage and on <html data-theme>; THEME_SCRIPT (lib/theme) applies it
// before paint.
import { useEffect, useState } from "react";
import { DARK_QUERY, THEME_KEY } from "@/lib/theme";

type Theme = "light" | "dark";
const KEY = THEME_KEY;
const QUERY = DARK_QUERY;

function device(): Theme {
  return matchMedia(QUERY).matches ? "dark" : "light";
}

function current(): Theme {
  const t = document.documentElement.dataset.theme;
  return t === "light" || t === "dark" ? t : device();
}

function apply(next: Theme) {
  const root = document.documentElement;
  try {
    if (next === device()) {
      delete root.dataset.theme;
      localStorage.removeItem(KEY);
    } else {
      root.dataset.theme = next;
      localStorage.setItem(KEY, next);
    }
  } catch {
    // Storage can be blocked; the switch still works for this page.
    if (next === device()) delete root.dataset.theme;
    else root.dataset.theme = next;
  }
  window.dispatchEvent(new Event("open-ds-theme"));
}

/** The theme in use right now, kept up to date with the switch and the device setting. */
export function useTheme(): Theme | null {
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    const update = () => setTheme(current());
    const media = matchMedia(QUERY);
    const onDevice = () => {
      // When the device changes to match the saved choice, follow the device again.
      if (document.documentElement.dataset.theme === device()) apply(device());
      update();
    };
    update();
    media.addEventListener("change", onDevice);
    window.addEventListener("open-ds-theme", update);
    return () => {
      media.removeEventListener("change", onDevice);
      window.removeEventListener("open-ds-theme", update);
    };
  }, []);
  return theme;
}

function SunIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-[20px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-[20px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
    </svg>
  );
}

export function ThemeSwitch() {
  const theme = useTheme();
  const next: Theme = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${next} theme`;
  return (
    <button
      type="button"
      onClick={() => apply(next)}
      aria-label={label}
      title={label}
      className="flex size-[40px] items-center justify-center hover:text-accent-text"
    >
      {/* The static page cannot know the theme; the icon appears once the script has read it. */}
      {theme === null ? (
        <span aria-hidden className="size-[20px]" />
      ) : theme === "dark" ? (
        <SunIcon />
      ) : (
        <MoonIcon />
      )}
    </button>
  );
}
