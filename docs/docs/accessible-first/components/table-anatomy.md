---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 56.5
slug: "table/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Table in Accessible first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the table apart to show how design decisions become the parts you see. You don't need it to use the table: [its own page](../table) has everything you need to build.

**Three easy ways in**

- Start with the drawing. Each number is one part, and the legend beside it names it.
- Want to know why a part looks the way it does? Its card follows the decision from the answer about the product, through the rule and the token, to what you see.
- Or start from a job, like Focus or Emphasis, and find every part that does it in the legend.

Come back whenever a part makes you wonder why.
:::

## Design roles

Each part does a job for the person. These are the jobs, as questions the part answers.

- **Containment** What holds this?
- **Layering** What sits on top?
- **Hierarchy** What do you read first?
- **Readability** Can you read it?
- **Emphasis** Where does the eye go?
- **Meaning** What state is it in?
- **Affordance** Can you act on it?
- **Feedback** Did it respond?
- **Focus** Where is the keyboard?
- **Grouping** What belongs together?
- **Reach** Can you hit it?

## The parts

![Table, every part numbered](/anatomy/accessible-first/table/stage.png)

*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Header** required :label[Hierarchy]
  - **1** **Header row** required :label[By scheme]{tone="info"} :label[Hierarchy] :label[Grouping]
  - **2** **Header label** required :label[By scheme]{tone="info"} :label[Hierarchy] :label[Readability]
- **Row** required :label[Readability] :label[Reach]
  - **3** **Row and its line** required :label[By scheme]{tone="info"} :label[Reach] :label[Grouping]
  - **4** **Cell** required :label[By scheme]{tone="info"} :label[Readability]
  - **5** **Selected row** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
- **Status** optional · shown by Badge :label[Meaning]
- **Row action** optional · shown by Button :label[Affordance]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Header" note="Parts 1, 2"}
![Header: 1, 2](/anatomy/accessible-first/table/card-1.png)

:label[Hierarchy] :label[Grouping]

- **Answer** What is the main content? → Forms and tasks

  Most screens are forms and steps.

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Rule** For field label or column header, use type.label, above the field, always visible. Don't use a placeholder as the label.

  Labels must stay visible while typing.

- **Token** `color.surface.sunken` → `header-background` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.17:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.16:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.text.secondary` → `head.label` #333333 · dark #D6D6D6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 12.63:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.700: supporting text, 12.68:1 on surface.default, above the 7:1 floor.

- **Token** `type.label.font-weight` → `head.font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700

- **Token** `space.inset.cell-x` → `head.padding-x` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

:::panel{id="part-3-4" title="Row" note="Parts 3, 4"}
![Row: 3, 4](/anatomy/accessible-first/table/card-2.png)

:label[Readability] :label[Reach]

- **Answer** How much is on one screen? → One idea at a time

  One question per screen lowers effort.

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For table row height, use size.row (large). Don't use a compact row.

  Large rows are easy to read and tap.

- **Rule** For a number in a table, use type.body. Don't use a small or mono font.

  Every number must be readable at large size.

- **Token** `size.row` → `row-height` 3.5rem :label[By scheme]{tone="info"}

  - **Pick** size.56

- **Token** `color.border.default` → `row-border` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `color.text.primary` → `label` #141414 · dark #F7F7F7 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.42:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.2:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `type.data.font-family` → `cell.font-family` "Atkinson Hyperlegible", Verdana, sans-serif :label[By scheme]{tone="info"}

  - **Pick** atkinson-hyperlegible for data text: Atkinson Hyperlegible for everything: it was drawn so letters can't be mistaken, and nobody is left out.
:::

:::panel{id="part-5" title="Selected row" note="Parts 5"}
![Selected row: 5](/anatomy/accessible-first/table/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** What is the main task? → Complete a form

  People must finish the form.

- **Answer** Accessibility · How many signals carry each meaning? → Three: color, icon and word

  Never color alone.

- **Rule** For a selected row or item, use color.surface.selected and a check icon. Don't use color alone.

  Selection never relies on color alone.

- **Token** `color.surface.selected` → `row-selected` #E2EDFF · dark #102547 :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** blue.light.100: a tint of the brand, 1.18:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** blue.dark.100: a tint of the brand, 1.21:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.

- **Token** `color.border.selected` → `row-selected-edge` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** blue.light.600: the edge beside a selected fill, so selection is never color alone, 7.26:1 on surface.default, above the 3:1 floor.
  - **Dark** blue.dark.600: the edge beside a selected fill, so selection is never color alone, 8.74:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `border-width.focus` → `row.focus` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `table`.
- **From a terminal:** `npx open-ds anatomy accessible-first table`
