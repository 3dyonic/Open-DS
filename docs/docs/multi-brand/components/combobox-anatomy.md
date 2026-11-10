---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 18.5
slug: "combobox/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Combobox in Multi-brand."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the combobox apart to show how design decisions become the parts you see. You don't need it to use the combobox: [its own page](../combobox) has everything you need to build.

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
![Combobox, every part numbered](/anatomy/multi-brand/combobox/stage.png)
*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Field** required · shown by Input group :label[Affordance]
- **1** **Chevron** optional :label[By scheme]{tone="info"} :label[Affordance]
- **List** required
  - **2** **Surface** required :label[By scheme]{tone="info"} :label[Containment] :label[Layering]
  - **3** **Shadow** required :label[By scheme]{tone="info"} :label[Layering]
  - **4** **Group label** optional :label[By scheme]{tone="info"} :label[Hierarchy] :label[Grouping]
  - **Empty message** state · not in this example :label[By scheme]{tone="info"} :label[Feedback]
- **Item** required :label[Readability] :label[Reach]
  - **5** **Item label** required :label[By scheme]{tone="info"} :label[Readability]
  - **6** **Highlight fill** state :label[By scheme]{tone="info"} :label[Feedback] :label[Focus]
  - **7** **Selected check** state :label[By scheme]{tone="info"} :label[Meaning]
- **Chips** optional
  - **8** **Chips field** optional :label[By scheme]{tone="info"} :label[Containment] :label[Affordance]
  - **9** **Chip** optional :label[By scheme]{tone="info"} :label[Grouping] :label[Meaning]
  - **10** **Chip remove** optional :label[By scheme]{tone="info"} :label[Affordance]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Chevron" note="Parts 1" media="side"}
![Chevron: 1](/anatomy/multi-brand/combobox/card-1.png)

:label[Affordance]

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the text.

- **Token** `color.text.muted` → `trigger.icon.label` #4B5A6F · dark #96A3B5 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.97:1 on surface.default, above the 4.5:1 floor.

- **Token** `size.icon` → `trigger.icon.icon-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16
:::

:::panel{id="part-2-3" title="Surface and shadow" note="Parts 2, 3" media="side"}
![Surface and shadow: 2, 3](/anatomy/multi-brand/combobox/card-2.png)

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

:::panel{id="part-4" title="Group label" note="Parts 4" media="side"}
![Group label: 4](/anatomy/multi-brand/combobox/card-3.png)

:label[Hierarchy] :label[Grouping]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  One set of roles across brands.

- **Rule** For items that belong together, use space.gap.default. Don't use brand-specific spacing.

  Spacing is shared across brands.

- **Token** `color.text.muted` → `label.label` #4B5A6F · dark #96A3B5 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.97:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.caption.font-size` → `label.font-size` 0.8125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.13

- **Token** `component-spacing-map.x2` → `label.padding-x` 0.5rem

  - **Pick** space.8
:::

:::panel{id="part-5-7" title="Item" note="Parts 5, 7" media="side"}
![Item: 5, 7](/anatomy/multi-brand/combobox/card-4.png)

:label[Readability] :label[Reach] :label[Meaning]

- **Answer** Typography · How large is body text? → Regular

  Regular body size suits all brands.

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Customers are often on phones.

- **Token** `type.body.font-size` → `item.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `component-spacing-map.x2` → `item.padding-y` 0.5rem

  - **Pick** space.8

- **Token** `component-spacing-map.x2` → `item.padding-left` 0.5rem

  - **Pick** space.8

- **Token** `size.icon` → `icon-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16
:::

:::panel{id="part-6" title="Highlight fill" note="Parts 6" media="side"}
![Highlight fill: 6](/anatomy/multi-brand/combobox/card-5.png)

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

:::panel{id="part-8-9-10" title="Chips" note="Parts 8, 9, 10" media="side"}
![Chips: 8, 9, 10](/anatomy/multi-brand/combobox/card-6.png)

:label[Containment] :label[Grouping] :label[Affordance]

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Rule** For shape of a status badge, use radius.badge (set by the brand). Don't use a hard-coded shape.

  The brand sets the badge shape.

- **Token** `color.border.strong` → `chips.border` #64748B · dark #96A3B5 :label[By scheme]{tone="info"}

  The edge of a control people must find.

  - **Pick** neutral.500: the edge of a control people must find, 4.76:1 on surface.default, above the 3:1 floor.
  - **Dark** neutral.400: the edge of a control people must find, 6.97:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** disabled.text. Changing this pick moves only what reads color.border.strong.

- **Token** `radius.control` → `chips.radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Rounded by default; each brand sets its own corner.

- **Token** `color.surface.sunken` → `chip.background` #F1F5F9 · dark #1E293B :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.1:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.22:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `radius.badge` → `chip.radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Rounded by default; each brand sets its own corner.

- **Token** `color.text.muted` → `chip.remove.label` #4B5A6F · dark #96A3B5 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.97:1 on surface.default, above the 4.5:1 floor.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `combobox`.
- **From a terminal:** `npx open-ds anatomy multi-brand combobox`
