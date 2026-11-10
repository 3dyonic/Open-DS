---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 53.5
slug: "slider/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Slider in Accessible first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the slider apart to show how design decisions become the parts you see. You don't need it to use the slider: [its own page](../slider) has everything you need to build.

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
![Slider, every part numbered](/anatomy/accessible-first/slider/stage.png)
*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Track** required :label[By scheme]{tone="info"} :label[Containment]
- **2** **Range** required :label[By scheme]{tone="info"} :label[Meaning]
- **3** **Thumb** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
- **4** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
- **5** **Disabled slider** state :label[By scheme]{tone="info"} :label[Feedback]
- **Label** required · shown by Label :label[Readability]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Track and range" note="Parts 1, 2" media="side"}
![Track and range: 1, 2](/anatomy/accessible-first/slider/card-1.png)

:label[Containment] :label[Meaning]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Clear, slightly rounded controls.

- **Token** `color.surface.sunken` → `track.background` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.17:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.16:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `radius.pill` → `track.radius` calc(infinity * 1px)

  - **Pick** radius.pill

- **Token** `color.action.primary` → `range.background` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** blue.light.600: the primary action's fill; its label reads, 7.26:1, above the 7:1 floor.
  - **Dark** blue.dark.600: the primary action's fill; its label reads, 8.74:1, above the 7:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.
:::

:::panel{id="part-3" title="Thumb" note="Parts 3" media="side"}
![Thumb: 3](/anatomy/accessible-first/slider/card-2.png)

:label[Affordance] :label[Reach]

- **Answer** Accessibility · What is the smallest target? → Large

  Large targets for tremor and touch.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Clear, slightly rounded controls.

- **Answer** Elevation · How soft are shadows? → No shadows

  No shadows; borders do the work.

- **Rule** For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size.

  Large targets help people with motor needs.

- **Token** `size.icon` → `thumb.icon-size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20

- **Token** `radius.round` → `thumb.radius` 50%

  - **Pick** radius.round

- **Token** `color.action.primary` → `thumb.border` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** blue.light.600: the primary action's fill; its label reads, 7.26:1, above the 7:1 floor.
  - **Dark** blue.dark.600: the primary action's fill; its label reads, 8.74:1, above the 7:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.

- **Token** `color.surface.default` → `thumb.background` #FFFFFF · dark #141414 :label[By scheme]{tone="info"}

  The base fill for content.

  - **Pick** neutral.0: the base for content; body text reads 18.42:1 on it, above the 7:1 floor.
  - **Dark** neutral.50: the base for content; body text reads 17.2:1 on it, above the 7:1 floor.
  - **Shares the step with** surface.raised, action.secondary. Changing this pick moves only what reads color.surface.default.

- **Token** `elevation.card` → `thumb.shadow` 0px 0px 0px, #00000000 :label[By scheme]{tone="info"}

  - **Pick** shadow.none: Flat is easier to read at high zoom.
  - **Shares the step with** elevation.overlay. Changing this pick moves only what reads elevation.card.
:::

:::panel{id="part-4" title="Focus ring" note="Parts 4" media="side"}
![Focus ring: 4](/anatomy/accessible-first/slider/card-3.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AAA for text

  AAA contrast for text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus, with an offset. Don't use a thin or faint outline.

  Focus must be seen by everyone.

- **Token** `color.border.focus` → `thumb.focus-ring-focus` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** blue.light.600: the focus ring, so the keyboard's place is never lost, 7.26:1 on surface.default, above the 3:1 floor.
  - **Dark** blue.dark.600: the focus ring, so the keyboard's place is never lost, 8.74:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `thumb.focus` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3

- **Token** `border-width.focus-offset` → `thumb.focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `thumb.focus-ring-offset-focus` #F7F7F7 · dark #0A0A0A :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.07:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.07:1 from surface.default, so cards and panels stand forward.
:::

:::panel{id="part-5" title="Disabled slider" note="Parts 5" media="side"}
![Disabled slider: 5](/anatomy/accessible-first/slider/card-4.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Token** `opacity.disabled` → `disabled-opacity-disabled` 0.5 :label[By scheme]{tone="info"}

  - **Pick** opacity.50

- **Token** `opacity.disabled` → `thumb.disabled-opacity-disabled` 0.5 :label[By scheme]{tone="info"}

  - **Pick** opacity.50
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `slider`.
- **From a terminal:** `npx open-ds anatomy accessible-first slider`
