// The privacy policy (OD-173), in plain words. It describes what the site and the hosted service
// actually do; if the service changes what it keeps, this page changes with it.
import type { Metadata } from "next";
import { Eyebrow } from "@/components/chrome";
import { brandContact, brandName } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Open DS keeps, why, for how long, and how to have it deleted.",
};

const UPDATED = "2026-11-01";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[24px] font-extrabold">{title}</h2>
      <div className="flex flex-col gap-3 text-[17px] leading-[1.55] text-body">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <article className="flex max-w-[820px] flex-col gap-10 px-5 pb-20 lg:px-20">
      <header className="flex flex-col gap-4">
        <Eyebrow>Privacy</Eyebrow>
        <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[56px]">
          What we keep, and why
        </h1>
        <p className="font-mono text-[13px] text-muted">Updated {UPDATED}</p>
      </header>

      <Section title="The short version">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>The website sets no cookies and runs no analytics or tracking.</li>
          <li>
            If you ask for a key, we keep what you send in the form to decide and to reach you.
          </li>
          <li>Keys are stored only as a hash. Nobody, us included, can read your key back.</li>
          <li>
            For the hosted MCP server we count tool calls by a hash of your key, for 30 days. We
            never keep what you asked.
          </li>
          <li>The CLI and the local MCP server run on your computer and send us nothing.</li>
        </ul>
      </Section>

      <Section title="The website">
        <p>
          The site sets no cookies and loads no analytics, advertising or tracking scripts. If you
          pick light or dark with the theme switch, that choice stays in your browser’s local
          storage and never reaches us. The service that serves the site does not store IP
          addresses. Our host and DNS provider process each request to deliver it.
        </p>
      </Section>

      <Section title="When you ask for a key">
        <p>
          The form asks for your full name, work email and organization, and, if you add them, your
          role, a LinkedIn profile, a website or GitHub link, what you will use {brandName} for, the
          AI clients you use and your team size. We keep them to decide on your request, to email
          you about it and, if you are approved, to send your key link. We record when you agreed to
          this policy.
        </p>
        <p>
          The people who review requests are the {brandName} admins. We do not sell or share your
          details with anyone else.
        </p>
      </Section>

      <Section title="Email">
        <p>
          We send email through Resend: that we got your request, and, if you are approved, a link
          that shows your key once. The link works once and expires after 7 days. The email never
          contains the key itself.
        </p>
      </Section>

      <Section title="Your key and the hosted MCP server">
        <p>
          Your key is shown once and stored only as a hash. When your AI calls the hosted MCP
          server, we keep one row per tool call: a hash of your key, the tool’s name, the scheme it
          asked about and the type of thing it asked for (for example “question”). We never keep the
          question, your prompts, your files or your IP address. These rows are deleted after 30
          days. Admins see use only by key hash, not by name.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          The public site sets none. The admin area sets one cookie that keeps an admin signed in
          for up to 7 days. It is only set for admins who sign in.
        </p>
      </Section>

      <Section title="How long, and deleting it">
        <p>
          We keep your request and key for as long as you have a key or your request is open. Usage
          rows go after 30 days. To have everything about you deleted (your request, your keys and
          their usage), write to{" "}
          <a href={`mailto:${brandContact}`} className="font-semibold text-accent-text underline">
            {brandContact}
          </a>{" "}
          or reply to any email you got from {brandName}. We delete it and confirm.
        </p>
      </Section>

      <Section title="Changes">
        <p>If we change what we keep, we change this page first and update the date at the top.</p>
      </Section>
    </article>
  );
}
