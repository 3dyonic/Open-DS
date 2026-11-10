---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 48.5
slug: "select/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Select in Accessible first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the select apart to show how design decisions become the parts you see. You don't need it to use the select: [its own page](../select) has everything you need to build.

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
![Select, every part numbered](/anatomy/accessible-first/select/stage.png)
*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Label** required · shown by Label :label[Readability]
- **Trigger** required :label[Affordance] :label[Reach]
  - **1** **Field** required :label[By scheme]{tone="info"} :label[Containment] :label[Affordance] :label[Reach]
  - **2** **Value** required :label[By scheme]{tone="info"} :label[Readability]
  - **3** **Chevron** required :label[By scheme]{tone="info"} :label[Affordance]
  - **4** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
  - **5** **Invalid border** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
  - **6** **Disabled trigger** state :label[By scheme]{tone="info"} :label[Feedback]
- **List** required
  - **7** **Surface** required :label[By scheme]{tone="info"} :label[Containment] :label[Layering]
  - **8** **Shadow** required :label[By scheme]{tone="info"} :label[Layering]
- **Option** required :label[Readability] :label[Reach]
  - **9** **Option label** required :label[By scheme]{tone="info"} :label[Readability]
  - **10** **Highlight fill** state :label[By scheme]{tone="info"} :label[Feedback] :label[Focus]
  - **11** **Selected check** state :label[By scheme]{tone="info"} :label[Meaning]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2-3" title="Trigger" note="Parts 1, 2, 3" media="side"}
![Trigger: 1, 2, 3](/anatomy/accessible-first/select/card-1.png)

:label[Containment] :label[Affordance] :label[Readability]

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Clear, slightly rounded controls.

- **Rule** For field label or column header, use type.label, above the field, always visible. Don't use a placeholder as the label.

  Labels must stay visible while typing.

- **Rule** For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size.

  Large targets help people with motor needs.

- **Rule** For corners of buttons and inputs, use radius.control. Don't use a pill.

  Clear rectangles read as fields and buttons.

- **Token** `size.control.default` → `trigger.height` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `space.inset.control-x` → `trigger.padding-x` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `radius.control` → `trigger.radius` 0.375rem :label[By scheme]{tone="info"}

  - **Pick** radius.6: Clear, slightly rounded controls.

- **Token** `color.text.muted` → `trigger.icon` #595959 · dark #B4B4B4 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** border.strong, category.5, disabled.text. Changing this pick moves only what reads color.text.muted.
:::

:::panel{id="part-4" title="Focus ring" note="Parts 4" media="side"}
![Focus ring: 4](/anatomy/accessible-first/select/card-2.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AAA for text

  AAA contrast for text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus, with an offset. Don't use a thin or faint outline.

  Focus must be seen by everyone.

- **Token** `color.border.focus` → `trigger.border.focus` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** blue.light.600: the focus ring, so the keyboard's place is never lost, 7.26:1 on surface.default, above the 3:1 floor.
  - **Dark** blue.dark.600: the focus ring, so the keyboard's place is never lost, 8.74:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `trigger.focus-width` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3

- **Token** `border-width.focus-offset` → `trigger.focus-offset` 2px

  - **Pick** border-width.2
:::

:::panel{id="part-5" title="Invalid border" note="Parts 5" media="side"}
![Invalid border: 5](/anatomy/accessible-first/select/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Rule** For an error message, use color.status.danger, an icon and a sentence next to the field. Don't use color alone.

  People must know what went wrong and where.

- **Token** `color.status.danger` → `trigger.border.invalid` #981519 · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.700: danger reads as text and icons, 8.55:1 on surface.default, above the 7:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.76:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

:::panel{id="part-6" title="Disabled trigger" note="Parts 6" media="side"}
![Disabled trigger: 6](/anatomy/accessible-first/select/card-4.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Token** `color.disabled.surface` → `trigger.disabled.background` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  The fill of a control that cannot be used right now.

  - **Pick** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Dark** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Shares the step with** surface.sunken, surface.highlight, action.secondary.hover, category.5.subtle. Changing this pick moves only what reads color.disabled.surface.

- **Token** `color.disabled.border` → `trigger.disabled.border` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  The edge of a control that cannot be used right now.

  - **Pick** neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Dark** neutral.200: the border of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Shares the step with** surface.pressed, border.default. Changing this pick moves only what reads color.disabled.border.

- **Token** `color.disabled.text` → `trigger.disabled.text` #595959 · dark #949494 :label[By scheme]{tone="info"}

  Text and icons of a control that cannot be used right now.

  - **Pick** neutral.500: 7.0:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Dark** neutral.500: 6.07:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Shares the step with** text.muted, border.strong, category.5. Changing this pick moves only what reads color.disabled.text.
:::

:::panel{id="part-7-8" title="List surface and shadow" note="Parts 7, 8" media="side"}
![List surface and shadow: 7, 8](/anatomy/accessible-first/select/card-5.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Nothing

  Flat is easier to read at high zoom.

- **Answer** Elevation · How soft are shadows? → No shadows

  No shadows; borders do the work.

- **Rule** For a menu or dialog, use A strong border and a dimmed page. Don't use a shadow only.

  The dimmed page makes the dialog obvious.

- **Token** `color.surface.raised` → `overlay.background` #FFFFFF · dark #141414 :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge alone, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge alone, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `elevation.overlay` → `overlay.shadow` 0px 0px 0px, #00000000 :label[By scheme]{tone="info"}

  - **Pick** shadow.none: No shadows; borders do the work.
  - **Shares the step with** elevation.card. Changing this pick moves only what reads elevation.overlay.

- **Token** `radius.surface` → `overlay.radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Clear, slightly rounded controls.

- **Token** `color.border.default` → `content.border` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.
:::

:::panel{id="part-9-11" title="Option" note="Parts 9, 11" media="side"}
![Option: 9, 11](/anatomy/accessible-first/select/card-6.png)

:label[Readability] :label[Reach] :label[Meaning]

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size.

  Large targets help people with motor needs.

- **Token** `size.control.default` → `overlay.item-height` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `type.body.font-size` → `item.font-size` 1.1875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.19

- **Token** `component-spacing-map.x2` → `item.padding-left` 0.5rem

  - **Pick** space.8

- **Token** `size.icon` → `size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20
:::

:::panel{id="part-10" title="Highlight fill" note="Parts 10" media="side"}
![Highlight fill: 10](/anatomy/accessible-first/select/card-7.png)

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

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `select`.
- **From a terminal:** `npx open-ds anatomy accessible-first select`
