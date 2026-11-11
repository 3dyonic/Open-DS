// Where the guide (guide.tsx) gets its data in the Open DS Storybook: the scheme chosen in the toolbar,
// and the grammar with its component reference. A created project has its own guide-data that reads
// its scheme.json instead (cli/templates/project/stories/guide/guide-data.ts). open-ds create copies guide.tsx and the guide stories, never this file..
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { NO_CHOICE, SchemeContext } from "../../src/scheme-context";
import { grammar, SCHEMES } from "../../src/schemes";

/** The scheme on <html>, which the story decorator writes; docs pages render outside the decorator. */
function useHtmlScheme() {
  const read = () => ({
    scheme: document.documentElement.dataset.scheme ?? "dense-data",
    brand: document.documentElement.dataset.brand,
    dark: document.documentElement.classList.contains("dark"),
  });
  const [state, setState] = useState(read);
  useEffect(() => {
    const watch = new MutationObserver(() => setState(read()));
    watch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-scheme", "data-brand", "class"],
    });
    return () => watch.disconnect();
  }, []);
  return state;
}

/** This Storybook shows every Open DS scheme, so its introduction first says what Open DS is (OD-216). */
export const ABOUT_OPEN_DS: { schemes: number } | null = { schemes: Object.keys(SCHEMES).length };

/** The guide's data, the same shape in this Storybook and in a created project's (OD-223). */
export function useGuideData(): { scheme: any; grammar: any; key: string; brand: string; mode: "light" | "dark" } {
  const ctx = useContext(SchemeContext);
  const html = useHtmlScheme();
  // Inside a story the decorator's choice is the source; on a docs page, <html> is.
  const story = ctx !== NO_CHOICE;
  const id = story ? ctx.scheme : html.scheme;
  const brand = story ? ctx.brand : html.brand;
  const mode = story ? ctx.mode : html.dark ? "dark" : "light";
  const scheme = SCHEMES[id] ?? SCHEMES["dense-data"];
  return {
    scheme,
    grammar,
    key: `${id}|${brand ?? ""}|${mode}`,
    brand: brand && scheme.tokens.brands[brand] ? brand : Object.keys(scheme.tokens.brands)[0],
    mode: mode === "dark" ? "dark" : "light",
  };
}
