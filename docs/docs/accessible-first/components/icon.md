---
composite_data: "./icon.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 30
title: "Icon"
description: "Icon in Accessible first."
---

# Icon

One small picture that marks an action or a status, beside its word. Open DS draws every icon with one open-source set, Lucide; the scheme sets its size and stroke.

:label[In Accessible first]{tone="info"}

## Two ways to draw an icon

To keep things simple, Open DS uses one open-source icon set, Lucide, in every scheme. Accessible first sets each icon's size and its stroke, 2px; the drawings stay the same. Both ways read the same tokens, so an icon looks the same either way, and a change to the scheme reaches every icon.

**Inside the components**, shadcn's way. Select, Accordion, Checkbox and the other components draw their own icons, so you add nothing. They import Lucide directly, as shadcn does, so they stay easy to update.

```tsx
// select.tsx, as it is
<ChevronDown className="size-[var(--select-size)] text-[var(--select-trigger-icon)]" />
```

**In your content**, use Icon: an icon beside a word, in text, a card or a toolbar; an icon button with no word, which needs a label; the large size; and the contained looks.

```tsx
<Icon icon={Bell} /> Notify me
<Button variant="ghost"><Icon icon={X} label="Close" /></Button>
```

## See it live

::preview{robot="slumber" id="icon/live"}

## When to use it

**In Accessible first:** Status and messages, always beside a word.

- **Use it when:** An icon in content or new UI: beside a word, in an icon button with a label, at the large size, or in a contained shape.
- **Not when:** Inside a component that already draws its icon, such as Select or Accordion: those draw Lucide directly and follow the same tokens.

Instead:

- [Badge](./badge.md): A status label, with a word.
- [Button](./button.md): Something to press; it can hold an Icon.

## Variants

What each variant is for in any design system, then what Accessible first decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="size" label="Used in Accessible first" tone="success"}
::preview{robot="slumber" id="icon/size/default"}

**What it is for**

The size of the text the icon sits beside.

- ✓ Almost always: beside a word, in a row or a toolbar.
- ✕ A feature that leads a section, where the scheme has a large size.

**In Accessible first**

Larger than the text beside it, so it is easy to see.

**Because**

