import type { Metadata } from "next";
import Link from "next/link";
import { MiniSpecimen } from "@/components/specimen";
import { Eyebrow } from "@/components/ui-bits";
import { schemes } from "@/lib/schemes";

export const metadata: Metadata = { title: "Schemes" };

export default function Schemes() {
  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <Eyebrow>Schemes</Eyebrow>
        <h1 className="text-4xl font-extrabold">Pick the scheme that fits your product.</h1>
        <p className="max-w-2xl text-muted">
          Each one answers every question in the grammar and says why.
        </p>
      </div>
      <ul className="grid gap-6">
        {schemes().map((s) => (
          <li
            key={s.id}
            className="grid gap-5 rounded-xl border border-line bg-white p-5 md:grid-cols-[1fr_1.2fr]"
          >
            <div className="grid content-start gap-2">
              <Link
                href={`/schemes/${s.id}/`}
                className="text-2xl font-extrabold hover:text-accent-text"
              >
                {s.name}
              </Link>
              <p>{s.summary}</p>
              <p className="text-sm">
                <span className="font-semibold">Use when:</span> {s.ai.use_when}
              </p>
              <p className="text-sm text-muted">
                <span className="font-semibold">Avoid when:</span> {s.ai.avoid_when}
              </p>
            </div>
            <MiniSpecimen
              scheme={s.id}
              brand={Object.keys(s.tokens.brands).length > 1 ? "aster" : undefined}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
