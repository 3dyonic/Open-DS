---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 52.5
slug: "sidebar/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Sidebar in Accessible first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the sidebar apart to show how design decisions become the parts you see. You don't need it to use the sidebar: [its own page](../sidebar) has everything you need to build.

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

![Sidebar, every part numbered](/anatomy/accessible-first/sidebar/stage.png)

*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Panel** required :label[By scheme]{tone="info"} :label[Containment]
- **Group** required :label[Grouping]
  - **2** **Group label** optional :label[By scheme]{tone="info"} :label[Hierarchy] :label[Readability]
  - **Menu** required :label[Grouping]
    - **3** **Menu button** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach] :label[Readability]
    - **4** **Current item** state :label[By scheme]{tone="info"} :label[Meaning] :label[Emphasis]
    - **5** **Hover and pressed fill** state :label[By scheme]{tone="info"} :label[Feedback]
    - **6** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
    - **7** **Disabled button** state :label[By scheme]{tone="info"} :label[Feedback]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Panel" note="Parts 1"}
![Panel: 1](/anatomy/accessible-first/sidebar/card-1.png)

:label[Containment]

- **Answer** Elevation · What separates groups on the page? → Lines

  Strong borders separate groups at any zoom.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Token** `color.surface.default` → `background` #FFFFFF · dark #141414 :label[By scheme]{tone="info"}

  The base fill for content.

  - **Pick** neutral.0: the base for content; body text reads 18.42:1 on it, above the 7:1 floor.
  - **Dark** neutral.50: the base for content; body text reads 17.2:1 on it, above the 7:1 floor.
  - **Shares the step with** surface.raised, action.secondary. Changing this pick moves only what reads color.surface.default.

- **Token** `color.text.primary` → `label` #141414 · dark #F7F7F7 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.42:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.2:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.
:::

:::panel{id="part-2" title="Group label" note="Parts 2"}
![Group label: 2](/anatomy/accessible-first/sidebar/card-2.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Token** `color.text.secondary` → `group.label.label` #333333 · dark #D6D6D6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 12.63:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.700: supporting text, 12.68:1 on surface.default, above the 7:1 floor.

- **Token** `type.caption.font-size` → `group.label.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `type.label.font-weight` → `group.label.font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700
:::

:::panel{id="part-3" title="Menu button" note="Parts 3"}
![Menu button: 3](/anatomy/accessible-first/sidebar/card-3.png)

:label[Affordance] :label[Reach] :label[Readability]

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Answer** Accessibility · What is the smallest target? → Large

  Large targets for tremor and touch.

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Clear, slightly rounded controls.

- **Rule** For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size.

  Large targets help people with motor needs.

- **Rule** For a link, use color.text.link, underlined. Don't use color only.

  Underline works without color perception.

- **Rule** For corners of buttons and inputs, use radius.control. Don't use a pill.

  Clear rectangles read as fields and buttons.

- **Token** `size.control.default` → `menu-button.default.height` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `component-spacing-map.x2` → `menu-button.padding` 0.5rem

  - **Pick** space.8

- **Token** `type.body.font-size` → `menu-button.font-size` 1.1875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.19

- **Token** `radius.control` → `menu-button.radius` 0.375rem :label[By scheme]{tone="info"}

  - **Pick** radius.6: Clear, slightly rounded controls.
:::

:::panel{id="part-4" title="Current item" note="Parts 4"}
![Current item: 4](/anatomy/accessible-first/sidebar/card-4.png)

:label[Meaning] :label[Emphasis]

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Answer** Accessibility · How many signals carry each meaning? → Three: color, icon and word

  Never color alone.

- **Rule** For a selected row or item, use color.surface.selected and a check icon. Don't use color alone.

  Selection never relies on color alone.

- **Token** `color.surface.selected` → `menu-button.background.current` #E2EDFF · dark #102547 :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** blue.light.100: a tint of the brand, 1.18:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** blue.dark.100: a tint of the brand, 1.21:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.

- **Token** `color.border.selected` → `menu-button.edge.current` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** blue.light.600: the edge beside a selected fill, so selection is never color alone, 7.26:1 on surface.default, above the 3:1 floor.
  - **Dark** blue.dark.600: the edge beside a selected fill, so selection is never color alone, 8.74:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `border-width.focus` → `menu-button.edge-width.current` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3
:::

:::panel{id="part-5" title="Hover and pressed fill" note="Parts 5"}
![Hover and pressed fill: 5](/anatomy/accessible-first/sidebar/card-5.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Rule** For hover and press feedback, use motion.duration.feedback (moderate). Don't use fast flicker.

  Moderate speed is easy to follow.

- **Token** `color.surface.highlight` → `menu-button.background.hover` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.

- **Token** `color.surface.pressed` → `menu-button.background.pressed` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  The fill of an item while it is pressed. Where the scheme gives pressed its own value, one step past the highlight; where pressed reuses hover, the highlight's step.

  - **Pick** neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: every state, including loading, gets its own value.
  - **Dark** neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: every state, including loading, gets its own value.
  - **Shares the step with** border.default, disabled.border. Changing this pick moves only what reads color.surface.pressed.
:::

:::panel{id="part-6" title="Focus ring" note="Parts 6"}
![Focus ring: 6](/anatomy/accessible-first/sidebar/card-6.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AAA for text

  AAA contrast for text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus, with an offset. Don't use a thin or faint outline.

  Focus must be seen by everyone.

- **Token** `color.border.focus` → `menu-button.focus-ring` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** blue.light.600: the focus ring, so the keyboard's place is never lost, 7.26:1 on surface.default, above the 3:1 floor.
  - **Dark** blue.dark.600: the focus ring, so the keyboard's place is never lost, 8.74:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `menu-button.focus-width` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3

- **Token** `border-width.focus-offset` → `menu-button.focus-offset` 2px

  - **Pick** border-width.2
:::

:::panel{id="part-7" title="Disabled button" note="Parts 7"}
![Disabled button: 7](/anatomy/accessible-first/sidebar/card-7.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Token** `opacity.disabled` → `menu-button.opacity.disabled` 0.5 :label[By scheme]{tone="info"}

  - **Pick** opacity.50
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `sidebar`.
- **From a terminal:** `npx open-ds anatomy accessible-first sidebar`
