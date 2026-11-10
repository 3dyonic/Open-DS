// A token's CSS variable from its full name, the way the token build names it: dots become dashes and
// a base (@) drops out. color.neutral.0 → var(--color-neutral-0). The data stores the token; the
// composite draws through its variable, so the drawing follows every scheme, mode and brand.
export const tokenVar = (token: string) =>
  `var(--${token
    .split(".")
    .filter((p) => p !== "@")
    .join("-")})`;
