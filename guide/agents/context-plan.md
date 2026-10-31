---
sidebar_position: 3
title: "Plan: token guidance and context on demand"
description: "A plan, not yet built: what agents still lack, where it belongs in Open DS, and how it stays generated and checked."
---

# Plan: token guidance and context on demand

Status: plan. Nothing here is built yet.

## Where we start

Agents already get a lot of context, all generated from the scheme JSON:

| What                                           | Answers                                  |
| ---------------------------------------------- | ---------------------------------------- |
| Grammar: questions, situations, component keys | What can be asked, what each id means.   |
| Scheme answers with `why` and `because`        | Why this scheme decided what it decided. |
| `usage[]` per situation: `use`, `not`, `why`   | What to use in a situation.              |
| `voice`                                        | How to write.                            |
| Token `$description`                           | What a token is, in one line.            |
| `llms.txt`, `AGENTS.md`, six skills, MCP, CLI  | How to read all of it.                   |

## What is still missing

An agent can find the right situation, but it cannot ask a token what it is for. Three gaps:

1. **Meaning per semantic key.** One line ("Danger text and icons.") says what a key is, not when to use it, when not to, and what to use instead. Agents misuse status colours more than anything else.
2. **Pairs.** Which text goes on which fill. Today only `text.on-action` exists, and nothing says a subtle fill takes dark text.
3. **Order.** Status colours have an urgency order: info, warning, danger. Success sits outside it. Nothing stops an agent from raising the level to get attention.

## What is right for Open DS

The reference keeps hand-written context files next to the tokens. Open DS should not. Four rules decide where things go:

1. **One source.** Context is written once in `schemes/` and generated everywhere else. No separate context files that can drift.
2. **Meaning belongs to the grammar. Values belong to the scheme.** `color.status.danger` means the same thing in every scheme, so its intent, its "not for" and its pairs live in the grammar, once. A scheme can add its own note through an answer or a usage rule.
3. **Words, never values.** Guidance names keys, never hex codes. Values are resolved on demand, so they are never stale.
4. **Every rule is checked.** A rule a machine can test becomes data the harness tests. A pair is checked for contrast in every brand and mode. A "use this instead" must name a key that exists.

## The plan

### 1. Semantic keys in the grammar

The grammar gains a `semantics` list: one entry per semantic key a component can read. Each entry has:

| Field     | Example for `color.status.danger.@`                                      |
| --------- | ------------------------------------------------------------------------ |
| `intent`  | Genuine risk: errors, failed checks, actions that cannot be undone.      |
| `use_for` | Error text and icons, labels of destructive actions.                     |
| `not_for` | Each item names what to use instead: caution → `color.status.warning.@`. |
| `pairs`   | `on`: the fills it can sit on. `text`: the text a fill takes. Keys only. |
| `order`   | For status keys: their place on the urgency order.                       |

The schema requires these for every colour semantic. Space, size and type keys follow later, if they earn it.

### 2. Checks in the harness

- Every semantic key a scheme defines has a grammar entry.
- Every `not_for` alternative and every pair names a key that exists.
- Every pair passes WCAG AA contrast in every brand and mode of every scheme. A known exception is written down as an answer with its `why`, not hidden.

### 3. Context on demand

The reference routes agents to files by task. Open DS already has tasks (the five skills) and an engine (the CLI and MCP). So the router is a call:

- `open-ds context <target>` and the MCP tool `get_context`. The target is a component, a token, a situation or a task (choose, build, write, change, review).
- It returns only that slice: the grammar entries, the scheme's answers and rules, the guidance, the pairs and the resolved values for each theme.
- Same engine as `why`, `when` and `get_key`, so it is never stale.

### 4. Where the guidance shows up

| Place                             | What it gets                                       |
| --------------------------------- | -------------------------------------------------- |
| Token `$description`              | Built from `intent`, so the CSS and JSON carry it. |
| MCP `get_key`, `when_to_use`      | `use_for`, `not_for` and pairs next to the value.  |
| `open-ds-review` skill            | `not_for` and pairs become review checks.          |
| `llms-full.txt`, docs colour page | A "pairs at a glance" table and the urgency order. |

## Not now

- **Gaps in the schemes:** an `info` status, colours for tags and charts, a shared disabled set. These are grammar questions, so each scheme has to answer them with a reason. They get their own ticket.
- **Copying the reference's layout:** its roles, maps, `refPattern`, SCSS maps and `:host`. Open DS already has its own tiers.

## Order of work

1. Grammar `semantics` for the colour keys, with the schema and the harness checks.
2. Guidance flows into `$description`, the MCP, the review skill and the docs.
3. `context` in the CLI and the MCP.
4. A separate ticket for the scheme gaps.
