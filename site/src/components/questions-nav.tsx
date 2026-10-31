"use client";
// The side menu of the Questions pages: the overview, then every reason group and scope.
// It sticks beside the page on wide screens and folds into a "Jump to" list on phones.
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavGroup = { id: string; title: string; count: number };

function Section({
  title,
  groups,
  current,
}: {
  title: string;
  groups: NavGroup[];
  current: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="px-3 pt-3 pb-1 font-mono text-[11px] font-medium uppercase tracking-[0.44px] text-muted">
        {title}
      </p>
      <ul className="flex flex-col">
        {groups.map((g) => {
          const on = g.id === current;
          return (
            <li key={g.id}>
              <Link
                href={`/questions/${g.id}/`}
                aria-current={on ? "page" : undefined}
                className={`flex items-center justify-between gap-2 rounded-[4px] px-3 py-[6px] text-[15px] ${on ? "bg-ink font-semibold text-paper" : "hover:bg-white"}`}
              >
                {g.title}
                <span className={`font-mono text-[11px] ${on ? "text-line" : "text-muted"}`}>
                  {g.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function QuestionsNav({ reasons, scopes }: { reasons: NavGroup[]; scopes: NavGroup[] }) {
  const path = usePathname();
  const current = path.split("/").filter(Boolean)[1] ?? "";
  const all = [...reasons, ...scopes];
  const here = all.find((g) => g.id === current)?.title ?? "Overview";
  const menu = (
    <nav aria-label="Questions" className="flex flex-col">
      <Link
        href="/questions/"
        aria-current={current === "" ? "page" : undefined}
        className={`rounded-[4px] px-3 py-[6px] text-[15px] ${current === "" ? "bg-ink font-semibold text-paper" : "hover:bg-white"}`}
      >
        Overview
      </Link>
      <Section title="Reasons" groups={reasons} current={current} />
      <Section title="Scopes" groups={scopes} current={current} />
    </nav>
  );
  return (
    <>
      <details
        key={path}
        className="sticky top-0 z-20 -mx-5 border-b border-line bg-paper/95 px-5 backdrop-blur lg:hidden"
      >
        <summary className="cursor-pointer py-3 text-[15px] font-semibold">
          Jump to: <span className="font-normal">{here}</span>
        </summary>
        <div className="max-h-[70vh] overflow-y-auto border-t border-line py-2">{menu}</div>
      </details>
      <aside className="hidden lg:block lg:w-[240px] lg:shrink-0">
        <div className="sticky top-6 max-h-[calc(100vh-48px)] overflow-y-auto pb-6">{menu}</div>
      </aside>
    </>
  );
}
