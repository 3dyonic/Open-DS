# Tokens

Style Dictionary builds every scheme in `schemes/` into files a product can use.

```bash
pnpm --dir tokens build
```

For each scheme, `tokens/dist/<scheme>/` holds:

| File                  | What it is                                                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `tokens.css`          | Every token as a CSS variable. One block per brand and mode. Dark mode: add the class `dark`. Brands: set `data-brand`. |
| `tokens.scoped.css`   | The same, scoped to `[data-scheme="<scheme>"]`, so many schemes can share one page.                                     |
| `theme.css`           | shadcn's variables (`--primary`, `--radius`, …) and a Tailwind v4 `@theme`, mapped onto our semantic decisions.         |
| `<theme>.tokens.json` | The resolved DTCG tokens for one brand and mode.                                                                        |
| `tokens.json`         | The default theme as DTCG.                                                                                              |

`tokens/dist/index.json` lists every scheme, brand and theme.

CSS variables keep their references, so you can see each decision: `--button-primary-background: var(--color-action-primary)`.
