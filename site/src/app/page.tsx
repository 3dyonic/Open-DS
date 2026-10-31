// Home, built from the Figma frame S00 Home / 1440 (115:900).
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/chrome";
import { brandName, brandTagline, openGraphBase } from "@/lib/brand";
import { Proof } from "@/components/proof";
import { SchemeCards, Squares } from "@/components/scheme-cards";
import { HOME_SCHEMES, proofData } from "@/lib/home";

// Only the home page names itself canonical; set in the layout it would apply to every page.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    ...openGraphBase,
    title: `${brandName}: design systems as answered questions`,
    description: brandTagline,
    url: "/",
  },
};

const STEPS = [
  {
    title: "1 · Pick a scheme",
    text: "Start from a ready-made design system for a product like yours: dense data, content, accessibility first, multi-brand, or an expressive brand.",
    chips: ["Dense data", "Content first", "Accessible first"],
    cta: ["See the schemes", "/schemes/"],
  },
  {
    title: "2 · Deploy it",
    text: "Connect your AI through MCP and it deploys the scheme, keeping every answer and its reason, so it builds the way the system would. Or run the CLI and do it yourself.",
    chips: ["“Deploy Dense data”", "open-ds init", "get_answer(id)"],
    cta: ["How to install", "/install/"],
  },
  {
    title: "3 · Change what differs",
    text: "When your product is different, change that one answer. See what moves, and keep it as your own flavour of the scheme.",
    chips: ["accessibility.values → Touch", "See what moves", "Compare schemes"],
    cta: ["Compare schemes", "/compare/"],
  },
];

const TAKE: [string, string][] = [
  ["Agent", "Connect your AI: “Deploy the Dense data scheme.”"],
  ["CLI", "open-ds init dense-data"],
  ["Link", "/schemes/dense-data"],
];

// The open-source projects every delivered design system is built on, credited by name.
const OPEN_SOURCE: [string, string, string][] = [
  ["shadcn/ui", "https://ui.shadcn.com", "The component patterns our components start from."],
  ["Radix UI", "https://www.radix-ui.com", "Accessible primitives under the components."],
  ["Tailwind CSS", "https://tailwindcss.com", "The styling layer that reads the tokens."],
  [
    "Style Dictionary",
    "https://styledictionary.com",
    "Builds the tokens into CSS, Tailwind and JSON.",
  ],
  ["Storybook", "https://storybook.js.org", "Shows every component in every scheme and mode."],
  ["Docusaurus", "https://docusaurus.io", "Publishes the docs of each delivered system."],
  ["TanStack Table", "https://tanstack.com/table", "Powers the data table."],
  ["Lucide", "https://lucide.dev", "The icons."],
];

// What every delivered design system contains: the main parts, then the extras.
const DELIVERS: [string, string][] = [
  [
    "shadcn/ui components",
    "The scheme's components, themed by its tokens and copied into your project.",
  ],
  ["A Storybook", "Every component, rendered in your scheme, in light and dark and every brand."],
  ["Docusaurus docs", "A docs site for your system: reasons, voice, foundations and components."],
  ["Style Dictionary tokens", "DTCG source files, built into CSS, the Tailwind theme and JSON."],
];

const DELIVERABLES = ["Agent skill", "AGENTS.md", "CI checks", "The answer map"];

