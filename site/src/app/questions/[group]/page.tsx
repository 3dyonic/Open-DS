// One group of questions: a reason group or a scope, with every option and the schemes that pick it.
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/chrome";
import { Options } from "@/components/options";
import { grammar, pickedBy } from "@/lib/schemes";

const groups = () => {
  const g = grammar();
  return [
    ...g.reasons.map((x) => ({ ...x, kind: "Reasons" as const })),
    ...g.scopes.map((x) => ({ ...x, kind: "Scopes" as const })),
  ];
};

export function generateStaticParams() {
  return groups().map((x) => ({ group: x.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ group: string }>;
}): Promise<Metadata> {
  const { group } = await params;
  const grp = groups().find((x) => x.id === group)!;
  return {
    title: `${grp.title} · Questions`,
    description: `The ${grp.title.toLowerCase()} questions every scheme answers, with every option and the schemes that pick it.`,
  };
}

export default async function QuestionGroupPage({
  params,
}: {
  params: Promise<{ group: string }>;
}) {
  const { group } = await params;
  const all = groups();
  const i = all.findIndex((x) => x.id === group);
  const grp = all[i];
  const next = all[i + 1];
  return (
    <>
      <header className="flex flex-col gap-3">
        <Eyebrow>{grp.kind}</Eyebrow>
        <h1 className="text-[40px] leading-[1.05] font-extrabold md:text-[48px]">{grp.title}</h1>
        <p className="max-w-[760px] text-[18px] leading-[1.45] text-body">{grp.description}</p>
      </header>
      <ol className="flex flex-col gap-8">
        {grp.questions.map((q, n) => (
          <li key={q.id} id={q.id} className="flex max-w-[760px] flex-col gap-3">
            <p className="text-[13px] text-muted">
              Question {n + 1} of {grp.questions.length} · {q.options.length} possible answers
            </p>
            <h2 className="text-[24px] leading-[1.2] font-extrabold">{q.text}</h2>
            {q.description && (
              <p className="text-[16px] leading-[1.45] text-body">{q.description}</p>
            )}
            <Options
              options={q.options}
              pickedBy={pickedBy(q.id)}
              label={`The options for: ${q.text}`}
            />
          </li>
        ))}
      </ol>
      {next && (
        <Link
          href={`/questions/${next.id}/`}
          className="self-start rounded-[4px] border border-ink px-5 py-[12px] text-[16px] font-semibold hover:bg-ink hover:text-paper"
        >
          Next: {next.title} →
        </Link>
      )}
    </>
  );
}
