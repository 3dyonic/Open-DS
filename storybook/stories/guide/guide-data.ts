// Where the guide (guide.tsx) gets its data in the Open DS Storybook: the scheme chosen in the toolbar,
// and the grammar with its component reference. A created project has its own guide-data that reads
// its scheme.json instead (cli/templates/project/stories/guide/guide-data.ts). open-ds create copies guide.tsx and the guide stories, never this file..
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import grammar from "../../../schemes/grammar.json";
import { NO_CHOICE, SchemeContext } from "../../src/scheme-context";
import { SCHEMES } from "../../src/schemes";

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

export function useGuideData(): { scheme: any; grammar: any; key: string } {
  const ctx = useContext(SchemeContext);
  const html = useHtmlScheme();
  // Inside a story the decorator's choice is the source; on a docs page, <html> is.
  const story = ctx !== NO_CHOICE;
  const id = story ? ctx.scheme : html.scheme;
  const brand = story ? ctx.brand : html.brand;
  const mode = story ? ctx.mode : html.dark ? "dark" : "light";
  return { scheme: SCHEMES[id] ?? SCHEMES["dense-data"], grammar, key: `${id}|${brand ?? ""}|${mode}` };
}
