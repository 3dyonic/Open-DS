/**
 * Fold: a section that opens and closes, around the page's own Markdown. One fold per section of the
 * Decision reference; the docs open one at a time and follow the address (src/clientModules/scales.ts
 * reads the data-fold hooks). Built on the Frame base form and the scheme's Card, used through its
 * props only:
 *
 *   :::fold{id="people" title="People" note="5 answers, 12 decisions"}
 *   …
 *   :::
 */
import * as React from "react";
import { Card } from "@open-ds/ui/components/card";
import Frame from "./base/Frame";

export type FoldProps = {
  id: string;
  title: string;
  note?: string;
  children?: React.ReactNode;
};

export default function Fold({ id, title, note, children }: FoldProps) {
  return (
    <section id={id} data-composite="fold" data-fold="" className="scroll-mt-20">
      <Frame inset={false}>
        <button
          type="button"
          data-fold-head=""
          aria-expanded="false"
          aria-controls={`${id}-body`}
          className="m-0 box-border flex w-full cursor-pointer appearance-none items-baseline gap-2.5 rounded-[var(--radius-surface)] border-0 bg-transparent px-4 py-3 text-start text-[color:inherit] [font:inherit] before:text-[color:var(--color-text-muted)] before:content-['▸'] focus-visible:outline-[length:var(--border-width-focus)] focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)] focus-visible:outline-solid aria-expanded:before:content-['▾']"
        >
          <span className="flex-1 font-bold">{title}</span>
          {note && <span className="text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-secondary)]">{note}</span>}
        </button>
        <div data-fold-body="" id={`${id}-body`} hidden>
          <Card>
            {/* Each answer starts at its question; a line runs between answers, edge to edge. */}
            <div className="flex flex-col [&>h4:not(:first-child)]:mx-[calc(var(--card-padding)*-1)]! [&>h4:not(:first-child)]:mt-[var(--space-gap-group)]! [&>h4:not(:first-child)]:border-t [&>h4:not(:first-child)]:border-[var(--color-border-default)] [&>h4:not(:first-child)]:px-[var(--card-padding)] [&>h4:not(:first-child)]:pt-[var(--space-gap-group)] [&>h4]:mb-[var(--space-gap-default)]!">
              {children}
            </div>
          </Card>
        </div>
      </Frame>
    </section>
  );
}
