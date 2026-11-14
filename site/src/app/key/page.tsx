// Ask for a key. Open DS is in Beta and invitations are limited, so every request is read by
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

const code = (s: string) => <code className="font-mono">{s}</code>;

export default function KeyPage() {
  return (
    <div className="flex flex-col gap-10 px-5 pb-20 lg:px-20">
      <WithRobot name="parcel" priority>
        <Eyebrow>Beta · Limited invitations</Eyebrow>
        <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[56px]">Get a key</h1>
        <p className="max-w-[760px] text-[19px] leading-[1.45] text-body">
          The hosted Open DS MCP server needs a key. With one, any AI client connects by URL:
          nothing to install, and every scheme stays up to date. Open DS is in Beta and invitations
          are limited in number, so a person reads every request. If you are approved, we email you
          a link that shows your key once.
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
            <h2 className="text-[17px] font-bold text-ink">No key yet? Start now</h2>
            <p>
              The key is only for the hosted server. Run the same MCP server on your computer, or
              the CLI, from the {code("open-ds")} package on npm. No key, and nothing leaves your
              machine.
            </p>
            <Link
              href="/install/#local"
              className="self-start rounded-[4px] border border-ink px-4 py-[10px] text-[15px] font-semibold text-ink"
            >
              Run it locally
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
