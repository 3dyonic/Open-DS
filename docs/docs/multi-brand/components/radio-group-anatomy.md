---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 45.5
slug: "radio-group/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Radio group in Multi-brand."
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

:::panel{media="wide"}
![Radio group, every part numbered](/anatomy/multi-brand/radio-group/stage.png)
*Multi-brand, light, drawn in Figma from the scheme's tokens.*

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
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Group" note="Parts 1" media="side"}
![Group: 1](/anatomy/multi-brand/radio-group/card-1.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Rule** For items that belong together, use space.gap.default. Don't use brand-specific spacing.

  Spacing is shared across brands.

- **Token** `component-spacing-map.x3` → `gap` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** space.20
:::

:::panel{id="part-2" title="Circle" note="Parts 2" media="side"}
![Circle: 2](/anatomy/multi-brand/radio-group/card-2.png)

:label[Affordance] :label[Reach]

- **Answer** Accessibility · What is the smallest target? → Touch size

  Customers sign up on phones.

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Customers are often on phones.

- **Token** `size.icon` → `item.icon-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `radius.round` → `item.radius` 50%

  - **Pick** radius.round

- **Token** `color.border.strong` → `item.border` #64748B · dark #96A3B5 :label[By scheme]{tone="info"}

  The edge of a control people must find.

  - **Pick** neutral.500: the edge of a control people must find, 4.76:1 on surface.default, above the 3:1 floor.
  - **Dark** neutral.400: the edge of a control people must find, 6.97:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** disabled.text. Changing this pick moves only what reads color.border.strong.

- **Token** `border-width.default` → `item.border-width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1
:::

:::panel{id="part-3" title="Selected dot" note="Parts 3" media="side"}
![Selected dot: 3](/anatomy/multi-brand/radio-group/card-3.png)

:label[Meaning]

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Brand colors vary, so meaning needs a word.

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Each brand brings its own accent ramp.

- **Token** `color.action.primary` → `icon` #0F766E · dark #7FCFC6 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** teal.light.600: the primary action's fill; its label reads, 5.47:1, above the 4.5:1 floor.
  - **Dark** teal.dark.600: the primary action's fill; its label reads, 9.9:1, above the 4.5:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.
:::

:::panel{id="part-4" title="Focus ring" note="Parts 4" media="side"}
![Focus ring: 4](/anatomy/multi-brand/radio-group/card-4.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA in every brand and mode.

- **Rule** For keyboard focus, use button/focus-ring (from the brand). Don't use removing the outline.

  Focus follows the brand but always shows.

- **Token** `color.border.focus` → `item.focus-ring-focus` #0F766E · dark #7FCFC6 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** teal.light.600: the focus ring, so the keyboard's place is never lost, 5.47:1 on surface.default, above the 3:1 floor.
  - **Dark** teal.dark.600: the focus ring, so the keyboard's place is never lost, 9.9:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `item.focus` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `border-width.focus-offset` → `item.focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `item.focus-ring-offset-focus` #F8FAFC · dark #020617 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.05:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.13:1 from surface.default, so cards and panels stand forward.
:::

:::panel{id="part-5" title="Invalid option" note="Parts 5" media="side"}
![Invalid option: 5](/anatomy/multi-brand/radio-group/card-5.png)

:label[Meaning] :label[Feedback]

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Brand colors vary, so meaning needs a word.

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Each brand brings its own accent ramp.

- **Rule** For an error message, use color.status.danger and a sentence. Don't use the brand color.

  Status colors are shared, never branded.

- **Token** `color.status.danger` → `item.border-invalid` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.52:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.

- **Token** `color.status.danger.subtle` → `item.focus-ring-invalid` #FFDBD8 · dark #410C11 :label[By scheme]{tone="info"}

  The fill behind danger status.

  - **Pick** red.light.100: a quiet tint behind danger; its text, 9.9:1, above the 4.5:1 floor.
  - **Dark** red.dark.100: a quiet tint behind danger; its text, 12.74:1, above the 4.5:1 floor.
:::

:::panel{id="part-6" title="Disabled option" note="Parts 6" media="side"}
![Disabled option: 6](/anatomy/multi-brand/radio-group/card-6.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Token** `opacity.disabled` → `item.disabled-opacity-disabled` 0.4 :label[By scheme]{tone="info"}

  - **Pick** opacity.40
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `radio-group`.
- **From a terminal:** `npx open-ds anatomy multi-brand radio-group`
