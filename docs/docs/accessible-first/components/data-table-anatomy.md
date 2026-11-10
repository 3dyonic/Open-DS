---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 21.5
slug: "data-table/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Data table in Accessible first."
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

:::panel{media="wide"}
![Data table, every part numbered](/anatomy/accessible-first/data-table/stage.png)
*Accessible first, light, drawn in Figma from the scheme's tokens.*

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
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2-3-4-5" title="Toolbar" note="Parts 1, 2, 3, 4, 5" media="side"}
![Toolbar: 1, 2, 3, 4, 5](/anatomy/accessible-first/data-table/card-1.png)

:label[Affordance] :label[Feedback]

- **Answer** How often do people repeat actions? → Rarely

  People do this once or twice a year.

- **Answer** How much is on one screen? → One idea at a time

  One question per screen lowers effort.

- **Token** `size.control.default` → `input.height` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `color.border.strong` → `button.secondary.border` #595959 · dark #949494 :label[By scheme]{tone="info"}

  The edge of a control people must find.

  - **Pick** neutral.500: the edge of a control people must find, 7.0:1 on surface.default, above the 3:1 floor.
  - **Dark** neutral.500: the edge of a control people must find, 6.07:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** text.muted, category.5, disabled.text. Changing this pick moves only what reads color.border.strong.

- **Token** `color.text.muted` → `label` #595959 · dark #B4B4B4 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** border.strong, category.5, disabled.text. Changing this pick moves only what reads color.text.muted.
:::

:::panel{id="part-6-7-8" title="Header" note="Parts 6, 7, 8" media="side"}
![Header: 6, 7, 8](/anatomy/accessible-first/data-table/card-2.png)

:label[Hierarchy] :label[Grouping] :label[Affordance]

- **Answer** What is the main content? → Forms and tasks

  Most screens are forms and steps.

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Token** `color.surface.sunken` → `table.header-background` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.17:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.16:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.text.secondary` → `table.head.label` #333333 · dark #D6D6D6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 12.63:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.700: supporting text, 12.68:1 on surface.default, above the 7:1 floor.

- **Token** `color.text.primary` → `label-hover` #141414 · dark #F7F7F7 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.42:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.2:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.
:::

:::panel{id="part-9-10" title="Row" note="Parts 9, 10" media="side"}
![Row: 9, 10](/anatomy/accessible-first/data-table/card-3.png)

:label[Readability] :label[Reach]

- **Answer** How much is on one screen? → One idea at a time

  One question per screen lowers effort.

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For table row height, use size.row (large). Don't use a compact row.

  Large rows are easy to read and tap.

- **Rule** For a number in a table, use type.body. Don't use a small or mono font.

  Every number must be readable at large size.

- **Token** `size.row` → `table.row-height` 3.5rem :label[By scheme]{tone="info"}

  - **Pick** size.56

- **Token** `color.border.default` → `table.row-border` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `color.text.primary` → `table.label` #141414 · dark #F7F7F7 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.42:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.2:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `type.data.font-family` → `table.cell.font-family` "Atkinson Hyperlegible", Verdana, sans-serif :label[By scheme]{tone="info"}

  - **Pick** atkinson-hyperlegible for data text: Atkinson Hyperlegible for everything: it was drawn so letters can't be mistaken, and nobody is left out.
:::

:::panel{id="part-11" title="Highlight row" note="Parts 11" media="side"}
![Highlight row: 11](/anatomy/accessible-first/data-table/card-4.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Rule** For hover and press feedback, use motion.duration.feedback (moderate). Don't use fast flicker.

  Moderate speed is easy to follow.

- **Token** `color.surface.highlight` → `row.background.hover` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-12-13" title="Selected row" note="Parts 12, 13" media="side"}
![Selected row: 12, 13](/anatomy/accessible-first/data-table/card-5.png)

:label[Meaning] :label[Feedback]

- **Answer** What is the main task? → Complete a form

  People must finish the form.

- **Answer** Accessibility · How many signals carry each meaning? → Three: color, icon and word

  Never color alone.

- **Rule** For a selected row or item, use color.surface.selected and a check icon. Don't use color alone.

  Selection never relies on color alone.

- **Token** `color.surface.selected` → `table.row-selected` #E2EDFF · dark #102547 :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** blue.light.100: a tint of the brand, 1.18:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** blue.dark.100: a tint of the brand, 1.21:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.

- **Token** `color.border.selected` → `table.row-selected-edge` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** blue.light.600: the edge beside a selected fill, so selection is never color alone, 7.26:1 on surface.default, above the 3:1 floor.
  - **Dark** blue.dark.600: the edge beside a selected fill, so selection is never color alone, 8.74:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `size.icon` → `checkbox.size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `data-table`.
- **From a terminal:** `npx open-ds anatomy accessible-first data-table`
