---
title: "Curating a scheme, chunk by chunk"
description: "OD-283 spike: how to cut a scheme into chunks, what curated means for one chunk, the order, and the count that measures progress."
---

# Curating a scheme, chunk by chunk

Status: proposed (OD-283). This is the plan only. The curation itself is a later story.

## Where we are

Measured on RC1, 2026-11-11, in every scheme unless a scheme is named:

| Layer | Linked to a decision | Measure |
|---|---|---|
| Answers | 79 of 79 have a why | — |
| Theme picks | 144 of 144 cite an answer (Multi-brand: 432 of 432) | `picks-cite-answers` |
| Usage rules | 57 of 57 cite an answer | — |
| Semantic tokens | 124 of 132 rest on a pick or a rule; the 8 left are the component spacing map | `decisions-cover-values` |
| Component keys (Accessible first) | 732 of 1,414 sit in an anatomy card | none yet |
| Gap ledger | 45 gaps in 5 schemes, such as `rule-not-written` (4 in Dense data) | `gaps-only-go-down` |

The foundation layers are covered. The gap is in the component layer: half of the component keys reach no card, so no answer, rule or reason shows for them.

## What curated means for one chunk

A chunk is curated when each of these is true for every value in it:

1. It rests on a decision: a theme pick that cites an answer, or a usage rule that names it.
2. The cited answers are the right ones: a person reads the answer and agrees that it decides this value. A link that only satisfies the count is a wrong link.
3. Each component key in the chunk sits in an anatomy card, and that card names the part it paints.
4. The reason says who needs what and what it buys. It does not repeat the answer.
5. No invented facts. A number in a reason comes from the scheme.

Points 1 and 3 are counted. Points 2, 4 and 5 are reviewed by a person.

## How to cut the chunks

Cut by component family, not by scope. The foundation scopes are already linked; what is left lives in component keys, and an anatomy card is per component. One family is one chunk:

1. Actions: button, toggle, toggle group
2. Fields: input, textarea, select, combobox, checkbox, radio group, switch, slider
3. Overlays: dialog, alert dialog, sheet, drawer, popover, tooltip, hover card
4. Menus: dropdown menu, context menu, menubar, navigation menu, command
5. Feedback: alert, toast, badge, progress, skeleton
6. Data: table, data table, pagination
7. Structure: card, accordion, tabs, separator, sidebar, the rest

The order follows use: actions and fields appear on almost every screen.

## The progress count

Add one harness check, `component-keys-carded`: per scheme, the component keys that sit in no anatomy card. The count may only go down, like `gaps-only-go-down`. Today it is 682 in Accessible first.

## Where to start

Start with family 1 (actions) in Accessible first. The ticket proposed color in Accessible first. The color semantics now all rest on decisions, so the open work is in the component keys. Actions is the smallest family that every screen uses.

## Decision asked

Approve the chunk order, the definition and the new count. Then the first chunk becomes its own story.
