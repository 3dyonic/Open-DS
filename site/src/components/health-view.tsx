"use client";
// The live part of /health: reads /health.json every 30 seconds and shows it. Pulse, the robot doctor,
// keeps watch; Slumber covers when something is down. Three small secrets for the curious: tap Pulse
// and it leans in to listen, type "twin" and its night-shift twin steps in, and open the console.
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Eyebrow } from "@/components/chrome";
import { Robot } from "@/components/robot";

/** What the hosted service returns at /health.json (open-ds-ops, src/health.mjs). */
type Health = {
  ok: boolean;
  name: string;
  ops: string;
  engine: string;
  mcp: string;
  database: string;
  checks: { website: boolean | null; mcp: boolean; database: boolean };
  error: { status: number; path: string; at: string } | null;
  title: string;
  body: string;
  commit: string | null;
  node: string;
  region: string | null;
  machine: string;
  uptime_s: number;
  checked_at: string;
};

type State = { kind: "loading" } | { kind: "ok"; h: Health } | { kind: "unreachable" };

function uptime(s: number) {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return d ? `${d}d ${h}h` : h ? `${h}h ${m}m` : `${m}m ${s % 60}s`;
}

type Tone = "good" | "bad" | "neutral";

function Chip({ tone, children }: { tone: Tone; children: string }) {
  const dot = tone === "good" ? "bg-good" : tone === "bad" ? "bg-accent" : "bg-muted";
  const text = tone === "good" ? "text-good" : tone === "bad" ? "text-accent-text" : "text-muted";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[13px] ${text}`}
    >
      <span aria-hidden className={`size-[7px] rounded-full ${dot}`} />
      {children}
    </span>
  );
}

function Row({ name, line, tone, chip }: { name: string; line: string; tone: Tone; chip: string }) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-line p-4 last:border-b-0">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-[17px] font-semibold text-ink">{name}</p>
        <p className="font-mono text-[13px] break-words text-muted">{line}</p>
      </div>
      <Chip tone={tone}>{chip}</Chip>
    </li>
  );
}

export function HealthView() {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [twin, setTwin] = useState(false);
  const [listening, setListening] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/health.json", { cache: "no-store" });
      const h = (await r.json()) as Health;
      setState(h && typeof h.ok === "boolean" ? { kind: "ok", h } : { kind: "unreachable" });
    } catch {
      setState({ kind: "unreachable" });
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30_000);
    return () => clearInterval(t);
  }, [load]);

  // The night-shift twin. They insist they are the same robot.
  useEffect(() => {
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return;
      typed = (typed + e.key.toLowerCase()).slice(-4);
      if (typed !== "twin") return;
      setTwin((on) => !on);
    };
    addEventListener("keydown", onKey);
    console.log(
      "%cPulse here.%c I check open-ds.dev every 30 seconds.\nFor JSON: curl https://open-ds.dev/health.json\nPsst: type “twin” on this page.",
      "font: 600 14px sans-serif; color: #ff5a1f",
      "font: 12px monospace",
    );
    return () => removeEventListener("keydown", onKey);
  }, []);

  const h = state.kind === "ok" ? state.h : null;
  const down = state.kind === "unreachable" || (h !== null && !h.ok);

  const checkUp = () => {
    if (down) return;
    setListening(false);
    requestAnimationFrame(() => setListening(true));
  };

  const title =
    state.kind === "loading"
      ? "Checking…"
      : state.kind === "unreachable"
        ? "Error: status could not be loaded"
        : h!.title;
  const body =
    state.kind === "loading"
      ? "Pulse is listening."
      : state.kind === "unreachable"
        ? "The service did not answer. Try this page again."
        : h!.body;
  const banner: [Tone, string] =
    state.kind === "loading"
      ? ["neutral", "Checking"]
      : down
        ? ["bad", "Error"]
        : ["good", "Operational"];

  return (
    <div className="flex flex-col gap-10 px-5 pt-4 pb-20 lg:px-20">
      <header className="flex flex-col-reverse gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Eyebrow>Status</Eyebrow>
          <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[56px]">Health</h1>
          <p className="max-w-[720px] text-[19px] leading-[1.45] text-body">
            Whether open-ds.dev is up: the website, the MCP server and the database.
          </p>
        </div>
        <div className="shrink-0 self-center md:self-end">
          <button
            type="button"
            onClick={checkUp}
            onAnimationEnd={() => setListening(false)}
            aria-label={down ? "Slumber, resting" : "Pulse, the robot doctor"}
            className={`block cursor-pointer origin-bottom transition-transform hover:-rotate-1 motion-reduce:transition-none ${twin ? "twin" : ""} ${listening ? "motion-safe:animate-[listen_1.2s_ease-in-out]" : ""}`}
          >
            <Robot
              name={down ? "slumber" : "pulse"}
              priority
              className="h-[260px] w-auto md:h-[240px] lg:h-[280px]"
            />
          </button>
        </div>
      </header>

      <div
        role="region"
        aria-label="Status"
        className="flex items-center gap-3 rounded-[6px] border border-line bg-white px-4 py-[14px]"
      >
        <span
          aria-hidden
          className={`size-[10px] shrink-0 rounded-full ${banner[0] === "good" ? "bg-good" : banner[0] === "bad" ? "bg-accent" : "bg-muted"}`}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <p className="text-[17px] font-semibold text-ink">{title}</p>
          <p className="font-mono text-[13px] text-muted">{body}</p>
        </div>
        <Chip tone={banner[0]}>{banner[1]}</Chip>
      </div>

      <section className="flex flex-col gap-3" aria-labelledby="components">
        <h2 id="components" className="text-[15px] font-bold text-ink">
          Components
        </h2>
        <ul className="overflow-hidden rounded-[6px] border border-line bg-white">
          {h ? (
            <>
              <Row
                name="API"
                line={
                  h.error
                    ? `A request returned ${h.error.status}. ${h.error.path}`
                    : "The service answers requests."
                }
                tone={h.error ? "bad" : "good"}
                chip={h.error ? "Error" : "Operational"}
              />
              <Row
                name="Website"
                line={
                  h.checks.website === null
                    ? "Not served by this host."
                    : h.checks.website
                      ? "The pages are in place."
                      : "The pages are missing."
                }
                tone={h.checks.website === null ? "neutral" : h.checks.website ? "good" : "bad"}
                chip={
                  h.checks.website === null ? "Local" : h.checks.website ? "Operational" : "Error"
                }
              />
              <Row name="MCP server" line={`Answers at ${h.mcp}.`} tone="good" chip="Operational" />
              <Row
                name="Database"
                line={
                  h.checks.database
                    ? `Open, ${h.database.replace(/^ok \((.*)\)$/, "$1")}.`
                    : `Not open: ${h.database}.`
                }
                tone={h.checks.database ? "good" : "bad"}
                chip={h.checks.database ? "Operational" : "Error"}
              />
            </>
          ) : (
            <Row
              name="Service"
              line={state.kind === "loading" ? "Asking…" : "No answer from /health.json."}
              tone={state.kind === "loading" ? "neutral" : "bad"}
              chip={state.kind === "loading" ? "Checking" : "Error"}
            />
          )}
        </ul>
      </section>

      {h && (
        <section className="flex flex-col gap-3" aria-labelledby="details">
          <h2 id="details" className="text-[15px] font-bold text-ink">
            Details
          </h2>
          <dl className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-x-4 gap-y-2 rounded-[6px] border border-line bg-white p-4 font-mono text-[13px]">
            <dt className="text-muted">Versions</dt>
            <dd className="text-ink">
              ops {h.ops} · engine {h.engine} · node {h.node}
            </dd>
            <dt className="text-muted">Built from</dt>
            <dd className="text-ink">
              {h.commit ? (
                <a
                  className="text-accent-text hover:underline"
                  href={`https://github.com/3dyonic/Open-DS/commit/${h.commit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {h.commit.slice(0, 7)}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                "unknown"
              )}
            </dd>
            <dt className="text-muted">Machine</dt>
            <dd className="break-words text-ink">
              {h.machine}
              {h.region ? ` · ${h.region}` : ""}
            </dd>
            <dt className="text-muted">Awake for</dt>
            <dd className="text-ink">{uptime(h.uptime_s)}</dd>
            <dt className="text-muted">Checked</dt>
            <dd className="text-ink">
              <time dateTime={h.checked_at}>{h.checked_at.replace("T", " ").slice(0, 19)} UTC</time>
              . Again in 30 seconds.
            </dd>
          </dl>
        </section>
      )}

      <section className="flex flex-col gap-2 rounded-[6px] border border-line px-4 py-[14px]">
        <h2 className="text-[14px] font-bold text-ink">About</h2>
        <p className="text-[15px] text-muted">
          This page shows whether Open DS is up. Agents and scripts that ask for JSON get the same
          facts: <code className="font-mono text-ink">curl https://open-ds.dev/health.json</code>
        </p>
      </section>

      <p className="flex flex-wrap items-center gap-2 text-[15px]">
        <span className="text-muted">Ready to connect?</span>
        <Link className="font-semibold text-accent-text hover:underline" href="/install/">
          How to install →
        </Link>
      </p>
    </div>
  );
}
