---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 19.5
slug: "command/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Command in Accessible first."
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

![Command, every part numbered](/anatomy/accessible-first/command/stage.png)

*Accessible first, light, drawn in Figma from the scheme's tokens.*

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
![Panel: 1](/anatomy/accessible-first/command/card-1.png)

:label[Containment]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Clear, slightly rounded controls.

- **Answer** Elevation · What rises above the page? → Nothing

  Flat is easier to read at high zoom.

- **Rule** For a menu or dialog, use A strong border and a dimmed page. Don't use a shadow only.

  The dimmed page makes the dialog obvious.

- **Token** `color.surface.raised` → `background` #FFFFFF · dark #141414 :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge alone, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge alone, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `radius.surface` → `radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Clear, slightly rounded controls.
:::

:::panel{id="part-2-3-4" title="Search field" note="Parts 2, 3, 4"}
![Search field: 2, 3, 4](/anatomy/accessible-first/command/card-2.png)

:label[Affordance] :label[Reach] :label[Readability]

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Answer** Accessibility · What is the smallest target? → Large

  Large targets for tremor and touch.

- **Rule** For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size.

  Large targets help people with motor needs.

- **Token** `size.control.default` → `input.wrapper.height` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `component-spacing-map.x3` → `input.wrapper.padding-x` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** space.20

- **Token** `color.border.default` → `input.wrapper.border` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `color.text.muted` → `input.wrapper.icon` #595959 · dark #B4B4B4 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** border.strong, category.5, disabled.text. Changing this pick moves only what reads color.text.muted.

- **Token** `color.text.muted` → `input.label-placeholder` #595959 · dark #B4B4B4 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** border.strong, category.5, disabled.text. Changing this pick moves only what reads color.text.muted.
:::

:::panel{id="part-5" title="Group heading" note="Parts 5"}
![Group heading: 5](/anatomy/accessible-first/command/card-3.png)

:label[Hierarchy] :label[Grouping]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Generous space lowers mis-taps.

- **Token** `color.text.muted` → `group.label-2` #595959 · dark #B4B4B4 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** border.strong, category.5, disabled.text. Changing this pick moves only what reads color.text.muted.

- **Token** `type.caption.font-size` → `group.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `type.label.font-weight` → `group.font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700
:::

:::panel{id="part-6-7" title="Item" note="Parts 6, 7"}
![Item: 6, 7](/anatomy/accessible-first/command/card-4.png)

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
![Highlight fill: 8](/anatomy/accessible-first/command/card-5.png)

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

:::panel{id="part-9" title="Separator" note="Parts 9"}
![Separator: 9](/anatomy/accessible-first/command/card-6.png)

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

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `command`.
- **From a terminal:** `npx open-ds anatomy accessible-first command`
