---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 19.5
slug: "command/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Command in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the command menu apart to show how design decisions become the parts you see. You don't need it to use the command menu: [its own page](../command) has everything you need to build.

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
![Command, every part numbered](/anatomy/dense-data/command/stage.png)
*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Panel** required :label[By scheme]{tone="info"} :label[Containment]
- **Dialog** optional · shown by Dialog :label[Layering]
- **Search** required :label[Affordance] :label[Reach]
  - **2** **Search field** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
  - **3** **Search icon** required :label[By scheme]{tone="info"} :label[Meaning]
  - **4** **Placeholder** required :label[By scheme]{tone="info"} :label[Readability]
- **5** **Group heading** optional :label[By scheme]{tone="info"} :label[Hierarchy] :label[Grouping]
- **Item** required :label[Readability] :label[Reach]
  - **6** **Item label** required :label[By scheme]{tone="info"} :label[Readability]
  - **7** **Item icon** optional :label[By scheme]{tone="info"} :label[Meaning]
  - **8** **Highlight fill** state :label[By scheme]{tone="info"} :label[Feedback] :label[Focus]
  - **Shortcut** optional · not in this example :label[By scheme]{tone="info"} :label[Hierarchy]
- **9** **Separator** optional :label[By scheme]{tone="info"} :label[Grouping]
- **Empty message** state · not in this example :label[By scheme]{tone="info"} :label[Feedback]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Panel" note="Parts 1" media="side"}
![Panel: 1](/anatomy/dense-data/command/card-1.png)

:label[Containment]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Answer** Elevation · What rises above the page? → Only what floats

  Only menus and dialogs float; cards use lines.

- **Rule** For a menu or dialog, use elevation.overlay and a dimmed page for dialogs. Don't use a border only.

  Floating things need a shadow so they read as on top.

- **Token** `color.surface.raised` → `background` #FFFFFF · dark #161B23 :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `radius.surface` → `radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Small corners keep dense rows straight.
:::

:::panel{id="part-2-3-4" title="Search field" note="Parts 2, 3, 4" media="side"}
![Search field: 2, 3, 4](/anatomy/dense-data/command/card-2.png)

:label[Affordance] :label[Reach] :label[Readability]

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Answer** Typography · How large is body text? → Small

  Small body text fits more rows on the screen.

- **Answer** Accessibility · What is the smallest target? → Compact, for a pointer

  Mouse and keyboard; compact targets are enough.

- **Rule** For the smallest clickable thing, use size.control.compact. Don't use anything smaller.

  Compact still fits a mouse. Touch is not this product's input.

- **Token** `size.control.default` → `input.wrapper.height` 2rem :label[By scheme]{tone="info"}

  - **Pick** size.32

- **Token** `component-spacing-map.x3` → `input.wrapper.padding-x` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12

- **Token** `color.border.default` → `input.wrapper.border` #DDE2EA · dark #3D4655 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.22:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.82:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `color.text.muted` → `input.wrapper.icon` #535D6D · dark #969FAD :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.66:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.47:1 on surface.default, above the 4.5:1 floor.

- **Token** `color.text.muted` → `input.label-placeholder` #535D6D · dark #969FAD :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.66:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.47:1 on surface.default, above the 4.5:1 floor.
:::

:::panel{id="part-5" title="Group heading" note="Parts 5" media="side"}
![Group heading: 5](/anatomy/dense-data/command/card-3.png)

:label[Hierarchy] :label[Grouping]

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Rule** For items that belong together, use space.gap.tight. Don't use space.gap.group.

  Things that belong together sit close.

- **Token** `color.text.muted` → `group.label-2` #535D6D · dark #969FAD :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.66:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.47:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.caption.font-size` → `group.font-size` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** font.size.12

- **Token** `type.label.font-weight` → `group.font-weight` 500 :label[By scheme]{tone="info"}

  - **Pick** font.weight.500
:::

:::panel{id="part-6-7" title="Item" note="Parts 6, 7" media="side"}
![Item: 6, 7](/anatomy/dense-data/command/card-4.png)

:label[Readability] :label[Reach] :label[Meaning]

- **Answer** Typography · How large is body text? → Small

  Small body text fits more rows on the screen.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the label so they do not outweigh it.

- **Rule** For the smallest clickable thing, use size.control.compact. Don't use anything smaller.

  Compact still fits a mouse. Touch is not this product's input.

- **Token** `type.body.font-size` → `item.font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `component-spacing-map.x2` → `item.padding-x` 0.5rem

  - **Pick** space.8

- **Token** `component-spacing-map.x2` → `item.padding-y` 0.5rem

  - **Pick** space.8

- **Token** `color.text.muted` → `item.icon` #535D6D · dark #969FAD :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.66:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.47:1 on surface.default, above the 4.5:1 floor.

- **Token** `size.icon` → `item.icon-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16
:::

:::panel{id="part-8" title="Highlight fill" note="Parts 8" media="side"}
![Highlight fill: 8](/anatomy/dense-data/command/card-5.png)

:label[Feedback] :label[Focus]

- **Answer** Accessibility · Which states get their own visible value? → Hover, focus, disabled

  Pressed reuses hover; experts do not need more.

- **Rule** For hover and press feedback, use motion.duration.feedback (fast). Don't use no transition.

  Fast feedback confirms the pointer without slowing experts.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Keyboard users must always see where they are.

- **Token** `color.surface.highlight` → `item.background.highlight` #EEF1F5 · dark #262D38 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, surface.pressed, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-9" title="Separator" note="Parts 9" media="side"}
![Separator: 9](/anatomy/dense-data/command/card-6.png)

:label[Grouping]

- **Answer** Elevation · What separates groups on the page? → Lines

  Thin lines guide the eye along rows.

- **Rule** For between page sections, use space.gap.section and a hairline. Don't use a card around every section.

  Lines separate without taking room from the data.

- **Token** `color.border.default` → `separator.background` #DDE2EA · dark #3D4655 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.22:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.82:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `border-width.default` → `separator.thickness` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `command`.
- **From a terminal:** `npx open-ds anatomy dense-data command`
