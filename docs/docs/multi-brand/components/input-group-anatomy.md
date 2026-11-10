---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 32.5
slug: "input-group/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Input group in Multi-brand."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the input group apart to show how design decisions become the parts you see. You don't need it to use the input group: [its own page](../input-group) has everything you need to build.

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

![Input group, every part numbered](/anatomy/multi-brand/input-group/stage.png)

*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Group** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach] :label[Containment]
- **2** **Start addon** optional :label[By scheme]{tone="info"} :label[Meaning]
- **Value and placeholder** required · shown by Input :label[Readability]
- **3** **End addon** optional :label[By scheme]{tone="info"} :label[Hierarchy]
- **4** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
- **5** **Invalid group** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
- **6** **Disabled group** state :label[By scheme]{tone="info"} :label[Feedback]
- **Addon button** optional · shown by Button :label[By scheme]{tone="info"} :label[Affordance]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Group" note="Parts 1"}
![Group: 1](/anatomy/multi-brand/input-group/card-1.png)

:label[Affordance] :label[Reach]

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Answer** Accessibility · What is the smallest target? → Touch size

  Customers sign up on phones.

- **Rule** For corners of buttons and inputs, use radius.control (set by the brand). Don't use a hard-coded radius.

  Each brand sets its own corner through the theme.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Customers are often on phones.

- **Token** `size.control.default` → `height` 2.75rem :label[By scheme]{tone="info"}

  - **Pick** size.44

- **Token** `radius.control` → `radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Rounded by default; each brand sets its own corner.

- **Token** `color.surface.default` → `background` #FFFFFF · dark #0F172A :label[By scheme]{tone="info"}

  The base fill for content.

  - **Pick** neutral.0: the base for content; body text reads 17.85:1 on it, above the 4.5:1 floor.
  - **Dark** neutral.50: the base for content; body text reads 17.06:1 on it, above the 4.5:1 floor.
  - **Shares the step with** surface.raised, action.secondary. Changing this pick moves only what reads color.surface.default.
:::

:::panel{id="part-2-3" title="Addons" note="Parts 2, 3"}
![Addons: 2, 3](/anatomy/multi-brand/input-group/card-2.png)

:label[Meaning] :label[Hierarchy]

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the text.

- **Answer** Typography · How large is body text? → Regular

  Regular body size suits all brands.

- **Rule** For items that belong together, use space.gap.default. Don't use brand-specific spacing.

  Spacing is shared across brands.

- **Token** `size.icon` → `addon.icon-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `color.text.muted` → `addon.label` #4B5A6F · dark #96A3B5 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.97:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.body.font-size` → `addon.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `space.inset.control-x` → `addon.inline.start.padding-left` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

:::panel{id="part-4" title="Focus ring" note="Parts 4"}
![Focus ring: 4](/anatomy/multi-brand/input-group/card-3.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA in every brand and mode.

- **Rule** For keyboard focus, use button/focus-ring (from the brand). Don't use removing the outline.

  Focus follows the brand but always shows.

- **Token** `color.border.focus` → `focus-ring.highlight` #0F766E · dark #7FCFC6 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** teal.light.600: the focus ring, so the keyboard's place is never lost, 5.47:1 on surface.default, above the 3:1 floor.
  - **Dark** teal.dark.600: the focus ring, so the keyboard's place is never lost, 9.9:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `focus-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `border-width.focus-offset` → `focus-offset` 2px

  - **Pick** border-width.2
:::

:::panel{id="part-5" title="Invalid group" note="Parts 5"}
![Invalid group: 5](/anatomy/multi-brand/input-group/card-4.png)

:label[Meaning] :label[Feedback]

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Brand colors vary, so meaning needs a word.

- **Rule** For an error message, use color.status.danger and a sentence. Don't use the brand color.

  Status colors are shared, never branded.

- **Token** `color.status.danger` → `border-invalid` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.52:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.

- **Token** `color.status.danger` → `focus-ring-invalid` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.52:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

:::panel{id="part-6" title="Disabled group" note="Parts 6"}
![Disabled group: 6](/anatomy/multi-brand/input-group/card-5.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Token** `color.disabled.surface` → `disabled.background` #F1F5F9 · dark #1E293B :label[By scheme]{tone="info"}

  The fill of a control that cannot be used right now.

  - **Pick** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Dark** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Shares the step with** surface.sunken, surface.highlight, action.secondary.hover. Changing this pick moves only what reads color.disabled.surface.

- **Token** `color.disabled.border` → `disabled.border` #E2E8F0 · dark #334155 :label[By scheme]{tone="info"}

  The edge of a control that cannot be used right now.

  - **Pick** neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Dark** neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Shares the step with** surface.pressed, border.default. Changing this pick moves only what reads color.disabled.border.

- **Token** `color.disabled.text` → `addon.disabled.label` #64748B · dark #CBD5E1 :label[By scheme]{tone="info"}

  Text and icons of a control that cannot be used right now.

  - **Pick** neutral.500: 4.76:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Dark** neutral.500: 12.02:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Shares the step with** border.strong. Changing this pick moves only what reads color.disabled.text.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `input-group`.
- **From a terminal:** `npx open-ds anatomy multi-brand input-group`
