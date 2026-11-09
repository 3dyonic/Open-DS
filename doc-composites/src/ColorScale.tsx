/**
 * ColorScale: one color family of a scheme in each mode. Every step of the scale, the steps its tokens
 * use filled in, and one row per token: what it paints (a background, an edge or ring, or text), the
 * step it points at and its value. Pointing at a row lights its step, and the other way round. Built
 * from the scheme's Tabs and Card, used through their props only; the steps are drawings of values.
 * The data follows doc-composites/schemas/color-scale.schema.json; the page holds one line:
 * ::color-scale{id="blue"}
 */
import * as React from "react";
import { Card, CardContent } from "@open-ds/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@open-ds/ui/components/tabs";
import { contrast, ink } from "./color";

type Paints = "fill" | "edge" | "text";
type Token = {
  token: string;
  paints: Paints;
  step?: string;
  primitive: string;
  via?: string;
  hex: string;
  brands?: string[];
  guidance?: string;
};
type Mode = {
  mode: "light" | "dark";
  page: {
    canvas: string;
    text: string;
    muted: string;
    border: string;
    inverse: string;
  };
  steps: { step: string; primitive: string; hex: string }[];
  tokens: Token[];
};
export type ColorScaleData = { family: string; modes: Mode[] };

const LANES: { paints: Paints; title: string }[] = [
  { paints: "fill", title: "Backgrounds" },
  { paints: "edge", title: "Edges and rings" },
  { paints: "text", title: "Text" },
];
const label =
  "text-[length:var(--type-caption-font-size)] font-semibold uppercase tracking-wide";
const small =
  "text-[length:var(--type-caption-font-size)] [font-family:var(--type-data-font-family)]";

function Step({
  s,
  paints,
  page,
  on,
  lit,
  onLight,
}: {
  s: Mode["steps"][number];
  paints: Paints | null;
  page: Mode["page"];
  on: boolean;
  lit: boolean;
  onLight: (on: boolean) => void;
}) {
  const ring = lit ? "ring-2 ring-[var(--color-border-focus)]" : "";
  const box = `flex min-h-24 flex-col whitespace-nowrap gap-[var(--space-gap-tight)] rounded-[var(--radius-option)] p-[var(--space-gap-tight)] ${small} ${ring}`;
  if (!on || !paints)
    return (
      <div
        className={`${box} border border-dashed`}
        style={{ borderColor: page.muted, color: page.muted }}
      >
        <span>{s.step}</span>
        <span
          aria-hidden="true"
          className="mt-auto size-[var(--type-body-font-size)] rounded-[var(--radius-badge)]"
          style={{ background: s.hex }}
        />
      </div>
    );
  const hover = {
    onMouseEnter: () => onLight(true),
    onMouseLeave: () => onLight(false),
  };
  if (paints === "fill")
    return (
      <div
        className={box}
        style={{ background: s.hex, color: ink(s.hex) }}
        {...hover}
      >
        <b>{s.step}</b>
        <span>{s.hex}</span>
      </div>
    );
  if (paints === "edge")
    return (
      <div
        className={`${box} border`}
        style={{ borderColor: page.border, color: page.muted }}
        {...hover}
      >
        <b>{s.step}</b>
        <span>{s.hex}</span>
        <span
          aria-hidden="true"
          className="mt-auto h-[var(--type-title-font-size)] w-[var(--space-gap-tight)] rounded-[var(--radius-badge)]"
          style={{ background: s.hex }}
        />
      </div>
    );
  // Text shows on the page, or on the page's text color when it is a label for dark fills.
  const ground =
    contrast(s.hex, page.canvas) < 3
      ? contrast(s.hex, page.text) >= 3
        ? page.text
        : page.inverse
      : undefined;
  return (
    <div
      className={`${box} border`}
      style={{ borderColor: page.border, color: s.hex, background: ground }}
      {...hover}
    >
      <b>{s.step}</b>
      <span>{s.hex}</span>
      <b className="mt-auto text-[length:var(--type-title-font-size)]">Aa</b>
    </div>
  );
}

