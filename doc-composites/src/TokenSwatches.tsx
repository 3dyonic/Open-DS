/**
 * TokenSwatches: the semantic tokens of one foundation, each drawn as its own value with its name.
 * Built on the Frame base form; Sample draws each value. Colors come grouped by job, with one Light /
 * Dark switch: each row is the token's live thumb in that mode, its name, and the chain it resolves
 * through (a gray's neutral step, else its primitive, then the hex), joined by the Chain base form.
 * The data follows doc-composites/schemas/token-swatches.schema.json; the page holds one line:
 * ::token-swatches{id="color"}
 */
import * as React from "react";
import Frame from "./base/Frame";
import Sample from "./Sample";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@open-ds/ui/components/tabs";
import Chain from "./base/Chain";
import Swatch from "./base/Swatch";
import { tokenVar } from "./base/token";

type Resolved = { mode: "light" | "dark"; primitive: string; via?: string; hex: string };
export type TokenSwatch = { token: string; type: string; px?: number; modes?: Resolved[] };
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

const mono = "[font-family:var(--type-data-font-family)] text-[length:var(--type-caption-font-size)]";
// The page shows a token without its color. prefix and without the base marker (.@).
const name = (token: string) => token.replace(/^color\./, "").replace(/\.@$/, "");

// The jobs colors are grouped by, in this order, with the line each group opens with. A token's group is
// the second word of its name (color.surface.canvas is a surface).
const GROUPS: [string, string, string][] = [
  ["surface", "Surfaces", "Fills behind content."],
  ["text", "Text", "Words, and the icons beside them."],
  ["border", "Borders", "Edges, focus and selection."],
  ["action", "Actions", "Things people press."],
  ["status", "Status", "What a state means."],
  ["category", "Categories", "Telling series apart, in charts and tags."],
  ["disabled", "Disabled", "What cannot be used right now."],
  ["neutral", "Neutral scale", "The gray steps the roles above read."],
];

function ColorGroups({ tokens }: { tokens: TokenSwatch[] }) {
  const groupOf = (t: TokenSwatch) => t.token.split(".")[1];
  const known = GROUPS.map(([g]) => g);
  const extra = [...new Set(tokens.map(groupOf))].filter((g) => !known.includes(g));
  const groups = [...GROUPS, ...extra.map((g): [string, string, string] => [g, g, ""])].filter(([g]) =>
    tokens.some((t) => groupOf(t) === g),
  );
  const modes = tokens.find((t) => t.modes)?.modes?.map((m) => m.mode) ?? ["light"];
  return (
    <Tabs defaultValue={modes[0]}>
      {/* One switch for the whole list, kept in view while it scrolls (OD-286). */}
      <div className="sticky top-[var(--ifm-navbar-height)] z-[1] bg-[var(--color-surface-canvas)] py-[var(--space-gap-tight)]">
        <TabsList>
          {modes.map((m) => (
            <TabsTrigger key={m} value={m}>
              {m === "light" ? "Light" : "Dark"}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {modes.map((m) => (
        <TabsContent key={m} value={m}>
          {/* Inside data-mode the whole list, thumbs and text, takes this mode's values. One list for every
              group, so the thumb, name and chain columns line up down the page; each group opens with a
              header row. Subtle separators between rows: the scheme's default border, at half strength. */}
          <div data-mode={m}>
            <Frame>
              <ul className="m-0 grid list-none grid-cols-[auto_minmax(0,1fr)] items-center gap-x-[var(--space-gap-default)] p-0 sm:grid-cols-[auto_minmax(0,max-content)_minmax(0,1fr)]">
                {groups.map(([g, title, why], gi) => (
                  <React.Fragment key={g}>
                    <li
                      className={`col-span-2 m-0 flex flex-wrap items-baseline gap-x-[var(--space-gap-default)] pb-[var(--space-gap-tight)] sm:col-span-3 ${gi ? "pt-[var(--space-gap-section)]" : ""}`}
                    >
                      <b className="text-[color:var(--color-text-primary)]">{title}</b>
                      <span className="text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-muted)]">{why}</span>
                    </li>
                    {tokens
                      .filter((t) => groupOf(t) === g)
                      .map((t, ti, list) => {
                        const r = t.modes?.find((x) => x.mode === m);
                        const last = ti === list.length - 1;
                        return (
                          <li
                            key={t.token}
                            className={`col-span-2 m-0 grid grid-cols-subgrid items-center py-[var(--space-gap-tight)] sm:col-span-3 ${last ? "" : "border-b-[length:var(--border-width-default)] border-[color-mix(in_srgb,var(--color-border-default)_50%,transparent)]"}`}
                          >
                            <Swatch color={tokenVar(t.token)} size="lg" />
                            <span className={`text-[color:var(--color-text-primary)] ${mono}`}>{name(t.token)}</span>
                            {r && (
                              <span className={`max-sm:col-start-2 text-[color:var(--color-text-muted)] ${mono}`}>
                                <Chain lead parts={[name(r.via ?? r.primitive), r.hex]} />
                              </span>
                            )}
                          </li>
                        );
                      })}
                  </React.Fragment>
                ))}
              </ul>
            </Frame>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default function TokenSwatches({ data }: { data: TokenSwatchesData }) {
  if (data.tokens.some((t) => t.modes))
    return (
      <div data-composite="token-swatches" className="mb-[var(--space-gap-group)]">
        <ColorGroups tokens={data.tokens} />
      </div>
    );
  // One row per token: its value drawn, then its name, in two columns so the names line up.
  return (
    <div data-composite="token-swatches" className="mb-[var(--space-gap-group)]">
      <Frame>
        <ul className="m-0 grid list-none grid-cols-[auto_minmax(0,1fr)] items-center gap-x-[var(--space-gap-group)] gap-y-[var(--space-gap-default)] p-0">
          {data.tokens.map((t) => (
            <li key={t.token} className="col-span-2 m-0 grid grid-cols-subgrid items-center">
              <Sample kind={kindOf(t.token, t.type) ?? "bar"} value={tokenVar(t.token)} note={t.px ? `${t.px}px` : undefined} />
              <span className={`text-[color:var(--color-text-secondary)] ${mono}`}>{t.token}</span>
            </li>
          ))}
        </ul>
      </Frame>
    </div>
  );
}