- [How many icon sizes exist? **One**](#why-iconography-count) · `iconography.count`
- [How big are icons next to text? **Larger than the text**](#why-iconography-values) · `iconography.values`
:::

:::panel{title="large" note="size" label="Not used in Accessible first" tone="neutral"}
::preview{robot="slumber" id="icon/size/large"}

**What it is for**

A larger step, for schemes that answer two icon sizes.

- ✓ An icon that leads a card or a section on its own.
- ✕ Beside running text or in a row.

**In Accessible first**

Accessible first has one icon size, already larger than the text.

**Because**

- [How many icon sizes exist? **One**](#why-iconography-count) · `iconography.count`
:::

:::panel{title="plain" note="variant" label="Used in Accessible first" tone="success"}
::preview{robot="slumber" id="icon/variant/plain"}

**What it is for**

The icon alone, in the color of the text beside it.

- ✓ Every icon by default.
- ✕ The scheme's style answer asks for a contained look.

**In Accessible first**

Every icon: a bold 2px stroke, easy to see.

**Because**

- [What icon style and stroke? **Bold stroke**](#why-iconography-definition) · `iconography.definition`
:::

:::panel{title="contained-tint" note="variant" label="Not used in Accessible first" tone="neutral"}
::preview{robot="slumber" id="icon/variant/contained-tint"}

**What it is for**

The icon in a tinted shape.

- ✓ The scheme answers a contained style: a feature or a list item that leads with its icon.
- ✕ Beside running text, or many times in one row.

**In Accessible first**

A bold stroke carries the icon; a shape adds nothing people need.

**Because**

- [What icon style and stroke? **Bold stroke**](#why-iconography-definition) · `iconography.definition`
:::

:::panel{title="contained-solid" note="variant" label="Not used in Accessible first" tone="neutral"}
::preview{robot="slumber" id="icon/variant/contained-solid"}

**What it is for**

The icon on a solid fill, in the on-action color.

- ✓ One strong mark per view, where the scheme answers a contained style.
- ✕ More than once in a view: it competes with the primary action.

**In Accessible first**

A bold stroke carries the icon.

**Because**

- [What icon style and stroke? **Bold stroke**](#why-iconography-definition) · `iconography.definition`
:::

::card-grid{id="anatomy-link/icon"}

## How Accessible first uses it

::::grid{columns="2"}
:::panel{title="An icon with no label"}
**Use** Not used: always add a word

**Not** An icon button

Icons alone are guesswork.
:::
:::panel{title="An action on one row or item"}
**Use** Button secondary with a word

**Not** An icon on its own

A word says what will happen.
:::
::::

## Why it works this way

Icon looks the way it does because of 3 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Icon, and what would move if it changed.

::reason-chain{id="icon/iconography.count"}

::reason-chain{id="icon/iconography.values"}

::reason-chain{id="icon/iconography.definition"}

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

## Icons in the components

The components draw these Lucide icons themselves, at Accessible first's icon size and stroke.

| Icon | Drawn by |
| --- | --- |
| `ArrowDown` | [Data table](./data-table.md) |
| `ArrowLeft` | [Carousel](./carousel.md) |
| `ArrowRight` | [Carousel](./carousel.md) |
| `ArrowUp` | [Data table](./data-table.md) |
| `Calendar` | [Date picker](./date-picker.md) |
| `Check` | [Checkbox](./checkbox.md), [Combobox](./combobox.md), [Context menu](./context-menu.md), [Menubar](./menubar.md), [Select](./select.md) |
| `ChevronDown` | [Accordion](./accordion.md), [Calendar](./calendar.md), [Combobox](./combobox.md), [Native select](./native-select.md), [Navigation menu](./navigation-menu.md), [Select](./select.md) |
| `ChevronLeft` | [Calendar](./calendar.md), [Pagination](./pagination.md) |
| `ChevronRight` | [Breadcrumb](./breadcrumb.md), [Calendar](./calendar.md), [Context menu](./context-menu.md), [Menubar](./menubar.md), [Pagination](./pagination.md) |
| `ChevronsUpDown` | [Data table](./data-table.md) |
| `Circle` | [Context menu](./context-menu.md), [Menubar](./menubar.md), [Radio group](./radio-group.md) |
| `Columns3` | [Data table](./data-table.md) |
| `FileText` | [Attachment](./attachment.md) |
| `GripVertical` | [Resizable](./resizable.md) |
| `ListFilter` | [Data table](./data-table.md) |
| `Loader2` | [Spinner](./spinner.md) |
| `Minus` | [Input otp](./input-otp.md) |
| `MoreHorizontal` | [Breadcrumb](./breadcrumb.md), [Pagination](./pagination.md) |
| `PanelLeft` | [Sidebar](./sidebar.md) |
| `Search` | [Command](./command.md) |
| `X` | [Combobox](./combobox.md), [Dialog](./dialog.md), [Sheet](./sheet.md) |

## Accessibility and keyboard

Test before you ship:

- [ ] Hidden from screen readers by default: the word beside it carries the meaning. undefined
- [ ] With no word on screen, the label is its accessible name. undefined

## Use it in code

```bash
npx open-ds add icon
```

```tsx
import { Bell, X } from "lucide-react";
import { Icon } from "@/components/ui/icon";

<Button><Icon icon={Bell} /> Notify me</Button>
<Button variant="ghost"><Icon icon={X} label="Close" /></Button>
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Icon reads 8 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Icon's tokens to change Icon alone.

::token-table{component="icon"}

Its icon also read `icon.stroke-width`, 2px in Accessible first: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
