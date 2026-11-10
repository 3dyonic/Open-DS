---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 20.5
slug: "context-menu/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Context menu in Multi-brand."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the context menu apart to show how design decisions become the parts you see. You don't need it to use the context menu: [its own page](../context-menu) has everything you need to build.

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
![Context menu, every part numbered](/anatomy/multi-brand/context-menu/stage.png)
*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Menu** required
  - **1** **Surface** required :label[By scheme]{tone="info"} :label[Containment] :label[Layering]
  - **2** **Shadow** required :label[By scheme]{tone="info"} :label[Layering]
- **Item** required :label[Readability] :label[Reach] :label[Affordance]
  - **3** **Item label** required :label[By scheme]{tone="info"} :label[Readability] :label[Hierarchy]
  - **4** **Item icon** optional :label[By scheme]{tone="info"} :label[Meaning]
  - **5** **Highlight fill** state :label[By scheme]{tone="info"} :label[Feedback] :label[Focus]
  - **6** **Submenu chevron** optional :label[By scheme]{tone="info"} :label[Affordance]
  - **7** **Destructive item** optional :label[By scheme]{tone="info"} :label[Meaning] :label[Emphasis]
  - **Disabled item** state · not in this example :label[By scheme]{tone="info"} :label[Feedback]
  - **Shortcut** optional · not in this example :label[By scheme]{tone="info"} :label[Hierarchy]
  - **Checkbox and radio items** optional · not in this example :label[By scheme]{tone="info"} :label[Meaning]
- **8** **Separator** optional :label[By scheme]{tone="info"} :label[Grouping]
- **Group label** optional · not in this example :label[By scheme]{tone="info"} :label[Hierarchy] :label[Grouping]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Surface and shadow" note="Parts 1, 2" media="side"}
![Surface and shadow: 1, 2](/anatomy/multi-brand/context-menu/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Cards too

  Cards lift slightly to group offers.

- **Answer** Elevation · How soft are shadows? → Soft

  Soft shadows fit every brand.

- **Rule** For a menu or dialog, use elevation.overlay and a dimmed page. Don't use no shadow.

  The shadow shows a menu or dialog floats above the page. Without it, it blends into the cards.

- **Token** `color.surface.raised` → `content.background` #FFFFFF · dark #0F172A :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `elevation.overlay` → `content.shadow` 0px 12px 32px, #0F172A29 · dark 0px 12px 32px, #00000080 :label[By scheme]{tone="info"}

  - **Pick** shadow.overlay: Soft shadows fit every brand.
  - **Dark** shadow.overlay-dark: Soft shadows fit every brand.

- **Token** `color.border.default` → `content.border` #E2E8F0 · dark #334155 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.18:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.72:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `radius.surface` → `content.radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Rounded by default; each brand sets its own corner.
:::

:::panel{id="part-3-4" title="Item" note="Parts 3, 4" media="side"}
![Item: 3, 4](/anatomy/multi-brand/context-menu/card-2.png)

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

:::panel{id="part-5" title="Highlight fill" note="Parts 5" media="side"}
![Highlight fill: 5](/anatomy/multi-brand/context-menu/card-3.png)

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

:::panel{id="part-6" title="Submenu chevron" note="Parts 6" media="side"}
![Submenu chevron: 6](/anatomy/multi-brand/context-menu/card-4.png)

:label[Affordance]

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the text.

- **Token** `color.text.muted` → `sub.trigger.icon` #4B5A6F · dark #96A3B5 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.97:1 on surface.default, above the 4.5:1 floor.

- **Token** `size.icon` → `sub.trigger.icon-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16
:::

:::panel{id="part-7" title="Destructive item" note="Parts 7" media="side"}
![Destructive item: 7](/anatomy/multi-brand/context-menu/card-5.png)

:label[Meaning] :label[Emphasis]

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Brand colors vary, so meaning needs a word.

- **Rule** For delete or remove, use Button secondary, then confirm with Button danger. Don't use button primary.

  Confirm before destroying data.

- **Token** `color.status.danger` → `item.label.destructive` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.52:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

:::panel{id="part-8" title="Separator" note="Parts 8" media="side"}
![Separator: 8](/anatomy/multi-brand/context-menu/card-6.png)

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

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `context-menu`.
- **From a terminal:** `npx open-ds anatomy multi-brand context-menu`
