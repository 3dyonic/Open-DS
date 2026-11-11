/**
 * Sample: one value drawn inline, inside a Markdown table or list, such as a color swatch, a corner, a
 * bar for a length, type at a size, or a shadow. The value is the attribute; the page stays Markdown:
 *
 *   | `space.16` | 1rem | :sample{kind="bar" value="1rem"} |
 *   - :sample[Your answers are saved]{kind="type" role="body"} `type.body`
 *
 * This is a drawing of a value, so it shows it; its look comes from its own classes and the scheme's tokens.
 */
import * as React from "react";
import Swatch from "./base/Swatch";
import { Pointer } from "lucide-react";
import { Icon } from "@open-ds/ui/components/icon";

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

// The drawing of each kind of value, in the scheme's tokens. A square for a color, a corner or a lift,
// a line for a border width, a bar for a length, type for a size, weight or spacing, a moving dot for
// motion. Its value comes from the data, in the inline style.
const box = "inline-block size-6 flex-none rounded-[var(--radius-control)] border-[length:var(--border-width-default)] border-[var(--color-border-default)] align-middle";
const DRAW: Record<string, (v: string, p: SampleProps) => Drawn> = {
  opacity: (v) => ({ cls: `${box} bg-[var(--color-text-primary)]`, style: { opacity: v } }),
  font: (v) => ({ cls: "text-lg", style: { fontFamily: v }, text: "Aa 123" }),
  weight: (v) => ({
    cls: "inline-block leading-none",
    style: { fontWeight: v as React.CSSProperties["fontWeight"] },
    text: "Aa",
  }),
  size: (v) => ({ cls: "inline-block font-semibold leading-none", style: { fontSize: v }, text: "Aa" }),
  tracking: (v) => ({
    cls: "inline-block font-semibold leading-none",
    style: { letterSpacing: v },
    text: "Aa Aa",
  }),
  shadow: (v) => ({ cls: `${box} w-10 bg-[var(--color-surface-raised)]`, style: { boxShadow: v } }),
  // One corner of a 48px square, so a small corner and a large one look different: a full corner ends
  // at a quarter circle (24px) instead of turning every sample into the same circle (OD-286).
  radius: (v) => ({
    cls: "inline-block size-12 flex-none border-t-[length:var(--border-width-focus)] border-l-[length:var(--border-width-focus)] border-[var(--color-border-strong)] bg-[var(--color-surface-sunken)] align-middle",
    style: { borderTopLeftRadius: v },
  }),
  line: (v) => ({ cls: "inline-block w-6 bg-[var(--color-text-primary)] align-middle", style: { height: v } }),
  bar: (v) => ({ cls: "inline-block h-2 min-w-px rounded-[var(--radius-badge)] bg-[var(--color-action-primary)]", style: { width: v } }),
  duration: (v) => ({
    cls: motion,
    style: { ["--sample-duration" as string]: v },
    inner: true,
    title: "Hover to play",
  }),
  easing: (v) => ({
    cls: motion,
    style: { ["--sample-easing" as string]: v },
    inner: true,
    title: "Hover to play",
  }),
};
// A track with a dot that crosses it when its row is pointed at (OD-220).
const motion = "relative inline-block h-3 w-12 rounded-full bg-[var(--color-surface-sunken)] align-middle";
const dot =
  "absolute left-0 top-0 size-3 rounded-full bg-[var(--color-action-primary)] transition-[left] duration-[var(--sample-duration,320ms)] ease-[var(--sample-easing,var(--motion-easing-standard))] motion-reduce:transition-none [tr:hover_&]:left-9 [li:hover_&]:left-9";

export default function Sample({
  kind,
  value = "",
  ink,
  role,
  note,
  children,
}: SampleProps) {
  // A line height, as the line box it makes: a band exactly one line tall with an accent edge, and
  // the height in pixels beside it (OD-221).
  if (kind === "leading")
    return (
      <span
        data-composite="sample"
        className="relative isolate ml-2 mr-14 inline-block whitespace-nowrap text-base font-normal"
        style={{ lineHeight: value }}
      >
        <span
          aria-hidden="true"
          className="absolute -inset-x-1.5 top-0 -z-10 h-[1lh] border-l-3 border-[var(--color-action-primary)] bg-[var(--color-surface-selected)]"
        />
        Ag Ag Ag
        {note && (
          <span className="absolute -right-1.5 top-0 flex h-[1lh] translate-x-full items-center pl-1.5 [font-family:var(--type-data-font-family)] text-[length:var(--type-caption-font-size)] text-[color:var(--color-action-primary)]">
            {note}
          </span>
        )}
      </span>
    );
  // A control size, as the target it makes: the outer square is the control, the area a pointer or a
  // finger hits; the inner square is its content, at the icon size; the pointer cursor marks the target.
  // Neutral, so it never reads as a color swatch.
  if (kind === "target")
    return (
      <span data-composite="sample" className="inline-flex shrink-0 items-center gap-[var(--space-gap-default)]">
        <span
          aria-hidden="true"
          className="relative flex shrink-0 items-center justify-center rounded-[var(--radius-control)] border-[length:var(--border-width-default)] border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-sunken)]"
          style={{ width: value, height: value }}
        >
          <span className="size-[var(--size-icon)] rounded-[var(--radius-badge)] bg-[var(--color-border-default)]" />
          <span className="absolute -bottom-[var(--space-gap-tight)] -right-[var(--space-gap-tight)] flex text-[color:var(--color-text-primary)] [&_svg]:fill-[var(--color-surface-default)]">
            <Icon icon={Pointer} />
          </span>
        </span>
        {note && (
          <span className="[font-family:var(--type-data-font-family)] text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-secondary)]">
            {note}
          </span>
        )}
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
        className="inline-block size-[var(--type-caption-font-size)] rounded-full border border-[var(--color-border-default)] align-middle"
        style={{ background: value }}
        aria-hidden="true"
      />
    );
  // A line of type set in a role's own tokens.
  if (kind === "type" && role)
    return (
      <span
        data-composite="sample"
        className="truncate"
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
  // A color is the Swatch base form.
  if (kind === "color") return <Swatch color={value} />;
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
      {d.inner && <span className={dot} />}
    </span>
  );
}
