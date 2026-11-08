// The token map's layout: one column per level, left to right, so every line runs in the gap between
// two columns and never through a box. Each column after the first is centered on the open box of the
// column before it, and never starts above the column heads. Heights are the boxes' measured heights
// once the page has drawn them, else an estimate.
export type Level = "scope" | "scale" | "step" | "word" | "group" | "decision" | "where" | "start" | "readers";

export const WIDTHS: Record<Level, number> = {
  scope: 168,
  scale: 144,
  step: 128,
  word: 248,
  group: 152,
  decision: 288,
  where: 224,
  start: 288,
  readers: 288,
};
// The heads sit at the top; the boxes start low enough to leave the selected box's toolbar room.
export const COLUMN_HEAD = 84;
const COLUMN_GAP = 64;
const ROW_GAP = 10;

export type LayoutColumn = { level: Level; ids: string[]; open: string | null };
export type Placed = { id: string; x: number; y: number; width: number };
export type Head = { level: Level; x: number; width: number };

export function layout({ columns, heightOf }: { columns: LayoutColumn[]; heightOf: (id: string) => number }): {
  placed: Placed[];
  heads: Head[];
  bottom: number;
  right: number;
} {
  const placed: Placed[] = [];
  const heads: Head[] = [];
  let x = 0;
  let bottom = COLUMN_HEAD;
  let openCenter: number | null = null;
  for (const column of columns) {
    const width = WIDTHS[column.level];
    const total = column.ids.reduce((sum, id) => sum + heightOf(id), 0) + ROW_GAP * Math.max(0, column.ids.length - 1);
    let y = openCenter == null ? COLUMN_HEAD : Math.max(COLUMN_HEAD, openCenter - total / 2);
    openCenter = null;
    for (const id of column.ids) {
      const h = heightOf(id);
      placed.push({ id, x, y, width });
      if (id === column.open) openCenter = y + h / 2;
      y += h + ROW_GAP;
    }
    bottom = Math.max(bottom, y - ROW_GAP);
    heads.push({ level: column.level, x, width });
    x += width + COLUMN_GAP;
  }
  return { placed, heads, bottom, right: x - COLUMN_GAP };
}
