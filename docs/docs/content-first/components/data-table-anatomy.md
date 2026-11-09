---
composite_data: "./data-table-anatomy.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 21.5
slug: "data-table/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Data table in Content first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the data table apart to show how design decisions become the parts you see. You don't need it to use the data table: [its own page](../data-table) has everything you need to build.

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

::anatomy-drawing{id="data-table/stage"}

*Content first, light, drawn from the scheme's tokens: 48px rows, 16px cell padding, 18px text and a 12px frame corner.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Toolbar** optional :label[Affordance]
  - **1** **Search field** optional :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
  - **2** **Filter** optional :label[By scheme]{tone="info"} :label[Grouping] :label[Affordance]
  - **3** **Selection count** state :label[By scheme]{tone="info"} :label[Feedback]
  - **4** **Density switch** optional :label[By scheme]{tone="info"} :label[Readability] :label[Reach]
  - **5** **Columns** optional :label[By scheme]{tone="info"} :label[Affordance]
- **Header** required :label[Hierarchy]
  - **6** **Header row** required :label[By scheme]{tone="info"} :label[Hierarchy] :label[Grouping]
  - **7** **Header label** required :label[By scheme]{tone="info"} :label[Hierarchy] :label[Readability]
  - **8** **Sort control** optional :label[By scheme]{tone="info"} :label[Affordance] :label[Feedback]
- **Row** required :label[Readability] :label[Reach]
  - **9** **Row and its line** required :label[By scheme]{tone="info"} :label[Reach] :label[Grouping]
  - **10** **Cell** required :label[By scheme]{tone="info"} :label[Readability]
  - **11** **Highlight row** state :label[By scheme]{tone="info"} :label[Feedback]
  - **12** **Selected row** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
  - **13** **Select box** optional :label[By scheme]{tone="info"} :label[Affordance] :label[Meaning]
- **Empty state** state · shown by Empty :label[Feedback]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2-3-4-5" title="Toolbar" note="Parts 1, 2, 3, 4, 5"}
::anatomy-drawing{id="data-table/card-1"}

:label[Affordance] :label[Feedback]

- **Answer** How often do people repeat actions? → Rarely

  Actions are rare: subscribe, share, save.

- **Answer** How much is on one screen? → One idea at a time

  One idea per screen keeps reading calm.

- **Token** `size.control.default` → `input.height` 3rem :label[By scheme]{tone="info"}

  - **Pick** size.48

- **Token** `color.border.strong` → `button.secondary.border` #7A7062 · dark #A39A8B :label[By scheme]{tone="info"}

  The edge of a control people must find.

  - **Pick** neutral.500: the edge of a control people must find, 4.86:1 on surface.default, above the 3:1 floor.
  - **Dark** neutral.400: the edge of a control people must find, 6.16:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** category.5, disabled.text. Changing this pick moves only what reads color.border.strong.

- **Token** `color.text.muted` → `label` #61594D · dark #A39A8B :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.9:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.16:1 on surface.default, above the 4.5:1 floor.
:::

:::panel{id="part-6-7-8" title="Header" note="Parts 6, 7, 8"}
::anatomy-drawing{id="data-table/card-2"}

:label[Hierarchy] :label[Grouping] :label[Affordance]

- **Answer** What is the main content? → Long-form text

  The content is long-form text.

- **Answer** Typography · Which text roles does it need? → Core and editorial display

  A lead and a display role open articles.

- **Token** `color.surface.sunken` → `table.header-background` #F6F2EA · dark #2E2A24 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.12:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.2:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.text.secondary` → `table.head.label` #4A4339 · dark #CFC6B6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 9.75:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 10.11:1 on surface.default, above the 4.5:1 floor.

- **Token** `color.text.primary` → `label-hover` #1F1B16 · dark #FFFDF8 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.12:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.84:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.
:::

:::panel{id="part-9-10" title="Row" note="Parts 9, 10"}
::anatomy-drawing{id="data-table/card-3"}

:label[Readability] :label[Reach]

- **Answer** How much is on one screen? → One idea at a time

  One idea per screen keeps reading calm.

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Rule** For table row height, use size.row (comfortable). Don't use a compact row.

  Rows are read, not scanned.

- **Rule** For a number in a table, use type.body. Don't use a mono font.

  Tables are rare and read row by row, so digits never need to line up in columns. A mono font would break the reading voice.

- **Token** `size.row` → `table.row-height` 3rem :label[By scheme]{tone="info"}

  - **Pick** size.48

- **Token** `color.border.default` → `table.row-border` #E4DDD0 · dark #4A4339 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.33:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.76:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `color.text.primary` → `table.label` #1F1B16 · dark #FFFDF8 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.12:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.84:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `type.data.font-family` → `table.cell.font-family` "Source Serif 4", Georgia, serif :label[By scheme]{tone="info"}

  - **Pick** source-serif-4 for data text: Source Serif 4 for reading and headings, Inter for labels and captions: a good magazine's text with a quiet interface.
:::

:::panel{id="part-11" title="Highlight row" note="Parts 11"}
::anatomy-drawing{id="data-table/card-4"}

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed gets its own value for touch.

- **Rule** For hover and press feedback, use motion.duration.feedback (moderate). Don't use a fast flash.

  Moderate speed feels calm in a slow reading flow. A fast flash feels jumpy.

- **Token** `color.surface.highlight` → `row.background.hover` #F6F2EA · dark #2E2A24 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-12-13" title="Selected row" note="Parts 12, 13"}
::anatomy-drawing{id="data-table/card-5"}

:label[Meaning] :label[Feedback]

- **Answer** What is the main task? → Read start to end

  People read from start to end.

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Status is rare; color and a word are enough.

- **Rule** For a selected row or item, use color.surface.selected. Don't use bold text only.

  A tint shows the choice clearly on warm paper.

- **Token** `color.surface.selected` → `table.row-selected` #E0E9F5 · dark #202B3B :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** navy.light.100: a tint of the brand, 1.22:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** navy.dark.100: a tint of the brand, 1.2:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.

- **Token** `color.border.selected` → `table.row-selected-edge` #1E3A5F · dark #8FA6C4 :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** navy.light.600: the edge beside a selected fill, so selection is never color alone, 11.5:1 on surface.default, above the 3:1 floor.
  - **Dark** navy.dark.600: the edge beside a selected fill, so selection is never color alone, 6.86:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `size.icon` → `checkbox.size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `data-table`.
- **From a terminal:** `npx open-ds anatomy content-first data-table`
