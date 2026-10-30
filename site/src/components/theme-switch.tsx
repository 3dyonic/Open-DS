"use client";
// Lets a visitor flip a scheme's brand and mode. Only data attributes change.
import { useState } from "react";
import { FullSpecimen } from "./specimen";

export function ThemeSwitch({
  scheme,
  brands,
}: {
  scheme: string;
  brands: { id: string; label: string }[];
}) {
  const [brand, setBrand] = useState(brands[0].id);
  const [dark, setDark] = useState(false);
  const multi = brands.length > 1;
  return (
    <div>
      <div
        className="mb-3 flex flex-wrap items-center gap-2 font-mono text-xs"
        role="group"
        aria-label="Theme"
      >
        {multi &&
          brands.map((b) => (
            <button
              key={b.id}
              type="button"
              aria-pressed={brand === b.id}
              onClick={() => setBrand(b.id)}
              className="rounded border border-line px-2 py-1 aria-pressed:bg-ink aria-pressed:text-paper"
            >
              {b.label}
            </button>
          ))}
        <button
          type="button"
          aria-pressed={!dark}
          onClick={() => setDark(false)}
          className="rounded border border-line px-2 py-1 aria-pressed:bg-ink aria-pressed:text-paper"
        >
          Light
        </button>
        <button
          type="button"
          aria-pressed={dark}
          onClick={() => setDark(true)}
          className="rounded border border-line px-2 py-1 aria-pressed:bg-ink aria-pressed:text-paper"
        >
          Dark
        </button>
      </div>
      <FullSpecimen scheme={scheme} brand={multi ? brand : undefined} dark={dark} />
    </div>
  );
}
