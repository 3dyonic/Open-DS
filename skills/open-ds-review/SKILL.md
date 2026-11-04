---
name: open-ds-review
description: Review UI against an Open DS scheme. Use when you finish a screen, or someone asks if UI follows the system.
tools:
  - check_ui
  - get_context
  - get_inventory
  - get_component
  - when_to_use
  - why
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

1. Call `check_ui` with the files, or run `open-ds check` in the project.
2. Report each finding it returns with its file, line, rule and fix.
3. Call `get_context` with target `review`, or run `open-ds context <scheme> review`. It lists the steps.
4. Load the build and write booklets it names. Ask for section `rules` or `colors` when you check them.
5. Components: check that each one is in the inventory with `get_inventory`. Flag look-alikes.
6. Variants: call `get_component` for each component. Flag each variant that the scheme marks as not used.
7. Variants: check each used variant against what the scheme says it is for.
8. Tokens: flag raw colors, sizes, spacing, radii and shadows.
9. Rules: check each choice against its situation with `when_to_use`.
10. Voice: check labels and messages with `open-ds-write`.
11. Meaning: check each color against its guidance. Flag a color used for a case in its `not_for`.
12. Urgency: check that each status matches the real risk: info, then warning, then danger.
13. Pairs: check that text and icons sit only on the fills in their `sits_on`.
14. Access: check visible focus, a label on every control, target size and WCAG AA contrast.
15. Themes: check light first, then dark.
16. For each failure, call `why` and quote the scheme's reason with the fix.

## Done

- You listed each failure with the rule it breaks and the fix.
- Each failure quotes the scheme's reason.
- `check_ui` returns no findings.
- The review passes only when no failure is left.
