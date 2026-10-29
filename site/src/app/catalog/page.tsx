import Link from "next/link";
import { packList } from "@/lib/data";

export default function CatalogPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Catalog</h1>
      <p>Each scope is a set of decisions. Purpose comes first.</p>
      <ul className="grid gap-3">
        {packList.map((pack) => (
          <li key={pack.id} className="rounded-control border border-line p-4">
            <h2 className="font-semibold">
              <Link href={`/catalog/${pack.id}/`}>{pack.title}</Link>
            </h2>
            <p className="mt-1 text-sm text-muted">{pack.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
