// One value drawn small, as RC1 drew it on its cards: a swatch, a column or bar for a length, an
// outlined corner, type in its family, a moving dot, a lifted box, a target, a mode, an icon label, a
// quote, a count or a code path. A drawing of a value, in the scheme's tokens; the scope cards and the
// Theming page's constants use it.
import * as React from "react";
import { TriangleAlert } from "lucide-react";
import Sample from "./Sample";

const note = "[font-family:var(--type-data-font-family)] text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-muted)]";
export default function Drawn({ x }: { x: { kind: string; value: string; note?: string } }) {
  switch (x.kind) {
    case "column":
      return <i aria-hidden="true" className="w-2 rounded-[var(--radius-badge)] bg-[var(--color-action-primary)]" style={{ height: `max(3px, ${x.value})` }} />;
    case "target":
      return <i aria-hidden="true" className="rounded-[var(--radius-control)] border-2 border-dashed border-[var(--color-action-primary)]" style={{ width: x.value, height: x.value }} />;
    case "mode":
      return <i aria-hidden="true" className="h-5.5 w-7.5 rounded-[var(--radius-badge)] border border-[var(--color-border-default)]" style={{ background: x.value }} />;
    case "icon-label":
      return (
        <span className="rounded-[var(--radius-control)] border border-[var(--color-border-default)] px-[var(--space-gap-default)] text-[length:var(--type-caption-font-size)]">
          <TriangleAlert aria-hidden="true" className="inline size-3 align-baseline" /> {x.value}
        </span>
      );
    case "quote":
      return <span className="border-l-3 border-[var(--color-action-primary)] pl-[var(--space-gap-default)] text-[length:var(--type-caption-font-size)] font-semibold">{x.value}</span>;
    case "count":
      return (
        <span className="flex items-baseline gap-[var(--space-gap-tight)] text-[length:var(--type-caption-font-size)]">
          <b className="text-[length:var(--type-title-font-size)] text-[color:var(--color-action-primary)]">{x.value}</b>
          <span className="font-semibold">{x.note}</span>
        </span>
      );
    case "color":
      return <i aria-hidden="true" className="size-5.5 rounded-[var(--radius-badge)] border border-[var(--color-border-default)]" style={{ background: x.value }} />;
    case "bar":
      return <i aria-hidden="true" className="h-2.5 rounded-[var(--radius-badge)] bg-[var(--color-action-primary)] opacity-80" style={{ width: x.value }} />;
    case "radius":
      return <i aria-hidden="true" className="h-5.5 w-7.5 border-2 border-[var(--color-action-primary)]" style={{ borderRadius: x.value }} />;
    case "font":
      return <span aria-hidden="true" className="text-2xl leading-none font-semibold" style={{ fontFamily: x.value }}>Aa</span>;
    case "shadow":
      return <i aria-hidden="true" className="h-6.5 w-10 rounded-[var(--radius-control)] border border-[var(--color-border-default)] bg-[var(--color-surface-raised)]" style={{ boxShadow: x.value }} />;
    case "duration":
      return (
        <>
          <i aria-hidden="true" className="ods-slide size-2.5 rounded-full bg-[var(--color-action-primary)]" style={{ ["--ods-d" as string]: x.value }} />
          {x.note && <span className={note}>{x.note}</span>}
        </>
      );
    case "text":
      return <span className={note}>{x.value}</span>;
    case "code":
      return <code className="text-[length:var(--type-caption-font-size)]">{x.value}</code>;
    default:
      return <Sample kind={x.kind} value={x.value} />;
  }
}

