/**
 * ModePreview: a small screen built from the scheme's own Card, Badge and Button, shown once in each
 * mode of a brand. Each copy sits in a mode scope (data-mode), so the scheme's tokens paint it; the
 * data holds only the content. The data follows doc-composites/schemas/mode-preview.schema.json; the
 * page holds one line: ::mode-preview{id="aster"}
 */
import * as React from "react";
import { Badge } from "@open-ds/ui/components/badge";
import { Button } from "@open-ds/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@open-ds/ui/components/card";

export type ModePreviewData = {
  name: string;
  scenario: string;
  actions: { commit: string; cancel: string };
  statuses: {
    label: string;
    meaning: "info" | "success" | "warning" | "danger";
  }[];
  brand?: { id: string; label: string };
  modes: ("light" | "dark")[];
};

export default function ModePreview({ data }: { data: ModePreviewData }) {
  return (
    <div
      data-composite="mode-preview"
      className="grid gap-[var(--space-gap-group)] sm:grid-cols-2"
    >
      {data.modes.map((mode) => (
        <div key={mode} data-mode={mode}>
          <div
            data-brand={data.brand?.id}
            className="flex flex-col gap-[var(--space-gap-default)] rounded-[var(--radius-surface)] border-[length:var(--border-width-default)] border-[var(--color-border-default)] bg-[var(--color-surface-canvas)] p-[var(--space-inset-container)] text-[var(--color-text-primary)]"
          >
            <p className="flex justify-between text-[length:var(--type-caption-font-size)] text-[var(--color-text-secondary)]">
              <span>{mode === "light" ? "Light" : "Dark"}</span>
              {data.brand && <span>{data.brand.label}</span>}
            </p>
            <Card>
              <CardHeader>
                <CardTitle>{data.name}</CardTitle>
                <CardDescription>{data.scenario}</CardDescription>
              </CardHeader>
              {data.statuses.length > 0 && (
                <CardContent>
                  <div className="flex flex-wrap gap-[var(--space-gap-tight)]">
                    {data.statuses.map((s) => (
                      <Badge key={s.label} tone={s.meaning}>
                        {s.label}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              )}
              <CardFooter>
                <div className="flex flex-wrap gap-[var(--space-gap-tight)]">
                  <Button tabIndex={-1}>{data.actions.commit}</Button>
                  <Button variant="secondary" tabIndex={-1}>
                    {data.actions.cancel}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}
