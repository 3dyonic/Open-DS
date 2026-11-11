/**
 * ModePreview: a small screen built from the scheme's own Card, Badge and Button, shown once in each
 * mode of a brand, each on the Frame base form's canvas. Each copy sits in a mode scope (data-mode),
 * so the scheme's tokens paint it; the data holds only the content. The data follows doc-composites/schemas/mode-preview.schema.json; the
 * page holds one line: ::mode-preview{id="aster"}
 */
import * as React from "react";
import { Badge } from "@open-ds/ui/components/badge";
import { Button } from "@open-ds/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@open-ds/ui/components/card";
import Columns from "./base/Columns";
import Frame from "./base/Frame";

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
    <div data-composite="mode-preview">
      <Columns gap="group">
        {data.modes.map((mode) => (
          <div key={mode} data-mode={mode}>
            <div data-brand={data.brand?.id}>
              <Frame variant="canvas">
                <div className="flex flex-col gap-[var(--space-gap-default)]">
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
              </Frame>
            </div>
          </div>
        ))}
      </Columns>
    </div>
  );
}
