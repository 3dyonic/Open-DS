// This design system's sample content and inventory (scheme.json). Every story shows its own words,
// data and status meanings, and says so when the system does not carry the component.
import type { ReactNode } from "react";
import scheme from "../scheme.json";

type Status = { label: string; meaning: "neutral" | "success" | "warning" | "danger"; why: string };
export interface Samples {
  screen: string;
  actions: { primary: string; secondary: string };
  statuses: Status[];
  table?: { caption: string; columns: { label: string; numeric?: boolean }[]; rows: { cells: string[]; status: string }[] };
  metrics: { label: string; value: string }[];
  field: { label: string; placeholder: string; hint: string; error: string; invalid: string };
  checkbox?: string[];
  select?: { label: string; options: string[]; value: string };
  switches?: string[];
  messages?: { success: string; error: { title: string; description: string }; neutral: string };
  confirm?: { trigger: string; title: string; body: string; confirm: string; cancel: string };
  card?: { title: string; description: string; status: string; primary: string; secondary: string };
  tabs?: { label: string; content: string }[];
  menu?: { trigger: string; items: string[]; destructive: string };
  icon_action?: string;
}
const data = scheme as unknown as {
  name: string;
  inventory: { in: { id: string }[]; out: { id: string; why: string }[] };
  samples: Samples;
};

/** The tone a status label maps to, from its meaning in the scheme. */
export const toneOf = (s: Samples, label: string) => s.statuses.find((x) => x.label === label)?.meaning ?? "neutral";

export function Show({ component, children }: { component: string; children: (s: Samples) => ReactNode }) {
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
