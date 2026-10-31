---
sidebar_position: 3
title: "Token guidance and context on demand"
description: "What each colour is for, which fills it may sit on, the status urgency order, and one call that returns only the context a task needs. How it is built and checked."
---

# Token guidance and context on demand

Status: built (OD-159).

## Why

Agents could find the right situation, but they could not ask a token what it is for. Three gaps:

1. **Meaning per semantic key.** One line said what a key is, not when to use it, when not to, and what to use instead.
2. **Pairs.** Which text goes on which fill.
3. **Order.** Status colours have an urgency order. Nothing stopped an agent from raising the level to get attention.

## Four rules

1. **One source.** Guidance is written once in `schemes/grammar.json` and generated everywhere else.
2. **Meaning in the grammar, values in the schemes.** `color.status.danger.@` means the same in every scheme.
3. **Words, never values.** Guidance names keys. Values are resolved on demand.
4. **Every rule is checked, with no exceptions.** A pair that misses its contrast fails the harness.

## What was built

### Guidance in the grammar

`semantics.keys[]` has one entry per colour semantic key:

| Field     | What it says                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------- |
| `intent`  | What the key is for.                                                                                          |
| `use_for` | Concrete uses.                                                                                                |
| `not_for` | Misuses, each naming the key to use instead.                                                                  |
| `pairs`   | The fills it may sit on, and the contrast it keeps there: 4.5:1 for text, 3:1 for graphics and control edges. |
| `order`   | The place of a status on the urgency order.                                                                   |
| `exempt`  | Only for disabled text, which WCAG 1.4.3 does not cover.                                                      |

`semantics.urgency` says the rule: info, then warning, then danger. Never go up a level to get attention. Success sits outside the order.

### The check

`semantics-guidance` in the harness checks four things:

- every colour semantic in every scheme has guidance;
- every key that guidance names exists;
- every pair keeps its contrast in every brand and mode;
- the urgency order names real keys.

728 pairs pass today.

### The gaps, filled in every scheme, light and dark

- **Info status:** `color.status.info.@` and `.subtle`. It lands in Badge as the `info` tone.
- **Category colours:** `color.category.1` to `.5`, each with `@` and `.subtle`, for tags and chart series. They carry no meaning. shadcn's `chart-1` to `chart-5` read them. Tag text is `color.text.primary` on the subtle fill.
- **Disabled set:** `color.disabled.text`, `.surface` and `.border`. Button and Input read it through `button/disabled/*` and `input/disabled/*`, instead of fading with opacity.

Info and categories borrow existing ramps (blue, teal) rather than inventing values. Each theme says why it picked its hues.

### Contrast, fixed without exceptions

Measuring the pairs found two real problems:

- `text.muted` missed 4.5:1 in 9 of 14 themes. Accessible-first dark was at 2.83:1.
- `border.strong`, the edge of inputs, missed 3:1 in 13 of 14 themes. The lowest was 1.56:1.

**The decision:**

1. Each neutral ramp gains two steps, 400 and 600. Each is the OKLab midpoint of its neighbours, so it is computed from the ramp, not invented.
2. `text.muted` moves to 600 in light and 400 in dark. It stays quieter than secondary and now reaches 4.5:1.
3. In accessible-first dark there is no room: anything quieter than secondary misses 4.5:1. Secondary moves up to 600 and muted takes 500. The scheme exists for readability, so it raises contrast instead of merging the two.
4. `border.strong` moves to the nearest step that reaches 3:1. `border.default` stays for decoration.

**Rejected:**

- Written exceptions: we chose to have none.
- Merging muted into secondary: it loses a level of the hierarchy.
- New hand-picked values: they would be invented.

### Where the guidance shows up

| Place                             | What it gets                                                           |
| --------------------------------- | ---------------------------------------------------------------------- |
| Token `$description` (CSS, JSON)  | The grammar's `intent`, applied by the build and by `open-ds create`.  |
| MCP `get_key`, `when_to_use`      | The guidance next to the value.                                        |
| Deployed `AGENTS.md`              | A colour table: what each key is for and what not to use it for.       |
| `open-ds-review`, `open-ds-build` | Check `not_for`, pairs and urgency. Start with `get_context`.          |
| `llms-full.txt`, docs colour page | The urgency order, what each colour is for, and the pairs at a glance. |

### Context on demand

`open-ds context <scheme> <target>` and the MCP tool `get_context` share one engine, `cli/src/context.mjs`. A target is one of:

- a task: `choose`, `build`, `write`, `change` or `review`;
- a component: `badge`;
- a component key: `button/primary/background`;
- a semantic token: `color.status.danger`;
- a situation: `status-label`.

It returns only that slice: rules, guidance, pairs and resolved values in every theme. It replaces a file router: the answer is built from the source each time, so it is never stale.

## Next

- Guidance for space, size and type keys, if agents misuse them.
- Category colours in more components (tags, avatars), when a scheme's inventory needs them.
