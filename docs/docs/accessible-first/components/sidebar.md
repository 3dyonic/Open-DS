---
composite_data: "./sidebar.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 52
title: "Sidebar"
description: "Sidebar in Accessible first."
sidebar_class_name: "ods-left-out"
---

# Sidebar

The side navigation of an app, open while people work.

:label[Left out of Accessible first]{tone="warning"} Sidebar is for apps people move around all session. Here people do this once or twice a year, and breadcrumb shows where they are. Use instead: [Breadcrumb](./breadcrumb), [Progress](./progress)

## See it live

::preview{id="sidebar/live"}

## When to use it

- **Use it when:** Apps with several sections people move between all session.
- **Not when:** A website's main navigation (navigation menu), or a few sections that fit in tabs.

Instead:

- [Navigation menu](./navigation-menu.md): Website navigation.
- [Tabs](./tabs.md): Views of one thing.

## Variants

What each variant is for in any design system, then what Accessible first decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Not decided yet" tone="neutral"}
::preview{id="sidebar/variant/default"}

**What it is for**

Menu items with no border; hover shows the item.

- ✓ Most apps: quiet next to the content.
- ✕ Items that need extra separation.

**In Accessible first**

Not decided yet.

:::

:::panel{title="outline" note="variant" label="Not decided yet" tone="neutral"}
::preview{id="sidebar/variant/outline"}

**What it is for**

Menu items with a border.

- ✓ Items that need extra separation from a busy background.
- ✕ A quiet sidebar next to dense content.

**In Accessible first**

Not decided yet.

:::

:::panel{title="default" note="size" label="Not decided yet" tone="neutral"}
::preview{id="sidebar/size/default"}

**What it is for**

The normal row height.

- ✓ Most menu items.
- ✕ Very long lists.

**In Accessible first**

Not decided yet.

:::

:::panel{title="sm" note="size" label="Not decided yet" tone="neutral"}
::preview{id="sidebar/size/sm"}

**What it is for**

A smaller row.

- ✓ Long or secondary lists.
- ✕ Touch screens.

**In Accessible first**

Not decided yet.

:::

:::panel{title="lg" note="size" label="Not decided yet" tone="neutral"}
::preview{id="sidebar/size/lg"}

**What it is for**

A taller row with room for an icon and two lines.

- ✓ A workspace or account switcher at the top.
- ✕ Ordinary menu items.

**In Accessible first**

Not decided yet.

:::

::card-grid{id="anatomy-link/sidebar"}

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

Its icons (`PanelLeft`) also read `icon.stroke-width`, 2px in Accessible first: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
