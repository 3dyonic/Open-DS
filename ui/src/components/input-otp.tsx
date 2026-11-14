/**
 * Input otp. Separate boxes for a one-time code.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads only component keys: --input-otp-*. Each slot is a field like the input: a square at the
 * field height, the surface fill, the disabled roles, no card shadow; the active slot keeps the
 * focus ring's gap. Dark mode comes from the tokens, so no dark: classes.
 */
"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "group/input-otp flex items-center gap-[var(--input-otp-gap)]",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="input-otp-group" className={cn("flex items-center", className)} {...props} />;
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-[var(--input-otp-slot-size)] items-center justify-center border-y-[length:var(--input-otp-slot-border-width)] border-r-[length:var(--input-otp-slot-border-width)] border-[color:var(--input-otp-slot-border)] bg-[color:var(--input-otp-slot-background)] text-[length:var(--input-otp-slot-font-size)]/[var(--input-otp-slot-line-height)] transition-[color,box-shadow] duration-[var(--input-otp-slot-duration)] ease-[var(--input-otp-slot-easing)] outline-none first:rounded-l-[var(--input-otp-slot-radius)] first:border-l-[length:var(--input-otp-slot-border-width)] last:rounded-r-[var(--input-otp-slot-radius)] aria-invalid:border-[color:var(--input-otp-slot-border-invalid)]",
        "data-[active=true]:z-10 data-[active=true]:border-[color:var(--input-otp-slot-border-highlight)] data-[active=true]:ring-[length:var(--input-otp-slot-focus-width)] data-[active=true]:ring-[color:var(--input-otp-slot-focus-ring-highlight)] data-[active=true]:ring-offset-[length:var(--input-otp-slot-focus-offset)] data-[active=true]:ring-offset-[color:var(--input-otp-slot-focus-ring-offset-color)] data-[active=true]:aria-invalid:border-[color:var(--input-otp-slot-border-invalid)] data-[active=true]:aria-invalid:ring-[color:var(--input-otp-slot-focus-ring-invalid)]",
        "group-has-[input:disabled]/input-otp:bg-[color:var(--input-otp-slot-disabled-background)] group-has-[input:disabled]/input-otp:border-[color:var(--input-otp-slot-disabled-border)] group-has-[input:disabled]/input-otp:text-[color:var(--input-otp-slot-disabled-text)]",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[var(--input-otp-caret-height)] w-[var(--input-otp-caret-width)] animate-caret-blink bg-[color:var(--input-otp-caret-background)] duration-[var(--input-otp-caret-duration)]" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon className="size-[var(--input-otp-separator-icon-size)]" />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
