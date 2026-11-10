---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 60.5
slug: "toggle/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Toggle in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the toggle apart to show how design decisions become the parts you see. You don't need it to use the toggle: [its own page](../toggle) has everything you need to build.

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
![Toggle, every part numbered](/anatomy/dense-data/toggle/stage.png)
*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Toggle** required :label[Affordance] :label[Reach]
  - **1** **Body** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
  - **2** **Label** required :label[By scheme]{tone="info"} :label[Readability]
- **3** **On** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
- **4** **Hover fill** state :label[By scheme]{tone="info"} :label[Feedback]
- **5** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
- **Disabled** state · not in this example :label[By scheme]{tone="info"} :label[Feedback]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Body" note="Parts 1" media="side"}
![Body: 1](/anatomy/dense-data/toggle/card-1.png)

:label[Affordance] :label[Reach]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Answer** Accessibility · What is the smallest target? → Compact, for a pointer

  Mouse and keyboard; compact targets are enough.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For corners of buttons and inputs, use radius.control. Don't use radius.round.

  Small corners keep dense rows straight.

- **Rule** For the smallest clickable thing, use size.control.compact. Don't use anything smaller.

  Compact still fits a mouse. Touch is not this product's input.

- **Token** `radius.control` → `radius` 0.125rem :label[By scheme]{tone="info"}

  - **Pick** radius.2: Small corners keep dense rows straight.

- **Token** `component-spacing-map.x2` → `default.padding-x` 0.5rem

  - **Pick** space.8
:::

:::panel{id="part-2" title="Label" note="Parts 2" media="side"}
![Label: 2](/anatomy/dense-data/toggle/card-2.png)

:label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Token** `color.text.primary` → `label` #161B23 · dark #F7F8FA :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.28:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.26:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `type.body.font-size` → `font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `type.label.font-weight` → `font-weight` 500 :label[By scheme]{tone="info"}

  - **Pick** font.weight.500
:::

:::panel{id="part-3" title="On" note="Parts 3" media="side"}
![On: 3](/anatomy/dense-data/toggle/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** Accessibility · How many signals carry each meaning? → Three: color, icon and word

  Many statuses share one table; color alone is not enough.

- **Answer** Accessibility · Which states get their own visible value? → Hover, focus, disabled

  Pressed reuses hover; experts do not need more.

- **Rule** For a selected row or item, use color.surface.selected. Don't use color.action.primary as a fill.

  A light tint shows selection without hiding the data.

- **Token** `color.surface.selected` → `background.on` #E8ECFF · dark #2A244F :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** violet.light.100: a tint of the brand, 1.17:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** violet.dark.100: a tint of the brand, 1.2:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.

- **Token** `color.border.selected` → `edge.on` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** violet.light.600: the edge beside a selected fill, so selection is never color alone, 6.97:1 on surface.default, above the 3:1 floor.
  - **Dark** violet.dark.600: the edge beside a selected fill, so selection is never color alone, 7.62:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `border-width.default` → `edge-width.on` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1
:::

:::panel{id="part-4" title="Hover fill" note="Parts 4" media="side"}
![Hover fill: 4](/anatomy/dense-data/toggle/card-4.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Hover, focus, disabled

  Pressed reuses hover; experts do not need more.

- **Answer** Motion · How fast does feedback feel? → Fast

  Fast feedback keeps up with experts.

- **Rule** For hover and press feedback, use motion.duration.feedback (fast). Don't use no transition.

  Fast feedback confirms the pointer without slowing experts.

- **Token** `color.surface.highlight` → `background.hover` #EEF1F5 · dark #262D38 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, surface.pressed, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-5" title="Focus ring" note="Parts 5" media="side"}
![Focus ring: 5](/anatomy/dense-data/toggle/card-5.png)

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

- **Token** `color.surface.canvas` → `focus-ring-offset-focus` #F7F8FA · dark #0D1117 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.06:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.1:1 from surface.default, so cards and panels stand forward.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `toggle`.
- **From a terminal:** `npx open-ds anatomy dense-data toggle`
