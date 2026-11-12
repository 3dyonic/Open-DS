---
composite_data: "./item.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 34
title: "Item"
description: "Item in Brand expressive."
---

# Item

A row with media, a title, a description and actions.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{id="item/live"}

## When to use it

**In Brand expressive:** A short list with media and a few actions. Not for products and features; card does that.

- **Use it when:** Lists of things such as people, files or settings, each with a few actions.
- **Not when:** Records people compare cell by cell (a table).

Instead:

- [Card](./card.md): A larger unit with more content.
- [Table](./table.md): Records compared across columns.

## Variants

What each variant is for in any design system, then what Brand expressive decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Used in Brand expressive" tone="success"}
::preview{id="item/variant/default"}

**What it is for**

No border and no fill: the row sits on the surface around it.

- ✓ Lists inside a card, panel or menu that already has a frame.
- ✕ Rows that stand alone on the page and need edges.

**In Brand expressive**

Rows inside a card, which already gives the frame.

**Because**

- [What separates groups on the page? **Cards**](#why-elevation-definition) · `elevation.definition`
:::

:::panel{title="outline" note="variant" label="Used in Brand expressive" tone="success"}
::preview{id="item/variant/outline"}

**What it is for**

A border around each row.

- ✓ Rows that stand alone on the page, such as a list of settings.
- ✕ Long lists inside a framed panel, where borders add noise.

**In Brand expressive**

Rows on a color block, with a border so each holds its edge on vivid color.

**Because**

- [How saturated is the palette? **Vivid**](#why-color-values) · `color.values`
:::

:::panel{title="muted" note="variant" label="Not used in Brand expressive" tone="neutral"}
::preview{id="item/variant/muted"}

**What it is for**

A soft fill behind the row.

- ✓ A row that should stand out quietly, such as the current one.
- ✕ Every row in a long list.

**In Brand expressive**

A quiet fill reads as bland on a loud page; color blocks already mark each section.

**Because**

- [How visible is the brand in the interface? **Loud**](#why-brand-q2) · `brand.q2`
- [What is a costly mistake? **Looking off-brand**](#why-outcomes-q2) · `outcomes.q2`
:::

:::panel{title="default" note="size" label="Used in Brand expressive" tone="success"}
::preview{id="item/size/default"}

**What it is for**

Comfortable padding.

- ✓ Most lists.
- ✕ Dense panels with many short rows.

**In Brand expressive**

Every row, at touch size: phones first.

**Because**

- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="sm" note="size" label="Not used in Brand expressive" tone="neutral"}
::preview{id="item/size/sm"}

**What it is for**

Tighter padding.

- ✓ Dense panels and short rows.
- ✕ Touch screens and lists people read slowly.

**In Brand expressive**

Phones first: no compact rows.

**Because**

- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
:::

::card-grid{id="anatomy-link/item"}

## Why it works this way

Item looks the way it does because of 5 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Item, and what would move if it changed.

::reason-chain{id="item/elevation.definition"}

::reason-chain{id="item/color.values"}

::reason-chain{id="item/brand.q2"}

::reason-chain{id="item/outcomes.q2"}

::reason-chain{id="item/accessibility.values"}

## Words

- Headlines are short and bold. Three to six words.
- Verbs that move: Join, Try, Go.
- Playful in headlines, plain in errors.
- Use: Join, Drop, Go, Love. Avoid: Synergy, Leverage, Kindly.

The labels components use, from the voice tokens:

- `content.action.commit`: Go
- `content.action.cancel`: Not now
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Explore the drop

See [Voice and tone](../voice.md) for the whole voice.

## Use it in code

```bash
npx open-ds add item
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Item reads 36 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Item's tokens to change Item alone.

::token-table{component="item"}
