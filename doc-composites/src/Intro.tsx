/**
 * Intro: how to read a page. An optional robot, a title, the page's own words and links, and a few
 * counts. The robot is the Robot base form. With a title it is the scheme's Card, used through its props only; without one it is layout. The words stay Markdown in the
 * page, inside the directive:
 *
 *   :::intro{robot="anatomy" title="Look closer, when you want to" stats="6 Parts|3 Jobs"}
 *   This page takes the button apart …
 *   :::
 */
import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@open-ds/ui/components/card";
import Robot, { type RobotPics } from "./base/Robot";

export type IntroProps = {
  title?: string;
  // "44 Primitives|30 In use": each count and what it counts.
  stats?: string;
  // The robot's day and night pictures; the docs resolve them from the robot's name.
  robot?: RobotPics;
  children?: React.ReactNode;
};

export default function Intro({ title, stats, robot, children }: IntroProps) {
  const counts = (stats ?? "")
    .split("|")
    .filter(Boolean)
    .map((s) => /^(\S+)\s+(.*)$/.exec(s.trim()) ?? [s, s, ""]);
  // An intro with a title is a card that says how to read the page, its robot on the left.
  if (title)
    return (
      <div data-composite="intro">
        <Card>
          <div className="grid items-center gap-[var(--space-gap-section)] sm:grid-cols-[auto_1fr]">
            {robot && <Robot robot={robot} className="w-42 justify-self-center" />}
            <div className="flex flex-col gap-[var(--space-gap-default)]">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>{children}</CardContent>
            </div>
          </div>
        </Card>
      </div>
    );
  // Without a title it opens a section page: the words and the counts, the robot on the right.
  return (
    <div data-composite="intro" className="grid items-center gap-[var(--space-gap-section)] sm:grid-cols-[1fr_auto]">
      <div className="flex flex-col gap-[var(--space-gap-default)]">
        {children}
        {counts.length > 0 && (
          <div className="flex flex-wrap gap-[var(--space-gap-default)]">
            {counts.map(([, n, what]) => (
              <span
                key={what}
                className="grid rounded-[var(--radius-surface)] border border-[var(--color-border-default)] px-[var(--space-gap-group)] py-[var(--space-gap-default)] [font-family:var(--type-data-font-family)] text-[length:var(--type-caption-font-size)] uppercase text-[color:var(--color-text-muted)]"
              >
                <b className="[font-family:var(--type-display-font-family)] text-[length:var(--type-title-font-size)] normal-case text-[color:var(--color-text-primary)]">
                  {n}
                </b>
                {what}
              </span>
            ))}
          </div>
        )}
      </div>
      {robot && <Robot robot={robot} className="size-45 justify-self-center [&_img]:max-h-full" />}
    </div>
  );
}
