// The small picture on each scope card (Figma 117:1088 to 117:1177), drawn with the scheme's
// own tokens through data-scheme.
import { Check } from "lucide-react";
import type { Scheme } from "@/lib/schemes";

const box =
  "flex h-[72px] w-full shrink-0 items-center gap-[6px] overflow-hidden rounded-[6px] bg-[#f7f8fa] px-3 md:w-[220px]";

export function ScopeMini({
  scheme,
  scope,
  toast,
}: {
  scheme: Scheme;
  scope: string;
  toast: string;
}) {
  const brand = Object.keys(scheme.tokens.brands);
  const v = (name: string) => `var(--${name})`;
  const base = scheme.tokens.semantic.base as {
    motion: { duration: { feedback: { $value: string } } };
  };
  const speed = base.motion.duration.feedback.$value.replace(/[{}]/g, "").split(".").pop();
  const body = (() => {
    switch (scope) {
      case "typography":
        return ["caption", "body", "heading", "title"].map((r) => (
          <span
            key={r}
            style={{
              fontFamily: v(`type-${r}-font-family`),
              fontSize: v(`type-${r}-font-size`),
              fontWeight: v(`type-${r}-font-weight`),
            }}
          >
            Aa
          </span>
        ));
      case "color":
        return [
          "color-text-primary",
          "color-text-secondary",
          "color-border-default",
          "color-action-primary",
          "color-status-success",
          "color-status-warning",
          "color-status-danger",
        ].map((c) => (
          <span key={c} className="size-5 rounded-[3px]" style={{ background: v(c) }} />
        ));
      case "spacing":
        return [
          "space-gap-tight",
          "space-gap-default",
          "space-inset-control-x",
          "space-gap-group",
          "space-inset-container",
          "space-gap-section",
        ].map((s) => (
          <span
            key={s}
            className="w-3 self-end bg-[var(--color-action-primary)]"
            style={{ height: `min(${v(s)}, 56px)`, marginBottom: 8 }}
          />
        ));
      case "shape":
        return ["radius-control", "radius-badge", "radius-container"].map((r) => (
          <span
            key={r}
            className="size-11 border-[length:var(--border-width-default)] border-[var(--color-border-strong)] bg-[var(--color-surface-default)]"
            style={{ borderRadius: v(r) }}
          />
        ));
      case "elevation":
        return ["elevation-card", "elevation-overlay"].map((e) => (
          <span
            key={e}
            className="h-10 w-16 rounded-[var(--radius-container)] bg-[var(--color-surface-default)]"
            style={{ boxShadow: v(e) }}
          />
        ));
      case "motion":
        return (
          <>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-[14px] rounded-full bg-[var(--color-action-primary)]"
                style={{ opacity: 0.4 + i * 0.3 }}
              />
            ))}
            <span className="font-mono text-[12px] text-muted">{speed}</span>
          </>
        );
      case "iconography":
        return (
          <span className="flex items-center gap-2 text-[length:var(--type-body-font-size)]">
            <Check style={{ width: v("size-icon"), height: v("size-icon") }} /> Saved
          </span>
        );
      case "theming":
        return brand.map((b) => (
          <span key={b} data-brand={b} className="flex gap-[3px]">
            <span className="size-5 rounded-[3px] bg-[var(--color-action-primary)]" />
            <span className="dark size-5 rounded-[3px] bg-[var(--color-surface-default)]" />
          </span>
        ));
      case "accessibility":
        return (
          <span
            className="flex items-center justify-center rounded-[var(--radius-control)] border-[length:var(--border-width-focus)] border-[var(--color-border-focus)] px-2"
            style={{ height: v("size-control-default") }}
          >
            <span className="text-[12px]">target</span>
          </span>
        );
      case "naming":
        return <span className="font-mono text-[12px] text-muted">button/primary/background</span>;
      case "voice":
        return <span className="text-[13px]">“{toast}”</span>;
      default:
        return null;
    }
  })();
  return (
    <span
      data-scheme={scheme.id}
      data-brand={brand.length > 1 ? brand[0] : undefined}
      className={`${box} text-[var(--color-text-primary)] [font-family:var(--type-body-font-family)]`}
    >
      {body}
    </span>
  );
}
