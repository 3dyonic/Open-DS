/**
 * Fold: a section that opens and closes, around the page's own Markdown. One fold per section of the
 * Decision reference; the docs open one at a time and follow the address (src/clientModules/scales.ts
 * reads the odv-qsec hooks). Built from the scheme's Card, used through its props only:
 *
 *   :::fold{id="people" title="People" note="5 answers, 12 decisions"}
 *   …
 *   :::
 */
import * as React from "react";
import { Card } from "@open-ds/ui/components/card";

export type FoldProps = {
  id: string;
  title: string;
  note?: string;
  children?: React.ReactNode;
};

export default function Fold({ id, title, note, children }: FoldProps) {
  return (
    <section id={id} data-composite="fold" className="odv-qsec">
      <button
        type="button"
        className="odv-qsec-h"
        aria-expanded="false"
        aria-controls={`${id}-body`}
      >
        <span className="odv-qsec-t">{title}</span>
        {note && <span className="odv-qsec-n">{note}</span>}
      </button>
      <div className="odv-qsec-b" id={`${id}-body`} hidden>
        <Card>{children}</Card>
      </div>
    </section>
  );
}
