"use client";
// The colour key: a small trigger that opens the key as a tooltip.
import { useEffect, useId, useState } from "react";

/**
 * The colour key for a section: one small trigger on its own line. The key opens as a tooltip
 * on hover or keyboard focus, so it never repeats on the page. Escape closes it (WCAG 1.4.13).
 */
export function Legend({ items }: { items: [React.ReactNode, string][] }) {
  const id = useId();
  const [dismissed, setDismissed] = useState(false);
  const [hovered, setHovered] = useState(false);
  // While the pointer is over the key, Escape closes it even if focus is elsewhere.
  useEffect(() => {
    if (!hovered) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDismissed(true);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [hovered]);
  const show = dismissed
    ? ""
    : "group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100";
  return (
    <div
      className="group relative self-start"
      onKeyDown={(e) => e.key === "Escape" && setDismissed(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setDismissed(false);
      }}
      onBlur={() => setDismissed(false)}
    >
      <button
        type="button"
        aria-describedby={id}
        className="flex items-center gap-2 rounded-[4px] border border-line bg-white px-2 py-1 font-mono text-[12px] text-[#3e3a31] hover:border-ink"
      >
        <span aria-hidden className="flex gap-[3px]">
          <span className="size-[8px] bg-accent" />
          <span className="size-[8px] bg-tag" />
        </span>
        What the colours mean
      </button>
      <div
        id={id}
        role="tooltip"
        className={`invisible absolute top-full left-0 z-10 mt-2 flex w-max max-w-[320px] flex-col gap-2 rounded-[6px] bg-ink p-3 font-mono text-[12px] text-paper opacity-0 shadow-lg transition-opacity ${show}`}
      >
        {items.map(([swatch, text]) => (
          <span key={text} className="flex items-center gap-2">
            <span aria-hidden>{swatch}</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
