/**
 * BrandSet: what one brand shows, in a scheme with several. The brand picked in the docs' top bar
 * shows; the others hide (docs/scripts/generate.mjs writes that rule for each brand). Built on the
 * Caption base form, which names the brand. The docs pass the brand's id and name as data; the words
 * stay Markdown in the page:
 *
 *   ::::brand{id="aster"}
 *   …
 *   ::::
 */
import * as React from "react";
import Caption from "./base/Caption";

export type BrandSetData = { brand: string; name: string };

export default function BrandSet({ data, children }: { data: BrandSetData; children?: React.ReactNode }) {
  return (
    // The layout sits inside, so the rule that hides another brand's set never meets a display class.
    <div data-composite="brand" data-for-brand={data.brand}>
      <div className="grid gap-4 [&>h3:not(:first-child)]:mt-2!">
        <Caption>{data.name}</Caption>
        {children}
      </div>
    </div>
  );
}
