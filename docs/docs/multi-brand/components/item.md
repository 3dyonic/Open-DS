---
composite_data: "./item.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 33
title: "Item"
description: "Item in Multi-brand."
---

# Item

A row with media, a title, a description and actions.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{robot="slumber" id="item/live"}

## When to use it

**In Multi-brand:** A list of account settings, each with a few actions named by a word. Not for records compared cell by cell.

- **Use it when:** Lists of things such as people, files or settings, each with a few actions.
- **Not when:** Records people compare cell by cell (a table).

Instead:

- [Card](./card.md): A larger unit with more content.
- [Table](./table.md): Records compared across columns.

## Variants

What each variant is for in any design system, then what Multi-brand decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="item/variant/default"}

**What it is for**

No border and no fill: the row sits on the surface around it.

- ✓ Lists inside a card, panel or menu that already has a frame.
- ✕ Rows that stand alone on the page and need edges.

**In Multi-brand**

Settings inside a card or menu, which already gives the frame.

**Because**

- [What separates groups on the page? **Cards**](#why-elevation-definition) · `elevation.definition`
:::

:::panel{title="outline" note="variant" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="item/variant/outline"}

**What it is for**

A border around each row.

- ✓ Rows that stand alone on the page, such as a list of settings.
- ✕ Long lists inside a framed panel, where borders add noise.

**In Multi-brand**

Account settings on their own page, with a border and the corner each brand sets.

**Because**

- [What is the main content? **Forms and tasks**](#why-content-q1) · `content.q1`
- [How are corners set? **Set by each brand**](#why-shape-definition) · `shape.definition`
:::

:::panel{title="muted" note="variant" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="item/variant/muted"}

**What it is for**

A soft fill behind the row.

- ✓ A row that should stand out quietly, such as the current one.
- ✕ Every row in a long list.

**In Multi-brand**

The current setting, with a soft fill from the brand.

**Because**

- [How are brands handled? **Brands as modes**](#why-theming-definition) · `theming.definition`
:::

:::panel{title="default" note="size" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="item/size/default"}

**What it is for**

Comfortable padding.

- ✓ Most lists.
- ✕ Dense panels with many short rows.

**In Multi-brand**

Every row, at touch size: customers are often on phones.

**Because**

- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="sm" note="size" label="Not used in Multi-brand" tone="neutral"}
::preview{robot="slumber" id="item/size/sm"}

**What it is for**

Tighter padding.

- ✓ Dense panels and short rows.
- ✕ Touch screens and lists people read slowly.

**In Multi-brand**

One density across brands, at touch size.

**Because**

- [How many densities exist? **One**](#why-spacing-count) · `spacing.count`
- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
:::

::card-grid{id="anatomy-link/item"}

## Why it works this way

Item looks the way it does because of 6 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Item, and what would move if it changed.

::reason-chain{id="item/elevation.definition"}

::reason-chain{id="item/content.q1"}

::reason-chain{id="item/shape.definition"}

::reason-chain{id="item/theming.definition"}

::reason-chain{id="item/accessibility.values"}

::reason-chain{id="item/spacing.count"}

## Words

- Shared structure: object, state, next step.
- Brand tone lives in headlines and marketing copy, not in errors.
- Errors and confirmations read the same in every brand.
- Use: Get started, Plan, Order. Avoid: Brand-specific words in errors, Jargon.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Cancel
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Get started

See [Voice and tone](../voice.md) for the whole voice.

## Use it in code

```bash
npx open-ds add item
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Item reads 36 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Item's tokens to change Item alone.

::token-table{component="item"}
