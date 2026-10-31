// The 404 page: Slumber has wound down and the page is not here.
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/chrome";
import { Robot } from "@/components/robot";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="flex flex-col items-center gap-6 px-5 pt-14 pb-20 text-center lg:px-20">
      <Robot name="slumber" priority className="h-[280px] w-auto md:h-[340px]" />
      <Eyebrow>404 · Not found</Eyebrow>
      <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[56px]">
        This page isn’t here.
      </h1>
      <p className="max-w-[620px] text-[19px] leading-[1.45] text-body">
        The link may be old, or the page moved. Start again from the schemes or the questions.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link
          href="/schemes/"
          className="flex items-center gap-[10px] rounded-[4px] bg-ink px-5 py-[14px] text-[17px] font-semibold text-paper"
        >
          <span aria-hidden className="size-[8px] bg-accent" />
          See the schemes
        </Link>
        <Link
          href="/"
          className="rounded-[4px] border border-ink px-5 py-[14px] text-[17px] font-semibold"
        >
          Go home
        </Link>
      </div>
    </section>
  );
}
