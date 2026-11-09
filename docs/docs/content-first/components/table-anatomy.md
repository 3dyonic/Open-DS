---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 56.5
slug: "table/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Table in Content first."
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

![Table, every part numbered](/anatomy/content-first/table/stage.png)

*Content first, light, drawn in Figma from the scheme's tokens.*

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
![Header: 1, 2](/anatomy/content-first/table/card-1.png)

:label[Hierarchy] :label[Grouping]

- **Answer** What is the main content? → Long-form text

  The content is long-form text.

- **Answer** Typography · Which text roles does it need? → Core and editorial display

  A lead and a display role open articles.

- **Rule** For field label or column header, use type.label. Don't use type.caption.

  Caption is too faint for a label people must read.

- **Token** `color.surface.sunken` → `header-background` #F6F2EA · dark #2E2A24 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.12:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.2:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.text.secondary` → `head.label` #4A4339 · dark #CFC6B6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 9.75:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 10.11:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.label.font-weight` → `head.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600

- **Token** `space.inset.cell-x` → `head.padding-x` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

:::panel{id="part-3-4" title="Row" note="Parts 3, 4"}
![Row: 3, 4](/anatomy/content-first/table/card-2.png)

:label[Readability] :label[Reach]

- **Answer** How much is on one screen? → One idea at a time

  One idea per screen keeps reading calm.

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Rule** For table row height, use size.row (comfortable). Don't use a compact row.

  Rows are read, not scanned.

- **Rule** For a number in a table, use type.body. Don't use a mono font.

  Tables are rare and read row by row, so digits never need to line up in columns. A mono font would break the reading voice.

- **Token** `size.row` → `row-height` 3rem :label[By scheme]{tone="info"}

  - **Pick** size.48

- **Token** `color.border.default` → `row-border` #E4DDD0 · dark #4A4339 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.33:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.76:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `color.text.primary` → `label` #1F1B16 · dark #FFFDF8 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.12:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.84:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `type.data.font-family` → `cell.font-family` "Source Serif 4", Georgia, serif :label[By scheme]{tone="info"}

  - **Pick** source-serif-4 for data text: Source Serif 4 for reading and headings, Inter for labels and captions: a good magazine's text with a quiet interface.
:::

:::panel{id="part-5" title="Selected row" note="Parts 5"}
![Selected row: 5](/anatomy/content-first/table/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** What is the main task? → Read start to end

  People read from start to end.

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Status is rare; color and a word are enough.

- **Rule** For a selected row or item, use color.surface.selected. Don't use bold text only.

  A tint shows the choice clearly on warm paper.

- **Token** `color.surface.selected` → `row-selected` #E0E9F5 · dark #202B3B :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** navy.light.100: a tint of the brand, 1.22:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** navy.dark.100: a tint of the brand, 1.2:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.

- **Token** `color.border.selected` → `row-selected-edge` #1E3A5F · dark #8FA6C4 :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** navy.light.600: the edge beside a selected fill, so selection is never color alone, 11.5:1 on surface.default, above the 3:1 floor.
  - **Dark** navy.dark.600: the edge beside a selected fill, so selection is never color alone, 6.86:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `border-width.focus` → `row.focus` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `table`.
- **From a terminal:** `npx open-ds anatomy content-first table`
