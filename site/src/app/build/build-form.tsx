"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { packList, packs, type Option, type Question } from "@/lib/data";
import { questionsIn } from "@/lib/resolve";
import { canonicalRecipe, checkRecipe, missingQuestionReport, shareCode } from "@/lib/check.mjs";

type Pick = { option: string; rationale: string; params: Record<string, string> };
type Badge = { label: string; because: string; reason: string };

const BADGE = {
  recommends: "Fits your purpose",
  discourages: "Worth a second look",
  requires: "Your purpose needs this",
} as const;

function resolvedQuestions(): { packId: string; question: Question }[] {
  const rows: { packId: string; question: Question }[] = [];
  const seen = new Set<string>();
  for (const pack of packList) {
    for (const question of questionsIn(pack)) {
      if (seen.has(question.id)) continue;
      seen.add(question.id);
      rows.push({ packId: pack.id, question });
    }
  }
  return rows;
}

function purposeBadges(questionId: string, optionId: string, picks: Record<string, Pick>): Badge[] {
  const badges: Badge[] = [];
  for (const question of questionsIn(packs.purpose)) {
    const pick = picks[question.id];
    if (!pick?.option) continue;
    const chosen = (question.options || []).find((item) => item.id === pick.option);
    if (!chosen) continue;
    for (const key of ["recommends", "discourages", "requires"] as const) {
      for (const effect of chosen[key] || []) {
        if (effect.question === questionId && effect.option === optionId) {
          badges.push({ label: BADGE[key], because: chosen.label, reason: effect.reason });
        }
      }
    }
  }
  return badges;
}

