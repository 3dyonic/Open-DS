---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 5.5
slug: "attachment/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Attachment in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the attachment apart to show how design decisions become the parts you see. You don't need it to use the attachment: [its own page](../attachment) has everything you need to build.

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
![Attachment, every part numbered](/anatomy/dense-data/attachment/stage.png)
*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Frame** required :label[By scheme]{tone="info"} :label[Containment] :label[Affordance] :label[Reach]
- **2** **File icon** required :label[By scheme]{tone="info"} :label[Meaning]
- **3** **File name** required :label[By scheme]{tone="info"} :label[Hierarchy] :label[Readability]
- **4** **Type and size** required :label[By scheme]{tone="info"} :label[Readability]
- **5** **Hover fill** state :label[By scheme]{tone="info"} :label[Feedback]
- **6** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
- **The message it is shared in** optional · shown by Message :label[Grouping]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Frame" note="Parts 1" media="side"}
![Frame: 1](/anatomy/dense-data/attachment/card-1.png)

:label[Containment] :label[Affordance] :label[Reach]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For corners of buttons and inputs, use radius.control. Don't use radius.round.

  Small corners keep dense rows straight.

- **Rule** For the smallest clickable thing, use size.control.compact. Don't use anything smaller.

  Compact still fits a mouse. Touch is not this product's input.

- **Token** `color.border.default` → `border` #DDE2EA · dark #3D4655 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.22:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.82:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `radius.control` → `radius` 0.125rem :label[By scheme]{tone="info"}

  - **Pick** radius.2: Small corners keep dense rows straight.

- **Token** `component-spacing-map.x2` → `padding-y` 0.5rem

  - **Pick** space.8
:::

:::panel{id="part-2" title="File icon" note="Parts 2" media="side"}
![File icon: 2](/anatomy/dense-data/attachment/card-2.png)

:label[Meaning]

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the label so they do not outweigh it.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Token** `size.control.default` → `media.size` 2rem :label[By scheme]{tone="info"}

  - **Pick** size.32

- **Token** `radius.control` → `media.radius` 0.125rem :label[By scheme]{tone="info"}

  - **Pick** radius.2: Small corners keep dense rows straight.

- **Token** `color.surface.sunken` → `media.background` #EEF1F5 · dark #262D38 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.13:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.25:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, surface.pressed, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.text.muted` → `media.icon.label` #535D6D · dark #969FAD :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.66:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.47:1 on surface.default, above the 4.5:1 floor.
:::

:::panel{id="part-3-4" title="Name, type and size" note="Parts 3, 4" media="side"}
![Name, type and size: 3, 4](/anatomy/dense-data/attachment/card-3.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Rule** For a link, use color.text.link. Don't use color.action.primary.

  Links and buttons look different, so people know which one navigates.

- **Token** `type.label.font-weight` → `name.font-weight` 500 :label[By scheme]{tone="info"}

  - **Pick** font.weight.500

- **Token** `color.text.muted` → `meta.label` #535D6D · dark #969FAD :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.66:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.47:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.caption.font-size` → `meta.font-size` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** font.size.12
:::

:::panel{id="part-5" title="Hover fill" note="Parts 5" media="side"}
![Hover fill: 5](/anatomy/dense-data/attachment/card-4.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Hover, focus, disabled

  Pressed reuses hover; experts do not need more.

- **Rule** For hover and press feedback, use motion.duration.feedback (fast). Don't use no transition.

  Fast feedback confirms the pointer without slowing experts.

- **Token** `color.surface.highlight` → `background.hover` #EEF1F5 · dark #262D38 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, surface.pressed, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-6" title="Focus ring" note="Parts 6" media="side"}
![Focus ring: 6](/anatomy/dense-data/attachment/card-5.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA contrast for every text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Keyboard users must always see where they are.

- **Token** `border-width.focus` → `focus` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `color.border.focus` → `focus-ring-focus` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** violet.light.600: the focus ring, so the keyboard's place is never lost, 6.97:1 on surface.default, above the 3:1 floor.
  - **Dark** violet.dark.600: the focus ring, so the keyboard's place is never lost, 7.62:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus-offset` → `focus-offset` 2px

  - **Pick** border-width.2
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `attachment`.
- **From a terminal:** `npx open-ds anatomy dense-data attachment`
