---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 40.5
slug: "native-select/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Native select in Accessible first."
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

:::panel{media="wide"}
![Native select, every part numbered](/anatomy/accessible-first/native-select/stage.png)
*Accessible first, light, drawn in Figma from the scheme's tokens.*

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
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Field" note="Parts 1" media="side"}
![Field: 1](/anatomy/accessible-first/native-select/card-1.png)

:label[Affordance] :label[Reach]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Clear, slightly rounded controls.

- **Answer** Accessibility · What is the smallest target? → Large

  Large targets for tremor and touch.

- **Rule** For corners of buttons and inputs, use radius.control. Don't use a pill.

  Clear rectangles read as fields and buttons.

- **Rule** For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size.

  Large targets help people with motor needs.

- **Token** `size.control.default` → `height` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `radius.control` → `radius` 0.375rem :label[By scheme]{tone="info"}

  - **Pick** radius.6: Clear, slightly rounded controls.

- **Token** `color.border.strong` → `border` #595959 · dark #949494 :label[By scheme]{tone="info"}

  The edge of a control people must find.

  - **Pick** neutral.500: the edge of a control people must find, 7.0:1 on surface.default, above the 3:1 floor.
  - **Dark** neutral.500: the edge of a control people must find, 6.07:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** text.muted, category.5, disabled.text. Changing this pick moves only what reads color.border.strong.

- **Token** `space.inset.control-x` → `padding-x` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-2" title="Selected value" note="Parts 2" media="side"}
![Selected value: 2](/anatomy/accessible-first/native-select/card-2.png)

:label[Readability]

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Rule** For field label or column header, use type.label, above the field, always visible. Don't use a placeholder as the label.

  Labels must stay visible while typing.

- **Token** `type.body.font-size` → `font-size` 1.1875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.19

- **Token** `type.body.line-height` → `line-height` 1.6 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_6
:::

:::panel{id="part-3" title="Chevron" note="Parts 3" media="side"}
![Chevron: 3](/anatomy/accessible-first/native-select/card-3.png)

:label[Affordance]

- **Answer** Iconography · How big are icons next to text? → Larger than the text

  Larger icons are easier to see.

- **Rule** For an icon with no label, use Not used: always add a word. Don't use an icon button.

  Icons alone are guesswork.

- **Token** `size.icon` → `icon-size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20

- **Token** `color.text.muted` → `icon.label` #595959 · dark #B4B4B4 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** border.strong, category.5, disabled.text. Changing this pick moves only what reads color.text.muted.

- **Token** `space.inset.control-x` → `icon.inset` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-4" title="Focus ring" note="Parts 4" media="side"}
![Focus ring: 4](/anatomy/accessible-first/native-select/card-4.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AAA for text

  AAA contrast for text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus, with an offset. Don't use a thin or faint outline.

  Focus must be seen by everyone.

- **Token** `color.border.focus` → `focus-ring-focus` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** blue.light.600: the focus ring, so the keyboard's place is never lost, 7.26:1 on surface.default, above the 3:1 floor.
  - **Dark** blue.dark.600: the focus ring, so the keyboard's place is never lost, 8.74:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `focus` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3

- **Token** `border-width.focus-offset` → `focus-offset` 2px

  - **Pick** border-width.2
:::

:::panel{id="part-5" title="Invalid field" note="Parts 5" media="side"}
![Invalid field: 5](/anatomy/accessible-first/native-select/card-5.png)

:label[Meaning] :label[Feedback]

- **Answer** Accessibility · How many signals carry each meaning? → Three: color, icon and word

  Never color alone.

- **Rule** For an error message, use color.status.danger, an icon and a sentence next to the field. Don't use color alone.

  People must know what went wrong and where.

- **Token** `color.status.danger` → `border-invalid` #981519 · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.700: danger reads as text and icons, 8.55:1 on surface.default, above the 7:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.76:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.

- **Token** `color.status.danger` → `focus-ring-invalid` #981519 · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.700: danger reads as text and icons, 8.55:1 on surface.default, above the 7:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.76:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

:::panel{id="part-6" title="Disabled field" note="Parts 6" media="side"}
![Disabled field: 6](/anatomy/accessible-first/native-select/card-6.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Token** `color.disabled.surface` → `disabled.background` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  The fill of a control that cannot be used right now.

  - **Pick** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Dark** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Shares the step with** surface.sunken, surface.highlight, action.secondary.hover, category.5.subtle. Changing this pick moves only what reads color.disabled.surface.

- **Token** `color.disabled.border` → `disabled.border` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  The edge of a control that cannot be used right now.

  - **Pick** neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Dark** neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Shares the step with** surface.pressed, border.default. Changing this pick moves only what reads color.disabled.border.

- **Token** `color.disabled.text` → `disabled.text` #595959 · dark #949494 :label[By scheme]{tone="info"}

  Text and icons of a control that cannot be used right now.

  - **Pick** neutral.500: 7.0:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Dark** neutral.500: 6.07:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Shares the step with** text.muted, border.strong, category.5. Changing this pick moves only what reads color.disabled.text.

- **Token** `color.disabled.text` → `icon.disabled` #595959 · dark #949494 :label[By scheme]{tone="info"}

  Text and icons of a control that cannot be used right now.

  - **Pick** neutral.500: 7.0:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Dark** neutral.500: 6.07:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Shares the step with** text.muted, border.strong, category.5. Changing this pick moves only what reads color.disabled.text.
:::

:::panel{id="part-7" title="Small select" note="Parts 7" media="side"}
![Small select: 7](/anatomy/accessible-first/native-select/card-7.png)

:label[Reach]

- **Answer** Accessibility · What is the smallest target? → Large

  Large targets for tremor and touch.

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size.

  Large targets help people with motor needs.

- **Token** `size.control.compact` → `sm.height` 3rem :label[By scheme]{tone="info"}

  - **Pick** size.48

- **Token** `component-spacing-map.x1` → `sm.padding-y` 0.25rem

  - **Pick** space.4
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `native-select`.
- **From a terminal:** `npx open-ds anatomy accessible-first native-select`
