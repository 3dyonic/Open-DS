---
composite_data: "./iconography.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 7
title: "Iconography"
description: "Dense data: When icons appear and how they look."
---

# Iconography

When icons appear and how they look.

::token-groups{id="iconography"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What do icons do? | Actions and status | Icons mark row actions and status. |
| How many icon sizes exist? | One | One size, matched to the small text. |
| What icon style and stroke? | Outline | Outline icons at a 1.5px stroke stay light next to dense text. |
| How big are icons next to text? | Match the text | Icons match the label so they do not outweigh it. |
| Where do icons work hardest? | Toolbars and rows | Icons work hardest in toolbars and row actions. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `size.icon` | `size.16` |
| `icon.stroke-width` | `stroke-width.1_5` |

The raw values these tokens end at are on [Primitives › all kinds](../primitives/).

## The icons

Open DS draws every icon with one open-source set, Lucide. In Dense data:

- **Style:** Outline
- **Stroke:** 1.5px on Lucide's 24px grid
- **Size next to text:** Match the text

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
| An icon with no label | Icon button with a tooltip | A bare icon | Experts learn icons; the tooltip covers the first uses. |
| An action on one row or item | Icon button, ghost, compact | Button secondary in every row | Rows repeat dozens of times; a quiet icon keeps the table readable. |
| An icon beside text | size.icon and icon.stroke-width | An icon larger than its label | Icons match the small text, so a toolbar reads as one line. The light stroke keeps rows quiet. |
