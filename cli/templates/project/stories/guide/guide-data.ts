// Where the guide (guide.tsx) gets its data in this design system's Storybook: its own scheme.json and
// the component reference in .open-ds/grammar.json. Copied by open-ds create.
/* eslint-disable @typescript-eslint/no-explicit-any */
import grammar from "../../.open-ds/grammar.json";
import scheme from "../../scheme.json";

/** This Storybook is one design system's own, so its introduction starts with it, not with Open DS. */
export const ABOUT_OPEN_DS: { schemes: number } | null = null;

/** The guide's data, the same shape as in the Open DS Storybook (OD-223). */
export function useGuideData(): {
  scheme: any;
  grammar: any;
  key: string;
  brand: string;
  mode: "light" | "dark";
} {
  const dark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const brand =
    typeof document !== "undefined"
      ? (document.documentElement.dataset.brand ?? "")
      : "";
  return {
    scheme,
    grammar,
    key: `${brand}|${dark}`,
    brand:
      brand && (scheme.tokens.brands as Record<string, unknown>)[brand]
        ? brand
        : Object.keys(scheme.tokens.brands)[0],
    mode: dark ? "dark" : "light",
  };
}
