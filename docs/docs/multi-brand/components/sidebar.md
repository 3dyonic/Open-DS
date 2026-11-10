---
composite_data: "./sidebar.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 51
title: "Sidebar"
description: "Sidebar in Multi-brand."
---

# Sidebar

The side navigation of an app, open while people work.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{robot="slumber" id="sidebar/live"}

## When to use it

**In Multi-brand:** Account area navigation.

- **Use it when:** Apps with several sections people move between all session.
- **Not when:** A website's main navigation (navigation menu), or a few sections that fit in tabs.

Instead:

- [Navigation menu](./navigation-menu.md): Website navigation.
- [Tabs](./tabs.md): Views of one thing.

## Variants

What each variant is for in any design system, then what Multi-brand decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="sidebar/variant/default"}

**What it is for**

Menu items with no border; hover shows the item.

- ✓ Most apps: quiet next to the content.
- ✕ Items that need extra separation.

**In Multi-brand**

Account-area menu items, the same in every brand.

**Because**

- [How are brands handled? **Brands as modes**](#why-theming-definition) · `theming.definition`
:::

:::panel{title="outline" note="variant" label="Not used in Multi-brand" tone="neutral"}
::preview{robot="slumber" id="sidebar/variant/outline"}

**What it is for**

Menu items with a border.

- ✓ Items that need extra separation from a busy background.
- ✕ A quiet sidebar next to dense content.

**In Multi-brand**

Brands change color and corners, not the structure of the menu.

**Because**

- [How are brands handled? **Brands as modes**](#why-theming-definition) · `theming.definition`
:::

:::panel{title="default" note="size" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="sidebar/size/default"}

**What it is for**

The normal row height.

- ✓ Most menu items.
- ✕ Very long lists.

**In Multi-brand**

Every account-area menu item.

**Because**

- [How many densities exist? **One**](#why-spacing-count) · `spacing.count`
:::

:::panel{title="sm" note="size" label="Not used in Multi-brand" tone="neutral"}
::preview{robot="slumber" id="sidebar/size/sm"}

**What it is for**

A smaller row.

- ✓ Long or secondary lists.
- ✕ Touch screens.

**In Multi-brand**

One density across brands.

**Because**

- [How many densities exist? **One**](#why-spacing-count) · `spacing.count`
:::

:::panel{title="lg" note="size" label="Not used in Multi-brand" tone="neutral"}
::preview{robot="slumber" id="sidebar/size/lg"}

**What it is for**

A taller row with room for an icon and two lines.

- ✓ A workspace or account switcher at the top.
- ✕ Ordinary menu items.

**In Multi-brand**

One density across brands.

**Because**

- [How many densities exist? **One**](#why-spacing-count) · `spacing.count`
:::

::card-grid{id="anatomy-link/sidebar"}

## Why it works this way

Sidebar looks the way it does because of 2 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Sidebar, and what would move if it changed.

::reason-chain{id="sidebar/theming.definition"}

::reason-chain{id="sidebar/spacing.count"}

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

## Accessibility and keyboard

Test before you ship:

- [ ] It is a navigation landmark; the current section is marked; collapsing keeps names for icons. undefined

## Use it in code

```bash
npx open-ds add sidebar
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Sidebar reads 122 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Sidebar's tokens to change Sidebar alone.

::token-table{component="sidebar"}
