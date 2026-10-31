// The schemes index: the Home scheme cards on their own page.
import type { Metadata } from "next";
import { Eyebrow } from "@/components/chrome";
import { DemoNote } from "@/components/demo-note";
import { WithRobot } from "@/components/robot";
import { SchemeCards } from "@/components/scheme-cards";

export const metadata: Metadata = {
  title: "Schemes",
  description: "Every Open DS scheme: the same questions, different answers.",
};

export default function SchemesPage() {
  return (
    <div className="flex flex-col gap-8 px-5 pb-20 lg:px-20">
      <WithRobot name="shelf" priority>
        <Eyebrow>Schemes</Eyebrow>
        <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[56px]">Pick a scheme.</h1>
        <p className="max-w-[820px] text-[19px] leading-[1.45] text-body">
          Each scheme answers every question in the grammar and says why. Open one to see its
          reasons, its answers and the screen they build.
        </p>
      </WithRobot>
      <DemoNote />
      <SchemeCards />
    </div>
  );
}
