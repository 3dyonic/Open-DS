---
name: open-ds-change
description: Change an Open DS design system: a token, a component or an answer. Use when the product differs from the scheme, or a value, colour, size or rule needs to change.
---

# Change the design system

Pick the smallest layer that does the job:

1. **A look on one component:** change its component key in the project's tokens (for example `button/radius`). The component reads it.
2. **A value everywhere:** change the semantic token it comes from. Find it with `why <scheme> <component-key>` or `get_key`.
3. **A raw option:** change the primitive the semantic points at (a palette step, a size, a corner). The primitives page on open-ds.dev shows what uses each one.
4. **A decision:** when the product is different, change the answer itself. Call `what_moves` first: it lists the answers and tokens that follow from it. Write the new reason.

Then:

- Rebuild the tokens: `npm run tokens` in a created project.
- Keep light and dark working, and keep contrast at WCAG AA.
- Say what you changed, at which layer, and why. Quote the old answer if you changed one.