function Row({
  t,
  lit,
  onLight,
}: {
  t: Token;
  lit: boolean;
  onLight: (on: boolean) => void;
}) {
  const inner = (
    <>
      <span
        aria-hidden="true"
        className="size-[var(--type-body-font-size)] shrink-0 rounded-[var(--radius-badge)] border"
        style={{ background: t.hex }}
      />
      <span className={small}>{t.token}</span>
      {t.brands && <span className={small}>{t.brands.join(", ")}</span>}
      <span className={`ml-auto ${small}`}>
        <b>{t.primitive}</b>
        {t.via && ` via ${t.via}`} {t.hex}
      </span>
    </>
  );
  const cls = `flex items-center gap-[var(--space-gap-tight)] rounded-[var(--radius-option)] px-[var(--space-gap-tight)] py-[var(--space-gap-tight)] no-underline text-[inherit] ${lit ? "ring-2 ring-[var(--color-border-focus)]" : ""}`;
  const hover = {
    onMouseEnter: () => onLight(true),
    onMouseLeave: () => onLight(false),
    onFocus: () => onLight(true),
    onBlur: () => onLight(false),
  };
  return t.guidance ? (
    <a className={cls} href={t.guidance} {...hover}>
      {inner}
    </a>
  ) : (
    <div className={cls} tabIndex={0} {...hover}>
      {inner}
    </div>
  );
}

function Panel({ m }: { m: Mode }) {
  // The lane and step a row or step points at, lit while pointed at.
  const [lit, setLit] = React.useState<string | null>(null);
  const light = (key: string) => (on: boolean) => setLit(on ? key : null);
  const own = m.tokens.filter((t) => t.step);
  const fixed = m.tokens.filter((t) => !t.step);
  return (
    <div
      className="flex flex-col gap-[var(--space-gap-group)] overflow-x-auto rounded-[var(--radius-container)] p-[var(--space-inset-container)]"
      style={{ background: m.page.canvas, color: m.page.text }}
    >
      {LANES.map(({ paints, title }) => {
        const list = own.filter((t) => t.paints === paints);
        if (!list.length) return null;
        const used = new Set(list.map((t) => t.step));
        return (
          <section
            key={paints}
            className="flex flex-col gap-[var(--space-gap-tight)]"
          >
            <h4 className={label} style={{ color: m.page.muted }}>
              {title}
            </h4>
            <div
              className="grid gap-[var(--space-gap-tight)]"
              style={{
                gridTemplateColumns: m.steps
                  .map((s) =>
                    used.has(s.step)
                      ? "minmax(min-content, 3fr)"
                      : "minmax(min-content, 1fr)",
                  )
                  .join(" "),
              }}
            >
              {m.steps.map((s) => (
                <Step
                  key={s.step}
                  s={s}
                  paints={paints}
                  page={m.page}
                  on={used.has(s.step)}
                  lit={lit === `${paints}-${s.step}`}
                  onLight={light(`${paints}-${s.step}`)}
                />
              ))}
            </div>
            <div className="flex flex-col">
              {list.map((t) => (
                <Row
                  key={`${t.token}|${t.primitive}`}
                  t={t}
                  lit={lit === `${paints}-${t.step}`}
                  onLight={light(`${paints}-${t.step}`)}
                />
              ))}
            </div>
          </section>
        );
      })}
      {own.length === 0 && (
        <section className="flex flex-col gap-[var(--space-gap-tight)]">
          <h4 className={label} style={{ color: m.page.muted }}>
            Not used yet in this theme
          </h4>
          <div
            className="grid gap-[var(--space-gap-tight)]"
            style={{
              gridTemplateColumns: `repeat(${m.steps.length}, minmax(min-content, 1fr))`,
            }}
          >
            {m.steps.map((s) => (
              <Step
                key={s.step}
                s={s}
                paints={null}
                page={m.page}
                on={false}
                lit={false}
                onLight={() => {}}
              />
            ))}
          </div>
        </section>
      )}
      {fixed.length > 0 && (
        <section className="flex flex-col gap-[var(--space-gap-tight)]">
          <h4 className={label} style={{ color: m.page.muted }}>
            From the {m.mode === "light" ? "dark" : "light"} scale, fixed colors
          </h4>
          {fixed.map((t) => (
            <Row
              key={`${t.token}|${t.primitive}`}
              t={t}
              lit={false}
              onLight={() => {}}
            />
          ))}
        </section>
      )}
    </div>
  );
}

export default function ColorScale({
  data,
  mode = "light",
}: {
  data: ColorScaleData;
  mode?: "light" | "dark";
}) {
  const start = data.modes.some((m) => m.mode === mode)
    ? mode
    : data.modes[0].mode;
  return (
    <div data-composite="color-scale">
      <Card>
        <Tabs defaultValue={start}>
          <TabsList>
            {data.modes.map((m) => (
              <TabsTrigger key={m.mode} value={m.mode}>
                {m.mode === "light" ? "Light theme" : "Dark theme"}
              </TabsTrigger>
            ))}
          </TabsList>
          {data.modes.map((m) => (
            <TabsContent key={m.mode} value={m.mode}>
              <CardContent>
                <Panel m={m} />
              </CardContent>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}
