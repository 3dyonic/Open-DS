---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 25.5
slug: "dropdown-menu/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Dropdown menu in Brand expressive."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the menu apart to show how design decisions become the parts you see. You don't need it to use the menu: [its own page](../dropdown-menu) has everything you need to build.

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
![Dropdown menu, every part numbered](/anatomy/brand-expressive/dropdown-menu/stage.png)
*Brand expressive, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Menu** required
  - **1** **Surface** required :label[By scheme]{tone="info"} :label[Containment] :label[Layering]
  - **2** **Shadow** required :label[By scheme]{tone="info"} :label[Layering]
- **Item** required :label[Readability] :label[Reach] :label[Affordance]
  - **3** **Item label** required :label[By scheme]{tone="info"} :label[Readability] :label[Hierarchy]
  - **4** **Item icon** optional :label[By scheme]{tone="info"} :label[Meaning]
  - **5** **Shortcut** optional · no token yet :label[Hierarchy]
  - **6** **Submenu chevron** optional · no token yet :label[Affordance]
  - **7** **Highlight fill** state :label[By scheme]{tone="info"} :label[Feedback]
  - **8** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
  - **9** **Disabled item** state :label[By scheme]{tone="info"} :label[Feedback]
  - **10** **Destructive item** optional :label[By scheme]{tone="info"} :label[Meaning] :label[Emphasis]
- **11** **Separator** optional :label[By scheme]{tone="info"} :label[Grouping]
- **Group label** optional · not in this example :label[Hierarchy] :label[Grouping]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Surface and shadow" note="Parts 1, 2" media="side"}
![Surface and shadow: 1, 2](/anatomy/brand-expressive/dropdown-menu/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Cards too

  Cards lift to feel like objects.

- **Answer** Elevation · How soft are shadows? → Pronounced

  Pronounced shadows add depth.

- **Rule** For a menu or dialog, use elevation.overlay and a dimmed page. Don't use no shadow.

  Strong depth shows a menu or dialog sits above vivid sections. Without a shadow it blends into the color blocks.

- **Token** `color.surface.raised` → `overlay.background` #FFFFFF · dark #1F1411 :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `elevation.overlay` → `overlay.shadow` 0px 24px 48px, #1F141133 · dark 0px 24px 48px, #00000099 :label[By scheme]{tone="info"}

  - **Pick** shadow.overlay: Pronounced shadows add depth.
  - **Dark** shadow.overlay-dark: Pronounced shadows add depth.
:::

:::panel{id="part-3-4-5" title="Item" note="Parts 3, 4, 5" media="side"}
![Item: 3, 4, 5](/anatomy/brand-expressive/dropdown-menu/card-2.png)

:label[Readability] :label[Reach] :label[Affordance]

- **Answer** Typography · How large is body text? → Regular

  Regular body; the display does the shouting.

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Answer** Accessibility · What is the smallest target? → Touch size

  Visitors come from social posts on phones.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Most visitors arrive on phones, and a compact control is too small for a thumb.

- **Token** `type.body.font-size` → `item.font-size` 1.0625rem :label[By scheme]{tone="info"}

  - **Pick** font.size.17

- **Token** `space.inset.cell-x` → `item.padding-x` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16

- **Token** `size.control.default` → `overlay.item-height` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52
:::

:::panel{id="part-7" title="Highlight fill" note="Parts 7" media="side"}
![Highlight fill: 7](/anatomy/brand-expressive/dropdown-menu/card-3.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Answer** Motion · How fast does feedback feel? → Fast

  Feedback stays fast; the personality shows in panels and hero moments, which move slower on a spring.

- **Rule** For hover and press feedback, use motion.duration.feedback (fast). Don't use an instant change.

  Fast feedback, on the brand's spring. An instant change drops the brand's motion.

- **Token** `color.surface.highlight` → `item.background.highlight` #FCEFE6 · dark #33241F :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-8" title="Focus ring" note="Parts 8" media="side"}
![Focus ring: 8](/anatomy/brand-expressive/dropdown-menu/card-4.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA, checked on every vivid color.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Focus must show on vivid color.

- **Token** `color.border.focus` no key of its own yet #D61F7A · dark #F59ACA :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** pink.light.600: the focus ring, so the keyboard's place is never lost, 4.84:1 on surface.default, above the 3:1 floor.
  - **Dark** pink.dark.600: the focus ring, so the keyboard's place is never lost, 8.88:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` no key of its own yet 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3
:::

:::panel{id="part-9" title="Disabled item" note="Parts 9" media="side"}
![Disabled item: 9](/anatomy/brand-expressive/dropdown-menu/card-5.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Token** `opacity.disabled` → `item.disabled` 0.4 :label[By scheme]{tone="info"}

  - **Pick** opacity.40
:::

:::panel{id="part-10" title="Destructive item" note="Parts 10" media="side"}
![Destructive item: 10](/anatomy/brand-expressive/dropdown-menu/card-6.png)

:label[Meaning] :label[Emphasis]

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Color and word.

- **Rule** For delete or remove, use Button secondary, then confirm with Button danger. Don't use button primary.

  Confirm before destroying data.

- **Token** `color.status.danger` → `item.label.destructive` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.58:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

:::panel{id="part-11" title="Separator" note="Parts 11" media="side"}
![Separator: 11](/anatomy/brand-expressive/dropdown-menu/card-7.png)

:label[Grouping]

- **Answer** Elevation · What separates groups on the page? → Cards

  Cards hold each offer.

- **Rule** For between page sections, use space.gap.section and a color block. Don't use a thin line.

  Big space and color make each section a moment.

- **Token** `color.border.default` → `separator.background` #F2DCCF · dark #4D3A33 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.26:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.69:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `dropdown-menu`.
- **From a terminal:** `npx open-ds anatomy brand-expressive dropdown-menu`
