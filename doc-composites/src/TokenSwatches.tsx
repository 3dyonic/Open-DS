/**
 * TokenSwatches: the semantic tokens of one foundation, each drawn as its own value with its name.
 * Built on the Frame base form; Sample draws each value.
 * The data follows doc-composites/schemas/token-swatches.schema.json; the page holds one line:
 * ::token-swatches{id="color"}
 */
import * as React from "react";
import Frame from "./base/Frame";
import Sample from "./Sample";
import { tokenVar } from "./base/token";

export type TokenSwatch = { token: string; type: string; px?: number };
export type TokenSwatchesData = { tokens: TokenSwatch[] };

// How a token is drawn, from its DTCG type and its name.
function kindOf(token: string, type: string) {
  if (/^size\.control\./.test(token)) return "target";
  if (type === "color") return "color";
  if (type === "fontFamily") return "font";
  if (type === "fontWeight" || /font[.-]weight/.test(token)) return "weight";
  if (/line-height/.test(token)) return "leading";
  if (/letter/.test(token)) return "tracking";
  if (type === "shadow") return "shadow";
  if (type === "duration") return "duration";
  if (type === "cubicBezier") return "easing";
  if (type === "number") return /opacity/.test(token) ? "opacity" : null;
  if (/radius/.test(token)) return "radius";
  if (/border-width/.test(token)) return "line";
  if (/font[.-]size/.test(token)) return "size";
  return "bar";
}

export default function TokenSwatches({ data }: { data: TokenSwatchesData }) {
  // One row per token: its value drawn, then its name.
  return (
    <div data-composite="token-swatches" className="mb-[var(--space-gap-group)]">
      <Frame>
          {/* Two columns: each value drawn, then its name, so the names line up however wide a value is. */}
          <ul className="m-0 grid list-none grid-cols-[auto_minmax(0,1fr)] items-center gap-x-[var(--space-gap-group)] gap-y-[var(--space-gap-default)] p-0">
            {data.tokens.map((t) => (
              <li key={t.token} className="col-span-2 m-0 grid grid-cols-subgrid items-center">
                <Sample kind={kindOf(t.token, t.type) ?? "bar"} value={tokenVar(t.token)} note={t.px ? `${t.px}px` : undefined} />
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
