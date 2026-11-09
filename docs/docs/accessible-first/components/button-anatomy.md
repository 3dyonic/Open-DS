---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 10.5
slug: "button/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Button in Accessible first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the button apart to show how design decisions become the parts you see. You don't need it to use the button: [its own page](../button) has everything you need to build.

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

![Button, every part numbered](/anatomy/accessible-first/button/stage.png)

*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Button** required :label[Affordance] :label[Reach]
  - **1** **Container** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach] :label[Emphasis]
  - **2** **Label** required :label[By scheme]{tone="info"} :label[Readability]
  - **Icon** optional · not on the first button: the secondary and the icon button carry one :label[By scheme]{tone="info"} :label[Meaning]
- **3** **Hover fill** state :label[By scheme]{tone="info"} :label[Feedback]
- **4** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
- **5** **Disabled** state :label[By scheme]{tone="info"} :label[Feedback]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Container" note="Parts 1"}
![Container: 1](/anatomy/accessible-first/button/card-1.png)

:label[Affordance] :label[Reach]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Clear, slightly rounded controls.

- **Answer** Accessibility · What is the smallest target? → Large

  Large targets for tremor and touch.

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For corners of buttons and inputs, use radius.control. Don't use a pill.

  Clear rectangles read as fields and buttons.

- **Rule** For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size.

  Large targets help people with motor needs.

- **Token** `size.control.default` → `height` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `space.inset.control-x` → `padding-x` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `radius.control` → `radius` 0.375rem :label[By scheme]{tone="info"}

  - **Pick** radius.6: Clear, slightly rounded controls.
:::

:::panel{id="part-1" title="Emphasis" note="Parts 1"}
![Emphasis: 1](/anatomy/accessible-first/button/card-2.png)

:label[Emphasis]

- **Answer** Color · How many emphasis levels do actions need? → Two

  Primary and secondary only; fewer choices, fewer errors.

- **Rule** For the action that completes the task, use Button primary, one per page. Don't use two primaries.

  One clear next step. Two primaries make people stop and compare, which adds effort.

- **Rule** For an alternative or cancel, use Button secondary. Don't use a text link.

  Every action looks like a button people can find.

- **Rule** For delete or remove, use Button secondary, then a confirm page with Button danger. Don't use button primary.

  A confirm step prevents a costly error.

- **Token** `color.border.strong` → `secondary.border` #595959 · dark #949494 :label[By scheme]{tone="info"}

  The edge of a control people must find.

  - **Pick** neutral.500: the edge of a control people must find, 7.0:1 on surface.default, above the 3:1 floor.
  - **Dark** neutral.500: the edge of a control people must find, 6.07:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** text.muted, category.5, disabled.text. Changing this pick moves only what reads color.border.strong.
:::

:::panel{id="part-2" title="Label" note="Parts 2"}
![Label: 2](/anatomy/accessible-first/button/card-3.png)

:label[Readability]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Answer** Voice and tone · How does it sound? → Plain and direct

  Every sentence is easy to read on the first try.

- **Rule** For a button label, use A common verb that says what happens next. Don't use "Submit" or "Proceed".

  Common words are understood by the most people.

- **Token** `color.text.on-action` → `primary.label` #FFFFFF · dark #141414 :label[By scheme]{tone="info"}

  Text and icons on the main action's fill.

  - **Pick** text.on-dark: the text its fill's tone picks, 7.26:1 on action.primary, above the 7:1 floor.
  - **Dark** text.on-light: the text its fill's tone picks, 8.74:1 on action.primary, above the 7:1 floor.
  - **Shares the step with** text.inverse, text.on-danger. Changing this pick moves only what reads color.text.on-action.

- **Token** `type.label.font-size` → `font-size` 1.125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.18

- **Token** `type.label.font-weight` → `font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700
:::

:::panel{id="part-3" title="Hover fill" note="Parts 3"}
![Hover fill: 3](/anatomy/accessible-first/button/card-4.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Answer** Motion · How fast does feedback feel? → Moderate

  Moderate speed is easy to follow.

- **Rule** For hover and press feedback, use motion.duration.feedback (moderate). Don't use fast flicker.

  Moderate speed is easy to follow.

- **Token** `color.action.primary.hover` → `primary.background.hover` #013895 · dark #A7C8FC :label[By scheme]{tone="info"}

  The main action under the pointer.

  - **Pick** blue.light.700: one step from the primary action (blue.light.600), so the pointer shows; its label still reads 10.5:1, above the 7:1 floor.
  - **Dark** blue.dark.700: one step from the primary action (blue.dark.600), so the pointer shows; its label still reads 10.8:1, above the 7:1 floor.
  - **Shares the step with** text.link. Changing this pick moves only what reads color.action.primary.hover.

- **Token** `color.action.secondary.hover` → `secondary.background.hover` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  Other actions under the pointer.

  - **Pick** neutral.100: one step from the secondary action (neutral.0), so the pointer shows; its label still reads 15.74:1, above the 7:1 floor.
  - **Dark** neutral.100: one step from the secondary action (neutral.50), so the pointer shows; its label still reads 14.85:1, above the 7:1 floor.
  - **Shares the step with** surface.sunken, surface.highlight, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.action.secondary.hover.

- **Token** `color.surface.highlight` → `ghost.background.hover` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-4" title="Focus ring" note="Parts 4"}
![Focus ring: 4](/anatomy/accessible-first/button/card-5.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AAA for text

  AAA contrast for text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus, with an offset. Don't use a thin or faint outline.

  Focus must be seen by everyone.

- **Token** `color.border.focus` → `focus-ring` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** blue.light.600: the focus ring, so the keyboard's place is never lost, 7.26:1 on surface.default, above the 3:1 floor.
  - **Dark** blue.dark.600: the focus ring, so the keyboard's place is never lost, 8.74:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `focus` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3

- **Token** `border-width.focus-offset` → `focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `focus-ring-offset` #F7F7F7 · dark #0A0A0A :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.07:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.07:1 from surface.default, so cards and panels stand forward.
:::

:::panel{id="part-5" title="Disabled" note="Parts 5"}
![Disabled: 5](/anatomy/accessible-first/button/card-6.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Token** `color.disabled.surface` → `disabled.background` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  The fill of a control that cannot be used right now.

  - **Pick** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Dark** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Shares the step with** surface.sunken, surface.highlight, action.secondary.hover, category.5.subtle. Changing this pick moves only what reads color.disabled.surface.

- **Token** `color.disabled.text` → `disabled.label` #595959 · dark #949494 :label[By scheme]{tone="info"}

  Text and icons of a control that cannot be used right now.

  - **Pick** neutral.500: 7.0:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Dark** neutral.500: 6.07:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Shares the step with** text.muted, border.strong, category.5. Changing this pick moves only what reads color.disabled.text.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `button`.
- **From a terminal:** `npx open-ds anatomy accessible-first button`
