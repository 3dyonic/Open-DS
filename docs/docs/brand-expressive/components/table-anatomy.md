---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 57.5
slug: "table/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Table in Brand expressive."
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

![Table, every part numbered](/anatomy/brand-expressive/table/stage.png)

*Brand expressive, light, drawn in Figma from the scheme's tokens.*

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
![Header: 1, 2](/anatomy/brand-expressive/table/card-1.png)

:label[Hierarchy] :label[Grouping]

- **Answer** What is the main content? → Images and campaigns

  Images, campaigns and short punchy copy.

- **Answer** Typography · Which text roles does it need? → Core and expressive display

  A big expressive display role carries the brand.

- **Rule** For field label or column header, use type.label. Don't use type.caption.

  Labels stay readable on vivid color.

- **Token** `color.surface.sunken` → `header-background` #FCEFE6 · dark #33241F :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.13:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.21:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.text.secondary` → `head.label` #4D3A33 · dark #E2C4B3 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 10.67:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 10.96:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.label.font-weight` → `head.font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700

- **Token** `space.inset.cell-x` → `head.padding-x` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

:::panel{id="part-3-4" title="Row" note="Parts 3, 4"}
![Row: 3, 4](/anatomy/brand-expressive/table/card-2.png)

:label[Readability] :label[Reach]

- **Answer** How much is on one screen? → One idea at a time

  One big idea per section.

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Rule** For table row height, use size.row (comfortable). Don't use a compact row.

  Tables are rare and short, so there is no need to fit many rows. Comfortable rows keep the brand's airy rhythm.

- **Rule** For a number in a table, use type.body. Don't use a mono font.

  Tables are rare and never compared column by column, so mono digits add nothing. The brand font keeps the voice.

- **Token** `size.row` → `row-height` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `color.border.default` → `row-border` #F2DCCF · dark #4D3A33 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.26:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.69:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `color.text.primary` → `label` #1F1411 · dark #FFF8F3 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.0:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.12:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `type.data.font-family` → `cell.font-family` "DM Sans", system-ui, sans-serif :label[By scheme]{tone="info"}

  - **Pick** dm-sans for data text: Bricolage Grotesque for display and headings, DM Sans for text: loud where the brand speaks, easy where people read.
:::

:::panel{id="part-5" title="Selected row" note="Parts 5"}
![Selected row: 5](/anatomy/brand-expressive/table/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** What is the main task? → Browse and explore

  People browse and explore the story.

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Color and word.

- **Rule** For a selected row or item, use color.surface.selected (brand tint). Don't use grey.

  Selection carries the brand.

- **Token** `color.surface.selected` → `row-selected` #FFEAF0 · dark #451731 :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** pink.light.100: a tint of the brand, 1.15:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** pink.dark.100: a tint of the brand, 1.22:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.

- **Token** `color.border.selected` → `row-selected-edge` #D61F7A · dark #F59ACA :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** pink.light.600: the edge beside a selected fill, so selection is never color alone, 4.84:1 on surface.default, above the 3:1 floor.
  - **Dark** pink.dark.600: the edge beside a selected fill, so selection is never color alone, 8.88:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `border-width.focus` → `row.focus` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `table`.
- **From a terminal:** `npx open-ds anatomy brand-expressive table`
