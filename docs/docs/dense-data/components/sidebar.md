---
composite_data: "./sidebar.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 51
title: "Sidebar"
description: "Sidebar in Dense data."
---

# Sidebar

The side navigation of an app, open while people work.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="sidebar/live"}

## When to use it

**In Dense data:** App navigation that stays open all shift.

- **Use it when:** Apps with several sections people move between all session.
- **Not when:** A website's main navigation (navigation menu), or a few sections that fit in tabs.

Instead:

- [Navigation menu](./navigation-menu.md): Website navigation.
- [Tabs](./tabs.md): Views of one thing.

## Variants

What each variant is for in any design system, then what Dense data decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Used in Dense data" tone="success"}
::preview{id="sidebar/variant/default"}

**What it is for**

Menu items with no border; hover shows the item.

- ✓ Most apps: quiet next to the content.
- ✕ Items that need extra separation.

**In Dense data**

Menu items with no border, quiet beside dense data.

**Because**

- [What is the main content? **Numbers and records**](#why-content-q1) · `content.q1`
:::

:::panel{title="outline" note="variant" label="Not used in Dense data" tone="neutral"}
::preview{id="sidebar/variant/outline"}

**What it is for**

Menu items with a border.

- ✓ Items that need extra separation from a busy background.
- ✕ A quiet sidebar next to dense content.

**In Dense data**

Borders on every item would compete with the data.

**Because**

- [What is the main content? **Numbers and records**](#why-content-q1) · `content.q1`
:::

:::panel{title="default" note="size" label="Used in Dense data" tone="success"}
::preview{id="sidebar/size/default"}

**What it is for**

The normal row height.

- ✓ Most menu items.
- ✕ Very long lists.

**In Dense data**

Every section of the app.

**Because**

- [How often do people repeat actions? **Constantly**](#why-tasks-q2) · `tasks.q2`
:::

:::panel{title="sm" note="size" label="Used in Dense data" tone="success"}
::preview{id="sidebar/size/sm"}

**What it is for**

A smaller row.

- ✓ Long or secondary lists.
- ✕ Touch screens.

**In Dense data**

Long secondary lists, at the denser size.

**Because**

- [How many densities exist? **Two**](#why-spacing-count) · `spacing.count`
:::

:::panel{title="lg" note="size" label="Not used in Dense data" tone="neutral"}
::preview{id="sidebar/size/lg"}

**What it is for**

A taller row with room for an icon and two lines.

- ✓ A workspace or account switcher at the top.
- ✕ Ordinary menu items.

**In Dense data**

Rows stay small so the whole navigation fits the screen all shift.

**Because**

- [How much is on one screen? **A lot**](#why-content-q2) · `content.q2`
:::

::card-grid{id="anatomy-link/sidebar"}

## Why it works this way

Sidebar looks the way it does because of 4 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Sidebar, and what would move if it changed.

::reason-chain{id="sidebar/content.q1"}

::reason-chain{id="sidebar/tasks.q2"}

::reason-chain{id="sidebar/spacing.count"}

::reason-chain{id="sidebar/content.q2"}

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
