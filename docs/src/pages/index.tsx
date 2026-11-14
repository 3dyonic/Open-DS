import React, { useMemo, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { useScheme, type Scheme } from "../components/scheme";
import { Robot } from "../components/Robot";

// The docs home: the five schemes as a small marketplace. A stage of their robots, then a
// row per scheme with its answers from its tokens, and the ways in: its docs and the command that
// creates it.

// What each scheme is for, in two words, for the filter. The rest of a row comes from schemes.json.
const FOR: Record<string, string> = {
  "dense-data": "Dashboards",
  "content-first": "Reading",
  "accessible-first": "Public services",
  "brand-expressive": "Launches",
  "multi-brand": "Several brands",
};
const corners = (c: string) =>
  parseFloat(c) >= 999 ? "Pill" : `${Math.round(parseFloat(c) * (c.endsWith("rem") ? 16 : 1))} px`;
const family = (f: string) => f.split(",")[0].replaceAll('"', "").trim();

function Row({ s }: { s: Scheme }) {
  const [copied, setCopied] = useState(false);
  const cmd = `npx open-ds create my-ds --scheme ${s.id}`;
  const copy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      const r = document.createRange();
      r.selectNodeContents(e.currentTarget);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(r);
    }
  };
  return (
    <article className="ods-row" style={{ "--c-light": s.primary, "--c-dark": s.primaryDark } as React.CSSProperties}>
      <Link className="ods-row-art" to={`/${s.id}/`} aria-label={`${s.name} docs`}>
        <Robot id={s.id} />
      </Link>
      <div className="ods-row-info">
        <h3 style={{ fontFamily: s.font }}>
          <Link to={`/${s.id}/`}>{s.name}</Link>
          <span className="ods-badge">v{s.version}</span>
          <span className="ods-badge">For {FOR[s.id]?.toLowerCase() ?? s.id}</span>
        </h3>
        <p>{s.summary}</p>
        <ul className="ods-tags">
          {s.examples.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
      <dl className="ods-facts">
        <div>
          <dt>Components</dt>
          <dd>{s.components}</dd>
        </div>
        <div>
          <dt>Answers</dt>
          <dd>{s.answers}</dd>
        </div>
        <div>
          <dt>Themes</dt>
          <dd>{s.brands.length > 1 ? `${s.brands.length} brands × 2` : "Light, dark"}</dd>
        </div>
        <div>
          <dt>Corners</dt>
          <dd>{corners(s.corners)}</dd>
        </div>
        <div>
          <dt>Type</dt>
          <dd style={{ fontFamily: s.font }} title={family(s.font)}>
            {family(s.font)}
          </dd>
        </div>
        <div>
          <dt>Motion</dt>
          <dd>{s.motion.replace("ms", " ms")}</dd>
        </div>
      </dl>
      <div className="ods-row-act">
        <Link className="ods-btn ods-btn--primary" to={`/${s.id}/`}>
          Read the docs
        </Link>
        <button className="ods-cmd" type="button" onClick={copy} title="Copy the command">
          {copied ? "Copied" : `$ ${cmd}`}
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const { schemes } = useScheme();
  const [pick, setPick] = useState("All");
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return schemes.filter(
      (s) =>
        (pick === "All" || FOR[s.id] === pick) &&
        (!t || [s.name, s.summary, s.useWhen, ...s.examples].join(" ").toLowerCase().includes(t)),
    );
  }, [schemes, pick, q]);
  return (
    <Layout
      title="Every scheme"
      description="Five Open DS design system schemes, each documented as the design system it builds."
    >
      <main className="ods-home">
        <section className="ods-hero">
          <p className="ods-eyebrow">Open DS docs</p>
          <h1>Five design system schemes. Same questions. Different answers.</h1>
          <p className="ods-lede">
            Every design system is a set of answers. Each scheme answers how dense, how round, how loud and how fast it
            should be. Pick a scheme to read its design system, then switch schemes from the top bar on any page.
          </p>
          <ul className="ods-asks" aria-label="Some of the questions">
            <li>How dense?</li>
            <li>How round?</li>
            <li>How loud?</li>
            <li>How fast?</li>
          </ul>
          <div className="ods-stage">
            {schemes.map((s) => (
              <Link key={s.id} className="ods-stage-bot" to={`/${s.id}/`} aria-label={`${s.name} docs`}>
                <Robot id={s.id} />
                <span className="ods-stage-name" style={{ fontFamily: s.font }}>
                  {s.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className="ods-shelf" aria-labelledby="pick">
          <div className="ods-shelf-bar">
            <h2 id="pick">Pick a scheme</h2>
            <input
              className="ods-search"
              type="search"
              placeholder="Search: dashboard, magazine, checkout…"
              aria-label="Search the schemes"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="ods-chips" role="group" aria-label="Filter by what you build">
            {["All", ...schemes.map((s) => FOR[s.id] ?? s.name)].map((f) => (
              <button key={f} type="button" className="ods-chip" aria-pressed={pick === f} onClick={() => setPick(f)}>
                {f}
              </button>
            ))}
          </div>
          <div className="ods-rows">
            {list.length ? (
              list.map((s) => (
                <React.Fragment key={s.id}>
                  <Row s={s} />
                </React.Fragment>
              ))
            ) : (
              <p className="ods-empty">No scheme matches “{q}”. Try dashboard, reading or checkout.</p>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}
