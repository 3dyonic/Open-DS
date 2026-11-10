---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 55.5
slug: "switch/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Switch in Accessible first."
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

![Switch, every part numbered](/anatomy/accessible-first/switch/stage.png)

*Accessible first, light, drawn in Figma from the scheme's tokens.*

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
![Track: 1](/anatomy/accessible-first/switch/card-1.png)

:label[Affordance] :label[Reach]

- **Answer** Accessibility · What is the smallest target? → Large

  Large targets for tremor and touch.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Clear, slightly rounded controls.

- **Rule** For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size.

  Large targets help people with motor needs.

- **Token** `size.icon` → `height` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20

- **Token** `size.icon` → `width` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20

- **Token** `radius.pill` → `radius` calc(infinity * 1px)

  - **Pick** radius.pill
:::

:::panel{id="part-2" title="Thumb" note="Parts 2"}
![Thumb: 2](/anatomy/accessible-first/switch/card-2.png)

:label[Affordance]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Clear, slightly rounded controls.

- **Answer** Theming · Which modes ship? → Light and dark

  Light and dark ship as standard; both hold AAA text.

- **Rule** For someone switches to dark, use The dark semantic mode, or high contrast. Don't use one mode only.

  People pick the mode they can read.

- **Token** `size.icon` → `thumb.size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20

- **Token** `radius.round` → `thumb.radius` 50%

  - **Pick** radius.round

- **Token** `color.surface.default` → `thumb.background` #FFFFFF · dark #141414 :label[By scheme]{tone="info"}

  The base fill for content.

  - **Pick** neutral.0: the base for content; body text reads 18.42:1 on it, above the 7:1 floor.
  - **Dark** neutral.50: the base for content; body text reads 17.2:1 on it, above the 7:1 floor.
  - **Shares the step with** surface.raised, action.secondary. Changing this pick moves only what reads color.surface.default.
:::

:::panel{id="part-3-4" title="On" note="Parts 3, 4"}
![On: 3, 4](/anatomy/accessible-first/switch/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** Accessibility · How many signals carry each meaning? → Three: color, icon and word

  Never color alone.

- **Answer** Motion · How fast does feedback feel? → Moderate

  Moderate speed is easy to follow.

- **Rule** For someone asked for less motion, use No motion. Don't use reduced motion.

  A shorter motion still moves. When people ask for less motion, nothing moves.

- **Token** `color.action.primary` → `track.background.checked` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** blue.light.600: the primary action's fill; its label reads, 7.26:1, above the 7:1 floor.
  - **Dark** blue.dark.600: the primary action's fill; its label reads, 8.74:1, above the 7:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.

- **Token** `size.icon` → `thumb.travel` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20
:::

:::panel{id="part-5" title="Focus ring" note="Parts 5"}
![Focus ring: 5](/anatomy/accessible-first/switch/card-4.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AAA for text

  AAA contrast for text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus, with an offset. Don't use a thin or faint outline.

  Focus must be seen by everyone.

- **Token** `color.border.focus` → `focus-ring` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** blue.light.600: the focus ring, so the keyboard's place is never lost, 7.26:1 on surface.default, above the 3:1 floor.
  - **Dark** blue.dark.600: the focus ring, so the keyboard's place is never lost, 8.74:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `focus` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3

- **Token** `border-width.focus-offset` → `focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `focus-ring-offset` #F7F7F7 · dark #0A0A0A :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.07:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.07:1 from surface.default, so cards and panels stand forward.
:::

:::panel{id="part-6" title="Disabled switch" note="Parts 6"}
![Disabled switch: 6](/anatomy/accessible-first/switch/card-5.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Token** `opacity.disabled` → `disabled` 0.5 :label[By scheme]{tone="info"}

  - **Pick** opacity.50
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `switch`.
- **From a terminal:** `npx open-ds anatomy accessible-first switch`
