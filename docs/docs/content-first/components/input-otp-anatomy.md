---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 33.5
slug: "input-otp/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Input otp in Content first."
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

![Input otp, every part numbered](/anatomy/content-first/input-otp/stage.png)

*Content first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Slot** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach] :label[Containment]
- **2** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
- **3** **Caret** state :label[By scheme]{tone="info"} :label[Focus] :label[Feedback]
- **4** **Separator** optional :label[By scheme]{tone="info"} :label[Grouping]
- **5** **Invalid slots** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
- **6** **Disabled slots** state :label[By scheme]{tone="info"} :label[Feedback]
- **Digit** required · not in this example :label[By scheme]{tone="info"} :label[Readability]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Slot" note="Parts 1"}
![Slot: 1](/anatomy/content-first/input-otp/card-1.png)

:label[Affordance] :label[Reach]

- **Answer** Shape · What should control corners say? → Rounded

  Rounded corners feel friendly.

- **Answer** Accessibility · What is the smallest target? → Touch size

  Readers are often on phones.

- **Rule** For corners of buttons and inputs, use radius.control (rounded). Don't use sharp corners.

  Rounded corners match the warm reading tone. Sharp corners feel technical next to long text.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Many readers are on phones.

- **Token** `size.control.default` → `slot.size` 3rem :label[By scheme]{tone="info"}

  - **Pick** size.48

- **Token** `radius.control` → `slot.radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Rounded corners feel friendly.
:::

:::panel{id="part-2" title="Focus ring" note="Parts 2"}
![Focus ring: 2](/anatomy/content-first/input-otp/card-2.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA contrast, with large text helping further.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Keyboard users must always see where they are.

- **Token** `color.border.focus` → `slot.focus-ring.highlight` #1E3A5F · dark #8FA6C4 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** navy.light.600: the focus ring, so the keyboard's place is never lost, 11.5:1 on surface.default, above the 3:1 floor.
  - **Dark** navy.dark.600: the focus ring, so the keyboard's place is never lost, 6.86:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `slot.focus-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `border-width.focus-offset` → `slot.focus-offset` 2px

  - **Pick** border-width.2
:::

:::panel{id="part-3" title="Caret" note="Parts 3"}
![Caret: 3](/anatomy/content-first/input-otp/card-3.png)

:label[Focus] :label[Feedback]

- **Answer** Motion · How fast does feedback feel? → Moderate

  Moderate speed feels calm.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Keyboard users must always see where they are.

- **Token** `size.icon` → `caret.height` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `border-width.default` → `caret.width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1

- **Token** `color.text.primary` → `caret.background` #1F1B16 · dark #FFFDF8 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.12:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.84:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `motion.duration.feedback` → `caret.duration` 200ms :label[By scheme]{tone="info"}

  - **Pick** duration.moderate
:::

:::panel{id="part-4" title="Separator" note="Parts 4"}
![Separator: 4](/anatomy/content-first/input-otp/card-4.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Text needs air even inside a group.

- **Token** `size.icon` → `separator.icon-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `space.gap.default` → `gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

:::panel{id="part-5" title="Invalid slots" note="Parts 5"}
![Invalid slots: 5](/anatomy/content-first/input-otp/card-5.png)

:label[Meaning] :label[Feedback]

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Status is rare; color and a word are enough.

- **Rule** For an error message, use color.status.danger and a plain sentence. Don't use color alone.

  The sentence says what to fix; color only draws the eye.

- **Token** `color.status.danger` → `slot.border-invalid` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.21:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.

- **Token** `color.status.danger` → `slot.focus-ring-invalid` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.21:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

:::panel{id="part-6" title="Disabled slots" note="Parts 6"}
![Disabled slots: 6](/anatomy/content-first/input-otp/card-6.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed gets its own value for touch.

- **Token** `color.disabled.surface` → `slot.disabled.background` #F6F2EA · dark #2E2A24 :label[By scheme]{tone="info"}

  The fill of a control that cannot be used right now.

  - **Pick** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Dark** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Shares the step with** surface.sunken, surface.highlight, action.secondary.hover, category.5.subtle. Changing this pick moves only what reads color.disabled.surface.

- **Token** `color.disabled.border` → `slot.disabled.border` #E4DDD0 · dark #4A4339 :label[By scheme]{tone="info"}

  The edge of a control that cannot be used right now.

  - **Pick** neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Dark** neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Shares the step with** surface.pressed, border.default. Changing this pick moves only what reads color.disabled.border.

- **Token** `color.disabled.text` → `slot.disabled.text` #7A7062 · dark #CFC6B6 :label[By scheme]{tone="info"}

  Text and icons of a control that cannot be used right now.

  - **Pick** neutral.500: 4.86:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Dark** neutral.500: 10.11:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Shares the step with** border.strong, category.5. Changing this pick moves only what reads color.disabled.text.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `input-otp`.
- **From a terminal:** `npx open-ds anatomy content-first input-otp`
