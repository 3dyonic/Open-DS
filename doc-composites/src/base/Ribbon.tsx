/**
 * Ribbon: one color scale as a row of cells, lightest first. A base form: the key strip and the
 * mini strips on How the scale is built extend it. size "lg" is a wide strip with each step's name in
 * its cell; "sm" is a thin strip with no words. The key step's cell is wider and carries its label.
 */
import * as React from "react";
import { ink } from "../color";

export type RibbonStep = { step: string; hex: string };

const SIZE = {
  lg: "h-28 rounded-[var(--radius-surface)]",
  sm: "h-6 rounded-[var(--radius-control)]",
} as const;

export default function Ribbon({
  steps,
  keyStep,
  keyLabel,
  size = "lg",
}: {
  steps: RibbonStep[];
  keyStep?: string;
  keyLabel?: React.ReactNode;
  size?: keyof typeof SIZE;
}) {
  return (
    <div className={`flex w-full overflow-hidden border-[length:var(--border-width-default)] border-[var(--color-border-default)] ${SIZE[size]}`}>
      {steps.map((s) => {
        const isKey = s.step === keyStep;
        return (
          <div
            key={s.step}
            title={`${s.step} ${s.hex}`}
            className={`flex min-w-0 flex-col justify-between ${isKey && size === "lg" ? "flex-[1.6]" : "flex-1"} ${size === "lg" ? "p-[var(--space-gap-tight)]" : ""}`}
            style={{ background: s.hex, color: ink(s.hex) }}
          >
            {size === "lg" && (
              <>
                <span className="min-h-0">{isKey ? keyLabel : null}</span>
                <span className={`text-[length:var(--type-caption-font-size)] [font-family:var(--type-data-font-family)] ${isKey ? "font-semibold" : ""}`}>{s.step}</span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
