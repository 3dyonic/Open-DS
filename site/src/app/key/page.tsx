// Ask for a key (OD-168). Open DS is in Beta and invitations are limited, so every request is read by
// a person. The form posts to the hosted service (/api/key-requests); approved people get a one-time
// link by email that shows their key once.
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/chrome";
import { KeyRequestForm } from "@/components/key-form";
import { WithRobot } from "@/components/robot";

export const metadata: Metadata = {
  title: "Get a key",
  description:
    "Ask for an Open DS key for the hosted MCP server. Open DS is in Beta and invitations are limited in number.",
};

export default function KeyPage() {
  return (
    <div className="flex flex-col gap-10 px-5 pb-20 lg:px-20">
      <WithRobot name="parcel" priority>
        <Eyebrow>Beta · Limited invitations</Eyebrow>
        <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[56px]">Get a key</h1>
        <p className="max-w-[760px] text-[19px] leading-[1.45] text-body">
          A key connects your AI to the hosted Open DS MCP server as you. Open DS is in Beta and
          invitations are limited in number, so a person reads every request. If you are approved,
          we email you a link that shows your key once.
        </p>
      </WithRobot>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <KeyRequestForm />
        <aside className="flex flex-col gap-4 text-[15px] text-body">
          <div className="flex flex-col gap-2 rounded-[6px] border border-line bg-white p-5">
            <h2 className="text-[17px] font-bold text-ink">What happens next</h2>
            <ol className="flex list-decimal flex-col gap-2 pl-5">
              <li>We email you that we got your request.</li>
              <li>A person reads it. Invitations are limited, so this can take a few days.</li>
              <li>
                If you are approved, the email has a one-time link. It shows your key once, with
                setup for your AI client.
              </li>
            </ol>
          </div>
          <div className="flex flex-col gap-2 rounded-[6px] border border-line bg-white p-5">
            <h2 className="text-[17px] font-bold text-ink">No key yet?</h2>
            <p>
              You can use Open DS now. The CLI and a local MCP server run from npm with no key. See{" "}
              <Link href="/install/" className="font-semibold text-accent-text hover:underline">
                How to install
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
