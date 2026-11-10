---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 32.5
slug: "input-otp/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Input otp in Accessible first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the code input apart to show how design decisions become the parts you see. You don't need it to use the code input: [its own page](../input-otp) has everything you need to build.

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
![Input otp, every part numbered](/anatomy/accessible-first/input-otp/stage.png)
*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Slot** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach] :label[Containment]
- **2** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
- **3** **Caret** state :label[By scheme]{tone="info"} :label[Focus] :label[Feedback]
- **4** **Separator** optional :label[By scheme]{tone="info"} :label[Grouping]
- **5** **Invalid slots** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
- **6** **Disabled slots** state :label[By scheme]{tone="info"} :label[Feedback]
- **Digit** required · not in this example :label[By scheme]{tone="info"} :label[Readability]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Slot" note="Parts 1" media="side"}
![Slot: 1](/anatomy/accessible-first/input-otp/card-1.png)

:label[Affordance] :label[Reach]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Clear, slightly rounded controls.

- **Answer** Accessibility · What is the smallest target? → Large

  Large targets for tremor and touch.

- **Rule** For corners of buttons and inputs, use radius.control. Don't use a pill.

  Clear rectangles read as fields and buttons.

- **Rule** For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size.

  Large targets help people with motor needs.

- **Token** `size.control.default` → `slot.size` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `radius.control` → `slot.radius` 0.375rem :label[By scheme]{tone="info"}

  - **Pick** radius.6: Clear, slightly rounded controls.
:::

:::panel{id="part-2" title="Focus ring" note="Parts 2" media="side"}
![Focus ring: 2](/anatomy/accessible-first/input-otp/card-2.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AAA for text

  AAA contrast for text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus, with an offset. Don't use a thin or faint outline.

  Focus must be seen by everyone.

- **Token** `color.border.focus` → `slot.focus-ring.highlight` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** blue.light.600: the focus ring, so the keyboard's place is never lost, 7.26:1 on surface.default, above the 3:1 floor.
  - **Dark** blue.dark.600: the focus ring, so the keyboard's place is never lost, 8.74:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `slot.focus-width` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3

- **Token** `border-width.focus-offset` → `slot.focus-offset` 2px

  - **Pick** border-width.2
:::

:::panel{id="part-3" title="Caret" note="Parts 3" media="side"}
![Caret: 3](/anatomy/accessible-first/input-otp/card-3.png)

:label[Focus] :label[Feedback]

- **Answer** Motion · How fast does feedback feel? → Moderate

  Moderate speed is easy to follow.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus, with an offset. Don't use a thin or faint outline.

  Focus must be seen by everyone.

- **Token** `size.icon` → `caret.height` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20

- **Token** `border-width.default` → `caret.width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `color.text.primary` → `caret.background` #141414 · dark #F7F7F7 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.42:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.2:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `motion.duration.feedback` → `caret.duration` 200ms :label[By scheme]{tone="info"}

  - **Pick** duration.moderate
:::

:::panel{id="part-4" title="Separator" note="Parts 4" media="side"}
![Separator: 4](/anatomy/accessible-first/input-otp/card-4.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Generous space lowers mis-taps.

- **Token** `size.icon` → `separator.icon-size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20

- **Token** `space.gap.default` → `gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

:::panel{id="part-5" title="Invalid slots" note="Parts 5" media="side"}
![Invalid slots: 5](/anatomy/accessible-first/input-otp/card-5.png)

:label[Meaning] :label[Feedback]

- **Answer** Accessibility · How many signals carry each meaning? → Three: color, icon and word

  Never color alone.

- **Rule** For an error message, use color.status.danger, an icon and a sentence next to the field. Don't use color alone.

  People must know what went wrong and where.

- **Token** `color.status.danger` → `slot.border-invalid` #981519 · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.700: danger reads as text and icons, 8.55:1 on surface.default, above the 7:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.76:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.

- **Token** `color.status.danger` → `slot.focus-ring-invalid` #981519 · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.700: danger reads as text and icons, 8.55:1 on surface.default, above the 7:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.76:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

:::panel{id="part-6" title="Disabled slots" note="Parts 6" media="side"}
![Disabled slots: 6](/anatomy/accessible-first/input-otp/card-6.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Token** `color.disabled.surface` → `slot.disabled.background` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  The fill of a control that cannot be used right now.

  - **Pick** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Dark** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Shares the step with** surface.sunken, surface.highlight, action.secondary.hover, category.5.subtle. Changing this pick moves only what reads color.disabled.surface.

- **Token** `color.disabled.border` → `slot.disabled.border` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  The edge of a control that cannot be used right now.

  - **Pick** neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Dark** neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Shares the step with** surface.pressed, border.default. Changing this pick moves only what reads color.disabled.border.

- **Token** `color.disabled.text` → `slot.disabled.text` #595959 · dark #949494 :label[By scheme]{tone="info"}

  Text and icons of a control that cannot be used right now.

  - **Pick** neutral.500: 7.0:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Dark** neutral.500: 6.07:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Shares the step with** text.muted, border.strong, category.5. Changing this pick moves only what reads color.disabled.text.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `input-otp`.
- **From a terminal:** `npx open-ds anatomy accessible-first input-otp`
