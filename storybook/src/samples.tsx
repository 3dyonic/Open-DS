// The active scheme's sample content and inventory. Every story shows that scheme's own words, data
// and status meanings, and says so when the scheme does not carry the component.
import type { ReactNode } from "react";
import { useScheme } from "./scheme-context";
import { SCHEMES, type Samples } from "./schemes";

export type { Samples };

/** The tone a status label maps to, from its meaning in the scheme. */
export const toneOf = (s: Samples, label: string) => s.statuses.find((x) => x.label === label)?.meaning ?? "neutral";

export function Show({ component, children }: { component: string; children: (s: Samples) => ReactNode }) {
  const { scheme } = useScheme();
  const data = SCHEMES[scheme] ?? SCHEMES["dense-data"];
  if (!data.inventory.in.some((i) => i.id === component)) {
    const out = data.inventory.out.find((i) => i.id === component);
    return (
      <p className="max-w-xl border-l-[length:var(--border-width-focus)] border-[var(--color-border-strong)] pl-[var(--space-gap-group)] text-[var(--color-text-secondary)]">
        {data.name} does not carry this component. {out?.why ?? "It is not in its inventory."}
      </p>
    );
  }
  return <>{children(data.samples)}</>;
}
