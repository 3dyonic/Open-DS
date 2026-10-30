import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui-bits";
import { grammar, schemes } from "@/lib/schemes";

export const metadata: Metadata = { title: "Compare" };

export default function Compare() {
  const g = grammar();
  const all = schemes();
  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <Eyebrow>Compare</Eyebrow>
        <h1 className="text-4xl font-extrabold">The same situation. Five answers.</h1>
        <p className="max-w-2xl text-muted">
          Every scheme answers the same situations. Different products need different answers, and
          each one says why.
        </p>
      </div>
      {g.situations.map((sit) => (
        <section key={sit.id} className="grid gap-3" aria-labelledby={`s-${sit.id}`}>
          <h2 id={`s-${sit.id}`} className="text-xl font-extrabold">
            {sit.title}{" "}
            <span className="text-base font-normal text-muted">· {sit.description}</span>
          </h2>
          <ul className="grid gap-3 md:grid-cols-5">
            {all.map((s) => {
              const r = s.usage.find((u) => u.situation === sit.id)!;
              return (
                <li key={s.id} className="rounded-lg border border-line bg-white p-3 text-sm">
                  <p className="font-mono text-xs uppercase text-muted">{s.name}</p>
                  <p className="mt-1 font-semibold">{r.use}</p>
                  <p className="mt-1 text-muted">{r.why}</p>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
