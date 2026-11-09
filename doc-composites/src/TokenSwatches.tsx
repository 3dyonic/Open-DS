/**
 * TokenSwatches: the semantic tokens of one foundation, each drawn as its own value with its name.
 * Built from the scheme's Card and Item, used through their props only; Sample draws each value.
 * The data follows doc-composites/schemas/token-swatches.schema.json; the page holds one line:
 * ::token-swatches{id="color"}
 */
import * as React from "react";
import { Card, CardContent } from "@open-ds/ui/components/card";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@open-ds/ui/components/item";
import Sample from "./Sample";

export type TokenSwatch = {
  token: string;
  kind: string;
  value: string;
  note?: string;
};
export type TokenSwatchesData = { tokens: TokenSwatch[] };

export default function TokenSwatches({ data }: { data: TokenSwatchesData }) {
  return (
    <div data-composite="token-swatches">
      <Card>
        <CardContent>
          <div className="grid gap-[var(--space-gap-tight)] [grid-template-columns:repeat(auto-fill,minmax(14rem,1fr))]">
            {data.tokens.map((t) => (
              <Item key={t.token} size="sm">
                <ItemMedia>
                  <Sample kind={t.kind} value={t.value} note={t.note} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    <code>{t.token}</code>
                  </ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
