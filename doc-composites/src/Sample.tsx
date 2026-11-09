/**
 * Sample: one value drawn inline, inside a Markdown table or list, such as a color swatch, a corner, a
 * bar for a length, type at a size, or a shadow. The value is the attribute; the page stays Markdown:
 *
 *   | `space.16` | 1rem | :sample{kind="bar" value="1rem"} |
 *   - :sample[Your answers are saved]{kind="type" role="body"} `type.body`
 *
 * This is a drawing of a value, so it shows it; its look comes from the docs' sample styles.
 */
import * as React from "react";

export type SampleProps = {
  kind: string;
  value?: string;
  // tone: the text color on the swatch. type: the role whose type tokens set the line.
  ink?: string;
  role?: string;
  // leading: the line height in pixels, shown beside it.
  note?: string;
  children?: React.ReactNode;
};

type Drawn = {
  cls: string;
  style?: React.CSSProperties;
  text?: string;
  inner?: boolean;
  title?: string;
};

const DRAW: Record<string, (v: string, p: SampleProps) => Drawn> = {
  color: (v) => ({ cls: "ods-swatch", style: { background: v } }),
  opacity: (v) => ({ cls: "ods-swatch", style: { opacity: v } }),
  font: (v) => ({ cls: "ods-font", style: { fontFamily: v }, text: "Aa 123" }),
  weight: (v) => ({
    cls: "ods-typesample",
    style: { fontWeight: v as React.CSSProperties["fontWeight"] },
    text: "Aa",
  }),
  size: (v) => ({ cls: "ods-typesample", style: { fontSize: v }, text: "Aa" }),
  tracking: (v) => ({
    cls: "ods-typesample",
    style: { letterSpacing: v },
    text: "Aa Aa",
  }),
  shadow: (v) => ({ cls: "ods-card", style: { boxShadow: v } }),
  radius: (v) => ({ cls: "ods-tile", style: { borderRadius: v } }),
  line: (v) => ({ cls: "ods-line", style: { height: v } }),
  bar: (v) => ({ cls: "ods-bar", style: { width: v } }),
  duration: (v) => ({
    cls: "ods-motion",
    style: { ["--ods-d" as string]: v },
    inner: true,
    title: "Hover to play",
  }),
  easing: (v) => ({
    cls: "ods-motion",
    style: { ["--ods-e" as string]: v },
    inner: true,
    title: "Hover to play",
  }),
};

export default function Sample({
  kind,
  value = "",
  ink,
  role,
  note,
  children,
}: SampleProps) {
  if (kind === "leading")
    return (
      <span
        data-composite="sample"
        className="ods-leading"
        style={{ lineHeight: value }}
        data-h={note}
      >
        Ag Ag Ag
      </span>
    );
  // A color with text on it, as the theme tables show a key color.
  if (kind === "tone")
    return (
      <i
        data-composite="sample"
        className="inline-flex items-center justify-center rounded-[var(--radius-badge)] px-[var(--space-gap-tight)] not-italic"
        style={{ background: value, color: ink }}
      >
        Aa
      </i>
    );
  // A small dot of color beside its name.
  if (kind === "dot")
    return (
      <i
        data-composite="sample"
        className="inline-block size-[var(--type-caption-font-size)] rounded-[var(--radius-round)] border border-[var(--color-border-default)] align-middle"
        style={{ background: value }}
        aria-hidden="true"
      />
    );
  // A line of type set in a role's own tokens.
  if (kind === "type" && role)
    return (
      <span
        data-composite="sample"
        className="ods-typeline"
        style={{
          fontFamily: `var(--type-${role}-font-family)`,
          fontSize: `var(--type-${role}-font-size)`,
          lineHeight: `var(--type-${role}-line-height)`,
          fontWeight:
            `var(--type-${role}-font-weight)` as React.CSSProperties["fontWeight"],
        }}
      >
        {children}
      </span>
    );
  const d = DRAW[kind]?.(value, { kind, value, ink, role, note });
  if (!d) return null;
  return (
    <span
      data-composite="sample"
      className={d.cls}
      style={d.style}
      title={d.title}
    >
      {d.text}
      {d.inner && <span />}
    </span>
  );
}
