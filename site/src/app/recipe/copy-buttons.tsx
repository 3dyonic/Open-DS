"use client";

import { useState } from "react";
import { canonicalRecipe } from "@/lib/check.mjs";

export function CopyButtons({ recipe }: { recipe: object }) {
  const [copied, setCopied] = useState("");
  return (
    <div className="grid gap-2">
      <button
        className="w-fit rounded-control border border-ink px-3 py-2"
        type="button"
        onClick={() => {
          void navigator.clipboard.writeText(canonicalRecipe(recipe)).then(() => {
            setCopied("Copied to clipboard.");
          });
        }}
      >
        Copy recipe JSON
      </button>
      <div aria-live="polite" className={copied ? undefined : "sr-only"}>
        {copied ? <p>{copied}</p> : null}
      </div>
    </div>
  );
}
