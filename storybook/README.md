# Storybook

Every Open DS component, in every scheme, brand and mode.

```bash
pnpm --dir storybook dev     # http://localhost:6006
pnpm --dir storybook build   # static build in storybook/storybook-static
```

Use the toolbar to switch the scheme (with the three Multi-brand brands) and the mode. The switch sets `data-scheme`, `data-brand` and the `dark` class. The tokens do the rest; the components never change.

Under each story, "When to use" shows the active scheme's rules for the situations the component serves, read from `schemes/<scheme>.json`.
