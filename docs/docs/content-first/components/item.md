---
composite_data: "./item.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 33
title: "Item"
description: "Item in Content first."
---

# Item

A row with media, a title, a description and actions.

:label[In Content first]{tone="info"}

## See it live

::preview{robot="slumber" id="item/live"}

## When to use it

**In Content first:** Rows in the reading list, each with an action named in a word. Not where cards preview articles.

- **Use it when:** Lists of things such as people, files or settings, each with a few actions.
- **Not when:** Records people compare cell by cell (a table).

Instead:

- [Card](./card.md): A larger unit with more content.
- [Table](./table.md): Records compared across columns.

## Variants

What each variant is for in any design system, then what Content first decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Used in Content first" tone="success"}
::preview{robot="slumber" id="item/variant/default"}

**What it is for**

No border and no fill: the row sits on the surface around it.

- ✓ Lists inside a card, panel or menu that already has a frame.
- ✕ Rows that stand alone on the page and need edges.

**In Content first**

Rows in the reading list, separated by space, not lines.

**Because**

- [What separates groups on the page? **Space**](#why-elevation-definition) · `elevation.definition`
- [How dense is the layout? **Spacious**](#why-spacing-values) · `spacing.values`
:::

:::panel{title="outline" note="variant" label="Not used in Content first" tone="neutral"}
::preview{robot="slumber" id="item/variant/outline"}

**What it is for**

A border around each row.

- ✓ Rows that stand alone on the page, such as a list of settings.
- ✕ Long lists inside a framed panel, where borders add noise.

**In Content first**

Borders would interrupt reading; space separates the rows.

**Because**

- [What separates groups on the page? **Space**](#why-elevation-definition) · `elevation.definition`
:::

:::panel{title="muted" note="variant" label="Not used in Content first" tone="neutral"}
::preview{robot="slumber" id="item/variant/muted"}

**What it is for**

A soft fill behind the row.

- ✓ A row that should stand out quietly, such as the current one.
- ✕ Every row in a long list.

**In Content first**

Every row in the reading list weighs the same; attention belongs to the text.

**Because**

- [What must the interface protect? **Attention on the content**](#why-human-q1) · `human.q1`
:::

:::panel{title="default" note="size" label="Used in Content first" tone="success"}
::preview{robot="slumber" id="item/size/default"}

**What it is for**

Comfortable padding.

- ✓ Most lists.
- ✕ Dense panels with many short rows.

**In Content first**

Every row, at touch size: many readers are on phones.

**Because**

- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="sm" note="size" label="Not used in Content first" tone="neutral"}
::preview{robot="slumber" id="item/size/sm"}

**What it is for**

Tighter padding.

- ✓ Dense panels and short rows.
- ✕ Touch screens and lists people read slowly.

**In Content first**

Many readers are on phones, and rows are read, not scanned.

**Because**

- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
- [What is the main task? **Read start to end**](#why-tasks-q1) · `tasks.q1`
:::

::card-grid{id="anatomy-link/item"}

## Why it works this way

Item looks the way it does because of 5 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Item, and what would move if it changed.

::reason-chain{id="item/elevation.definition"}

::reason-chain{id="item/spacing.values"}

::reason-chain{id="item/human.q1"}

::reason-chain{id="item/accessibility.values"}

::reason-chain{id="item/tasks.q1"}

## Words

- Write to one person: "you", not "users".
- Short sentences with room to breathe.
- Explain why before asking for anything.
- Use: Read, Save for later, You, Next issue. Avoid: Click here, Submit, Users, Content.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Not now
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Browse guides

See [Voice and tone](../voice.md) for the whole voice.

## Use it in code

```bash
npx open-ds add item
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Item reads 36 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Item's tokens to change Item alone.

::token-table{component="item"}
