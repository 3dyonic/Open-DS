// The Questions pages share one side menu: the overview, the reason groups and the scopes.
import { QuestionsNav } from "@/components/questions-nav";
import { grammar } from "@/lib/schemes";

export default function QuestionsLayout({ children }: { children: React.ReactNode }) {
  const g = grammar();
  const nav = (list: typeof g.reasons) =>
    list.map((x) => ({ id: x.id, title: x.title, count: x.questions.length }));
  return (
    <div className="flex flex-col gap-6 px-5 pb-20 lg:flex-row lg:gap-12 lg:px-20">
      <QuestionsNav reasons={nav(g.reasons)} scopes={nav(g.scopes)} />
      <div className="flex min-w-0 flex-1 flex-col gap-10">{children}</div>
    </div>
  );
}
