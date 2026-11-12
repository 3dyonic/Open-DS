/**
 * Hero: a scheme's home page opening. A line above the name, the page's own heading and summary in
 * Markdown, one action as the scheme's Button, a few counts, the robot (the Robot base form) and the
 * scheme's sample screen.
 *
 *   :::hero{eyebrow="Design system · built from 79 answered questions" action="Explore the foundations" href="foundations/" stats="41 components|174 primitives|2 themes"}
 *   # Accessible first
 *   …
 *   :::
 */
import * as React from "react";
import { Button } from "@open-ds/ui/components/button";
import Robot, { type RobotPics } from "./base/Robot";

export type HeroProps = {
  eyebrow?: string;
  action?: string;
  href?: string;
  stats?: string;
  robot?: RobotPics;
  children?: React.ReactNode;
};

export default function Hero({
  eyebrow,
  action,
  href,
  stats,
  robot,
  children,
}: HeroProps) {
  const counts = (stats ?? "")
    .split("|")
    .filter(Boolean)
    .map((s) => /^(\S+)\s+(.*)$/.exec(s.trim()) ?? [s, s, ""]);
  return (
    <div
      data-composite="hero"
      className="grid items-start gap-[var(--space-gap-section)] lg:grid-cols-2"
    >
      <div className="flex flex-col gap-[var(--space-gap-default)]">
        {robot && <Robot robot={robot} className="w-32" />}
        {eyebrow && (
          <span className="text-[length:var(--type-caption-font-size)] text-[var(--color-text-secondary)]">
            {eyebrow}
          </span>
        )}
        {children}
        {action && href && (
          <span>
            <Button asChild>
              <a href={href}>{action}</a>
            </Button>
          </span>
        )}
        {counts.length > 0 && (
          <div className="flex flex-wrap gap-[var(--space-gap-group)]">
            {counts.map(([, n, what]) => (
              <div key={what} className="flex flex-col">
                <b className="text-[length:var(--type-title-font-size)]">{n}</b>
                <span className="text-[length:var(--type-caption-font-size)]">
                  {what}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
