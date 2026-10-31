"use client";
// A command block with a copy button. The command is shown as it is typed.
import { useState } from "react";

export function Command({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-start gap-3 rounded-[6px] bg-ink p-4 text-paper">
      <pre className="min-w-0 flex-1 overflow-x-auto font-mono text-[14px] leading-[1.5] whitespace-pre-wrap">
        {code}
      </pre>
      <button
        type="button"
        aria-label={label ? `Copy: ${label}` : "Copy the command"}
        onClick={() => {
          navigator.clipboard?.writeText(code).then(
            () => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            },
            () => setCopied(false),
          );
        }}
        className="shrink-0 rounded-[4px] border border-muted px-2 py-1 font-mono text-[12px] text-line hover:border-paper hover:text-paper"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