export default function Home() {
  return (
    <>
      <section className="flex flex-col gap-10 px-5 pt-14 pb-[72px] lg:px-20">
        <div className="flex flex-col gap-5">
          <Eyebrow>For makers, product teams and their AI</Eyebrow>
          <h1 className="text-[44px] leading-none font-extrabold md:text-[72px]">
            A design system
            <br />
            you can read and take.
          </h1>
          <p className="max-w-[820px] text-[21px] leading-[1.45] text-[#3e3a31]">
            Every decision is an answered question, with its options and its reason in plain view.
            Then the whole system is yours: tokens, components, Storybook and docs, delivered in one
            command or through your AI, as code you own.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/schemes/"
              className="flex items-center gap-[10px] rounded-[4px] bg-ink px-5 py-[14px] text-[17px] font-semibold text-paper"
            >
              <span aria-hidden className="size-[8px] bg-accent" />
              Pick a scheme
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-[4px] border border-ink px-5 py-[14px] text-[17px] font-semibold"
            >
              See how it works
            </Link>
          </div>
        </div>
        <Proof data={HOME_SCHEMES.map(proofData)} />
      </section>

      <section id="how-it-works" className="flex flex-col gap-8 bg-white px-5 py-[72px] lg:px-20">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="text-[32px] leading-[1.05] font-extrabold md:text-[44px]">
          Start from a scheme. Deploy it your way.
        </h2>
        <ol className="grid gap-5 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="flex flex-col gap-[14px] rounded-[8px] border border-line bg-paper p-7"
            >
              <Squares lit={[0, 1, 2].map((n) => n <= i)} size={12} />
              <h3 className="text-[28px] font-extrabold">{s.title}</h3>
              <p className="text-[16px] leading-[1.45] text-[#3e3a31]">{s.text}</p>
              <ul className="flex flex-wrap gap-[6px]">
                {s.chips.map((c) => (
                  <li
                    key={c}
                    className="rounded-[3px] bg-accent-soft px-2 py-1 font-mono text-[12px] font-medium text-accent-text"
                  >
                    {c}
                  </li>
                ))}
              </ul>
              <Link
                href={s.cta[1]}
                className="mt-auto self-start pt-2 text-[16px] font-semibold hover:text-accent-text"
              >
                {s.cta[0]} →
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-8 px-5 py-[72px] lg:px-20">
        <Eyebrow>Schemes</Eyebrow>
        <div className="flex min-h-[100px] flex-wrap items-end gap-5">
          <h2 className="text-[32px] leading-[1.05] font-extrabold md:text-[44px]">
            Pick a scheme.
          </h2>
          <Link
            href="/schemes/"
            className="ml-auto text-[17px] font-semibold hover:text-accent-text"
          >
            All schemes →
          </Link>
        </div>
        <SchemeCards />
      </section>

      <section className="flex flex-col gap-5 bg-ink px-5 py-[72px] text-paper lg:flex-row lg:items-start lg:px-20">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Eyebrow tone="accent">Take a scheme · A full design system</Eyebrow>
          <h2 className="text-[40px] font-extrabold">Take a whole design system.</h2>
          <ul className="flex flex-col gap-4">
            {TAKE.map(([k, v]) => (
              <li key={k} className="flex gap-4 rounded-[4px] border border-muted px-4 py-3">
                <span className="w-[60px] shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.44px] text-line">
                  {k}
                </span>
                <code className="font-mono text-[15px]">{v}</code>
              </li>
            ))}
          </ul>
          <p className="text-[16px] leading-[1.45] text-line">
            Not a token file. Every scheme delivers a fully working design system, built from its
            answers:
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {DELIVERS.map(([name, what]) => (
              <li
                key={name}
                className="flex flex-col gap-1 rounded-[4px] border border-[#3e3a31] p-4"
              >
                <span className="text-[17px] font-semibold">{name}</span>
                <span className="text-[14px] leading-[1.4] text-line">{what}</span>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-[6px]">
            {DELIVERABLES.map((d) => (
              <li
                key={d}
                className="rounded-[3px] border border-[#3e3a31] px-2 py-1 font-mono text-[12px] font-medium"
              >
                {d}
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-3 rounded-[6px] bg-[#2c2821] p-4 text-[16px] leading-[1.35] font-semibold">
            <span aria-hidden className="size-[12px] shrink-0 bg-accent" />
            Built for AI agents: an MCP server, AGENTS.md and llms.txt, so agents get the reasons,
            not just the values.
          </p>
          <Link
            href="/install/"
            className="self-start text-[16px] font-semibold text-accent hover:underline"
          >
            How to install →
          </Link>
        </div>
        <div className="flex flex-col gap-4 rounded-[8px] border border-muted p-7 lg:w-[480px] lg:shrink-0">
          <Eyebrow tone="accent">Contribute</Eyebrow>
          <h2 className="text-[32px] font-extrabold">Add your answers.</h2>
          <p className="text-[16px] leading-[1.45] text-line">
            Publish your design system as a scheme: same questions, your answers, your reasons.
            Missing a question in a scope? Propose it.
          </p>
          <Link
            href="/contribute/"
            className="self-start rounded-[4px] bg-accent px-4 py-[10px] text-[16px] font-semibold text-ink"
          >
            Add a scheme
          </Link>
        </div>
      </section>
      <section
        aria-labelledby="open-source"
        className="flex flex-col gap-6 px-5 py-[72px] lg:px-20"
      >
        <Eyebrow>Built on open source</Eyebrow>
        <div className="flex flex-col gap-3">
          <h2 id="open-source" className="text-[32px] leading-[1.05] font-extrabold md:text-[40px]">
            Standing on good work.
          </h2>
          <p className="max-w-[820px] text-[17px] leading-[1.45] text-[#3e3a31]">
            {brandName} decides and explains; these projects do the building. Every design system we
            deliver uses them as their authors intend, keeps their licences, and credits them here
            and in its own files.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {OPEN_SOURCE.map(([name, href, what]) => (
            <li key={name}>
              <a
                href={href}
                rel="noopener"
                className="flex h-full flex-col gap-1 rounded-[6px] border border-line bg-white p-4 hover:border-ink"
              >
                <span className="text-[17px] font-semibold">{name} ↗</span>
                <span className="text-[14px] leading-[1.4] text-[#3e3a31]">{what}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
