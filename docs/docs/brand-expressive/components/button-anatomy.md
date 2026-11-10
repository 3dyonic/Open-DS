---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 10.5
slug: "button/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Button in Brand expressive."
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

![Button, every part numbered](/anatomy/brand-expressive/button/stage.png)

*Brand expressive, light, drawn in Figma from the scheme's tokens.*

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
![Container: 1](/anatomy/brand-expressive/button/card-1.png)

:label[Affordance] :label[Reach]

- **Answer** Shape · What should control corners say? → Pill

  Pill controls feel playful.

- **Answer** Accessibility · What is the smallest target? → Touch size

  Visitors come from social posts on phones.

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Rule** For corners of buttons and inputs, use radius.control (pill). Don't use sharp corners.

  Pills match the brand's round, playful shapes. Sharp corners would feel corporate.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Most visitors arrive on phones, and a compact control is too small for a thumb.

- **Token** `size.control.default` → `height` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `space.inset.control-x` → `padding-x` 1.75rem :label[By scheme]{tone="info"}

  - **Pick** space.28

- **Token** `radius.control` → `radius` calc(infinity * 1px) :label[By scheme]{tone="info"}

  - **Pick** radius.pill: Pill controls feel playful.
:::

:::panel{id="part-1" title="Emphasis" note="Parts 1"}
![Emphasis: 1](/anatomy/brand-expressive/button/card-2.png)

:label[Emphasis]

- **Answer** Color · How many emphasis levels do actions need? → Three

  Primary, secondary, ghost.

- **Rule** For the action that completes the task, use Button primary, large, one per section. Don't use two primaries.

  One loud call to action per section.

- **Rule** For an alternative or cancel, use Button ghost. Don't use a second primary.

  The alternative must not compete.

- **Rule** For delete or remove, use Button secondary, then confirm with Button danger. Don't use button primary.

  Confirm before destroying data.

- **Token** `color.border.strong` → `secondary.border` #8A6F63 · dark #B5988A :label[By scheme]{tone="info"}

  The edge of a control people must find.

  - **Pick** neutral.500: the edge of a control people must find, 4.63:1 on surface.default, above the 3:1 floor.
  - **Dark** neutral.400: the edge of a control people must find, 6.71:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** category.5, disabled.text. Changing this pick moves only what reads color.border.strong.
:::

:::panel{id="part-2" title="Label" note="Parts 2"}
![Label: 2](/anatomy/brand-expressive/button/card-3.png)

:label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and expressive display

  A big expressive display role carries the brand.

- **Answer** Voice and tone · How does it sound? → Playful

  Big words, few of them.

- **Rule** For a button label, use A short verb that moves: Join, Try, Go. Don't use "Learn more".

  Big moments need verbs with energy.

- **Token** `color.text.on-action` → `primary.label` #FFFFFF · dark #1F1411 :label[By scheme]{tone="info"}

  Text and icons on the main action's fill.

  - **Pick** text.on-dark: the text its fill's tone picks, 4.84:1 on action.primary, above the 4.5:1 floor.
  - **Dark** text.on-light: the text its fill's tone picks, 8.88:1 on action.primary, above the 4.5:1 floor.
  - **Shares the step with** text.inverse, text.on-danger. Changing this pick moves only what reads color.text.on-action.

- **Token** `type.label.font-size` → `font-size` 0.9375rem :label[By scheme]{tone="info"}

  - **Pick** font.size.15

- **Token** `type.label.font-weight` → `font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700
:::

:::panel{id="part-3" title="Hover fill" note="Parts 3"}
![Hover fill: 3](/anatomy/brand-expressive/button/card-4.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Answer** Motion · How fast does feedback feel? → Fast

  Feedback stays fast; the personality shows in panels and hero moments, which move slower on a spring.

- **Rule** For hover and press feedback, use motion.duration.feedback (fast). Don't use an instant change.

  Fast feedback, on the brand's spring. An instant change drops the brand's motion.

- **Token** `color.action.primary.hover` → `primary.background.hover` #A6025B · dark #FBB4D8 :label[By scheme]{tone="info"}

  The main action under the pointer.

  - **Pick** pink.light.700: one step from the primary action (pink.light.600), so the pointer shows; its label still reads 7.55:1, above the 4.5:1 floor.
  - **Dark** pink.dark.700: one step from the primary action (pink.dark.600), so the pointer shows; its label still reads 10.82:1, above the 4.5:1 floor.
  - **Shares the step with** text.link. Changing this pick moves only what reads color.action.primary.hover.

- **Token** `color.action.secondary.hover` → `secondary.background.hover` #FCEFE6 · dark #33241F :label[By scheme]{tone="info"}

  Other actions under the pointer.

  - **Pick** neutral.100: one step from the secondary action (neutral.0), so the pointer shows; its label still reads 15.97:1, above the 4.5:1 floor.
  - **Dark** neutral.100: one step from the secondary action (neutral.50), so the pointer shows; its label still reads 14.14:1, above the 4.5:1 floor.
  - **Shares the step with** surface.sunken, surface.highlight, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.action.secondary.hover.

- **Token** `color.surface.highlight` → `ghost.background.hover` #FCEFE6 · dark #33241F :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-4" title="Focus ring" note="Parts 4"}
![Focus ring: 4](/anatomy/brand-expressive/button/card-5.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA, checked on every vivid color.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Focus must show on vivid color.

- **Token** `color.border.focus` → `focus-ring` #D61F7A · dark #F59ACA :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** pink.light.600: the focus ring, so the keyboard's place is never lost, 4.84:1 on surface.default, above the 3:1 floor.
  - **Dark** pink.dark.600: the focus ring, so the keyboard's place is never lost, 8.88:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `focus` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3

- **Token** `border-width.focus-offset` → `focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `focus-ring-offset` #FFF8F3 · dark #120B09 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.05:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.08:1 from surface.default, so cards and panels stand forward.
:::

:::panel{id="part-5" title="Disabled" note="Parts 5"}
![Disabled: 5](/anatomy/brand-expressive/button/card-6.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Token** `color.disabled.surface` → `disabled.background` #FCEFE6 · dark #33241F :label[By scheme]{tone="info"}

  The fill of a control that cannot be used right now.

  - **Pick** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Dark** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Shares the step with** surface.sunken, surface.highlight, action.secondary.hover, category.5.subtle. Changing this pick moves only what reads color.disabled.surface.

- **Token** `color.disabled.text` → `disabled.label` #8A6F63 · dark #E2C4B3 :label[By scheme]{tone="info"}

  Text and icons of a control that cannot be used right now.

  - **Pick** neutral.500: 4.63:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Dark** neutral.500: 10.96:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Shares the step with** border.strong, category.5. Changing this pick moves only what reads color.disabled.text.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `button`.
- **From a terminal:** `npx open-ds anatomy brand-expressive button`
