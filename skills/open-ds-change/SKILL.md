---
name: open-ds-change
description: Change a token, a component or an answer in an Open DS scheme. Use when the product differs from the scheme.
tools:
  - why
  - get_key
  - plan_change
  - get_component
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
5. Before any change, call `plan_change`, or run `open-ds change <scheme> <question-id> <option>`.
6. For a primitive, plan with the token path and the new value. Fix each pair that would fail contrast.
7. For a decision, read what the plan returns: the answers that follow, the variant decisions and the rules.
8. Check each variant decision it lists with `get_component`. Update the decisions that no longer fit.
9. Write the new reason for each answer you change.
10. Rebuild the tokens with `npm run tokens`.

## Done

- Light and dark both work, and contrast stays at WCAG AA.
- You said what changed, at which layer, and why.
- If you changed an answer, you quoted the old answer and listed what moved.
