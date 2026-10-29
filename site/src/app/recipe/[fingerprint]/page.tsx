import Link from "next/link";
import { notFound } from "next/navigation";
import { showcase } from "@/lib/data";
import { CopyButtons } from "@/app/recipe/copy-buttons";

export function generateStaticParams() {
  return [{ fingerprint: showcase.manifest.fingerprint }];
}

export default async function RecipePage({ params }: { params: Promise<{ fingerprint: string }> }) {
  const { fingerprint } = await params;
  if (fingerprint !== showcase.manifest.fingerprint) notFound();
  const recipe = showcase.recipe;
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">{recipe.name}</h1>
      <p>{recipe.serves}</p>
      <p className="break-all text-sm">Fingerprint {fingerprint}</p>
      <CopyButtons recipe={recipe} />
      <p>
        <Link className="rounded-control border border-ink px-3 py-2" href="/build/">
          Edit in the builder
        </Link>
      </p>
      <p>
        <a
          className="rounded-control bg-accent px-3 py-2 text-accent-fg"
          href="https://github.com/3dyonic/Open-DS/tree/master/boilerplates/3dyonic"
        >
          Get the boilerplate
        </a>
      </p>
      <h2 className="text-xl font-semibold">Decisions</h2>
      <ul className="grid gap-3">
        {recipe.picks.map((pick) => (
          <li key={pick.question} className="rounded-control border border-line p-3">
            <p className="font-medium">{pick.question}</p>
            <p className="text-sm">Option {pick.option}</p>
            <p className="text-sm">{pick.rationale}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
