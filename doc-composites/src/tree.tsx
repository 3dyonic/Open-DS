// The connector lines of a tree: each branch hangs from a line on its left. A drawing, in the
// scheme's border token; the composites put their content in each twig.
import * as React from "react";

export function Tree({ children, root = false }: { children: React.ReactNode; root?: boolean }) {
  return (
    <ul className={`m-0 flex list-none flex-col p-0 ${root ? "" : "ml-[var(--space-gap-default)]"}`}>
      {children}
    </ul>
  );
}

export function Twig({ children, root = false }: { children: React.ReactNode; root?: boolean }) {
  if (root) return <li className="m-0 py-[calc(var(--space-gap-tight)/2)]">{children}</li>;
  return (
    <li className="relative m-0 py-[calc(var(--space-gap-tight)/2)] pl-[var(--space-gap-group)] before:absolute before:top-0 before:bottom-0 before:left-0 before:border-l before:border-[var(--color-border-default)] before:content-[''] after:absolute after:top-[calc(1lh/2)] after:left-0 after:w-[calc(var(--space-gap-group)-var(--space-gap-tight))] after:border-t after:border-[var(--color-border-default)] after:content-[''] last:before:bottom-auto last:before:h-[calc(1lh/2)]">
      {children}
    </li>
  );
}
