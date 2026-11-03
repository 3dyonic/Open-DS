# Schemes

A scheme is a full design system as data. It answers every question in the grammar and says why.

| File | What it holds |
| --- | --- |
| `grammar.json` | The questions (9 reasons, 11 scopes, 73 questions; every scope answers the same five method questions), the 32 situations, and the 63 component keys. |
| `dense-data.json` | Compact and exact, for experts who compare numbers. |
| `content-first.json` | Large calm type, for people who come to read. |
| `accessible-first.json` | Large text and targets, AAA contrast, for everyone. |
| `multi-brand.json` | One system, three brands (Aster, Birch, Coral) as themes. |
| `brand-expressive.json` | Big display type and vivid color, for launches. |

Each scheme holds:

- `answers`: one per question, with `why` and `because` (the earlier questions that pulled it).
- `usage`: one rule per situation: what to use, what not to use, and why.
- `voice`: voice and tone, with real copy.
- `scenarios`: the work the reasons describe.
- `themes`: every brand in light and dark.
- `tokens`: DTCG tokens in three tiers. Primitives are the options. Semantics are the decisions (`base`, `light`, `dark`). Component keys point to semantics.

Options must look clearly different from each other: two steps you cannot tell apart are one step. The rules, with the smallest gap per kind of option, are in `grammar.json` under `options`; the harness checks every scheme against them, and the agent context carries them. Keep only the options something reads: outside colour ramps, which stay whole, every primitive is read by a semantic, a theme or a component key. A count answer has that many tokens: `motion.count` "two" means two speeds.

Text, icons, borders and focus pair with fills by tone. Every fill in a theme states its tone, light or dark, in `$extensions.open-ds.tone`: a decision, like a value. What sits on a fill comes from that tone's set, `color.on-light` or `color.on-dark`; `color.text.*` is the mode's own set, for the page's own surfaces. The grammar's `semantics.tones` lists the roles, their contrast and what each fill carries, and the harness checks every fill. A known shortfall can wait on its fill with the ticket that fixes it (`waits`); the check names it.

The schemas are `schema/grammar.schema.json` and `schema/scheme.schema.json` (JSON Schema draft 2020-12). Every object carries a description written for agents.
