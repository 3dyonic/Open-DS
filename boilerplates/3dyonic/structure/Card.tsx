import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLElement>;

export function Card({ children, ...props }: CardProps) {
  return (
    <article className="ods-card" {...props}>
      {children}
    </article>
  );
}