export function BuildForm() {
  const params = useSearchParams();
  const presetQuestion = params.get("question") || "";
  const presetOption = params.get("option") || "";
  const rows = useMemo(resolvedQuestions, []);
  const [picks, setPicks] = useState<Record<string, Pick>>(() => {
    if (!presetQuestion || !presetOption) return {};
    return { [presetQuestion]: { option: presetOption, rationale: "", params: {} } };
  });
  const [result, setResult] = useState<{
    ok: boolean;
    findings: { id: string; severity: string; message: string; question?: string }[];
    fingerprint?: string;
  } | null>(null);
  const [copied, setCopied] = useState("");

  const purposeIds = new Set(packs.purpose.questions.map((question) => question.id));
  const purposeDone = packs.purpose.questions.every(
    (question) => picks[question.id]?.option && picks[question.id]?.rationale.trim(),
  );
  const blocked = (result?.findings || []).some((item) => item.id === "required-option");
  const copyLocked = blocked || !result?.ok;
  const missingQuestions: { summary: string; lines: string[]; fix: string } | null = result
    ? missingQuestionReport(result.findings)
    : null;
  const otherFindings = (result?.findings || []).filter((item) => item.id !== "missing-question");

  function recipe() {
    return {
      id: "draft",
      name: "Draft",
      version: "0.1.0",
      provisional: true,
      summary: "A draft recipe from the builder.",
      serves: "A design system described by these picks.",
      packs: packList.map((pack) => pack.id),
      picks: Object.entries(picks)
        .filter(([, pick]) => pick.option)
        .map(([question, pick]) => ({
          question,
          option: pick.option,
          rationale: pick.rationale,
          ...(Object.keys(pick.params).length ? { params: pick.params } : {}),
        })),
    };
  }

  async function onCheck() {
    const checked = await checkRecipe(recipe(), packs);
    setResult(checked);
  }

  async function onCopy() {
    if (blocked || !result?.ok) return;
    await navigator.clipboard.writeText(canonicalRecipe(recipe()));
    setCopied("Copied to clipboard.");
  }

  async function onShare() {
    if (blocked || !result?.ok || !result.fingerprint) return;
    const url = `${window.location.origin}/recipe/${result.fingerprint}/#${shareCode(recipe())}`;
    await navigator.clipboard.writeText(url);
    setCopied("Copied to clipboard.");
  }

  return (
    <div className="grid gap-8">
      <h1 className="text-3xl font-semibold">Build a recipe</h1>
      <p>Start with purpose. Each pick asks why. The words you write are the rationale.</p>
      <form
        className="grid gap-8"
        onSubmit={(event) => {
          event.preventDefault();
          void onCheck();
        }}
      >
        {rows.map(({ packId, question }) => (
          <fieldset
            key={question.id}
            className="grid gap-3 rounded-control border border-line p-4"
            disabled={packId !== "purpose" && !purposeDone}
          >
            <legend className="px-1 font-semibold">
              {purposeIds.has(question.id) ? "Step 1. " : ""}
              {question.prompt}
            </legend>
            <p className="text-sm text-muted">{question.summary}</p>
            {(question.options || []).map((option) => (
              <OptionRow
                key={option.id}
                question={question}
                option={option}
                pick={picks[question.id]}
                badges={purposeBadges(question.id, option.id, picks)}
                onChange={(next) => setPicks({ ...picks, [question.id]: next })}
              />
            ))}
            {picks[question.id]?.option ? (
              <label className="grid gap-1 text-sm">
                Why this choice?
                <textarea
                  className="min-h-20 rounded-control border border-line bg-paper p-2"
                  maxLength={280}
                  required
                  value={picks[question.id].rationale}
                  onChange={(event) =>
                    setPicks({
                      ...picks,
                      [question.id]: { ...picks[question.id], rationale: event.target.value },
                    })
                  }
                />
              </label>
            ) : null}
          </fieldset>
        ))}
        <div className="flex flex-wrap gap-3">
          <button className="rounded-control bg-accent px-4 py-2 text-accent-fg" type="submit">
            Check this recipe
          </button>
          <button
            className="rounded-control border border-ink px-4 py-2 disabled:opacity-40"
            type="button"
            disabled={copyLocked}
            aria-describedby={copyLocked ? "finish-recipe-reason" : undefined}
            onClick={() => void onCopy()}
          >
            Copy recipe JSON
          </button>
          <button
            className="rounded-control border border-ink px-4 py-2 disabled:opacity-40"
            type="button"
            disabled={copyLocked}
            aria-describedby={copyLocked ? "finish-recipe-reason" : undefined}
            onClick={() => void onShare()}
          >
            Copy share link
          </button>
          {copyLocked ? <p id="finish-recipe-reason">Finish your recipe to copy it.</p> : null}
        </div>
      </form>
      {blocked ? (
        <p className="rounded-control border border-bad p-3 text-bad" role="alert">
          Your purpose needs this. The build step stays blocked until that option is selected.
        </p>
      ) : null}
      <div aria-live="polite" className={copied ? undefined : "sr-only"}>
        {copied ? <p>{copied}</p> : null}
      </div>
      <section
        aria-live="polite"
        aria-atomic="true"
        aria-label="Check results"
        className={result ? "grid gap-2" : "sr-only"}
      >
        {result ? (
          <>
            <h2 className="text-xl font-semibold">
              {result.ok ? "Check passed" : "Check did not pass"}
            </h2>
            {result.fingerprint && !blocked ? (
              <p className="break-all text-sm">Fingerprint {result.fingerprint}</p>
            ) : null}
            {missingQuestions?.summary ? <p>{missingQuestions.summary}</p> : null}
            {missingQuestions?.fix ? <p>{missingQuestions.fix}</p> : null}
            <ul className="grid gap-2">
              {missingQuestions?.lines.map((line: string) => (
                <li key={line} className="text-sm">
                  {line}
                </li>
              ))}
              {otherFindings.map((item, index) => (
                <li key={`${item.id}-${index}`} className="text-sm">
                  <span
                    className={
                      item.severity === "error"
                        ? "text-bad"
                        : item.severity === "warning"
                          ? "text-warn"
                          : "text-info"
                    }
                  >
                    {item.severity}
                  </span>{" "}
                  {item.message}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>
    </div>
  );
}

function OptionRow({
  question,
  option,
  pick,
  badges,
  onChange,
}: {
  question: Question;
  option: Option;
  pick?: Pick;
  badges: Badge[];
  onChange: (next: Pick) => void;
}) {
  const selected = pick?.option === option.id;
  return (
    <div className="grid gap-2">
      <label className="flex gap-2">
        <input
          type="radio"
          name={question.id}
          checked={selected}
          onChange={() =>
            onChange({ option: option.id, rationale: pick?.rationale || "", params: {} })
          }
        />
        <span>
          <span className="font-medium">{option.label}</span>
          <span className="mt-1 block text-sm text-muted">{option.when_to_choose}</span>
        </span>
      </label>
      {badges.map((badge) => (
        <p
          key={badge.label}
          className="ml-6 text-sm"
          title={`Because you chose ${badge.because}: ${badge.reason}`}
        >
          <span className="rounded-control border border-line px-2 py-1">{badge.label}</span>
          <span className="mt-1 block text-muted">
            Because you chose {badge.because}: {badge.reason}
          </span>
        </p>
      ))}
    </div>
  );
}
