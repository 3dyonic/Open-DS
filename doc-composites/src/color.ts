// Color math for the docs' drawings: WCAG contrast between two hex colors, and the text color that
// reads on a fill. The same rules as cli/src/docs.mjs, so a drawing agrees with the generated pages.

const channel = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

function luminance(hex: string): number {
  const c = hex.replace("#", "").slice(0, 6).match(/../g);
  if (!c) return 0;
  const [r, g, b] = c.map((x) => channel(parseInt(x, 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colors. */
export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/** Black or white, whichever reads on the fill. */
export function ink(hex: string): string {
  return /^#?[0-9a-f]{6}/i.test(hex) && contrast(hex, "#000000") > 9
    ? "#000000"
    : "#FFFFFF";
}
