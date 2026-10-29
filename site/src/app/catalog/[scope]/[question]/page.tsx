import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { packById, packList } from "@/lib/data";
import { questionsIn } from "@/lib/resolve";

export function generateStaticParams() {
  return packList.flatMap((pack) =>
    pack.questions.map((question) => ({ scope: pack.id, question: question.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ scope: string; question: string }>;
}): Promise<Metadata> {
  const { scope, question: questionId } = await params;
  const pack = packById(scope);
  const question = pack ? questionsIn(pack).find((item) => item.id === questionId) : undefined;
  return { title: question?.prompt ?? pack?.title ?? "Catalog" };
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ scope: string; question: string }>;
}) {
  const { scope, question: questionId } = await params;
  const pack = packById(scope);
  const question = pack ? questionsIn(pack).find((item) => item.id === questionId) : undefined;
  if (!pack || !question) notFound();
  return (
    <div className="grid gap-6">
      <p className="text-sm">
        <Link href={`/catalog/${pack.id}/`}>{pack.title}</Link>
      </p>
      <h1 className="text-3xl font-semibold">{question.prompt}</h1>
      <p>{question.summary}</p>
      <ul className="grid gap-4">
        {(question.options || []).map((option) => (
          <li key={option.id} className="rounded-control border border-line p-4">
            <h2 className="text-lg font-semibold">{option.label}</h2>
            <p className="mt-2">{option.why}</p>
            <p className="mt-2 text-sm">{option.when_to_choose}</p>
            <p className="mt-2 text-sm text-muted">Cost: {option.trade_offs[0]}</p>
            {option.formula ? <p className="mt-2 text-sm">Scheme: {option.formula}</p> : null}
            <ul className="mt-3 text-sm">
              {option.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url}>
                    {source.name}: {source.title}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              <Link
                className="rounded-control bg-accent px-3 py-2 text-sm text-accent-fg"
                href={`/build/?question=${question.id}&option=${option.id}`}
              >
                Use this option
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
