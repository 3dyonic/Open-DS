/**
 * AnatomyDrawing: a component drawn from the scheme's own variables, with a number on each part, for
 * the Anatomy reference. Two kinds: a menu (rows with icons, labels, shortcuts and separators) and a
 * table (toolbar, frame, header and rows). The docs generator writes what to draw and which numbers
 * to show (<page>.json beside the page); the page holds one line: ::anatomy-drawing{id="data-table/stage"}
 *
 * This is a drawing of a component, not the component: it shows every part at once, with its number.
 * It sits on the Frame base form, on the page's canvas, and every class reads the scheme's component
 * variables.
 */
import * as React from "react";
import Frame from "./base/Frame";

type Marks = Record<string, number>;
type MenuRow = {
  label?: string;
  icon?: string;
  shortcut?: string;
  chevron?: boolean;
  separator?: boolean;
  state?: string;
  tone?: string;
  marks?: Marks;
};
type ToolbarItem = {
  kind: string;
  label?: string;
  icon?: string;
  options?: string[];
  n?: number;
};
type TableRow = {
  cells: string[];
  checked?: boolean;
  state?: string;
  marks?: Marks;
};
export type AnatomyDrawingData =
  | {
      kind: "menu";
      rows: MenuRow[];
      show: number[];
      whole: boolean;
      surface: number[];
      shadow: number[];
    }
  | {
      kind: "table";
      sections: string[];
      show: number[];
      toolbar: ToolbarItem[];
      columns: { label: string; numeric?: boolean; sort?: boolean }[];
      header: Marks;
      rows: TableRow[];
      frame?: number;
    };

const ICON: Record<string, React.ReactNode> = {
  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </>
  ),
  copy: (
    <>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </>
  ),
  clipboard: (
    <>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </>
  ),
  trash: (
    <>
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  filter: (
    <>
      <path d="M2 5h20" />
      <path d="M6 12h12" />
      <path d="M9 19h6" />
    </>
  ),
  columns: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </>
  ),
  search: (
    <>
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </>
  ),
  sort: (
    <>
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </>
  ),
};

