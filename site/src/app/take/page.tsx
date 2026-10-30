import type { Metadata } from "next";
import { Command, Eyebrow } from "@/components/ui-bits";

export const metadata: Metadata = { title: "Take it" };

export default function Take() {
  return (
    <div className="grid gap-12">
      <div className="grid gap-3">
        <Eyebrow>Take it</Eyebrow>
        <h1 className="text-4xl font-extrabold">Connect your AI, or use the package yourself.</h1>
        <p className="max-w-2xl text-muted">
          Both paths run the same engine and write the same files.
        </p>
      </div>
      <section className="grid gap-4">
        <h2 className="text-2xl font-extrabold">Connect your AI (MCP)</h2>
        <Command>
          {"claude mcp add --scope user open-ds -- uv run --directory /path/to/Open-DS open-ds-mcp"}
        </Command>
        <p>
          Then ask: “Which Open DS scheme fits an order management tool? Deploy it into this
          project.”
        </p>
        <ul className="grid gap-1 font-mono text-sm">
          <li>list_schemes · get_scheme · get_answer · why · when_to_use · deploy</li>
        </ul>
      </section>
      <section className="grid gap-4">
        <h2 className="text-2xl font-extrabold">Use the package yourself (CLI)</h2>
        <Command>{`node cli/bin/open-ds.js list
node cli/bin/open-ds.js init dense-data --dir ./my-app
node cli/bin/open-ds.js when dense-data "a number in a table"
node cli/bin/open-ds.js why dense-data typography.definition`}</Command>
      </section>
      <section className="grid gap-4">
        <h2 className="text-2xl font-extrabold">What you get</h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {[
            "Tokens built with Style Dictionary: CSS variables for every brand in light and dark, and DTCG JSON",
            "14 components on shadcn and Radix, themed only through component keys",
            "Storybook with every component in every scheme",
            "AGENTS.md and an agent skill, so your AI follows the usage rules and the voice",
            "The full scheme as JSON, every decision with its reasons",
            "Docs for the product, the business and the brand",
          ].map((x) => (
            <li key={x} className="rounded-lg border border-line bg-white p-4">
              {x}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
