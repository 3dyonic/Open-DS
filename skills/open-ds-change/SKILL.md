---
name: open-ds-change
description: Change a token, a component or an answer in an Open DS scheme. Use when the product differs from the scheme.
tools: [why, get_key, what_moves, get_component]
---

# Change the design system

## Why

Each layer of the system feeds the next. A change at the right layer moves only what it should.

## When

- The product differs from the scheme.
- A value, a colour, a size or a rule must change.

## Input

- What must change, and why.
- The token, the component key or the question id involved.

## Run

1. Pick the smallest layer that does the job.
2. For the look of one component, change its component key, for example `button/radius`.
3. For a value everywhere, change its semantic token. Find it with `why` or `get_key`.
4. For a raw option, change the primitive that the semantic token points to.
5. For a decision, change the answer itself. First call `what_moves` with its question id.
6. Read what `what_moves` returns: the answers that follow, the token groups, the variant decisions and the rules.
7. Check each variant decision it lists with `get_component`. Update the decisions that no longer fit.
8. Write the new reason for each answer you change.
9. Rebuild the tokens with `npm run tokens`.

## Done

- Light and dark both work, and contrast stays at WCAG AA.
- You said what changed, at which layer, and why.
- If you changed an answer, you quoted the old answer and listed what moved.
