/**
 * Caption: a short name over a run of content, in small capitals in the data face. A base form: the
 * groups on the Decision reference and each brand's set extend it. It is the run's heading.
 */
import * as React from "react";

export default function Caption({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="m-0 text-[length:var(--type-caption-font-size)] font-normal tracking-wider text-[color:var(--color-text-muted)] uppercase [font-family:var(--type-data-font-family)]">
      {children}
    </h3>
  );
}