// The drawing's own icon: the menu item's icon size, or a small one in the table and its toolbar.
function Icon({ name, small = false, dim = "" }: { name?: string; small?: boolean; dim?: string }) {
  return (
    <svg
      className={`flex-none ${small ? "size-3.5" : "size-[var(--dropdown-menu-item-icon)]"} ${dim}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name ? ICON[name] : null}
    </svg>
  );
}

// A part's number: a small pill in the action color, set in the label face.
function Num({ n, show }: { n?: number; show: Set<number> }) {
  return n && show.has(n) ? (
    <i className="mx-1 inline-flex h-4.5 min-w-4.5 flex-none items-center justify-center rounded-full bg-[var(--color-action-primary)] px-1 text-[length:var(--badge-font-size)] leading-none font-semibold not-italic text-[color:var(--color-text-on-action)] [font-family:var(--type-label-font-family)]">
      {n}
    </i>
  ) : null;
}

// Where a number sits outside the part it names: above a row, below it, at the frame's corner, under
// its shadow, or at a separator's end.
const AT = {
  top: "absolute -top-2.75 left-1/2",
  bottom: "absolute -bottom-3 left-1/2",
  corner: "absolute -bottom-2.75 left-4.5",
  shadow: "absolute -right-2.5 -bottom-5.5",
  separator: "absolute -top-2.25 -right-3.5",
} as const;

function At({ at, n, show }: { at: keyof typeof AT; n?: number; show: Set<number> }) {
  return n && show.has(n) ? (
    <span className={AT[at]}>
      <Num n={n} show={show} />
    </span>
  ) : null;
}

// A row's state, from the menu's own item variables.
const ROW_STATE: Record<string, string> = {
  highlight: "bg-[var(--dropdown-menu-item-background-highlight)]",
  focus:
    "outline-[length:var(--focus-ring-width)] outline-solid outline-[var(--color-border-focus)] -outline-offset-2",
  danger: "text-[color:var(--dropdown-menu-item-label-destructive)]",
};

function Menu({ data }: { data: Extract<AnatomyDrawingData, { kind: "menu" }> }) {
  const show = new Set(data.show);
  return (
    <div
      className={`relative border-[length:var(--dropdown-menu-content-border-width)] border-[var(--dropdown-menu-content-border)] bg-[var(--overlay-background)] p-[var(--dropdown-menu-content-padding)] text-[color:var(--dropdown-menu-content-label)] rounded-[var(--overlay-radius)] ${data.whole ? "min-w-65 shadow-[var(--overlay-shadow)]" : "min-w-60"}`}
    >
      {data.rows.map((r, i) => {
        const k = r.marks ?? {};
        if (r.separator)
          return (
            <div key={i} className="relative my-1 h-px bg-[var(--dropdown-menu-separator-background)]">
              <At at="separator" n={k.row} show={show} />
            </div>
          );
        // A disabled row greys its content, never its numbers.
        const dim = r.state === "disabled" ? "text-[color:var(--dropdown-menu-item-disabled-label)]!" : "";
        const state = [r.state && ROW_STATE[r.state], r.tone && ROW_STATE[r.tone]].filter(Boolean).join(" ");
        return (
          <div
            key={i}
            className={`relative flex min-h-[var(--overlay-item-height)] items-center gap-[var(--dropdown-menu-item-gap)] rounded-[var(--dropdown-menu-item-radius)] px-[var(--dropdown-menu-item-padding-x)] text-[length:var(--dropdown-menu-item-font-size)] ${state}`}
          >
            <At at="top" n={k.focus} show={show} />
            <Num n={k.icon} show={show} />
            <Icon name={r.icon} dim={dim} />
            <span className={`inline-flex items-center whitespace-nowrap ${dim}`}>
              {r.label}
              <Num n={k.label} show={show} />
            </span>
            <span className="flex-1" />
            {r.shortcut && (
              <span
                className={`inline-flex items-center whitespace-nowrap text-[length:var(--type-caption-font-size)] text-[color:var(--color-text-muted)] ${dim}`}
              >
                {r.shortcut}
                <Num n={k.shortcut} show={show} />
              </span>
            )}
            {r.chevron && (
              <>
                <Num n={k.chevron} show={show} />
                <Icon name="chevron" dim={dim} />
              </>
            )}
            <Num n={k.row} show={show} />
            <At at="bottom" n={k.separator} show={show} />
          </div>
        );
      })}
      {data.whole && data.surface.map((n) => <At key={`s${n}`} at="corner" n={n} show={show} />)}
      {data.whole && data.shadow.map((n) => <At key={`h${n}`} at="shadow" n={n} show={show} />)}
    </div>
  );
}

function Box({ on }: { on?: boolean }) {
  return (
    <span
      className={`inline-flex size-[var(--checkbox-size)] items-center justify-center rounded-[var(--radius-badge)] border-[length:var(--checkbox-border-width)] align-middle ${on ? "border-[var(--color-action-primary)] bg-[var(--color-action-primary)] text-[color:var(--color-text-on-action)]" : "border-[var(--color-border-strong)]"}`}
    >
      {on && (
        <svg
          className="size-4/5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
    </span>
  );
}

// The docs' own table styles sit outside any layer, so the drawing's cells set theirs as important.
const CELL =
  "h-[var(--table-row-height)]! border-0! px-[var(--table-cell-padding-x)]! py-0! text-left whitespace-nowrap";
const HEAD = `${CELL} bg-[var(--table-header-background)]! text-[color:var(--table-head-label)] [font-family:var(--table-head-font-family)] text-[length:var(--table-head-font-size)] [font-weight:var(--table-head-font-weight)]`;
const BODY = `${CELL} border-t-[length:var(--table-row-border-width)]! border-solid! border-[var(--table-row-border)]!`;
const NUMERIC = "text-right! tabular-nums";
const EDGE = { check: "w-7", end: "w-7 px-1!" };
const ROW_FILL: Record<string, string> = {
  highlight: "bg-[var(--data-table-row-background-hover)]!",
  selected: "bg-[var(--table-row-selected)]!",
};

function TableDrawing({ data }: { data: Extract<AnatomyDrawingData, { kind: "table" }> }) {
  const show = new Set(data.show);
  const bar = (
    <div className="flex flex-wrap items-center gap-[var(--data-table-gap-2)]">
      {data.toolbar.map((t, i) => (
        <React.Fragment key={i}>
          {t.kind === "search" ? (
            <span className="inline-flex h-[var(--input-height)] min-w-40 items-center gap-1.5 rounded-[var(--input-radius)] border-[length:var(--input-border-width)] border-[var(--input-border)] bg-[var(--input-background)] px-[var(--input-padding-x)] text-[color:var(--input-placeholder)]">
              <Icon name="search" small />
              <span>{t.label}</span>
            </span>
          ) : t.kind === "button" ? (
            <span className="inline-flex h-[var(--input-height)] items-center gap-1.5 rounded-[var(--radius-control)] border-[length:var(--button-secondary-border-width)] border-[var(--button-secondary-border)] bg-[var(--button-secondary-background)] px-2.5 text-[color:var(--button-secondary-label)]">
              <Icon name={t.icon} small />
              {t.label}
            </span>
          ) : t.kind === "count" ? (
            <span className="text-[color:var(--data-table-label)]">{t.label}</span>
          ) : (
            <span className="inline-flex overflow-hidden rounded-[var(--toggle-group-radius)] border border-[var(--color-border-default)] shadow-[var(--toggle-group-shadow)]">
              {(t.options ?? []).map((o, k) => (
                <span
                  key={o}
                  className={`px-[var(--toggle-group-item-padding-x)] py-1 ${k ? "" : "bg-[var(--color-surface-selected)] text-[color:var(--ods-text-on-selected)]"}`}
                >
                  {o}
                </span>
              ))}
            </span>
          )}
          <Num n={t.n} show={show} />
        </React.Fragment>
      ))}
    </div>
  );
  const head = (
    <tr className="border-0! bg-transparent!">
      <th className={`${HEAD} ${EDGE.check}`}>
        <Box />
        <Num n={data.header.check} show={show} />
      </th>
      {data.columns.map((c, k) => (
        <th key={c.label} className={`${HEAD} ${c.numeric ? NUMERIC : ""}`}>
          {c.label}
          {k === 0 && <Num n={data.header.label} show={show} />}
          {c.sort && (
            <span className="relative top-0.5 ml-1 inline-flex text-[color:var(--data-table-label)]">
              <Icon name="sort" small />
            </span>
          )}
          {k === 0 && c.sort && <Num n={data.header.sort} show={show} />}
        </th>
      ))}
      <th className={`${HEAD} ${EDGE.end}`}>
        <Num n={data.header.row} show={show} />
      </th>
    </tr>
  );
  // The select box is numbered on the header when the header is drawn, else on its own row.
  const row = (r: TableRow, withHead: boolean, i: number) => {
    const fill = (r.state && ROW_FILL[r.state]) ?? "";
    // A selected row marks its first cell with the row's focus edge.
    const edge =
      r.state === "selected" ? "shadow-[inset_var(--table-row-focus)_0_0_0_var(--table-row-selected-edge)]" : "";
    return (
      <tr key={i} className="border-0! bg-transparent!">
        <td className={`${BODY} ${EDGE.check} ${fill} ${edge}`}>
          <Box on={r.checked} />
          {!withHead && <Num n={r.marks?.check} show={show} />}
        </td>
        {r.cells.map((c, k) => (
          <td key={k} className={`${BODY} ${fill} ${data.columns[k]?.numeric ? NUMERIC : ""}`}>
            {c}
            {k === 0 && <Num n={r.marks?.cell} show={show} />}
            {data.columns[k]?.numeric && <Num n={r.marks?.number} show={show} />}
          </td>
        ))}
        <td className={`${BODY} ${EDGE.end} ${fill}`}>
          <Num n={r.marks?.row} show={show} />
        </td>
      </tr>
    );
  };
  const frame = (rows: TableRow[], withHead: boolean | "corner", key: string) => (
    <div
      key={key}
      className="relative overflow-visible rounded-[var(--data-table-container-radius)] border-[length:var(--data-table-container-border-width)] border-[var(--data-table-container-border)] bg-[var(--color-surface-default)]"
    >
      {(withHead === "corner" || data.sections.includes("frame")) && <At at="corner" n={data.frame} show={show} />}
      <table className="m-0! table! w-full border-collapse border-0 [font-family:var(--table-cell-font-family)]">
        {withHead && <thead className="bg-transparent!">{head}</thead>}
        <tbody>{rows.map((r, i) => row(r, Boolean(withHead), i))}</tbody>
      </table>
    </div>
  );
  const out: React.ReactNode[] = [];
  data.sections.forEach((sec, i) => {
    if (sec === "toolbar") out.push(<React.Fragment key={`b${i}`}>{bar}</React.Fragment>);
    else if (sec === "frame" || sec === "table") out.push(frame(data.rows, sec === "table" ? "corner" : true, `f${i}`));
  });
  const withHeader = data.sections.includes("header");
  const picked = data.sections.filter((x) => x.startsWith("row:")).map((x) => data.rows[Number(x.split(":")[1])]);
  if (withHeader || picked.length) out.push(frame(picked, withHeader, "picked"));
  return (
    <div className="flex w-full max-w-160 min-w-0 flex-col gap-3 text-[length:var(--table-font-size)] text-[color:var(--table-label)]">
      {out}
    </div>
  );
}

export default function AnatomyDrawing({ data }: { data: AnatomyDrawingData }) {
  return (
    <div data-composite="anatomy-drawing">
      <Frame variant="canvas">
        <div className="flex justify-center overflow-x-auto pt-3 pr-3.5 pb-6">
          {data.kind === "menu" ? <Menu data={data} /> : <TableDrawing data={data} />}
        </div>
      </Frame>
    </div>
  );
}
