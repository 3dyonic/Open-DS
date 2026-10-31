// A friendly note: the questions and answers show the idea; they are not a standard.
import Link from "next/link";

export function DemoNote({ className = "" }: { className?: string }) {
  return (
    <aside
      aria-label="About these questions and answers"
      className={`flex gap-3 rounded-[8px] border border-line bg-white p-5 ${className}`}
    >
      <span aria-hidden className="mt-[6px] size-[10px] shrink-0 bg-accent" />
      <div className="flex max-w-[880px] flex-col gap-2 text-[16px] leading-[1.5] text-body">
        <p className="font-semibold text-ink">A starting point, not the last word.</p>
        <p>
          These questions and answers are a sketch, written to show the idea. They are not a
          standard, and nobody handed them down from on high. What matters is the way of working:
          think a design system through with guided questions, write down every answer with its
          reason, and let those answers build what you ship.
        </p>
        <p>
          Disagree with a question or an answer? Good, that is the point. Change it in your own
          scheme, or{" "}
          <Link href="/contribute/" className="font-semibold text-ink underline">
            suggest a better one
          </Link>
          .
        </p>
      </div>
    </aside>
  );
}
