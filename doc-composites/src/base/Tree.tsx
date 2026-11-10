// Tree: the connector lines of a tree. A base form: the Decision reference and the anatomy legend and steps extend it.
// Each branch hangs from a line on its left. A drawing, in the
// scheme's border token; the composites put their content in each twig. The indent and the tick come
// from the scheme's gaps.
import * as React from "react";

export function Tree({ children, root = false }: { children: React.ReactNode; root?: boolean }) {
  return (
    <ul
      className={
        root
          ? "m-0 flex list-none flex-col p-0 text-[length:var(--type-body-font-size)]"
          : "m-0 ml-[calc(var(--space-gap-group)_-_var(--space-gap-tight)/2)] flex list-none flex-col p-0 text-[length:var(--type-body-font-size)]"
      }
    >
      {children}
    </ul>
  );
}

export function Twig({ children, root = false }: { children: React.ReactNode; root?: boolean }) {
  if (root) return <li className="m-0 py-[calc(var(--space-gap-tight)/2)]">{children}</li>;
  return (
    <li className="relative m-0 py-[calc(var(--space-gap-tight)/2)] pl-[calc(var(--space-gap-group)_+_var(--space-gap-default)_-_var(--space-gap-tight)/2)] before:absolute before:top-0 before:bottom-0 before:left-0 before:border-l before:border-[var(--color-border-default)] before:content-[''] after:absolute after:top-[calc(1lh/2_+_var(--space-gap-tight)/2)] after:left-0 after:w-[calc(var(--space-gap-group)_-_var(--space-gap-tight)/2)] after:border-t after:border-[var(--color-border-default)] after:content-[''] last:before:bottom-auto last:before:h-[calc(1lh/2_+_var(--space-gap-tight)/2)]">
      {children}
    </li>
  );
}
