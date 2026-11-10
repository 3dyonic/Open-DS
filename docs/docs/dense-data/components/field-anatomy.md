---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 27.5
slug: "field/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Field in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the field apart to show how design decisions become the parts you see. You don't need it to use the field: [its own page](../field) has everything you need to build.

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
![Field, every part numbered](/anatomy/dense-data/field/stage.png)
*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Field** required :label[Grouping]
  - **1** **Label** required :label[By scheme]{tone="info"} :label[Readability] :label[Hierarchy]
  - **Control** required · shown by Input :label[Affordance]
  - **2** **Description** optional :label[By scheme]{tone="info"} :label[Readability] :label[Hierarchy]
  - **3** **Error message** optional :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
  - **4** **Invalid field** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
- **Choice card** optional :label[Containment] :label[Affordance]
  - **5** **Choice card** optional :label[By scheme]{tone="info"} :label[Containment] :label[Reach]
  - **Checkbox or radio** required · shown by Checkbox :label[Affordance]
  - **6** **Checked choice card** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
- **7** **Separator** optional :label[Grouping]
- **Separator line** optional · shown by Separator :label[Grouping]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Label" note="Parts 1" media="side"}
![Label: 1](/anatomy/dense-data/field/card-1.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Rule** For field label or column header, use type.label. Don't use type.heading.

  Headers repeat on every column; a heavy style would compete with the data.

- **Token** `type.label.font-size` → `label.font-size` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** font.size.12

- **Token** `type.label.font-weight` → `label.font-weight` 500 :label[By scheme]{tone="info"}

  - **Pick** font.weight.500
:::

:::panel{id="part-2" title="Description" note="Parts 2" media="side"}
![Description: 2](/anatomy/dense-data/field/card-2.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For paragraph or help text, use type.body. Don't use type.label.

  Help text is a sentence read in passing. Body size reads quickly; the label style is made for short names, not sentences.

- **Token** `type.body.font-size` → `description.font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `color.text.muted` → `description.label` #535D6D · dark #969FAD :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.66:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.47:1 on surface.default, above the 4.5:1 floor.

- **Token** `component-spacing-map.x1` → `description.margin-top` 0.25rem

  - **Pick** space.4
:::

:::panel{id="part-3" title="Error message" note="Parts 3" media="side"}
![Error message: 3](/anatomy/dense-data/field/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Answer** Accessibility · Which states get their own visible value? → Hover, focus, disabled

  Pressed reuses hover; experts do not need more.

- **Rule** For an error message, use color.status.danger with an icon. Don't use color.status.warning.

  Red always means fix this, and the icon says it without color.

- **Rule** For the words of an error, use Name the record, then the fix. Flat and specific.. Don't use "Oops" or a vague apology.

  Experts act on the message; the record and the fix are all they need.

- **Token** `color.status.danger` → `error.label` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.28:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.

- **Token** `type.body.font-weight` → `error.font-weight` 400

  - **Pick** font.weight.400
:::

:::panel{id="part-4" title="Invalid field" note="Parts 4" media="side"}
![Invalid field: 4](/anatomy/dense-data/field/card-4.png)

:label[Meaning] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Answer** Accessibility · Which states get their own visible value? → Hover, focus, disabled

  Pressed reuses hover; experts do not need more.

- **Rule** For an error message, use color.status.danger with an icon. Don't use color.status.warning.

  Red always means fix this, and the icon says it without color.

- **Token** `color.status.danger` → `input.border.invalid` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.28:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

:::panel{id="part-5" title="Choice card" note="Parts 5" media="side"}
![Choice card: 5](/anatomy/dense-data/field/card-5.png)

:label[Containment] :label[Reach]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For corners of buttons and inputs, use radius.control. Don't use radius.round.

  Small corners keep dense rows straight.

- **Rule** For the smallest clickable thing, use size.control.compact. Don't use anything smaller.

  Compact still fits a mouse. Touch is not this product's input.

- **Token** `radius.control` → `label.radius` 0.125rem :label[By scheme]{tone="info"}

  - **Pick** radius.2: Small corners keep dense rows straight.

- **Token** `component-spacing-map.x4` → `label.padding` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16

- **Token** `border-width.default` → `label.border-width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1
:::

:::panel{id="part-6" title="Checked choice card" note="Parts 6" media="side"}
![Checked choice card: 6](/anatomy/dense-data/field/card-6.png)

:label[Meaning] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Rule** For a selected row or item, use color.surface.selected. Don't use color.action.primary as a fill.

  A light tint shows selection without hiding the data.

- **Token** `color.border.selected` → `label.border.checked` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** violet.light.600: the edge beside a selected fill, so selection is never color alone, 6.97:1 on surface.default, above the 3:1 floor.
  - **Dark** violet.dark.600: the edge beside a selected fill, so selection is never color alone, 7.62:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `color.surface.selected` → `label.background.checked` #E8ECFF · dark #2A244F :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** violet.light.100: a tint of the brand, 1.17:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** violet.dark.100: a tint of the brand, 1.2:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.
:::

:::panel{id="part-7" title="Separator" note="Parts 7" media="side"}
![Separator: 7](/anatomy/dense-data/field/card-7.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For between page sections, use space.gap.section and a hairline. Don't use a card around every section.

  Lines separate without taking room from the data.

- **Token** `component-spacing-map.x2` → `separator.margin-y` 0.5rem

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `field`.
- **From a terminal:** `npx open-ds anatomy dense-data field`
