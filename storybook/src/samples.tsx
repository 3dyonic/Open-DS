// The active scheme's sample content. Every story shows that scheme's own words, data and status
// meanings. A component the scheme does not carry still renders in its tokens (OD-192); the docs page
// says it is not part of the scheme.
import type { ReactNode } from "react";
import { useScheme } from "./scheme-context";
import { SCHEMES, type Samples } from "./schemes";

export type { Samples };

/** The tone a status label maps to, from its meaning in the scheme. */
/**
 * The first variant this scheme uses on an axis, so an example stays inside its decisions (OD-214):
 * Dense data's Item shows default, Accessible first's shows outline. A component the scheme leaves
 * out has no decisions, so it shows the fallback.
 */
export function useVariant(component: string, axis: string, fallback: string): string {
  const { scheme } = useScheme();
  const data = SCHEMES[scheme] ?? SCHEMES["dense-data"];
  const item = (data.inventory.in as Carried[]).find((i) => i.id === component);
  return Object.entries(item?.variants?.[axis] ?? {}).find(([, d]) => !d.not_used)?.[0] ?? fallback;
}
type Carried = { id: string; variants?: Record<string, Record<string, { not_used?: boolean }>> };

export const toneOf = (s: Samples, label: string) => s.statuses.find((x) => x.label === label)?.meaning ?? "neutral";

// The samples part each component's examples read.
const PART: Record<string, keyof Samples> = {
  badge: "statuses",
  card: "card",
  checkbox: "checkbox",
  dialog: "confirm",
  "dropdown-menu": "menu",
  select: "select",
  switch: "switches",
  table: "table",
  tabs: "tabs",
  toast: "messages",
  tooltip: "icon_action",
  attachment: "conversation",
  bubble: "conversation",
  marker: "conversation",
  message: "conversation",
  "message-scroller": "conversation",
  item: "menu",
  "button-group": "actions",
  menubar: "menu",
  "hover-card": "card",
};

export function Show({ component, children }: { component: string; children: (s: Samples) => ReactNode }) {
  const { scheme } = useScheme();
  const data = SCHEMES[scheme] ?? SCHEMES["dense-data"];
  if (PART[component] && !data.samples[PART[component]])
    return (
      <p className="text-[var(--color-text-secondary)]">{data.name} has no sample content for this component yet.</p>
    );
  return <>{children(data.samples)}</>;
}
