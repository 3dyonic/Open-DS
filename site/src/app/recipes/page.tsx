import Link from "next/link";
import { stanceRecipes } from "@/lib/data";

export const metadata = { title: "Recipes" };

export default function RecipesPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Recipes</h1>
      <p>Five stance recipes. Each one is a path from Purpose through the decisions it records.</p>
      <div className="grid gap-4">
        {stanceRecipes.map((recipe) => (
          <article key={recipe.id} className="rounded-control border border-line p-4">
            <h2 className="text-xl font-semibold">{recipe.name}</h2>
            <p className="mt-2">{recipe.serves}</p>
            <p className="mt-4">
              <Link
                className="rounded-control bg-accent px-3 py-2 text-accent-fg"
                href={`/recipes/${recipe.id}/`}
              >
                Open this recipe
              </Link>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
