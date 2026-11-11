---
composite_data: "./sidebar.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 52
title: "Sidebar"
description: "Sidebar in Brand expressive."
sidebar_class_name: "ods-left-out"
---

# Sidebar

The side navigation of an app, open while people work.

:label[Left out of Brand expressive]{tone="warning"} Sidebar is for apps people move around all session. Brand expressive avoids tools people use for hours, and a visit lasts a few minutes at most. Use instead: [Navigation menu](./navigation-menu), [Drawer](./drawer)

## See it live

::preview{robot="slumber" id="sidebar/live"}

## When to use it

- **Use it when:** Apps with several sections people move between all session.
- **Not when:** A website's main navigation (navigation menu), or a few sections that fit in tabs.

Instead:

- [Navigation menu](./navigation-menu.md): Website navigation.
- [Tabs](./tabs.md): Views of one thing.

## Variants

What each variant is for in any design system, then what Brand expressive decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Not decided yet" tone="neutral"}
::preview{robot="slumber" id="sidebar/variant/default"}

**What it is for**

Menu items with no border; hover shows the item.

- ✓ Most apps: quiet next to the content.
- ✕ Items that need extra separation.

**In Brand expressive**

Not decided yet.

:::

:::panel{title="outline" note="variant" label="Not decided yet" tone="neutral"}
::preview{robot="slumber" id="sidebar/variant/outline"}

**What it is for**

Menu items with a border.

- ✓ Items that need extra separation from a busy background.
- ✕ A quiet sidebar next to dense content.

**In Brand expressive**

Not decided yet.

:::

:::panel{title="default" note="size" label="Not decided yet" tone="neutral"}
::preview{robot="slumber" id="sidebar/size/default"}

**What it is for**

The normal row height.

- ✓ Most menu items.
- ✕ Very long lists.

**In Brand expressive**

Not decided yet.

:::

:::panel{title="sm" note="size" label="Not decided yet" tone="neutral"}
::preview{robot="slumber" id="sidebar/size/sm"}

**What it is for**

A smaller row.

- ✓ Long or secondary lists.
- ✕ Touch screens.

**In Brand expressive**

Not decided yet.

:::

:::panel{title="lg" note="size" label="Not decided yet" tone="neutral"}
::preview{robot="slumber" id="sidebar/size/lg"}

**What it is for**

A taller row with room for an icon and two lines.

- ✓ A workspace or account switcher at the top.
- ✕ Ordinary menu items.

**In Brand expressive**

Not decided yet.

:::

::card-grid{id="anatomy-link/sidebar"}

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

Its icons (`PanelLeft`) also read `icon.stroke-width`, 1.75px in Brand expressive: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
