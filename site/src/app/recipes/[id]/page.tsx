import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { stanceRecipes } from "@/lib/data";

export function generateStaticParams() {
  return stanceRecipes.map((recipe) => ({ id: recipe.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const recipe = stanceRecipes.find((item) => item.id === id);
  return { title: recipe?.name ?? "Recipe" };
}

export default async function StanceRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = stanceRecipes.find((item) => item.id === id);
  if (!recipe) notFound();
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">{recipe.name}</h1>
      <p>{recipe.serves}</p>
      <p>
        <Link className="rounded-control border border-ink px-3 py-2" href="/recipes/">
          All recipes
        </Link>
      </p>
      <h2 className="text-xl font-semibold">Chain from Purpose</h2>
      <ul className="grid gap-2">
        <li>Purpose: {recipe.serves}</li>
        {recipe.chain.map((link) => (
          <li key={`${link.from}-${link.to}-${link.rule}`}>{link.line}</li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold">Picks</h2>
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
