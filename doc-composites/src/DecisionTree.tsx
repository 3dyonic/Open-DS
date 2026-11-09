/**
 * DecisionTree: the first answers of a scheme and the answers that follow from each, down to the
 * foundation values they set. Built from the scheme's Card and Badge (through Label), used through
 * their props only; the connector lines are a drawing. The data follows
 * doc-composites/schemas/decision-tree.schema.json; the page holds one line: ::decision-tree{id="start"}
 */
import * as React from "react";
import { Card, CardContent } from "@open-ds/ui/components/card";
import Label from "./Label";
import { Tree, Twig } from "./tree";

export type DecisionNode = {
  answer: string;
  question?: string;
  also?: string[];
  scope?: { title: string; href: string; token?: string; primitive?: string; value?: string };
  children?: DecisionNode[];
};
export type DecisionTreeData = { roots: DecisionNode[] };

const muted = "text-[color:var(--color-text-muted)]";
const code = "text-[length:var(--type-caption-font-size)] [font-family:var(--type-data-font-family)]";

function Node({ node, root }: { node: DecisionNode; root?: boolean }) {
  return (
    <Twig root={root}>
      <span className="inline-flex flex-wrap items-center gap-[var(--space-gap-tight)]">
        <Label tone="info">{node.answer}</Label>
        {node.question && <span className={muted}>{node.question}</span>}
        {node.also?.length ? (
          <span className={muted}>
            also because <b className="text-[color:var(--color-text-primary)]">{node.also.join(", ")}</b>
          </span>
        ) : null}
        {node.scope && (
          <>
            <a href={node.scope.href} className={muted}>
              {node.scope.title} →
            </a>
            {node.scope.token && <code className={code}>{node.scope.token}</code>}
            {node.scope.primitive && <code className={code}>{node.scope.primitive}</code>}
            {node.scope.value && <span className={code}>: {node.scope.value}</span>}
          </>
        )}
      </span>
      {node.children?.length ? (
        <Tree>
          {node.children.map((c, i) => (
            <Node key={i} node={c} />
          ))}
        </Tree>
      ) : null}
    </Twig>
  );
}

export default function DecisionTree({ data }: { data: DecisionTreeData }) {
  return (
    <div data-composite="decision-tree">
      <Card>
        <CardContent>
          <Tree root>
            {data.roots.map((n, i) => (
              <Node key={i} node={n} root />
            ))}
          </Tree>
        </CardContent>
      </Card>
    </div>
  );
}
