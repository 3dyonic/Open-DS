---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 40.5
slug: "native-select/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Native select in Brand expressive."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the native select apart to show how design decisions become the parts you see. You don't need it to use the native select: [its own page](../native-select) has everything you need to build.

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

![Native select, every part numbered](/anatomy/brand-expressive/native-select/stage.png)

*Brand expressive, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Field** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach] :label[Containment]
- **2** **Selected value** required :label[By scheme]{tone="info"} :label[Readability]
- **3** **Chevron** required :label[By scheme]{tone="info"} :label[Affordance]
- **4** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
- **5** **Invalid field** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
- **6** **Disabled field** state :label[By scheme]{tone="info"} :label[Feedback]
- **7** **Small select** optional :label[By scheme]{tone="info"} :label[Reach]
- **Options list** required · shown by the browser :label[Readability]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Field" note="Parts 1"}
![Field: 1](/anatomy/brand-expressive/native-select/card-1.png)

:label[Affordance] :label[Reach]

- **Answer** Shape · What should control corners say? → Pill

  Pill controls feel playful.

- **Answer** Accessibility · What is the smallest target? → Touch size

  Visitors come from social posts on phones.

- **Rule** For corners of buttons and inputs, use radius.control (pill). Don't use sharp corners.

  Pills match the brand's round, playful shapes. Sharp corners would feel corporate.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Most visitors arrive on phones, and a compact control is too small for a thumb.

- **Token** `size.control.default` → `height` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `radius.control` → `radius` calc(infinity * 1px) :label[By scheme]{tone="info"}

  - **Pick** radius.pill: Pill controls feel playful.

- **Token** `color.border.strong` → `border` #8A6F63 · dark #B5988A :label[By scheme]{tone="info"}

  The edge of a control people must find.

  - **Pick** neutral.500: the edge of a control people must find, 4.63:1 on surface.default, above the 3:1 floor.
  - **Dark** neutral.400: the edge of a control people must find, 6.71:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** category.5, disabled.text. Changing this pick moves only what reads color.border.strong.

- **Token** `space.inset.control-x` → `padding-x` 1.75rem :label[By scheme]{tone="info"}

  - **Pick** space.28
:::

:::panel{id="part-2" title="Selected value" note="Parts 2"}
![Selected value: 2](/anatomy/brand-expressive/native-select/card-2.png)

:label[Readability]

- **Answer** Typography · How large is body text? → Regular

  Regular body; the display does the shouting.

- **Rule** For field label or column header, use type.label. Don't use type.caption.

  Labels stay readable on vivid color.

- **Token** `type.body.font-size` → `font-size` 1.0625rem :label[By scheme]{tone="info"}

  - **Pick** font.size.17

- **Token** `type.body.line-height` → `line-height` 1.55 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_55
:::

:::panel{id="part-3" title="Chevron" note="Parts 3"}
![Chevron: 3](/anatomy/brand-expressive/native-select/card-3.png)

:label[Affordance]

- **Answer** Iconography · How big are icons next to text? → Larger than the text

  Larger icons hold their own next to big type.

- **Rule** For an icon with no label, use Not used: always add a word. Don't use an icon button with a hover hint.

  On phones, hover hints never show; a word says what will happen.

- **Token** `size.icon` → `icon-size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20

- **Token** `color.text.muted` → `icon.label` #6B544A · dark #B5988A :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.71:1 on surface.default, above the 4.5:1 floor.

- **Token** `space.inset.control-x` → `icon.inset` 1.75rem :label[By scheme]{tone="info"}

  - **Pick** space.28
:::

:::panel{id="part-4" title="Focus ring" note="Parts 4"}
![Focus ring: 4](/anatomy/brand-expressive/native-select/card-4.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA, checked on every vivid color.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Focus must show on vivid color.

- **Token** `color.border.focus` → `focus-ring-focus` #D61F7A · dark #F59ACA :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** pink.light.600: the focus ring, so the keyboard's place is never lost, 4.84:1 on surface.default, above the 3:1 floor.
  - **Dark** pink.dark.600: the focus ring, so the keyboard's place is never lost, 8.88:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `focus` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3

- **Token** `border-width.focus-offset` → `focus-offset` 2px

  - **Pick** border-width.2
:::

:::panel{id="part-5" title="Invalid field" note="Parts 5"}
![Invalid field: 5](/anatomy/brand-expressive/native-select/card-5.png)

:label[Meaning] :label[Feedback]

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Color and word.

- **Rule** For an error message, use color.status.danger and a short sentence. Don't use the brand magenta.

  Errors must not look like the brand.

- **Token** `color.status.danger` → `border-invalid` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.58:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.

- **Token** `color.status.danger` → `focus-ring-invalid` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.58:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

:::panel{id="part-6" title="Disabled field" note="Parts 6"}
![Disabled field: 6](/anatomy/brand-expressive/native-select/card-6.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Token** `color.disabled.surface` → `disabled.background` #FCEFE6 · dark #33241F :label[By scheme]{tone="info"}

  The fill of a control that cannot be used right now.

  - **Pick** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Dark** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Shares the step with** surface.sunken, surface.highlight, action.secondary.hover, category.5.subtle. Changing this pick moves only what reads color.disabled.surface.

- **Token** `color.disabled.border` → `disabled.border` #F2DCCF · dark #4D3A33 :label[By scheme]{tone="info"}

  The edge of a control that cannot be used right now.

  - **Pick** neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Dark** neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Shares the step with** surface.pressed, border.default. Changing this pick moves only what reads color.disabled.border.

- **Token** `color.disabled.text` → `disabled.text` #8A6F63 · dark #E2C4B3 :label[By scheme]{tone="info"}

  Text and icons of a control that cannot be used right now.

  - **Pick** neutral.500: 4.63:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Dark** neutral.500: 10.96:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Shares the step with** border.strong, category.5. Changing this pick moves only what reads color.disabled.text.

- **Token** `color.disabled.text` → `icon.disabled` #8A6F63 · dark #E2C4B3 :label[By scheme]{tone="info"}

  Text and icons of a control that cannot be used right now.

  - **Pick** neutral.500: 4.63:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Dark** neutral.500: 10.96:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Shares the step with** border.strong, category.5. Changing this pick moves only what reads color.disabled.text.
:::

:::panel{id="part-7" title="Small select" note="Parts 7"}
![Small select: 7](/anatomy/brand-expressive/native-select/card-7.png)

:label[Reach]

- **Answer** Accessibility · What is the smallest target? → Touch size

  Visitors come from social posts on phones.

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Most visitors arrive on phones, and a compact control is too small for a thumb.

- **Token** `size.control.compact` → `sm.height` 2.75rem :label[By scheme]{tone="info"}

  - **Pick** size.44

- **Token** `component-spacing-map.x1` → `sm.padding-y` 0.25rem

  - **Pick** space.4
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `native-select`.
- **From a terminal:** `npx open-ds anatomy brand-expressive native-select`
