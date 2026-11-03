// The active scheme's sample content. Every story shows that scheme's own words, data and status
// meanings. A component the scheme does not carry still renders in its tokens (OD-192); the docs page
// says it is not part of the scheme.
import type { ReactNode } from "react";
import { useScheme } from "./scheme-context";
import { SCHEMES, type Samples } from "./schemes";

export type { Samples };

/** The tone a status label maps to, from its meaning in the scheme. */
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
  sonner: "messages",
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
