/**
 * BrandSet: what one brand shows, in a scheme with several. The brand picked in the docs' top bar
 * shows; the others hide (docs/scripts/generate.mjs writes that rule for odv-brandset). The words
 * stay Markdown in the page:
 *
 *   ::::brand{id="aster" name="Aster"}
 *   …
 *   ::::
 */
import * as React from "react";

export default function BrandSet({
  id,
  name,
  children,
}: {
  id: string;
  name: string;
  children?: React.ReactNode;
}) {
  return (
    <div data-composite="brand" className="odv-brandset" data-for-brand={id}>
      <p className="odv-brandname">{name}</p>
      {children}
    </div>
  );
}
