---
composite_data: "./iconography.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 7
title: "Iconography"
description: "Accessible first: When icons appear and how they look."
---

# Iconography

When icons appear and how they look.

::token-groups{id="iconography"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What do icons do? | Actions and status | Icons support words; they never replace them. |
| How many icon sizes exist? | One | One size, larger than the text. |
| What icon style and stroke? | Bold stroke | A bold 2px stroke keeps every icon easy to see, for low vision and small screens. |
| How big are icons next to text? | Larger than the text | Larger icons are easier to see. |
| Where do icons work hardest? | Status and messages | Icons work hardest beside status words and errors. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `size.icon` | `size.20` |
| `icon.stroke-width` | `stroke-width.2` |

The raw values these tokens end at are on [Primitives › all kinds](../primitives/).

## The icons

Open DS draws every icon with one open-source set, Lucide. In Accessible first:

- **Style:** Bold stroke
- **Stroke:** 2px on Lucide's 24px grid
- **Size next to text:** Larger than the text

The components draw their own icons; in content, use [Icon](../components/icon.md).

::preview{robot="slumber" id="icon/live"}

## Icons in the components

| Icon | Drawn by |
| --- | --- |
| `ArrowDown` | [Data table](../components/data-table.md) |
| `ArrowLeft` | [Carousel](../components/carousel.md) |
| `ArrowRight` | [Carousel](../components/carousel.md) |
| `ArrowUp` | [Data table](../components/data-table.md) |
| `Calendar` | [Date picker](../components/date-picker.md) |
| `Check` | [Checkbox](../components/checkbox.md), [Combobox](../components/combobox.md), [Context menu](../components/context-menu.md), [Menubar](../components/menubar.md), [Select](../components/select.md) |
| `ChevronDown` | [Accordion](../components/accordion.md), [Calendar](../components/calendar.md), [Combobox](../components/combobox.md), [Native select](../components/native-select.md), [Navigation menu](../components/navigation-menu.md), [Select](../components/select.md) |
| `ChevronLeft` | [Calendar](../components/calendar.md), [Pagination](../components/pagination.md) |
| `ChevronRight` | [Breadcrumb](../components/breadcrumb.md), [Calendar](../components/calendar.md), [Context menu](../components/context-menu.md), [Menubar](../components/menubar.md), [Pagination](../components/pagination.md) |
| `ChevronsUpDown` | [Data table](../components/data-table.md) |
| `Circle` | [Context menu](../components/context-menu.md), [Menubar](../components/menubar.md), [Radio group](../components/radio-group.md) |
| `Columns3` | [Data table](../components/data-table.md) |
| `FileText` | [Attachment](../components/attachment.md) |
| `GripVertical` | [Resizable](../components/resizable.md) |
| `ListFilter` | [Data table](../components/data-table.md) |
| `Loader2` | [Spinner](../components/spinner.md) |
| `Minus` | [Input otp](../components/input-otp.md) |
| `MoreHorizontal` | [Breadcrumb](../components/breadcrumb.md), [Pagination](../components/pagination.md) |
| `PanelLeft` | [Sidebar](../components/sidebar.md) |
| `Search` | [Command](../components/command.md) |
| `X` | [Combobox](../components/combobox.md), [Dialog](../components/dialog.md), [Sheet](../components/sheet.md) |

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| An icon with no label | Not used: always add a word | An icon button | Icons alone are guesswork. |
| An action on one row or item | Button secondary with a word | An icon on its own | A word says what will happen. |
| An icon beside text | size.icon and icon.stroke-width | A thin icon at text size | Larger icons with a bold line stay easy to see for people with low vision. |
