---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 27.5
slug: "field/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Field in Brand expressive."
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

![Field, every part numbered](/anatomy/brand-expressive/field/stage.png)

*Brand expressive, light, drawn in Figma from the scheme's tokens.*

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

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Label" note="Parts 1"}
![Label: 1](/anatomy/brand-expressive/field/card-1.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · Which text roles does it need? → Core and expressive display

  A big expressive display role carries the brand.

- **Rule** For field label or column header, use type.label. Don't use type.caption.

  Labels stay readable on vivid color.

- **Token** `type.label.font-size` → `label.font-size` 0.9375rem :label[By scheme]{tone="info"}

  - **Pick** font.size.15

- **Token** `type.label.font-weight` → `label.font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700
:::

:::panel{id="part-2" title="Description" note="Parts 2"}
![Description: 2](/anatomy/brand-expressive/field/card-2.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · Which text roles does it need? → Core and expressive display

  A big expressive display role carries the brand.

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Brand accents are part of the message.

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Rule** For paragraph or help text, use type.body, short. Don't use long paragraphs.

  Short copy keeps the energy.

- **Token** `type.body.font-size` → `description.font-size` 1.0625rem :label[By scheme]{tone="info"}

  - **Pick** font.size.17

- **Token** `color.text.muted` → `description.label` #6B544A · dark #B5988A :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.71:1 on surface.default, above the 4.5:1 floor.

- **Token** `component-spacing-map.x1` → `description.margin-top` 0.25rem

  - **Pick** space.4
:::

:::panel{id="part-3" title="Error message" note="Parts 3"}
![Error message: 3](/anatomy/brand-expressive/field/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Brand accents are part of the message.

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Rule** For an error message, use color.status.danger and a short sentence. Don't use the brand magenta.

  Errors must not look like the brand.

- **Rule** For the words of an error, use Plain first, a light touch after. Don't use a joke before the fix.

  Playful copy must never hide what went wrong.

- **Token** `color.status.danger` → `error.label` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.58:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.

- **Token** `type.body.font-weight` → `error.font-weight` 400

  - **Pick** font.weight.400
:::

:::panel{id="part-4" title="Invalid field" note="Parts 4"}
![Invalid field: 4](/anatomy/brand-expressive/field/card-4.png)

:label[Meaning] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Brand accents are part of the message.

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Rule** For an error message, use color.status.danger and a short sentence. Don't use the brand magenta.

  Errors must not look like the brand.

- **Token** `color.status.danger` → `input.border.invalid` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.58:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

:::panel{id="part-5" title="Choice card" note="Parts 5"}
![Choice card: 5](/anatomy/brand-expressive/field/card-5.png)

:label[Containment] :label[Reach]

- **Answer** Shape · What should control corners say? → Pill

  Pill controls feel playful.

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Rule** For corners of buttons and inputs, use radius.control (pill). Don't use sharp corners.

  Pills match the brand's round, playful shapes. Sharp corners would feel corporate.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Most visitors arrive on phones, and a compact control is too small for a thumb.

- **Token** `radius.control` → `label.radius` calc(infinity * 1px) :label[By scheme]{tone="info"}

  - **Pick** radius.pill: Pill controls feel playful.

- **Token** `component-spacing-map.x4` → `label.padding` 2rem :label[By scheme]{tone="info"}

  - **Pick** space.32

- **Token** `border-width.default` → `label.border-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2
:::

:::panel{id="part-6" title="Checked choice card" note="Parts 6"}
![Checked choice card: 6](/anatomy/brand-expressive/field/card-6.png)

:label[Meaning] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Brand accents are part of the message.

- **Rule** For a selected row or item, use color.surface.selected (brand tint). Don't use grey.

  Selection carries the brand.

- **Token** `color.border.selected` → `label.border.checked` #D61F7A · dark #F59ACA :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** pink.light.600: the edge beside a selected fill, so selection is never color alone, 4.84:1 on surface.default, above the 3:1 floor.
  - **Dark** pink.dark.600: the edge beside a selected fill, so selection is never color alone, 8.88:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `color.surface.selected` → `label.background.checked` #FFEAF0 · dark #451731 :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** pink.light.100: a tint of the brand, 1.15:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** pink.dark.100: a tint of the brand, 1.22:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.
:::

:::panel{id="part-7" title="Separator" note="Parts 7"}
![Separator: 7](/anatomy/brand-expressive/field/card-7.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Rule** For between page sections, use space.gap.section and a color block. Don't use a thin line.

  Big space and color make each section a moment.

- **Token** `component-spacing-map.x2` → `separator.margin-y` 0.5rem

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `field`.
- **From a terminal:** `npx open-ds anatomy brand-expressive field`
