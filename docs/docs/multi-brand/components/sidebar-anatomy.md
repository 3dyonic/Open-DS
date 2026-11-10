---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 51.5
slug: "sidebar/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Sidebar in Multi-brand."
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

:::panel{media="wide"}
![Sidebar, every part numbered](/anatomy/multi-brand/sidebar/stage.png)
*Multi-brand, light, drawn in Figma from the scheme's tokens.*

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
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Panel" note="Parts 1" media="side"}
![Panel: 1](/anatomy/multi-brand/sidebar/card-1.png)

:label[Containment]

- **Answer** Elevation · What separates groups on the page? → Cards

  Cards group plans and offers.

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Each brand brings its own accent ramp.

- **Token** `color.surface.default` → `background` #FFFFFF · dark #0F172A :label[By scheme]{tone="info"}

  The base fill for content.

  - **Pick** neutral.0: the base for content; body text reads 17.85:1 on it, above the 4.5:1 floor.
  - **Dark** neutral.50: the base for content; body text reads 17.06:1 on it, above the 4.5:1 floor.
  - **Shares the step with** surface.raised, action.secondary. Changing this pick moves only what reads color.surface.default.

- **Token** `color.text.primary` → `label` #0F172A · dark #F8FAFC :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.85:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.06:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.
:::

:::panel{id="part-2" title="Group label" note="Parts 2" media="side"}
![Group label: 2](/anatomy/multi-brand/sidebar/card-2.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  One set of roles across brands.

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Each brand brings its own accent ramp.

- **Token** `color.text.secondary` → `group.label.label` #334155 · dark #CBD5E1 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 10.35:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 12.02:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.caption.font-size` → `group.label.font-size` 0.8125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.13

- **Token** `type.label.font-weight` → `group.label.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600
:::

:::panel{id="part-3" title="Menu button" note="Parts 3" media="side"}
![Menu button: 3](/anatomy/multi-brand/sidebar/card-3.png)

:label[Affordance] :label[Reach] :label[Readability]

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Answer** Accessibility · What is the smallest target? → Touch size

  Customers sign up on phones.

- **Answer** Typography · How large is body text? → Regular

  Regular body size suits all brands.

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Customers are often on phones.

- **Rule** For a link, use color.text.link (from the brand). Don't use a fixed blue.

  Links take the brand's color, so they look native in each brand. A fixed blue would clash with some brands.

- **Rule** For corners of buttons and inputs, use radius.control (set by the brand). Don't use a hard-coded radius.

  Each brand sets its own corner through the theme.

- **Token** `size.control.default` → `menu-button.default.height` 2.75rem :label[By scheme]{tone="info"}

  - **Pick** size.44

- **Token** `component-spacing-map.x2` → `menu-button.padding` 0.5rem

  - **Pick** space.8

- **Token** `type.body.font-size` → `menu-button.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `radius.control` → `menu-button.radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Rounded by default; each brand sets its own corner.
:::

:::panel{id="part-4" title="Current item" note="Parts 4" media="side"}
![Current item: 4](/anatomy/multi-brand/sidebar/card-4.png)

:label[Meaning] :label[Emphasis]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Brand colors vary, so meaning needs a word.

- **Rule** For a selected row or item, use color.surface.selected (from the brand). Don't use a fixed blue.

  Selection follows the brand color.

- **Token** `color.surface.selected` → `menu-button.background.current` #DEF3F0 · dark #012C28 :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** teal.light.100: a tint of the brand, 1.15:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** teal.dark.100: a tint of the brand, 1.18:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.

- **Token** `color.border.selected` → `menu-button.edge.current` #0F766E · dark #7FCFC6 :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** teal.light.600: the edge beside a selected fill, so selection is never color alone, 5.47:1 on surface.default, above the 3:1 floor.
  - **Dark** teal.dark.600: the edge beside a selected fill, so selection is never color alone, 9.9:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `border-width.focus` → `menu-button.edge-width.current` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2
:::

:::panel{id="part-5" title="Hover and pressed fill" note="Parts 5" media="side"}
![Hover and pressed fill: 5](/anatomy/multi-brand/sidebar/card-5.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Rule** For hover and press feedback, use motion.duration.feedback (moderate). Don't use brand-specific motion.

  Motion is shared, so one component library behaves the same in every brand.

- **Token** `color.surface.highlight` → `menu-button.background.hover` #F1F5F9 · dark #1E293B :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, disabled.surface. Changing this pick moves only what reads color.surface.highlight.

- **Token** `color.surface.pressed` → `menu-button.background.pressed` #E2E8F0 · dark #334155 :label[By scheme]{tone="info"}

  The fill of an item while it is pressed. Where the scheme gives pressed its own value, one step past the highlight; where pressed reuses hover, the highlight's step.

  - **Pick** neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: pressed for touch.
  - **Dark** neutral.200, one step past the highlight (neutral.100), so a press reads as its own change under the finger: pressed for touch.
  - **Shares the step with** border.default, disabled.border. Changing this pick moves only what reads color.surface.pressed.
:::

:::panel{id="part-6" title="Focus ring" note="Parts 6" media="side"}
![Focus ring: 6](/anatomy/multi-brand/sidebar/card-6.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA in every brand and mode.

- **Rule** For keyboard focus, use button/focus-ring (from the brand). Don't use removing the outline.

  Focus follows the brand but always shows.

- **Token** `color.border.focus` → `menu-button.focus-ring` #0F766E · dark #7FCFC6 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** teal.light.600: the focus ring, so the keyboard's place is never lost, 5.47:1 on surface.default, above the 3:1 floor.
  - **Dark** teal.dark.600: the focus ring, so the keyboard's place is never lost, 9.9:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `menu-button.focus-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `border-width.focus-offset` → `menu-button.focus-offset` 2px

  - **Pick** border-width.2
:::

:::panel{id="part-7" title="Disabled button" note="Parts 7" media="side"}
![Disabled button: 7](/anatomy/multi-brand/sidebar/card-7.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Token** `opacity.disabled` → `menu-button.opacity.disabled` 0.4 :label[By scheme]{tone="info"}

  - **Pick** opacity.40
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `sidebar`.
- **From a terminal:** `npx open-ds anatomy multi-brand sidebar`
