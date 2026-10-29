import Link from "next/link";
import { showcase } from "@/lib/data";

export const metadata = { title: "Recipes" };

export default function RecipesPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Recipes</h1>
      <p>
        A recipe is one path through the dictionary. Values on the 3dyonic recipe are provisional.
      </p>
      <article className="rounded-control border border-line p-4">
        <h2 className="text-xl font-semibold">{showcase.recipe.name}</h2>
        <p className="mt-2">{showcase.recipe.serves}</p>
        <p className="mt-4">
          <Link
            className="rounded-control bg-accent px-3 py-2 text-accent-fg"
            href={`/recipe/${showcase.manifest.fingerprint}/`}
          >
            Open this recipe
          </Link>
        </p>
      </article>
    </div>
  );
}
