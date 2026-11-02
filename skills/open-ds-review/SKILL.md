---
name: open-ds-review
description: Review UI against an Open DS scheme. Use when you finish a screen, or someone asks if UI follows the system.
tools: [get_context, get_inventory, get_component, when_to_use, why]
---

# Review UI against the scheme

## Why

A review catches a choice that breaks a rule before people see it. Each finding names the rule, so the fix is clear.

## When

- You are about to finish a screen.
- Someone asks if UI follows the design system.

## Input

- The screen or the files to review.
- The scheme id.

## Run

1. Call `get_context review`, or run `open-ds context <scheme> review`.
2. It returns every rule, the colour guidance and the urgency order in one call.
3. Components: check that each one is in the inventory with `get_inventory`. Flag look-alikes.
4. Variants: call `get_component` for each component. Flag each variant that the scheme marks as not used.
5. Variants: check each used variant against what the scheme says it is for.
6. Tokens: flag raw colours, sizes, spacing, radii and shadows.
7. Rules: check each choice against its situation with `when_to_use`.
8. Voice: check labels and messages with `open-ds-write`.
9. Meaning: check each colour against its guidance. Flag a colour used for a case in its `not_for`.
10. Urgency: check that each status matches the real risk: info, then warning, then danger.
11. Pairs: check that text and icons sit only on the fills in their `sits_on`.
12. Access: check visible focus, a label on every control, target size and WCAG AA contrast.
13. Themes: check light first, then dark.
14. For each failure, call `why` and quote the scheme's reason with the fix.

## Done

- You listed each failure with the rule it breaks and the fix.
- Each failure quotes the scheme's reason.
- The review passes only when no failure is left.
