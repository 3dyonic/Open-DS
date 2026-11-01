"use client";
// The key request form. Posts JSON to /api/key-requests on the same host (open-ds-ops checks it again).
import Link from "next/link";
import { useState } from "react";

const CLIENTS = [
  "Claude Code",
  "Claude (desktop or claude.ai)",
  "Cursor",
  "VS Code",
  "Windsurf",
  "Other",
];
// The same list the service accepts (open-ds-ops, src/keys.mjs).
const TEAM_SIZES = ["Just me", "2–10", "11–50", "51–200", "201–1000", "More than 1000"];

type Errors = Partial<Record<string, string>>;

const input =
  "h-11 w-full rounded-[4px] border border-line bg-white px-3 text-[16px] text-ink outline-none focus:border-ink";

function Field({
  name,
  label,
  hint,
  error,
  children,
}: {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[15px] font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-[13px] text-muted">{hint}</p>}
      {error && (
        <p id={`${name}-error`} className="text-[13px] font-medium text-accent-text">
          {error}
        </p>
      )}
    </div>
  );
}

export function KeyRequestForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = {
      name: f.get("name"),
      email: f.get("email"),
      organization: f.get("organization"),
      role: f.get("role"),
      linkedin: f.get("linkedin"),
      website: f.get("website"),
      use_case: f.get("use_case"),
      clients: f.getAll("clients"),
      team_size: f.get("team_size"),
      consent: f.get("consent") === "on",
      company_url: f.get("company_url"),
    };
    setState("sending");
    setErrors({});
    try {
      const r = await fetch("/api/key-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok) return setState("done");
      if (r.status === 400 && data.errors) {
        setErrors(data.errors);
        setState("idle");
        return;
      }
      setMessage(data.error ?? "The request could not be sent. Try again in a few minutes.");
      setState("failed");
    } catch {
      setMessage("The request could not be sent. Check your connection and try again.");
      setState("failed");
    }
  }

  if (state === "done")
    return (
      <div
        role="status"
        className="flex flex-col gap-3 rounded-[8px] border border-line bg-white p-8"
      >
        <h2 className="text-[28px] font-extrabold">Thanks. We got your request.</h2>
        <p className="text-[17px] text-body">
          We sent you an email to say so. A person reads every request, and we will email you when
          we decide. Invitations are limited in number during the Beta.
        </p>
      </div>
    );

  const err = (n: string) => errors[n];
  const aria = (n: string) =>
    err(n) ? { "aria-invalid": true as const, "aria-describedby": `${n}-error` } : {};

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex flex-col gap-5 rounded-[8px] border border-line bg-white p-6 md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field name="name" label="Full name" error={err("name")}>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            className={input}
            {...aria("name")}
          />
        </Field>
        <Field name="email" label="Work email" error={err("email")}>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={input}
            {...aria("email")}
          />
        </Field>
        <Field name="organization" label="Organization" error={err("organization")}>
          <input
            id="organization"
            name="organization"
            required
            autoComplete="organization"
            className={input}
            {...aria("organization")}
          />
        </Field>
        <Field name="role" label="Role" hint="Optional" error={err("role")}>
          <input
            id="role"
            name="role"
            autoComplete="organization-title"
            className={input}
            {...aria("role")}
          />
        </Field>
        <Field
          name="linkedin"
          label="LinkedIn profile"
          hint="Optional. The full link."
          error={err("linkedin")}
        >
          <input
            id="linkedin"
            name="linkedin"
            type="url"
            placeholder="https://www.linkedin.com/in/…"
            className={input}
            {...aria("linkedin")}
          />
        </Field>
        <Field name="website" label="Website or GitHub" hint="Optional" error={err("website")}>
          <input
            id="website"
            name="website"
            type="url"
            placeholder="https://"
            className={input}
            {...aria("website")}
          />
        </Field>
      </div>

      <Field
        name="use_case"
        label="What will you use it for?"
        hint="A sentence or two: the product, and what you want the design system to do."
        error={err("use_case")}
      >
        <textarea
          id="use_case"
          name="use_case"
          required
          rows={4}
          className={`${input} h-auto py-2`}
          {...aria("use_case")}
        />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-[15px] font-semibold text-ink">
          Which AI clients do you use?
        </legend>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {CLIENTS.map((c) => (
            <label key={c} className="flex items-center gap-2 text-[15px] text-body">
              <input
                type="checkbox"
                name="clients"
                value={c}
                className="size-4 accent-[var(--color-ink)]"
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      <Field name="team_size" label="Team size" hint="Optional" error={err("team_size")}>
        <select
          id="team_size"
          name="team_size"
          defaultValue=""
          className={input}
          {...aria("team_size")}
        >
          <option value="">Choose</option>
          {TEAM_SIZES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      {/* People never see or fill this; bots often do. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Company URL
          <input name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-2 text-[15px] text-body">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 size-4 accent-[var(--color-ink)]"
            {...aria("consent")}
          />
          <span>
            I agree to the{" "}
            <Link href="/privacy/" className="font-semibold text-accent-text underline">
              privacy policy
            </Link>{" "}
            and the{" "}
            <Link href="/terms/" className="font-semibold text-accent-text underline">
              terms
            </Link>
            . Open DS keeps what I send here to decide on my request and to reach me about it.
          </span>
        </label>
        {err("consent") && (
          <p id="consent-error" className="text-[13px] font-medium text-accent-text">
            {err("consent")}
          </p>
        )}
      </div>

      {(state === "failed" || err("form")) && (
        <p role="alert" className="rounded-[4px] bg-accent-soft px-3 py-2 text-[15px] text-ink">
          {message || err("form")}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={state === "sending"}
          className="flex items-center gap-[10px] rounded-[4px] bg-ink px-5 py-[14px] text-[17px] font-semibold text-paper disabled:opacity-60"
        >
          <span aria-hidden className="size-[8px] bg-accent" />
          {state === "sending" ? "Sending…" : "Ask for a key"}
        </button>
      </div>
    </form>
  );
}
