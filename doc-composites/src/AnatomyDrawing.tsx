/**
 * AnatomyDrawing: a component drawn from the scheme's own variables, with a number on each part, for
 * the Anatomy reference. Two kinds: a menu (rows with icons, labels, shortcuts and separators) and a
 * table (toolbar, frame, header and rows). The docs generator writes what to draw and which numbers
 * to show (<page>.json beside the page); the page holds one line: ::anatomy-drawing{id="data-table/stage"}
 *
 * This is a drawing of a component, not the component: it shows every part at once, with its number.
 * Its look comes from the docs' anatomy styles, which read the scheme's component variables.
 */
import * as React from "react";

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

function Icon({ name }: { name?: string }) {
  return (
    <svg
      className="odv-am-icon"
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

function Num({ n, show }: { n?: number; show: Set<number> }) {
  return n && show.has(n) ? <i className="odv-am-n">{n}</i> : null;
}

function Menu({
  data,
}: {
  data: Extract<AnatomyDrawingData, { kind: "menu" }>;
}) {
  const show = new Set(data.show);
  return (
    <div className={`odv-am-menu${data.whole ? "" : " part"}`}>
      {data.rows.map((r, i) => {
        const k = r.marks ?? {};
        if (r.separator)
          return (
            <div key={i} className="odv-am-sep">
              {k.row && show.has(k.row) && (
                <span className="odv-am-at sepn">
                  <Num n={k.row} show={show} />
                </span>
              )}
            </div>
          );
        const cls = [r.state && `is-${r.state}`, r.tone && `is-${r.tone}`]
          .filter(Boolean)
          .join(" ");
        return (
          <div key={i} className={`odv-am-row ${cls}`}>
            {k.focus && show.has(k.focus) && (
              <span className="odv-am-at top">
                <Num n={k.focus} show={show} />
              </span>
            )}
            <Num n={k.icon} show={show} />
            <Icon name={r.icon} />
            <span className="odv-am-label">
              {r.label}
              <Num n={k.label} show={show} />
            </span>
            <span className="odv-am-fill" />
            {r.shortcut && (
              <span className="odv-am-key">
                {r.shortcut}
                <Num n={k.shortcut} show={show} />
              </span>
            )}
            {r.chevron && (
              <>
                <Num n={k.chevron} show={show} />
                <Icon name="chevron" />
              </>
            )}
            <Num n={k.row} show={show} />
            {k.separator && show.has(k.separator) && (
              <span className="odv-am-at bottom">
                <Num n={k.separator} show={show} />
              </span>
            )}
          </div>
        );
      })}
      {data.whole &&
        data.surface.map((n) =>
          show.has(n) ? (
            <span key={`s${n}`} className="odv-am-at corner">
              <Num n={n} show={show} />
            </span>
          ) : null,
        )}
      {data.whole &&
        data.shadow.map((n) =>
          show.has(n) ? (
            <span key={`h${n}`} className="odv-am-at shadow">
              <Num n={n} show={show} />
            </span>
          ) : null,
        )}
    </div>
  );
}

function Box({ on }: { on?: boolean }) {
  return (
    <span className={`odv-at-box${on ? " on" : ""}`}>
      {on && (
        <svg
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

function TableDrawing({
  data,
}: {
  data: Extract<AnatomyDrawingData, { kind: "table" }>;
}) {
  const show = new Set(data.show);
  const bar = (
    <div className="odv-at-bar">
      {data.toolbar.map((t, i) => (
        <React.Fragment key={i}>
          {t.kind === "search" ? (
            <span className="odv-at-input">
              <Icon name="search" />
              <span>{t.label}</span>
            </span>
          ) : t.kind === "button" ? (
            <span className="odv-at-btn">
              <Icon name={t.icon} />
              {t.label}
            </span>
          ) : t.kind === "count" ? (
            <span className="odv-at-count">{t.label}</span>
          ) : (
            <span className="odv-at-toggle">
              {(t.options ?? []).map((o, k) => (
                <span key={o} className={k ? undefined : "on"}>
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
    <tr className="odv-at-head">
      <th className="chk">
        <Box />
        <Num n={data.header.check} show={show} />
      </th>
      {data.columns.map((c, k) => (
        <th key={c.label} className={c.numeric ? "num" : ""}>
          {c.label}
          {k === 0 && <Num n={data.header.label} show={show} />}
          {c.sort && <Icon name="sort" />}
          {k === 0 && c.sort && <Num n={data.header.sort} show={show} />}
        </th>
      ))}
      <th className="end">
        <Num n={data.header.row} show={show} />
      </th>
    </tr>
  );
  // The select box is numbered on the header when the header is drawn, else on its own row.
  const row = (r: TableRow, withHead: boolean, i: number) => (
    <tr key={i} className={`odv-at-row${r.state ? ` is-${r.state}` : ""}`}>
      <td className="chk">
        <Box on={r.checked} />
        {!withHead && <Num n={r.marks?.check} show={show} />}
      </td>
      {r.cells.map((c, k) => (
        <td key={k} className={data.columns[k]?.numeric ? "num" : ""}>
          {c}
          {k === 0 && <Num n={r.marks?.cell} show={show} />}
          {data.columns[k]?.numeric && <Num n={r.marks?.number} show={show} />}
        </td>
      ))}
      <td className="end">
        <Num n={r.marks?.row} show={show} />
      </td>
    </tr>
  );
  const frame = (
    rows: TableRow[],
    withHead: boolean | "corner",
    key: string,
  ) => (
    <div key={key} className="odv-at-frame">
      {(withHead === "corner" || data.sections.includes("frame")) && (
        <span className="odv-am-at corner">
          <Num n={data.frame} show={show} />
        </span>
      )}
      <table className="odv-at-table">
        {withHead && <thead>{head}</thead>}
        <tbody>{rows.map((r, i) => row(r, Boolean(withHead), i))}</tbody>
      </table>
    </div>
  );
  const out: React.ReactNode[] = [];
  data.sections.forEach((sec, i) => {
    if (sec === "toolbar")
      out.push(<React.Fragment key={`b${i}`}>{bar}</React.Fragment>);
    else if (sec === "frame" || sec === "table")
      out.push(frame(data.rows, sec === "table" ? "corner" : true, `f${i}`));
  });
  const withHeader = data.sections.includes("header");
  const picked = data.sections
    .filter((x) => x.startsWith("row:"))
    .map((x) => data.rows[Number(x.split(":")[1])]);
  if (withHeader || picked.length)
    out.push(frame(picked, withHeader, "picked"));
  return <div className="odv-at">{out}</div>;
}

export default function AnatomyDrawing({ data }: { data: AnatomyDrawingData }) {
  return (
    <div
      data-composite="anatomy-drawing"
      className="flex justify-center overflow-x-auto rounded-[var(--radius-container)] bg-[var(--color-surface-canvas)] p-[var(--space-inset-container)]"
    >
      {data.kind === "menu" ? (
        <Menu data={data} />
      ) : (
        <TableDrawing data={data} />
      )}
    </div>
  );
}
