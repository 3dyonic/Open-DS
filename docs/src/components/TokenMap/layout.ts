// The trace's layout: one column per role of the trace (cli/src/token-trace.mjs), left to right, each
// stacked from the top. The component token column holds one box per component, with its tokens
// under it when it is expanded, split over groupColumns side by side so a long list fits the canvas.
// Heights are the boxes' measured heights once the page has drawn them, else an estimate.
export const NODE_WIDTH = 264;
export const PRIMITIVE_WIDTH = 360;
export const NODE_HEIGHT = 64;
export const COLUMN_HEAD = 48;
const COLUMN_GAP = 96;
const ROW_GAP = 12;
const GROUP_GAP = 32;

export type Column = { role: string; ids: string[]; groups?: { id: string; ids: string[] }[] };
export type Placed = { id: string; x: number; y: number; width: number };
export type Head = { key: string; label: string; x: number; y: number; width: number };

export const widthOf = (role: string) => (role === "primitive" ? PRIMITIVE_WIDTH : NODE_WIDTH);

export function layout({
  columns,
  heightOf,
  labelOf,
  groupColumns = 1,
}: {
  columns: Column[];
  heightOf: (id: string) => number;
  labelOf: (role: string) => string;
  groupColumns?: number;
}): { placed: Placed[]; heads: Head[]; bottom: number; right: number } {
  const placed: Placed[] = [];
  const heads: Head[] = [];
  let x = 0;
  let bottom = 0;
  let right = 0;
  for (const column of columns) {
    const width = widthOf(column.role);
    const stack = (ids: string[], left: number) => {
      let y = COLUMN_HEAD;
      for (const id of ids) {
        placed.push({ id, x: left, y, width });
        y += heightOf(id) + ROW_GAP;
      }
      bottom = Math.max(bottom, y);
    };
    let span = width;
    if (column.groups) {
      // Each group with its tokens stays whole; the groups fill the side-by-side columns in order,
      // each about the same height.
      const blocks = column.groups.map((g) => [g.id, ...g.ids]);
      const tall = (ids: string[]) => ids.reduce((sum, id) => sum + heightOf(id) + ROW_GAP, 0);
      const share = blocks.reduce((sum, b) => sum + tall(b), 0) / Math.max(1, groupColumns);
      const parts: string[][] = [[]];
      let filled = 0;
      for (const block of blocks) {
        if (filled > 0 && filled + tall(block) / 2 > share && parts.length < groupColumns) {
          parts.push([]);
          filled = 0;
        }
        parts[parts.length - 1].push(...block);
        filled += tall(block);
      }
      parts.forEach((ids, i) => stack(ids, x + i * (width + GROUP_GAP)));
      span = parts.length * width + (parts.length - 1) * GROUP_GAP;
    } else stack(column.ids, x);
    heads.push({ key: `${column.role}:${x}`, label: labelOf(column.role), x, y: 0, width: span });
    right = x + span;
    x += span + COLUMN_GAP;
  }
  return { placed, heads, bottom, right };
}
