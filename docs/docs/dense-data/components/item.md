---
composite_data: "./item.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 33
title: "Item"
description: "Item in Dense data."
---

# Item

A row with media, a title, a description and actions.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="item/live"}

## When to use it

**In Dense data:** Short lists such as users or settings, each with a few actions. Not for records analysts compare; those go in a table.

- **Use it when:** Lists of things such as people, files or settings, each with a few actions.
- **Not when:** Records people compare cell by cell (a table).

Instead:

- [Card](./card.md): A larger unit with more content.
- [Table](./table.md): Records compared across columns.

## Variants

What each variant is for in any design system, then what Dense data decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Used in Dense data" tone="success"}
::preview{robot="slumber" id="item/variant/default"}

**What it is for**

No border and no fill: the row sits on the surface around it.

- ✓ Lists inside a card, panel or menu that already has a frame.
- ✕ Rows that stand alone on the page and need edges.

**In Dense data**

Users and settings in a panel or menu, with no border, quiet beside the data.

**Because**

- [What is the main content? **Numbers and records**](#why-content-q1) · `content.q1`
:::

:::panel{title="outline" note="variant" label="Not used in Dense data" tone="neutral"}
::preview{robot="slumber" id="item/variant/outline"}

**What it is for**

A border around each row.

- ✓ Rows that stand alone on the page, such as a list of settings.
- ✕ Long lists inside a framed panel, where borders add noise.

**In Dense data**

Borders on every row would compete with the data; hairlines between sections do that work.

**Because**

- [What is the main content? **Numbers and records**](#why-content-q1) · `content.q1`
- [What separates groups on the page? **Lines**](#why-elevation-definition) · `elevation.definition`
:::

:::panel{title="muted" note="variant" label="Used in Dense data" tone="success"}
::preview{robot="slumber" id="item/variant/muted"}

**What it is for**

A soft fill behind the row.

- ✓ A row that should stand out quietly, such as the current one.
- ✕ Every row in a long list.

**In Dense data**

The current user or setting, with a soft fill so people keep their place.

**Because**

- [What is the main task? **Scan and compare**](#why-tasks-q1) · `tasks.q1`
- [What must the interface protect? **People keep their place**](#why-human-q1) · `human.q1`
:::

:::panel{title="default" note="size" label="Used in Dense data" tone="success"}
::preview{robot="slumber" id="item/size/default"}

**What it is for**

Comfortable padding.

- ✓ Most lists.
- ✕ Dense panels with many short rows.

**In Dense data**

Settings and user lists outside the table, at the standard row.

**Because**

- [How many densities exist? **Two**](#why-spacing-count) · `spacing.count`
:::

:::panel{title="sm" note="size" label="Used in Dense data" tone="success"}
::preview{robot="slumber" id="item/size/sm"}

**What it is for**

Tighter padding.

- ✓ Dense panels and short rows.
- ✕ Touch screens and lists people read slowly.

**In Dense data**

Long lists in a side panel, at the denser size. It still fits a mouse.

**Because**

- [How many densities exist? **Two**](#why-spacing-count) · `spacing.count`
- [What is the smallest target? **Compact, for a pointer**](#why-accessibility-values) · `accessibility.values`
:::

::card-grid{id="anatomy-link/item"}

## Why it works this way

Item looks the way it does because of 6 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Item, and what would move if it changed.

::reason-chain{id="item/content.q1"}

::reason-chain{id="item/elevation.definition"}

::reason-chain{id="item/tasks.q1"}

::reason-chain{id="item/human.q1"}

::reason-chain{id="item/spacing.count"}

::reason-chain{id="item/accessibility.values"}

## Words

- Lead with the object, then the state: "Alert 2041 contained."
- Use numbers, not words for numbers.
- One verb per button. No "please", no exclamation marks.
- Use: Investigate, Filter, Assign, Escalated, Resolved. Avoid: Oops, Awesome, Please, Simply.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Cancel
- `content.action.destroy`: Delete
- `content.action.retry`: Retry
- `content.action.empty-action`: Change filters

See [Voice and tone](../voice.md) for the whole voice.

## Use it in code

```bash
npx open-ds add item
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Item reads 36 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Item's tokens to change Item alone.

::token-table{component="item"}
