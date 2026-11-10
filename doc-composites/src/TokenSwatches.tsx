/**
 * TokenSwatches: the semantic tokens of one foundation, each drawn as its own value with its name.
 * Built from the scheme's Card, used through its props only; Sample draws each value.
 * The data follows doc-composites/schemas/token-swatches.schema.json; the page holds one line:
 * ::token-swatches{id="color"}
 */
import * as React from "react";
import { Card, CardContent } from "@open-ds/ui/components/card";
import Sample from "./Sample";

export type TokenSwatch = {
  token: string;
  kind: string;
  value: string;
  note?: string;
};
export type TokenSwatchesData = { tokens: TokenSwatch[] };

export default function TokenSwatches({ data }: { data: TokenSwatchesData }) {
  // RC1's specimen: three columns of a value drawn and its token's name, compact.
  return (
    <div data-composite="token-swatches" className="mb-[var(--space-gap-group)]">
      <Card>
        <CardContent>
          <ul className="m-0 grid list-none gap-x-[var(--space-gap-group)] gap-y-[var(--space-gap-default)] p-0 sm:grid-cols-2 lg:grid-cols-3">
            {data.tokens.map((t) => (
              <li key={t.token} className="m-0 flex min-w-0 items-center gap-[var(--space-gap-default)]">
                <Sample kind={t.kind} value={t.value} note={t.note} />
                <span className="truncate [font-family:var(--type-data-font-family)] text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-secondary)]">
                  {t.token}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
