---
title: "Status"
description: "What is open in Open DS now: the PRs that wait for review, the open ends decided, the known issues and the next steps."
---

# Status

This page lists what is open now. Git holds the history. Update the page when a PR merges or an issue closes.

## PRs that wait for review

Each PR targets RC1. None is merged. Each one passes its own tests. On RC1, the harness fails four doc-composites checks; PR 217 fixes them, and with it the fast harness passes in full.

| PR | Ticket | What it does | What to check |
|---|---|---|---|
| [214](https://github.com/3dyonic/Open-DS/pull/214) | OD-293 | One trace engine takes every semantic value to the answers that decide it. The Token map, decision coverage and `open-ds trace` read it. The Token map's values with no reason drop from 48 to 0 per scheme. | Two links are judgment calls: `border-width.default` follows the layering answer (elevation.definition), and font weights follow the text roles answer. No grammar question asks about either yet. |
| [215](https://github.com/3dyonic/Open-DS/pull/215) | OD-135 | Every content text in the anatomy drawings reads the scheme's own samples: 311 texts. 82 drawn texts (dates, key caps, page numbers, state captions) stay fixed, each with a reason. | Two new sample lines are not owner facts: "Cancel any time" (Multi-brand) and "Free delivery" (Brand expressive). The PNGs need a re-export with the plugin. |
| [216](https://github.com/3dyonic/Open-DS/pull/216) | OD-292 | The loader generates the color scales and the component spacing map, so a scheme stores only its decisions (−72 KB). The build checks the scheme schema and the contrast pairs. The built output is byte-identical to RC1. | `ajv` becomes a CLI dependency (the MCP SDK already installs it). |
| [217](https://github.com/3dyonic/Open-DS/pull/217) | OD-120 | Fixes the four doc-composites checks that keep CI red on every PR: data schemas for every kind, scoped styles, composites on base forms, and facts stored as numbers and separate values. No check changed. | Screenshots before and after match, except the Decision reference fold header, which is 12px shorter. |
| This PR | OD-288 | ADR-002 section 9a: schemes nest, at most 3 levels below the root source. This page. | |

Merge order: 217 first, so CI turns green. Then 216, 214 and 215. Each of these changes generated docs: after each merge, merge RC1 into the next branch and run `pnpm --dir docs generate`. 215 adds sample fields that 216's schema rule then checks.

## Open ends, decided

These were open questions. Each now has a decision and its reason. Say if you want a different one.

1. **`color.text.inverse` and `color.text.on-action`.** Keep both. Each names one job: text on an inverse surface, and text on the primary action. Their theme picks point at the tone's text (`on-dark` in light mode, `on-light` in dark mode), so they follow tone pairing without a value of their own. 15 component keys read them as defaults, among them the primary button label, the tooltip, the bubble and the kbd.
2. **The input-group corner.** It stays on the control corner (`radius.control`), the same as the input it wraps. A one-line field and its addons must read as one control. A textarea inside a group is a separate case: OD-286 moved the textarea to the element corner; the group follows when it holds one. Ticket it when a scheme needs it.
3. **The drafted situations.** No situation in the grammar is a draft now: all 57 have a description, and every scheme answers each one with a why.
4. **Plain words: replace or add a layer.** Add, never replace. The scheme keeps its precise record (the token, the answer, the pick); plain words are a view the docs and agents generate from it. A view keeps no copy (one source for each fact).

## Known issues

| Issue | Where | Next step |
|---|---|---|
| The four doc-composites checks fail on RC1, so CI is red on every PR. | OD-120 | PR 217. |
| The base-forms check reads props only from inline types. Panel, Hero, Intro and Fold still take content props through named types such as `PanelProps`. | OD-120 | Make the check read named types, then fix what it finds. |
| The published Brand expressive library gives the anatomy file 0 variables, though the kit holds 131 semantic and 1,652 component variables. The cause is unknown. | OD-248 | The plugin falls back to the file's local kit variables, so run it in the kit file. |
| The anatomy PNGs show fixed text until they are exported again. | OD-135 | Re-export all five schemes once PR 215 merges. |
| The menu and data-table drawings still hold fixed labels. They use their own recipes, outside the tree drawings. | OD-135 | Move them onto samples, as the tree drawings did. |
| No grammar question decides line width or font weight. | OD-293 | Add a question to the shape and typography scopes, or keep the trace rule links in PR 214. |
| Storybook does not show the new samples `choices`, `search`, `chart` and `field.value` yet. | OD-135 | Add them to the stories. |
| `schema/scheme.schema.json` and most of `doc-composites/src` fail `prettier --check`. They failed on RC1 before these PRs. | — | Format them in their own commit. |
| The Atlassian connector uses a V1 endpoint that goes away on 2027-03-01. | — | Reconnect it with the v2 endpoint. |

## Next in the plan (ADR-002)

1. Step 4: the overlay format, its schema, the review list and the lockfile. `create` writes these in place of a copied `scheme.json`.
2. Step 5: `open-ds upgrade`, with the three-way compare, migrations on overlays, the chain of sources (section 9a) and the import from old projects.
3. Step 6: the source folder split by scope.
4. Step 7: packaging, npm first.
5. An MCP tool for the trace engine, so agents read a value's chain (OD-293, Out).
