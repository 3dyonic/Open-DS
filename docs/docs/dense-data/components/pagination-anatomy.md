---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 43.5
slug: "pagination/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Pagination in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the pagination apart to show how design decisions become the parts you see. You don't need it to use the pagination: [its own page](../pagination) has everything you need to build.

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

![Pagination, every part numbered](/anatomy/dense-data/pagination/stage.png)

*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Previous** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
- **Pages** required :label[Grouping]
  - **2** **Page** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
  - **3** **Current page** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
  - **4** **Ellipsis** optional :label[By scheme]{tone="info"} :label[Grouping]
  - **5** **Gap** required :label[By scheme]{tone="info"} :label[Grouping] :label[Reach]
- **6** **Next** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
- **Page links** required · shown by Button :label[Affordance]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-6" title="Previous and next" note="Parts 1, 6"}
![Previous and next: 1, 6](/anatomy/dense-data/pagination/card-1.png)

:label[Affordance] :label[Reach]

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Answer** Accessibility · What is the smallest target? → Compact, for a pointer

  Mouse and keyboard; compact targets are enough.

- **Rule** For the smallest clickable thing, use size.control.compact. Don't use anything smaller.

  Compact still fits a mouse. Touch is not this product's input.

- **Token** `space.gap.tight` → `link.gap` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** space.4

- **Token** `component-spacing-map.x3` → `link.padding-x` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12

- **Token** `component-spacing-map.x3` → `previous.padding-left` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12

- **Token** `component-spacing-map.x3` → `next.padding-right` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12
:::

:::panel{id="part-2-3" title="Pages" note="Parts 2, 3"}
![Pages: 2, 3](/anatomy/dense-data/pagination/card-2.png)

:label[Affordance] :label[Meaning]

- **Answer** Accessibility · What is the smallest target? → Compact, for a pointer

  Mouse and keyboard; compact targets are enough.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Rule** For an alternative or cancel, use Button secondary. Don't use button ghost.

  A ghost button has no edge, so next to a filled primary it reads as plain text and cancel gets lost. Secondary keeps a visible border, so people find it at once.

- **Rule** For the smallest clickable thing, use size.control.compact. Don't use anything smaller.

  Compact still fits a mouse. Touch is not this product's input.

- **Token** `color.text.link` → `button.ghost.label` #3729AA · dark #BEBBFB :label[By scheme]{tone="info"}

  Links in running text.

  - **Pick** violet.light.700: a link, set apart by its hue, 10.19:1 on surface.default, above the 4.5:1 floor.
  - **Dark** violet.dark.700: a link, set apart by its hue, 9.62:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.primary.hover. Changing this pick moves only what reads color.text.link.

- **Token** `color.border.strong` → `button.secondary.border` #6B7585 · dark #969FAD :label[By scheme]{tone="info"}

  The edge of a control people must find.

  - **Pick** neutral.500: the edge of a control people must find, 4.66:1 on surface.default, above the 3:1 floor.
  - **Dark** neutral.400: the edge of a control people must find, 6.47:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** category.5, disabled.text. Changing this pick moves only what reads color.border.strong.

- **Token** `size.control.default` → `button.height` 2rem :label[By scheme]{tone="info"}

  - **Pick** size.32
:::

:::panel{id="part-4-5" title="Ellipsis and gap" note="Parts 4, 5"}
![Ellipsis and gap: 4, 5](/anatomy/dense-data/pagination/card-3.png)

:label[Grouping]

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the label so they do not outweigh it.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For items that belong together, use space.gap.tight. Don't use space.gap.group.

  Things that belong together sit close.

- **Token** `size.icon` → `ellipsis.icon-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `space.gap.tight` → `content.gap` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** space.4
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `pagination`.
- **From a terminal:** `npx open-ds anatomy dense-data pagination`
