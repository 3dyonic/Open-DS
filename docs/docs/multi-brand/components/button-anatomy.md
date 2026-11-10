---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 10.5
slug: "button/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Button in Multi-brand."
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

:::panel{media="wide"}
![Button, every part numbered](/anatomy/multi-brand/button/stage.png)
*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Button** required :label[Affordance] :label[Reach]
  - **1** **Container** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach] :label[Emphasis]
  - **2** **Label** required :label[By scheme]{tone="info"} :label[Readability]
  - **Icon** optional · not on the first button: the secondary and the icon button carry one :label[By scheme]{tone="info"} :label[Meaning]
- **3** **Hover fill** state :label[By scheme]{tone="info"} :label[Feedback]
- **4** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
- **5** **Disabled** state :label[By scheme]{tone="info"} :label[Feedback]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Container" note="Parts 1" media="side"}
![Container: 1](/anatomy/multi-brand/button/card-1.png)

:label[Affordance] :label[Reach]

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Answer** Accessibility · What is the smallest target? → Touch size

  Customers sign up on phones.

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Rule** For corners of buttons and inputs, use radius.control (set by the brand). Don't use a hard-coded radius.

  Each brand sets its own corner through the theme.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Customers are often on phones.

- **Token** `size.control.default` → `height` 2.75rem :label[By scheme]{tone="info"}

  - **Pick** size.44

- **Token** `space.inset.control-x` → `padding-x` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16

- **Token** `radius.control` → `radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Rounded by default; each brand sets its own corner.
:::

:::panel{id="part-1" title="Emphasis" note="Parts 1" media="side"}
![Emphasis: 1](/anatomy/multi-brand/button/card-2.png)

:label[Emphasis]

- **Answer** Color · How many emphasis levels do actions need? → Three

  Primary, secondary and ghost in every brand.

- **Rule** For the action that completes the task, use Button primary, one per view. Don't use two primaries.

  One clear action per view. Two primaries split attention.

- **Rule** For an alternative or cancel, use Button secondary. Don't use a second primary.

  The alternative steps back, so the one primary stays clear. A second primary would compete with it.

- **Rule** For delete or remove, use Button secondary, then confirm with Button danger. Don't use button primary.

  Confirm before destroying data.

- **Token** `color.border.strong` → `secondary.border` #64748B · dark #96A3B5 :label[By scheme]{tone="info"}

  The edge of a control people must find.

  - **Pick** neutral.500: the edge of a control people must find, 4.76:1 on surface.default, above the 3:1 floor.
  - **Dark** neutral.400: the edge of a control people must find, 6.97:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** disabled.text. Changing this pick moves only what reads color.border.strong.
:::

:::panel{id="part-2" title="Label" note="Parts 2" media="side"}
![Label: 2](/anatomy/multi-brand/button/card-3.png)

:label[Readability]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  One set of roles across brands.

- **Answer** Voice and tone · How does it sound? → Plain and direct

  The shared core is plain and direct.

- **Rule** For a button label, use A shared verb; the brand may choose the headline verb. Don't use brand slang on account actions.

  Shared labels keep the account area the same in every brand.

- **Token** `color.text.on-action` → `primary.label` #FFFFFF · dark #0F172A :label[By scheme]{tone="info"}

  Text and icons on the main action's fill.

  - **Pick** text.on-dark: the text its fill's tone picks, 5.47:1 on action.primary, above the 4.5:1 floor.
  - **Dark** text.on-light: the text its fill's tone picks, 9.9:1 on action.primary, above the 4.5:1 floor.
  - **Shares the step with** text.inverse, text.on-danger. Changing this pick moves only what reads color.text.on-action.

- **Token** `type.label.font-size` → `font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `type.label.font-weight` → `font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600
:::

:::panel{id="part-3" title="Hover fill" note="Parts 3" media="side"}
![Hover fill: 3](/anatomy/multi-brand/button/card-4.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Answer** Motion · How fast does feedback feel? → Moderate

  Moderate speed across brands.

- **Rule** For hover and press feedback, use motion.duration.feedback (moderate). Don't use brand-specific motion.

  Motion is shared, so one component library behaves the same in every brand.

- **Token** `color.action.primary.hover` → `primary.background.hover` #015852 · dark #A1DCD4 :label[By scheme]{tone="info"}

  The main action under the pointer.

  - **Pick** teal.light.700: one step from the primary action (teal.light.600), so the pointer shows; its label still reads 8.34:1, above the 4.5:1 floor.
  - **Dark** teal.dark.700: one step from the primary action (teal.dark.600), so the pointer shows; its label still reads 11.65:1, above the 4.5:1 floor.
  - **Shares the step with** text.link. Changing this pick moves only what reads color.action.primary.hover.

- **Token** `color.action.secondary.hover` → `secondary.background.hover` #F1F5F9 · dark #1E293B :label[By scheme]{tone="info"}

  Other actions under the pointer.

  - **Pick** neutral.100: one step from the secondary action (neutral.0), so the pointer shows; its label still reads 16.3:1, above the 4.5:1 floor.
  - **Dark** neutral.100: one step from the secondary action (neutral.50), so the pointer shows; its label still reads 13.98:1, above the 4.5:1 floor.
  - **Shares the step with** surface.sunken, surface.highlight, disabled.surface. Changing this pick moves only what reads color.action.secondary.hover.

- **Token** `color.surface.highlight` → `ghost.background.hover` #F1F5F9 · dark #1E293B :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-4" title="Focus ring" note="Parts 4" media="side"}
![Focus ring: 4](/anatomy/multi-brand/button/card-5.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA in every brand and mode.

- **Rule** For keyboard focus, use button/focus-ring (from the brand). Don't use removing the outline.

  Focus follows the brand but always shows.

- **Token** `color.border.focus` → `focus-ring` #0F766E · dark #7FCFC6 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** teal.light.600: the focus ring, so the keyboard's place is never lost, 5.47:1 on surface.default, above the 3:1 floor.
  - **Dark** teal.dark.600: the focus ring, so the keyboard's place is never lost, 9.9:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `focus` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `border-width.focus-offset` → `focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `focus-ring-offset` #F8FAFC · dark #020617 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.05:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.13:1 from surface.default, so cards and panels stand forward.
:::

:::panel{id="part-5" title="Disabled" note="Parts 5" media="side"}
![Disabled: 5](/anatomy/multi-brand/button/card-6.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Token** `color.disabled.surface` → `disabled.background` #F1F5F9 · dark #1E293B :label[By scheme]{tone="info"}

  The fill of a control that cannot be used right now.

  - **Pick** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Dark** neutral.100: the surface of a control that cannot be used, flat and quiet, so it never reads as an action.
  - **Shares the step with** surface.sunken, surface.highlight, action.secondary.hover. Changing this pick moves only what reads color.disabled.surface.

- **Token** `color.disabled.text` → `disabled.label` #64748B · dark #CBD5E1 :label[By scheme]{tone="info"}

  Text and icons of a control that cannot be used right now.

  - **Pick** neutral.500: 4.76:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Dark** neutral.500: 12.02:1 on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.
  - **Shares the step with** border.strong. Changing this pick moves only what reads color.disabled.text.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `button`.
- **From a terminal:** `npx open-ds anatomy multi-brand button`
