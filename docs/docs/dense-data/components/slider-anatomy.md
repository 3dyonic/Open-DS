---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 53.5
slug: "slider/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Slider in Dense data."
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
![Slider, every part numbered](/anatomy/dense-data/slider/stage.png)
*Dense data, light, drawn in Figma from the scheme's tokens.*

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
![Track and range: 1, 2](/anatomy/dense-data/slider/card-1.png)

:label[Containment] :label[Meaning]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Token** `color.surface.sunken` → `track.background` #EEF1F5 · dark #262D38 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.13:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.25:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, surface.pressed, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `radius.pill` → `track.radius` calc(infinity * 1px)

  - **Pick** radius.pill

- **Token** `color.action.primary` → `range.background` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** violet.light.600: the primary action's fill; its label reads, 6.97:1, above the 4.5:1 floor.
  - **Dark** violet.dark.600: the primary action's fill; its label reads, 7.62:1, above the 4.5:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.
:::

:::panel{id="part-3" title="Thumb" note="Parts 3" media="side"}
![Thumb: 3](/anatomy/dense-data/slider/card-2.png)

:label[Affordance] :label[Reach]

- **Answer** Accessibility · What is the smallest target? → Compact, for a pointer

  Mouse and keyboard; compact targets are enough.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Answer** Elevation · How soft are shadows? → Subtle

  Subtle shadows keep the grid crisp.

- **Rule** For the smallest clickable thing, use size.control.compact. Don't use anything smaller.

  Compact still fits a mouse. Touch is not this product's input.

- **Token** `size.icon` → `thumb.icon-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `radius.round` → `thumb.radius` 50%

  - **Pick** radius.round

- **Token** `color.action.primary` → `thumb.border` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** violet.light.600: the primary action's fill; its label reads, 6.97:1, above the 4.5:1 floor.
  - **Dark** violet.dark.600: the primary action's fill; its label reads, 7.62:1, above the 4.5:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.

- **Token** `color.surface.default` → `thumb.background` #FFFFFF · dark #161B23 :label[By scheme]{tone="info"}

  The base fill for content.

  - **Pick** neutral.0: the base for content; body text reads 17.28:1 on it, above the 4.5:1 floor.
  - **Dark** neutral.50: the base for content; body text reads 16.26:1 on it, above the 4.5:1 floor.
  - **Shares the step with** surface.raised, action.secondary. Changing this pick moves only what reads color.surface.default.

- **Token** `elevation.card` → `thumb.shadow` 0px 0px 0px, #00000000 :label[By scheme]{tone="info"}

  - **Pick** shadow.none: Only menus and dialogs float; cards use lines.
:::

:::panel{id="part-4" title="Focus ring" note="Parts 4" media="side"}
![Focus ring: 4](/anatomy/dense-data/slider/card-3.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA contrast for every text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Keyboard users must always see where they are.

- **Token** `color.border.focus` → `thumb.focus-ring-focus` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** violet.light.600: the focus ring, so the keyboard's place is never lost, 6.97:1 on surface.default, above the 3:1 floor.
  - **Dark** violet.dark.600: the focus ring, so the keyboard's place is never lost, 7.62:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `thumb.focus` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `border-width.focus-offset` → `thumb.focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `thumb.focus-ring-offset-focus` #F7F8FA · dark #0D1117 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.06:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.1:1 from surface.default, so cards and panels stand forward.
:::

:::panel{id="part-5" title="Disabled slider" note="Parts 5" media="side"}
![Disabled slider: 5](/anatomy/dense-data/slider/card-4.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Hover, focus, disabled

  Pressed reuses hover; experts do not need more.

- **Token** `opacity.disabled` → `disabled-opacity-disabled` 0.4 :label[By scheme]{tone="info"}

  - **Pick** opacity.40

- **Token** `opacity.disabled` → `thumb.disabled-opacity-disabled` 0.4 :label[By scheme]{tone="info"}

  - **Pick** opacity.40
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `slider`.
- **From a terminal:** `npx open-ds anatomy dense-data slider`
