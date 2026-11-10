/**
 * TokenSwatches: the semantic tokens of one foundation, each drawn as its own value with its name.
 * Built on the Frame base form; Sample draws each value.
 * The data follows doc-composites/schemas/token-swatches.schema.json; the page holds one line:
 * ::token-swatches{id="color"}
 */
import * as React from "react";
import Frame from "./base/Frame";
import Sample from "./Sample";

export type TokenSwatch = {
  token: string;
  kind: string;
  value: string;
  note?: string;
};
export type TokenSwatchesData = { tokens: TokenSwatch[] };

export default function TokenSwatches({ data }: { data: TokenSwatchesData }) {
  // One row per token: its value drawn, then its name.
  return (
    <div data-composite="token-swatches" className="mb-[var(--space-gap-group)]">
      <Frame>
          <ul className="m-0 flex list-none flex-col gap-[var(--space-gap-default)] p-0">
            {data.tokens.map((t) => (
              <li key={t.token} className="m-0 flex items-center gap-[var(--space-gap-default)]">
                <Sample kind={t.kind} value={t.value} note={t.note} />
                <span className="[font-family:var(--type-data-font-family)] text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-secondary)]">
                  {t.token}
                </span>
              </li>
            ))}
          </ul>
      </Frame>
    </div>
  );
}
