/**
 * Group: a run of sections under one short caption, such as the Reasons and Scopes on the Decision
 * reference. Layout only; the caption is the group's heading:
 *
 *   ::::group{title="Reasons"}
 *   :::fold{…}
 *   :::
 *   ::::
 */
import * as React from "react";

export default function Group({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section data-composite="group" className="flex flex-col gap-[var(--space-gap-group)]">
      <h3 className="mt-[var(--space-gap-default)] mb-0 text-[length:var(--type-caption-font-size)] font-normal uppercase tracking-wider [font-family:var(--type-data-font-family)] text-[color:var(--color-text-muted)]">
        {title}
      </h3>
      {children}
    </section>
  );
}
