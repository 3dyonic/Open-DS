"use client";

import { canonicalRecipe } from "@/lib/check.mjs";

export function CopyButtons({ recipe }: { recipe: object }) {
  return (
    <button
      className="w-fit rounded-control border border-ink px-3 py-2"
      type="button"
      onClick={() => void navigator.clipboard.writeText(canonicalRecipe(recipe))}
    >
      Copy recipe JSON
    </button>
  );
}
