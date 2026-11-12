/**
 * TokenGroups: a foundation's tokens, each shown as the thing it makes. One group per thing: a type
 * role (its four tokens), the focus ring (its widths and its color), an icon (its size and stroke), or a
 * single token. Each group draws its value on top, lists its token API under it, and says when to use
 * it and when not, from the scheme's usage rules (OD-286, OD-287). Built from the Frame, TokenApi and
 * Rule base forms and the Sample composite. The data follows doc-composites/schemas/token-groups.schema.json;
 * the page holds one line: ::token-groups{id="shape"}
 */
import * as React from "react";
import Frame from "./base/Frame";
import Rule, { type RuleLine } from "./base/Rule";
import TokenApi, { type ApiRow } from "./base/TokenApi";
import Sample from "./Sample";

export type TokenGroup = {
  // The thing the tokens make, such as "display", "Focus ring" or "radius.surface".
  title: string;
  // A short line under the title, such as the icon style the scheme answers.
  note?: string;
  // A type sample's line is one text, or (for data) its values, each a part of its own.
  sample: { kind: string; value?: string; role?: string; text?: string; parts?: string[]; note?: string };
  api: ApiRow[];
  rules: RuleLine[];
};
export type TokenGroupsData = { groups: TokenGroup[] };

export default function TokenGroups({ data }: { data: TokenGroupsData }) {
  return (
    <div data-composite="token-groups" className="mb-[var(--space-gap-group)]">
      <Frame>
        <ul className="m-0 flex list-none flex-col p-0">
          {data.groups.map((g, i) => (
            <li
              key={g.title}
              className={`m-0 grid gap-[var(--space-gap-group)] py-[var(--space-gap-default)] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] ${i < data.groups.length - 1 ? "border-b-[length:var(--border-width-default)] border-[color-mix(in_srgb,var(--color-border-default)_50%,transparent)]" : ""}`}
            >
              <div className="flex min-w-0 flex-col gap-[var(--space-gap-tight)]">
                <b className="text-[color:var(--color-text-primary)]">{g.title}</b>
                {g.note && <span className="text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-muted)]">{g.note}</span>}
                <div className="flex min-h-[var(--size-control-default)] items-center">
                  {g.sample.kind === "type" ? (
                    <Sample kind="type" role={g.sample.role}>
                      {g.sample.parts ? g.sample.parts.join(" · ") : g.sample.text}
                    </Sample>
                  ) : (
                    <Sample kind={g.sample.kind} value={g.sample.value} note={g.sample.note} />
                  )}
                </div>
                <TokenApi rows={g.api} />
              </div>
              <div className="flex min-w-0 flex-col gap-[var(--space-gap-tight)]">
                {g.rules.map((r, k) => (
                  <Rule key={k} {...r} />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Frame>
    </div>
  );
}
