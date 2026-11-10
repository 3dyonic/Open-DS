---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 56.5
slug: "table/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Table in Multi-brand."
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

:::panel{media="wide"}
![Table, every part numbered](/anatomy/multi-brand/table/stage.png)
*Multi-brand, light, drawn in Figma from the scheme's tokens.*

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
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Header" note="Parts 1, 2" media="side"}
![Header: 1, 2](/anatomy/multi-brand/table/card-1.png)

:label[Hierarchy] :label[Grouping]

- **Answer** What is the main content? → Forms and tasks

  Product pages, sign-up and account forms.

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  One set of roles across brands.

- **Rule** For field label or column header, use type.label. Don't use type.caption.

  Labels stay readable in every brand.

- **Token** `color.surface.sunken` → `header-background` #F1F5F9 · dark #1E293B :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.1:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.22:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.text.secondary` → `head.label` #334155 · dark #CBD5E1 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 10.35:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 12.02:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.label.font-weight` → `head.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600

- **Token** `space.inset.cell-x` → `head.padding-x` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

:::panel{id="part-3-4" title="Row" note="Parts 3, 4" media="side"}
![Row: 3, 4](/anatomy/multi-brand/table/card-2.png)

:label[Readability] :label[Reach]

- **Answer** How much is on one screen? → A moderate amount

  A moderate amount per screen.

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Rule** For table row height, use size.row (comfortable). Don't use a compact row.

  Customers browse on phones, and compact rows are hard to tap in any brand.

- **Rule** For a number in a table, use type.body. Don't use a mono font.

  Prices sit in sentences and offers, not in columns to compare, so a mono font adds nothing in any brand.

- **Token** `size.row` → `row-height` 3rem :label[By scheme]{tone="info"}

  - **Pick** size.48

- **Token** `color.border.default` → `row-border` #E2E8F0 · dark #334155 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.18:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.72:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `color.text.primary` → `label` #0F172A · dark #F8FAFC :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.85:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.06:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `type.data.font-family` → `cell.font-family` Inter, system-ui, sans-serif :label[By scheme]{tone="info"}

  - **Pick** inter for data text: Each brand brings its own face, Inter, Plus Jakarta Sans or Poppins, on one shared type scale, so brands differ and the system stays one.
:::

:::panel{id="part-5" title="Selected row" note="Parts 5" media="side"}
![Selected row: 5](/anatomy/multi-brand/table/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** What is the main task? → Complete a form

  Customers sign up and buy.

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Brand colors vary, so meaning needs a word.

- **Rule** For a selected row or item, use color.surface.selected (from the brand). Don't use a fixed blue.

  Selection follows the brand color.

- **Token** `color.surface.selected` → `row-selected` #DEF3F0 · dark #012C28 :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** teal.light.100: a tint of the brand, 1.15:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** teal.dark.100: a tint of the brand, 1.18:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.

- **Token** `color.border.selected` → `row-selected-edge` #0F766E · dark #7FCFC6 :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** teal.light.600: the edge beside a selected fill, so selection is never color alone, 5.47:1 on surface.default, above the 3:1 floor.
  - **Dark** teal.dark.600: the edge beside a selected fill, so selection is never color alone, 9.9:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `border-width.focus` → `row.focus` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `table`.
- **From a terminal:** `npx open-ds anatomy multi-brand table`
