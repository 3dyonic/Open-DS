import Link from "next/link";
import { showcase } from "@/lib/data";

export default function CaseStudyPage() {
  return (
    <div className="grid max-w-3xl gap-6">
      <h1 className="text-3xl font-semibold">3dyonic, provisional</h1>
      <p>{showcase.recipe.serves}</p>
      <p>
        This recipe records one path through the dictionary. A person wrote the boilerplate to
        follow those decisions. The hex values are provisional. Open DS did not calculate them.
      </p>
      <p>
        The boilerplate keeps structure apart from theme. Components use CSS variables only. Light
        and dark are modifiers on one theme.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          className="rounded-control bg-accent px-3 py-2 text-accent-fg"
          href={`/recipe/${showcase.manifest.fingerprint}/`}
        >
          Read the recipe
        </Link>
        <Link className="rounded-control border border-ink px-3 py-2" href="/build/">
          Start picking
        </Link>
      </div>
    </div>
  );
}
