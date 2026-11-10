---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 19.5
slug: "command/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Command in Multi-brand."
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

![Command, every part numbered](/anatomy/multi-brand/command/stage.png)

*Multi-brand, light, drawn in Figma from the scheme's tokens.*

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

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Panel" note="Parts 1"}
![Panel: 1](/anatomy/multi-brand/command/card-1.png)

:label[Containment]

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Answer** Elevation · What rises above the page? → Cards too

  Cards lift slightly to group offers.

- **Rule** For a menu or dialog, use elevation.overlay and a dimmed page. Don't use no shadow.

  The shadow shows a menu or dialog floats above the page. Without it, it blends into the cards.

- **Token** `color.surface.raised` → `background` #FFFFFF · dark #0F172A :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `radius.surface` → `radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Rounded by default; each brand sets its own corner.
:::

:::panel{id="part-2-3-4" title="Search field" note="Parts 2, 3, 4"}
![Search field: 2, 3, 4](/anatomy/multi-brand/command/card-2.png)

:label[Affordance] :label[Reach] :label[Readability]

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Answer** Typography · How large is body text? → Regular

  Regular body size suits all brands.

- **Answer** Accessibility · What is the smallest target? → Touch size

  Customers sign up on phones.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Customers are often on phones.

- **Token** `size.control.default` → `input.wrapper.height` 2.75rem :label[By scheme]{tone="info"}

  - **Pick** size.44

- **Token** `component-spacing-map.x3` → `input.wrapper.padding-x` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** space.20

- **Token** `color.border.default` → `input.wrapper.border` #E2E8F0 · dark #334155 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.18:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.72:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `color.text.muted` → `input.wrapper.icon` #4B5A6F · dark #96A3B5 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.97:1 on surface.default, above the 4.5:1 floor.

- **Token** `color.text.muted` → `input.label-placeholder` #4B5A6F · dark #96A3B5 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.97:1 on surface.default, above the 4.5:1 floor.
:::

:::panel{id="part-5" title="Group heading" note="Parts 5"}
![Group heading: 5](/anatomy/multi-brand/command/card-3.png)

:label[Hierarchy] :label[Grouping]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  One set of roles across brands.

- **Rule** For items that belong together, use space.gap.default. Don't use brand-specific spacing.

  Spacing is shared across brands.

- **Token** `color.text.muted` → `group.label-2` #4B5A6F · dark #96A3B5 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.97:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.caption.font-size` → `group.font-size` 0.8125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.13

- **Token** `type.label.font-weight` → `group.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600
:::

:::panel{id="part-6-7" title="Item" note="Parts 6, 7"}
![Item: 6, 7](/anatomy/multi-brand/command/card-4.png)

:label[Readability] :label[Reach] :label[Meaning]

- **Answer** Typography · How large is body text? → Regular

  Regular body size suits all brands.

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the text.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Customers are often on phones.

- **Token** `type.body.font-size` → `item.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `component-spacing-map.x2` → `item.padding-x` 0.5rem

  - **Pick** space.8

- **Token** `component-spacing-map.x2` → `item.padding-y` 0.5rem

  - **Pick** space.8

- **Token** `color.text.muted` → `item.icon` #4B5A6F · dark #96A3B5 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.97:1 on surface.default, above the 4.5:1 floor.

- **Token** `size.icon` → `item.icon-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16
:::

:::panel{id="part-8" title="Highlight fill" note="Parts 8"}
![Highlight fill: 8](/anatomy/multi-brand/command/card-5.png)

:label[Feedback] :label[Focus]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Rule** For hover and press feedback, use motion.duration.feedback (moderate). Don't use brand-specific motion.

  Motion is shared, so one component library behaves the same in every brand.

- **Rule** For keyboard focus, use button/focus-ring (from the brand). Don't use removing the outline.

  Focus follows the brand but always shows.

- **Token** `color.surface.highlight` → `item.background.highlight` #F1F5F9 · dark #1E293B :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-9" title="Separator" note="Parts 9"}
![Separator: 9](/anatomy/multi-brand/command/card-6.png)

:label[Grouping]

- **Answer** Elevation · What separates groups on the page? → Cards

  Cards group plans and offers.

- **Rule** For between page sections, use space.gap.section and cards. Don't use lines.

  Cards hold each offer together, so customers compare offers as units in every brand. Lines would split an offer apart.

- **Token** `color.border.default` → `separator.background` #E2E8F0 · dark #334155 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.18:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.72:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `border-width.default` → `separator.thickness` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `command`.
- **From a terminal:** `npx open-ds anatomy multi-brand command`
