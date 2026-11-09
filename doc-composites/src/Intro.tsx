/**
 * Intro: how to read a page. An optional robot, a title, the page's own words and links, and a few
 * counts. Built from the scheme's Card, used through its props only. The words stay Markdown in the
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

export type IntroProps = {
  title?: string;
  // "44 Primitives|30 In use": each count and what it counts.
  stats?: string;
  // The robot's day and night pictures; the docs resolve them from the robot's name.
  robot?: { day: string; night: string };
  children?: React.ReactNode;
};

export default function Intro({ title, stats, robot, children }: IntroProps) {
  const counts = (stats ?? "")
    .split("|")
    .filter(Boolean)
    .map((s) => /^(\S+)\s+(.*)$/.exec(s.trim()) ?? [s, s, ""]);
  return (
    <div data-composite="intro">
      <Card>
        <div className="grid items-start gap-[var(--space-gap-group)] sm:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-[var(--space-gap-default)]">
            {title && (
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
            )}
            <CardContent>{children}</CardContent>
            {counts.length > 0 && (
              <div className="flex flex-wrap gap-[var(--space-gap-tight)]">
                {counts.map(([, n, what]) => (
                  <span
                    key={what}
                    className="grid rounded-[var(--radius-container)] border border-[var(--color-border-default)] px-[var(--space-inset-control-x)] text-[length:var(--type-caption-font-size)] text-[var(--color-text-muted)]"
                  >
                    <b className="text-[length:var(--type-title-font-size)] text-[var(--color-text-primary)]">
                      {n}
                    </b>
                    {what}
                  </span>
                ))}
              </div>
            )}
          </div>
          {robot && (
            <span aria-hidden="true" className="w-32 justify-self-center">
              <img
                src={robot.day}
                alt=""
                loading="lazy"
                className="dark:hidden"
              />
              <img
                src={robot.night}
                alt=""
                loading="lazy"
                className="hidden dark:block"
              />
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}
