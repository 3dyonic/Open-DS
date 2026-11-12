---
composite_data: "./item.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 34
title: "Item"
description: "Item in Accessible first."
---

# Item

A row with media, a title, a description and actions.

:label[In Accessible first]{tone="info"}

## See it live

::preview{id="item/live"}

## When to use it

**In Accessible first:** A list such as saved applications, each with worded secondary buttons. Not records compared cell by cell.

- **Use it when:** Lists of things such as people, files or settings, each with a few actions.
- **Not when:** Records people compare cell by cell (a table).

Instead:

- [Card](./card.md): A larger unit with more content.
- [Table](./table.md): Records compared across columns.

## Variants

What each variant is for in any design system, then what Accessible first decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Not used in Accessible first" tone="neutral"}
::preview{id="item/variant/default"}

**What it is for**

No border and no fill: the row sits on the surface around it.

- ✓ Lists inside a card, panel or menu that already has a frame.
- ✕ Rows that stand alone on the page and need edges.

**In Accessible first**

A row with no border is hard to see at high zoom; borders do the work.

**Because**

- [What separates groups on the page? **Lines**](#why-elevation-definition) · `elevation.definition`
- [How soft are shadows? **No shadows**](#why-elevation-values) · `elevation.values`
:::

:::panel{title="outline" note="variant" label="Used in Accessible first" tone="success"}
::preview{id="item/variant/outline"}

**What it is for**

A border around each row.

- ✓ Rows that stand alone on the page, such as a list of settings.
- ✕ Long lists inside a framed panel, where borders add noise.

**In Accessible first**

Each saved application, with a strong border that separates it at any zoom.

**Because**

- [What separates groups on the page? **Lines**](#why-elevation-definition) · `elevation.definition`
- [How soft are shadows? **No shadows**](#why-elevation-values) · `elevation.values`
:::

:::panel{title="muted" note="variant" label="Not used in Accessible first" tone="neutral"}
::preview{id="item/variant/muted"}

**What it is for**

A soft fill behind the row.

- ✓ A row that should stand out quietly, such as the current one.
- ✕ Every row in a long list.

**In Accessible first**

A fill alone marks a row by color; status goes in a badge with an icon and a word.

**Because**

- [How many signals carry each meaning? **Three: color, icon and word**](#why-accessibility-count) · `accessibility.count`
:::

:::panel{title="default" note="size" label="Used in Accessible first" tone="success"}
::preview{id="item/size/default"}

**What it is for**

Comfortable padding.

- ✓ Most lists.
- ✕ Dense panels with many short rows.

**In Accessible first**

Every row. Large targets help people with motor needs.

**Because**

- [What is the smallest target? **Large**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="sm" note="size" label="Not used in Accessible first" tone="neutral"}
::preview{id="item/size/sm"}

**What it is for**

Tighter padding.

- ✓ Dense panels and short rows.
- ✕ Touch screens and lists people read slowly.

**In Accessible first**

Large targets help people with motor needs; nothing smaller.

**Because**

- [What is the smallest target? **Large**](#why-accessibility-values) · `accessibility.values`
- [How many densities exist? **One**](#why-spacing-count) · `spacing.count`
:::

::card-grid{id="anatomy-link/item"}

## Why it works this way

Item looks the way it does because of 5 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Item, and what would move if it changed.

::reason-chain{id="item/elevation.definition"}

::reason-chain{id="item/elevation.values"}

::reason-chain{id="item/accessibility.count"}

::reason-chain{id="item/accessibility.values"}

::reason-chain{id="item/spacing.count"}

## Words

- Use common words. Explain any term you must use.
- One idea per sentence. Put the action first.
- Never blame the person.
- Use: Continue, Change, Start, You. Avoid: Invalid, Utilise, Submit, Error code.

The labels components use, from the voice tokens:

- `content.action.commit`: Continue
- `content.action.cancel`: Go back
- `content.action.destroy`: Delete
- `content.action.retry`: Try again
- `content.action.empty-action`: Start a new application

See [Voice and tone](../voice.md) for the whole voice.

## Use it in code

```bash
npx open-ds add item
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Item reads 36 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Item's tokens to change Item alone.

::token-table{component="item"}
