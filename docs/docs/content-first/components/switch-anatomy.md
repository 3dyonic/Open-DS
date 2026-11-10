---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 55.5
slug: "switch/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Switch in Content first."
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

:::panel{media="wide"}
![Switch, every part numbered](/anatomy/content-first/switch/stage.png)
*Content first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Track** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
- **2** **Thumb** required :label[By scheme]{tone="info"} :label[Affordance]
- **3** **On track** state :label[By scheme]{tone="info"} :label[Meaning]
- **4** **Thumb at the on side** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
- **5** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
- **6** **Disabled switch** state :label[By scheme]{tone="info"} :label[Feedback]
- **Label** required · shown by Label :label[Readability] :label[Reach]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Track" note="Parts 1" media="side"}
![Track: 1](/anatomy/content-first/switch/card-1.png)

:label[Affordance] :label[Reach]

- **Answer** Accessibility · What is the smallest target? → Touch size

  Readers are often on phones.

- **Answer** Shape · What should control corners say? → Rounded

  Rounded corners feel friendly.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Many readers are on phones.

- **Token** `size.icon` → `height` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `size.icon` → `width` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `radius.pill` → `radius` calc(infinity * 1px)

  - **Pick** radius.pill
:::

:::panel{id="part-2" title="Thumb" note="Parts 2" media="side"}
![Thumb: 2](/anatomy/content-first/switch/card-2.png)

:label[Affordance]

- **Answer** Shape · What should control corners say? → Rounded

  Rounded corners feel friendly.

- **Answer** Theming · Which modes ship? → Light and dark

  Light and dark ship as standard; dark helps night reading.

- **Rule** For someone switches to dark, use The dark semantic mode. Don't use inverting images.

  Only semantic colors change; the reading layout stays.

- **Token** `size.icon` → `thumb.size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `radius.round` → `thumb.radius` 50%

  - **Pick** radius.round

- **Token** `color.surface.default` → `thumb.background` #FFFFFF · dark #1F1B16 :label[By scheme]{tone="info"}

  The base fill for content.

  - **Pick** neutral.0: the base for content; body text reads 17.12:1 on it, above the 4.5:1 floor.
  - **Dark** neutral.50: the base for content; body text reads 16.84:1 on it, above the 4.5:1 floor.
  - **Shares the step with** surface.raised, action.secondary. Changing this pick moves only what reads color.surface.default.
:::

:::panel{id="part-3-4" title="On" note="Parts 3, 4" media="side"}
![On: 3, 4](/anatomy/content-first/switch/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Status is rare; color and a word are enough.

- **Answer** Motion · How fast does feedback feel? → Moderate

  Moderate speed feels calm.

- **Rule** For someone asked for less motion, use No motion. Don't use reduced motion.

  A shorter motion still moves. When people ask for less motion, nothing moves.

- **Token** `color.action.primary` → `track.background.checked` #1E3A5F · dark #8FA6C4 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** navy.light.600: the primary action's fill; its label reads, 11.5:1, above the 4.5:1 floor.
  - **Dark** navy.dark.600: the primary action's fill; its label reads, 6.86:1, above the 4.5:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.

- **Token** `size.icon` → `thumb.travel` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16
:::

:::panel{id="part-5" title="Focus ring" note="Parts 5" media="side"}
![Focus ring: 5](/anatomy/content-first/switch/card-4.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA contrast, with large text helping further.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Keyboard users must always see where they are.

- **Token** `color.border.focus` → `focus-ring` #1E3A5F · dark #8FA6C4 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** navy.light.600: the focus ring, so the keyboard's place is never lost, 11.5:1 on surface.default, above the 3:1 floor.
  - **Dark** navy.dark.600: the focus ring, so the keyboard's place is never lost, 6.86:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `focus` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `border-width.focus-offset` → `focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `focus-ring-offset` #FFFDF8 · dark #14110D :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.02:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.1:1 from surface.default, so cards and panels stand forward.
:::

:::panel{id="part-6" title="Disabled switch" note="Parts 6" media="side"}
![Disabled switch: 6](/anatomy/content-first/switch/card-5.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed gets its own value for touch.

- **Token** `opacity.disabled` → `disabled` 0.4 :label[By scheme]{tone="info"}

  - **Pick** opacity.40
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `switch`.
- **From a terminal:** `npx open-ds anatomy content-first switch`
