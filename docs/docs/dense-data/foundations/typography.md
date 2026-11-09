---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 1
title: "Typography"
description: "Dense data: How text is set: roles, sizes and line height."
---

# Typography

How text is set: roles, sizes and line height.

- **display** 24px · 1.2 · 600

  :sample[Open alerts]{kind="type" role="display"}
- **title** 20px · 1.2 · 600

  :sample[Open alerts]{kind="type" role="title"}
- **heading** 16px · 1.2 · 600

  :sample[Alert ALR-2043]{kind="type" role="heading"}
- **body** 14px · 1.45 · 400

  :sample[A security analyst opens the alert queue at 8:00 and scans 200 rows for escalated threats.]{kind="type" role="body"}
- **label** 12px · 1.2 · 500

  :sample[Investigate]{kind="type" role="label"}
- **caption** 12px · 1.45 · 400

  :sample[A security analyst opens the alert queue at 8:00 and scans 200 rows for escalated threats.]{kind="type" role="caption"}
- **data** 13px · 1.45 · 400

  :sample[Open alerts 142 · Escalated 7 · Model precision 96.4% · Mean time to contain 38 min]{kind="type" role="data"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which text roles does it need? | Core and data | A data role keeps numbers in aligned columns. |
| How many steps does the type scale take? | Only the steps the screens need | A screen full of records stays calm with only the sizes it needs. |
| How are sizes and line heights defined? | A ratio, line heights in proportion | Line height is a ratio of each text's own size, so it follows the text. Two steps: tight for headings and labels, open for body, data and captions. |
| How large is body text? | Small | Small body text fits more rows on the screen. |
| Where does type do the most work? | Tables and inputs | Most text sits in table cells and inputs. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `type.display.font-family` | `dense-data.theme.base.type.display.font-family` → `font.family.ibm-plex-sans` |
| `type.display.font-size` | `font.size.24` |
| `type.display.line-height` | `font.line-height.1_2` |
| `type.display.font-weight` | `font.weight.600` |
| `type.title.font-family` | `dense-data.theme.base.type.title.font-family` → `font.family.ibm-plex-sans` |
| `type.title.font-size` | `font.size.20` |
| `type.title.line-height` | `font.line-height.1_2` |
| `type.title.font-weight` | `font.weight.600` |
| `type.heading.font-family` | `dense-data.theme.base.type.heading.font-family` → `font.family.ibm-plex-sans` |
| `type.heading.font-size` | `font.size.16` |
| `type.heading.line-height` | `font.line-height.1_2` |
| `type.heading.font-weight` | `font.weight.600` |
| `type.body.font-family` | `dense-data.theme.base.type.body.font-family` → `font.family.ibm-plex-sans` |
| `type.body.font-size` | `font.size.14` |
| `type.body.line-height` | `font.line-height.1_45` |
| `type.body.font-weight` | `font.weight.400` |
| `type.label.font-family` | `dense-data.theme.base.type.label.font-family` → `font.family.ibm-plex-sans` |
| `type.label.font-size` | `font.size.12` |
| `type.label.line-height` | `font.line-height.1_2` |
| `type.label.font-weight` | `font.weight.500` |
| `type.caption.font-family` | `dense-data.theme.base.type.caption.font-family` → `font.family.ibm-plex-sans` |
| `type.caption.font-size` | `font.size.12` |
| `type.caption.line-height` | `font.line-height.1_45` |
| `type.caption.font-weight` | `font.weight.400` |
| `type.data.font-family` | `dense-data.theme.base.type.data.font-family` → `font.family.ibm-plex-mono` |
| `type.data.font-size` | `font.size.13` |
| `type.data.line-height` | `font.line-height.1_45` |
| `type.data.font-weight` | `font.weight.400` |

The raw values these tokens end at are on [Primitives › Type](../primitives/type).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Page title | type.title | type.display | Titles stay small so the table starts higher on the screen. |
| A number in a table | type.data | type.body | Mono digits line up in columns, so values compare at a glance. |
| Paragraph or help text | type.body | type.label | Help text is a sentence read in passing. Body size reads quickly; the label style is made for short names, not sentences. |
| Field label or column header | type.label | type.heading | Headers repeat on every column; a heavy style would compete with the data. |
