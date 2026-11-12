/**
 * Group: a run of sections under one short caption, such as the Reasons and Scopes on the Decision
 * reference. Built on the Caption base form, the group's heading. The data follows
 * doc-composites/schemas/group.schema.json; the sections stay in the page:
 *
 *   ::::group{id="reasons"}
 *   :::fold{…}
 *   :::
 *   ::::
 */
import * as React from "react";
import Caption from "./base/Caption";

export type GroupData = { title: string };

export default function Group({ data, children }: { data: GroupData; children?: React.ReactNode }) {
  return (
    <section data-composite="group" className="flex flex-col gap-[var(--space-gap-group)]">
      <Caption>{data.title}</Caption>
      {children}
    </section>
  );
}
