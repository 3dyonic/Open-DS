// Home, built from the Figma frame S00 Home / 1440 (115:900).
import Link from "next/link";
import { Eyebrow } from "@/components/chrome";
import { Proof } from "@/components/proof";
import { SchemeCards, Squares } from "@/components/scheme-cards";
import { HOME_SCHEMES, proofData } from "@/lib/home";

const STEPS = [
  {
    title: "1 · Pick a scheme",
    text: "Start from a ready-made design system for a product like yours: dense data, content, accessibility first, multi-brand, or an expressive brand.",
    chips: ["Dense data", "Content first", "Accessible first"],
  },
  {
    title: "2 · Deploy it",
    text: "Connect your AI through MCP and it deploys the scheme, keeping every answer and its reason, so it builds the way the system would. Or install the package and do it yourself.",
    chips: ["“Deploy Dense data”", "open-ds init", "get_answer(id)"],
  },
  {
    title: "3 · Change what differs",
    text: "When your product is different, change that one answer. See what moves, and keep it as your own flavour of the scheme.",
    chips: ["accessibility.values → Touch", "See what moves", "Compare schemes"],
  },
];

const TAKE: [string, string][] = [
  ["Agent", "Connect your AI: “Deploy the Dense data scheme.”"],
  ["CLI", "open-ds init dense-data"],
  ["Link", "/schemes/dense-data"],
];

const DELIVERABLES = [
  "Components · copied in, shadcn-style",
  "Storybook",
  "Style Dictionary tokens",
  "DTCG · CSS · Tailwind",
  "Agent skill",
  "Docs",
  "CI checks",
  "The answer map",
];

export default function Home() {
  return (
    <>
      <section className="flex flex-col gap-10 px-5 pt-14 pb-[72px] lg:px-20">
        <div className="flex flex-col gap-5">
          <Eyebrow>For makers, product teams and their AI</Eyebrow>
          <h1 className="text-[44px] leading-none font-extrabold md:text-[72px]">
            Every design system
            <br />
            is a set of answers.
          </h1>
          <p className="max-w-[820px] text-[21px] leading-[1.45] text-[#3e3a31]">
            Pick a ready-made design system scheme. Connect your AI and deploy it, or use the
            package and do it yourself. Every value comes with the product reason behind it. Change
            an answer only where your product is different.
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
        <ol className="grid gap-5 lg:grid-cols-3 lg:items-start">
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
    </>
  );
}
