# Schemes

A scheme is a full design system as data. It answers every question in the grammar and says why.

| File | What it holds |
| --- | --- |
| `grammar.json` | The questions (9 reasons, 10 scopes, 48 questions), the 25 situations, and the 62 component keys. |
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

The schemas are `schema/grammar.schema.json` and `schema/scheme.schema.json` (JSON Schema draft 2020-12). Every object carries a description written for agents.

All answers are drafts until Yonatan curates them.
