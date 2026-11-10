---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 38.5
slug: "menubar/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Menubar in Accessible first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the menubar apart to show how design decisions become the parts you see. You don't need it to use the menubar: [its own page](../menubar) has everything you need to build.

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

![Menubar, every part numbered](/anatomy/accessible-first/menubar/stage.png)

*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Bar** required
  - **1** **Bar** required :label[By scheme]{tone="info"} :label[Containment] :label[Grouping]
  - **2** **Menu trigger** required :label[By scheme]{tone="info"} :label[Readability] :label[Affordance]
  - **3** **Open trigger fill** state :label[By scheme]{tone="info"} :label[Feedback]
- **Menu** required
  - **4** **Surface** required :label[By scheme]{tone="info"} :label[Containment] :label[Layering]
  - **5** **Shadow** required :label[By scheme]{tone="info"} :label[Layering]
- **Item** required :label[Readability] :label[Reach] :label[Affordance]
  - **6** **Item label** required :label[By scheme]{tone="info"} :label[Readability] :label[Hierarchy]
  - **7** **Item icon** optional :label[By scheme]{tone="info"} :label[Meaning]
  - **8** **Highlight fill** state :label[By scheme]{tone="info"} :label[Feedback] :label[Focus]
  - **9** **Destructive item** optional :label[By scheme]{tone="info"} :label[Meaning] :label[Emphasis]
  - **Submenu chevron** optional · not in this example :label[By scheme]{tone="info"} :label[Affordance]
  - **Shortcut** optional · not in this example :label[By scheme]{tone="info"} :label[Hierarchy]
  - **Disabled item** state · not in this example :label[By scheme]{tone="info"} :label[Feedback]
- **10** **Separator** optional :label[By scheme]{tone="info"} :label[Grouping]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Bar" note="Parts 1, 2"}
![Bar: 1, 2](/anatomy/accessible-first/menubar/card-1.png)

:label[Containment] :label[Grouping] :label[Readability]

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Answer** Accessibility · What is the smallest target? → Large

  Large targets for tremor and touch.

- **Rule** For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size.

  Large targets help people with motor needs.

- **Token** `size.control.default` → `height` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `component-spacing-map.x1` → `padding` 0.25rem

  - **Pick** space.4

- **Token** `color.border.default` → `border` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `component-spacing-map.x2` → `trigger.padding-x` 0.5rem

  - **Pick** space.8

- **Token** `type.body.font-size` → `trigger.font-size` 1.1875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.19
:::

:::panel{id="part-3" title="Open trigger" note="Parts 3"}
![Open trigger: 3](/anatomy/accessible-first/menubar/card-2.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Token** `color.surface.highlight` → `trigger.background.open` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-4-5" title="Surface and shadow" note="Parts 4, 5"}
![Surface and shadow: 4, 5](/anatomy/accessible-first/menubar/card-3.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Nothing

  Flat is easier to read at high zoom.

- **Answer** Elevation · How soft are shadows? → No shadows

  No shadows; borders do the work.

- **Rule** For a menu or dialog, use A strong border and a dimmed page. Don't use a shadow only.

  The dimmed page makes the dialog obvious.

- **Token** `color.surface.raised` → `content.background` #FFFFFF · dark #141414 :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge alone, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge alone, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `elevation.overlay` → `content.shadow` 0px 0px 0px, #00000000 :label[By scheme]{tone="info"}

  - **Pick** shadow.none: No shadows; borders do the work.
  - **Shares the step with** elevation.card. Changing this pick moves only what reads elevation.overlay.

- **Token** `color.border.default` → `content.border` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `radius.container` → `content.radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Clear, slightly rounded controls.
:::

:::panel{id="part-6-7" title="Item" note="Parts 6, 7"}
![Item: 6, 7](/anatomy/accessible-first/menubar/card-4.png)

:label[Readability] :label[Reach] :label[Meaning]

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Answer** Iconography · How big are icons next to text? → Larger than the text

  Larger icons are easier to see.

- **Rule** For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size.

  Large targets help people with motor needs.

- **Token** `type.body.font-size` → `item.font-size` 1.1875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.19

- **Token** `component-spacing-map.x2` → `item.padding-x` 0.5rem

  - **Pick** space.8

- **Token** `component-spacing-map.x2` → `item.padding-y` 0.5rem

  - **Pick** space.8

- **Token** `color.text.muted` → `item.icon` #595959 · dark #B4B4B4 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** border.strong, category.5, disabled.text. Changing this pick moves only what reads color.text.muted.

- **Token** `size.icon` → `item.icon-size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20
:::

:::panel{id="part-8" title="Highlight fill" note="Parts 8"}
![Highlight fill: 8](/anatomy/accessible-first/menubar/card-5.png)

:label[Feedback] :label[Focus]

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Rule** For hover and press feedback, use motion.duration.feedback (moderate). Don't use fast flicker.

  Moderate speed is easy to follow.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus, with an offset. Don't use a thin or faint outline.

  Focus must be seen by everyone.

- **Token** `color.surface.highlight` → `item.background.highlight` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-9" title="Destructive item" note="Parts 9"}
![Destructive item: 9](/anatomy/accessible-first/menubar/card-6.png)

:label[Meaning] :label[Emphasis]

- **Answer** Accessibility · How many signals carry each meaning? → Three: color, icon and word

  Never color alone.

- **Rule** For delete or remove, use Button secondary, then a confirm page with Button danger. Don't use button primary.

  A confirm step prevents a costly error.

- **Token** `color.status.danger` → `item.label.destructive` #981519 · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.700: danger reads as text and icons, 8.55:1 on surface.default, above the 7:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.76:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

:::panel{id="part-10" title="Separator" note="Parts 10"}
![Separator: 10](/anatomy/accessible-first/menubar/card-7.png)

:label[Grouping]

- **Answer** Elevation · What separates groups on the page? → Lines

  Strong borders separate groups at any zoom.

- **Rule** For between page sections, use space.gap.section. Don't use a thin line.

  Space is easy to see; thin lines are not.

- **Token** `color.border.default` → `separator.background` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `border-width.default` → `separator.thickness` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `menubar`.
- **From a terminal:** `npx open-ds anatomy accessible-first menubar`
