---
composite_data: "./dropdown-menu-anatomy.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 25.5
slug: "dropdown-menu/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Dropdown menu in Content first."
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

::anatomy-drawing{id="dropdown-menu/stage"}

*Content first, light, drawn from the scheme's tokens: 48px items, 16px side padding, 18px text, a 12px corner and its shadow.*

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

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Surface and shadow" note="Parts 1, 2"}
::anatomy-drawing{id="dropdown-menu/card-1"}

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Only what floats

  Only menus and dialogs float.

- **Answer** Elevation · How soft are shadows? → Soft

  Soft shadows suit warm paper.

- **Rule** For a menu or dialog, use elevation.overlay and a dimmed page. Don't use no shadow.

  The dimmed page focuses the reader on the dialog.

- **Token** `color.surface.raised` → `overlay.background` #FFFFFF · dark #1F1B16 :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `elevation.overlay` → `overlay.shadow` 0px 12px 32px, #1F1B1629 · dark 0px 12px 32px, #00000080 :label[By scheme]{tone="info"}

  - **Pick** shadow.overlay: Soft shadows suit warm paper.
  - **Dark** shadow.overlay-dark: Soft shadows suit warm paper.
:::

:::panel{id="part-3-4-5" title="Item" note="Parts 3, 4, 5"}
::anatomy-drawing{id="dropdown-menu/card-2"}

:label[Readability] :label[Reach] :label[Affordance]

- **Answer** Typography · How large is body text? → Large

  Large body text is easy on the eyes.

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Answer** Accessibility · What is the smallest target? → Touch size

  Readers are often on phones.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Many readers are on phones.

- **Token** `type.body.font-size` → `item.font-size` 1.125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.18

- **Token** `space.inset.cell-x` → `item.padding-x` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16

- **Token** `size.control.default` → `overlay.item-height` 3rem :label[By scheme]{tone="info"}

  - **Pick** size.48
:::

:::panel{id="part-7" title="Highlight fill" note="Parts 7"}
::anatomy-drawing{id="dropdown-menu/card-3"}

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed gets its own value for touch.

- **Answer** Motion · How fast does feedback feel? → Moderate

  Moderate speed feels calm.

- **Rule** For hover and press feedback, use motion.duration.feedback (moderate). Don't use a fast flash.

  Moderate speed feels calm in a slow reading flow. A fast flash feels jumpy.

- **Token** `color.surface.highlight` → `item.background.highlight` #F6F2EA · dark #2E2A24 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-8" title="Focus ring" note="Parts 8"}
::anatomy-drawing{id="dropdown-menu/card-4"}

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA contrast, with large text helping further.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Keyboard users must always see where they are.

- **Token** `color.border.focus` no key of its own yet #1E3A5F · dark #8FA6C4 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** navy.light.600: the focus ring, so the keyboard's place is never lost, 11.5:1 on surface.default, above the 3:1 floor.
  - **Dark** navy.dark.600: the focus ring, so the keyboard's place is never lost, 6.86:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` no key of its own yet 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2
:::

:::panel{id="part-9" title="Disabled item" note="Parts 9"}
::anatomy-drawing{id="dropdown-menu/card-5"}

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed gets its own value for touch.

- **Token** `opacity.disabled` → `item.disabled` 0.4 :label[By scheme]{tone="info"}

  - **Pick** opacity.40
:::

:::panel{id="part-10" title="Destructive item" note="Parts 10"}
::anatomy-drawing{id="dropdown-menu/card-6"}

:label[Meaning] :label[Emphasis]

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Status is rare; color and a word are enough.

- **Rule** For delete or remove, use Button secondary with the full verb, then confirm with Button danger. Don't use button primary.

  Naming the verb and confirming prevents a mistake.

- **Token** `color.status.danger` → `item.label.destructive` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.21:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

:::panel{id="part-11" title="Separator" note="Parts 11"}
::anatomy-drawing{id="dropdown-menu/card-7"}

:label[Grouping]

- **Answer** Elevation · What separates groups on the page? → Space

  Space separates groups; lines would interrupt reading.

- **Rule** For between page sections, use space.gap.section, no line. Don't use a divider line.

  Space alone separates sections; lines add noise.

- **Token** `color.border.default` → `separator.background` #E4DDD0 · dark #4A4339 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.33:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.76:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `dropdown-menu`.
- **From a terminal:** `npx open-ds anatomy content-first dropdown-menu`
