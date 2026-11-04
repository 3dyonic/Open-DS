/**
 * Alert. A message that stays on the page.
 *
 * From shadcn/ui (new-york-v4, MIT), carried by the schemes whose inventory names it.
 * Reads the shadcn variables, which theme.css maps onto the scheme's semantic tokens, and the
 * radius, shadow and text scale that shadcn.css maps onto the scheme's tokens. Dark mode comes
 * from the tokens, so no dark: classes.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-[var(--alert-radius)] border px-[var(--alert-padding-x)] py-3 text-[length:var(--alert-font-size)] has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-[var(--alert-icon-size)] [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-[color:var(--alert-default-background)] text-[color:var(--alert-default-label)]",
        destructive:
          "bg-[color:var(--alert-destructive-background)] text-[color:var(--alert-destructive-label)] *:data-[slot=alert-description]:text-[color:var(--alert-destructive-label)]/90 [&>svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 [font-weight:var(--alert-title-font-weight)] tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-[var(--alert-description-gap)] text-[length:var(--alert-description-font-size)] text-[color:var(--alert-description-label)] [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
