---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 45.5
slug: "radio-group/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Radio group in Brand expressive."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the radio group apart to show how design decisions become the parts you see. You don't need it to use the radio group: [its own page](../radio-group) has everything you need to build.

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

![Radio group, every part numbered](/anatomy/brand-expressive/radio-group/stage.png)

*Brand expressive, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Group** required :label[By scheme]{tone="info"} :label[Grouping]
- **Option** required :label[Affordance] :label[Reach]
  - **2** **Circle** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
  - **3** **Dot** state :label[By scheme]{tone="info"} :label[Meaning]
  - **4** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
  - **5** **Invalid option** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
  - **6** **Disabled option** state :label[By scheme]{tone="info"} :label[Feedback]
  - **Option label** required · shown by Label :label[Readability] :label[Reach]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Group" note="Parts 1"}
![Group: 1](/anatomy/brand-expressive/radio-group/card-1.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Air keeps big type readable.

- **Token** `component-spacing-map.x3` → `gap` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-2" title="Circle" note="Parts 2"}
![Circle: 2](/anatomy/brand-expressive/radio-group/card-2.png)

:label[Affordance] :label[Reach]

- **Answer** Accessibility · What is the smallest target? → Touch size

  Visitors come from social posts on phones.

- **Answer** Shape · What should control corners say? → Pill

  Pill controls feel playful.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Most visitors arrive on phones, and a compact control is too small for a thumb.

- **Token** `size.icon` → `item.icon-size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20

- **Token** `radius.round` → `item.radius` 50%

  - **Pick** radius.round

- **Token** `color.border.strong` → `item.border` #8A6F63 · dark #B5988A :label[By scheme]{tone="info"}

  The edge of a control people must find.

  - **Pick** neutral.500: the edge of a control people must find, 4.63:1 on surface.default, above the 3:1 floor.
  - **Dark** neutral.400: the edge of a control people must find, 6.71:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** category.5, disabled.text. Changing this pick moves only what reads color.border.strong.

- **Token** `border-width.default` → `item.border-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2
:::

:::panel{id="part-3" title="Selected dot" note="Parts 3"}
![Selected dot: 3](/anatomy/brand-expressive/radio-group/card-3.png)

:label[Meaning]

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Color and word.

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Brand accents are part of the message.

- **Token** `color.action.primary` → `icon` #D61F7A · dark #F59ACA :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** pink.light.600: the primary action's fill; its label reads, 4.84:1, above the 4.5:1 floor.
  - **Dark** pink.dark.600: the primary action's fill; its label reads, 8.88:1, above the 4.5:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.
:::

:::panel{id="part-4" title="Focus ring" note="Parts 4"}
![Focus ring: 4](/anatomy/brand-expressive/radio-group/card-4.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA, checked on every vivid color.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Focus must show on vivid color.

- **Token** `color.border.focus` → `item.focus-ring-focus` #D61F7A · dark #F59ACA :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** pink.light.600: the focus ring, so the keyboard's place is never lost, 4.84:1 on surface.default, above the 3:1 floor.
  - **Dark** pink.dark.600: the focus ring, so the keyboard's place is never lost, 8.88:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `item.focus` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3

- **Token** `border-width.focus-offset` → `item.focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `item.focus-ring-offset-focus` #FFF8F3 · dark #120B09 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.05:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.08:1 from surface.default, so cards and panels stand forward.
:::

:::panel{id="part-5" title="Invalid option" note="Parts 5"}
![Invalid option: 5](/anatomy/brand-expressive/radio-group/card-5.png)

:label[Meaning] :label[Feedback]

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Color and word.

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Brand accents are part of the message.

- **Rule** For an error message, use color.status.danger and a short sentence. Don't use the brand magenta.

  Errors must not look like the brand.

- **Token** `color.status.danger` → `item.border-invalid` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.58:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.

- **Token** `color.status.danger.subtle` → `item.focus-ring-invalid` #FFDBD8 · dark #481316 :label[By scheme]{tone="info"}

  The fill behind danger status.

  - **Pick** red.light.100: a quiet tint behind danger; its text, 9.9:1, above the 4.5:1 floor.
  - **Dark** red.dark.100: a quiet tint behind danger; its text, 11.86:1, above the 4.5:1 floor.
:::

:::panel{id="part-6" title="Disabled option" note="Parts 6"}
![Disabled option: 6](/anatomy/brand-expressive/radio-group/card-6.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Token** `opacity.disabled` → `item.disabled-opacity-disabled` 0.4 :label[By scheme]{tone="info"}

  - **Pick** opacity.40
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `radio-group`.
- **From a terminal:** `npx open-ds anatomy brand-expressive radio-group`
