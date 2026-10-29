import Link from "next/link";
import { brandCopy, brandName } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="grid gap-8">
      <p className="text-sm text-muted">{brandName}</p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight">{brandCopy.tagline}</h1>
      <p className="max-w-2xl text-lg">{brandCopy.subhead}</p>
      <div className="flex flex-wrap gap-3">
        <Link className="rounded-control bg-accent px-4 py-2 text-accent-fg" href="/build/">
          {brandCopy.ctaPrimary}
        </Link>
        <Link className="rounded-control border border-ink px-4 py-2" href="/docs/">
          {brandCopy.ctaSecondary}
        </Link>
      </div>
      <p>
        <Link href="/case-study/">See the 3dyonic boilerplate</Link>
      </p>
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-control border border-line p-4">
          <h2 className="font-semibold">A cited answer</h2>
          <p className="mt-2 text-sm">
            Each option names its source, why it exists, and what it costs.
          </p>
        </article>
        <article className="rounded-control border border-line p-4">
          <h2 className="font-semibold">A check</h2>
          <p className="mt-2 text-sm">
            A missing requirement is an error. A discouraged pick is a warning.
          </p>
        </article>
        <article className="rounded-control border border-line p-4">
          <h2 className="font-semibold">A boilerplate</h2>
          <p className="mt-2 text-sm">
            Tokens, CSS, and components that a person wrote to follow the recipe.
          </p>
        </article>
      </section>
    </div>
  );
}
