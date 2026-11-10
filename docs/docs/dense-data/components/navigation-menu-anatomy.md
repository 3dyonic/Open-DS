---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 41.5
slug: "navigation-menu/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Navigation menu in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the navigation menu apart to show how design decisions become the parts you see. You don't need it to use the navigation menu: [its own page](../navigation-menu) has everything you need to build.

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

![Navigation menu, every part numbered](/anatomy/dense-data/navigation-menu/stage.png)

*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **List** required
  - **1** **Trigger** required :label[By scheme]{tone="info"} :label[Readability] :label[Affordance] :label[Reach]
  - **2** **Open trigger fill** state :label[By scheme]{tone="info"} :label[Feedback]
  - **3** **Chevron** required :label[By scheme]{tone="info"} :label[Affordance]
- **Panel** required
  - **4** **Surface** required :label[By scheme]{tone="info"} :label[Containment] :label[Layering]
  - **5** **Shadow** required :label[By scheme]{tone="info"} :label[Layering]
- **Link** required :label[Readability] :label[Reach]
  - **6** **Link** required :label[By scheme]{tone="info"} :label[Readability] :label[Reach]
  - **7** **Current link** state :label[By scheme]{tone="info"} :label[Meaning] :label[Emphasis]
  - **8** **Hover fill** state :label[By scheme]{tone="info"} :label[Feedback]
  - **9** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
  - **Link icon** optional · not in this example :label[By scheme]{tone="info"} :label[Meaning]
- **Indicator** optional · not in this example :label[By scheme]{tone="info"} :label[Affordance]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-3" title="Trigger" note="Parts 1, 3"}
![Trigger: 1, 3](/anatomy/dense-data/navigation-menu/card-1.png)

:label[Readability] :label[Affordance] :label[Reach]

- **Answer** Typography · How large is body text? → Small

  Small body text fits more rows on the screen.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For the smallest clickable thing, use size.control.compact. Don't use anything smaller.

  Compact still fits a mouse. Touch is not this product's input.

- **Token** `type.body.font-size` → `trigger.font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `type.label.font-weight` → `trigger.font-weight` 500 :label[By scheme]{tone="info"}

  - **Pick** font.weight.500

- **Token** `space.inset.container` → `trigger.padding-x` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16

- **Token** `component-spacing-map.x2` → `trigger.padding-y` 0.5rem

  - **Pick** space.8

- **Token** `space.gap.tight` → `trigger.icon-gap` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** space.4
:::

:::panel{id="part-2" title="Open trigger" note="Parts 2"}
![Open trigger: 2](/anatomy/dense-data/navigation-menu/card-2.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Hover, focus, disabled

  Pressed reuses hover; experts do not need more.

- **Token** `color.surface.highlight` → `trigger.background.open` #EEF1F5 · dark #262D38 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, surface.pressed, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-4-5" title="Panel surface and shadow" note="Parts 4, 5"}
![Panel surface and shadow: 4, 5](/anatomy/dense-data/navigation-menu/card-3.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Only what floats

  Only menus and dialogs float; cards use lines.

- **Answer** Elevation · How soft are shadows? → Subtle

  Subtle shadows keep the grid crisp.

- **Rule** For a menu or dialog, use elevation.overlay and a dimmed page for dialogs. Don't use a border only.

  Floating things need a shadow so they read as on top.

- **Token** `color.surface.raised` → `viewport.background` #FFFFFF · dark #161B23 :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `color.border.default` → `viewport.border` #DDE2EA · dark #3D4655 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.22:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.82:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `radius.surface` → `viewport.radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Small corners keep dense rows straight.

- **Token** `elevation.overlay` → `viewport.shadow` 0px 8px 24px, #0D111729 · dark 0px 8px 24px, #00000080 :label[By scheme]{tone="info"}

  - **Pick** shadow.overlay: Subtle shadows keep the grid crisp.
  - **Dark** shadow.overlay-dark: Subtle shadows keep the grid crisp.
:::

:::panel{id="part-6" title="Link" note="Parts 6"}
![Link: 6](/anatomy/dense-data/navigation-menu/card-4.png)

:label[Readability] :label[Reach]

- **Answer** Typography · How large is body text? → Small

  Small body text fits more rows on the screen.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For a link, use color.text.link. Don't use color.action.primary.

  Links and buttons look different, so people know which one navigates.

- **Rule** For the smallest clickable thing, use size.control.compact. Don't use anything smaller.

  Compact still fits a mouse. Touch is not this product's input.

- **Token** `type.body.font-size` → `link.font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `component-spacing-map.x2` → `link.padding` 0.5rem

  - **Pick** space.8

- **Token** `radius.option` → `link.radius` 0rem :label[By scheme]{tone="info"}

  - **Pick** radius.0: square, because the panel's 4px corner is used up by its 4px padding.
:::

:::panel{id="part-7" title="Current link" note="Parts 7"}
![Current link: 7](/anatomy/dense-data/navigation-menu/card-5.png)

:label[Meaning] :label[Emphasis]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Answer** Accessibility · How many signals carry each meaning? → Three: color, icon and word

  Many statuses share one table; color alone is not enough.

- **Rule** For a selected row or item, use color.surface.selected. Don't use color.action.primary as a fill.

  A light tint shows selection without hiding the data.

- **Token** `color.surface.selected` → `link.background.current` #E8ECFF · dark #2A244F :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** violet.light.100: a tint of the brand, 1.17:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** violet.dark.100: a tint of the brand, 1.2:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.

- **Token** `color.border.selected` → `link.edge.current` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** violet.light.600: the edge beside a selected fill, so selection is never color alone, 6.97:1 on surface.default, above the 3:1 floor.
  - **Dark** violet.dark.600: the edge beside a selected fill, so selection is never color alone, 7.62:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `border-width.focus` → `link.edge-width.current` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2
:::

:::panel{id="part-8" title="Hover fill" note="Parts 8"}
![Hover fill: 8](/anatomy/dense-data/navigation-menu/card-6.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Hover, focus, disabled

  Pressed reuses hover; experts do not need more.

- **Rule** For hover and press feedback, use motion.duration.feedback (fast). Don't use no transition.

  Fast feedback confirms the pointer without slowing experts.

- **Token** `color.surface.highlight` → `link.background.hover` #EEF1F5 · dark #262D38 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, surface.pressed, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-9" title="Focus ring" note="Parts 9"}
![Focus ring: 9](/anatomy/dense-data/navigation-menu/card-7.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA contrast for every text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Keyboard users must always see where they are.

- **Token** `color.border.focus` → `link.focus-ring-focus` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** violet.light.600: the focus ring, so the keyboard's place is never lost, 6.97:1 on surface.default, above the 3:1 floor.
  - **Dark** violet.dark.600: the focus ring, so the keyboard's place is never lost, 7.62:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `link.focus-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `border-width.focus-offset` → `link.focus-offset` 2px

  - **Pick** border-width.2
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `navigation-menu`.
- **From a terminal:** `npx open-ds anatomy dense-data navigation-menu`
