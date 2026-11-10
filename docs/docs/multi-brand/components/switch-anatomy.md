---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 56.5
slug: "switch/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Switch in Multi-brand."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the switch apart to show how design decisions become the parts you see. You don't need it to use the switch: [its own page](../switch) has everything you need to build.

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

![Switch, every part numbered](/anatomy/multi-brand/switch/stage.png)

*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Track** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
- **2** **Thumb** required :label[By scheme]{tone="info"} :label[Affordance]
- **3** **On track** state :label[By scheme]{tone="info"} :label[Meaning]
- **4** **Thumb at the on side** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
- **5** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
- **6** **Disabled switch** state :label[By scheme]{tone="info"} :label[Feedback]
- **Label** required · shown by Label :label[Readability] :label[Reach]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Track" note="Parts 1"}
![Track: 1](/anatomy/multi-brand/switch/card-1.png)

:label[Affordance] :label[Reach]

- **Answer** Accessibility · What is the smallest target? → Touch size

  Customers sign up on phones.

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Customers are often on phones.

- **Token** `size.icon` → `height` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `size.icon` → `width` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `radius.round` → `radius` 9999px

  - **Pick** radius.full
:::

:::panel{id="part-2" title="Thumb" note="Parts 2"}
![Thumb: 2](/anatomy/multi-brand/switch/card-2.png)

:label[Affordance]

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Answer** Theming · Which modes ship? → Light and dark

  Light and dark ship for every brand.

- **Rule** For someone switches to dark, use The dark mode of the active brand. Don't use one dark theme for all brands.

  Every brand ships light and dark.

- **Token** `size.icon` → `thumb.size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `radius.round` → `thumb.radius` 9999px

  - **Pick** radius.full

- **Token** `color.surface.default` → `thumb.background` #FFFFFF · dark #0F172A :label[By scheme]{tone="info"}

  The base fill for content.

  - **Pick** neutral.0: the base for content; body text reads 17.85:1 on it, above the 4.5:1 floor.
  - **Dark** neutral.50: the base for content; body text reads 17.06:1 on it, above the 4.5:1 floor.
  - **Shares the step with** surface.raised, action.secondary. Changing this pick moves only what reads color.surface.default.
:::

:::panel{id="part-3-4" title="On" note="Parts 3, 4"}
![On: 3, 4](/anatomy/multi-brand/switch/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Brand colors vary, so meaning needs a word.

- **Answer** Motion · How fast does feedback feel? → Moderate

  Moderate speed across brands.

- **Rule** For someone asked for less motion, use Reduced motion. Don't use full motion.

  Motion is reduced, not removed: a fade keeps the change visible, and nothing slides.

- **Token** `color.action.primary` → `track.background.checked` #0F766E · dark #7FCFC6 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** teal.light.600: the primary action's fill; its label reads, 5.47:1, above the 4.5:1 floor.
  - **Dark** teal.dark.600: the primary action's fill; its label reads, 9.9:1, above the 4.5:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.

- **Token** `size.icon` → `thumb.travel` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16
:::

:::panel{id="part-5" title="Focus ring" note="Parts 5"}
![Focus ring: 5](/anatomy/multi-brand/switch/card-4.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA in every brand and mode.

- **Rule** For keyboard focus, use button/focus-ring (from the brand). Don't use removing the outline.

  Focus follows the brand but always shows.

- **Token** `color.border.focus` → `focus-ring` #0F766E · dark #7FCFC6 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** teal.light.600: the focus ring, so the keyboard's place is never lost, 5.47:1 on surface.default, above the 3:1 floor.
  - **Dark** teal.dark.600: the focus ring, so the keyboard's place is never lost, 9.9:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `focus` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `border-width.focus-offset` → `focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `focus-ring-offset` #F8FAFC · dark #020617 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.05:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.13:1 from surface.default, so cards and panels stand forward.
:::

:::panel{id="part-6" title="Disabled switch" note="Parts 6"}
![Disabled switch: 6](/anatomy/multi-brand/switch/card-5.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Token** `opacity.disabled` → `disabled` 0.4 :label[By scheme]{tone="info"}

  - **Pick** opacity.40
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `switch`.
- **From a terminal:** `npx open-ds anatomy multi-brand switch`
