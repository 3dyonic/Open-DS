---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 42.5
slug: "navigation-menu/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Navigation menu in Content first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the navigation menu apart to show how design decisions become the parts you see. You don't need it to use the navigation menu: [its own page](../navigation-menu) has everything you need to build.

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

![Navigation menu, every part numbered](/anatomy/content-first/navigation-menu/stage.png)

*Content first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **List** required
  - **1** **Trigger** required :label[By scheme]{tone="info"} :label[Readability] :label[Affordance] :label[Reach]
  - **2** **Open trigger fill** state :label[By scheme]{tone="info"} :label[Feedback]
  - **3** **Chevron** required :label[By scheme]{tone="info"} :label[Affordance]
- **Panel** required
  - **4** **Surface** required :label[By scheme]{tone="info"} :label[Containment] :label[Layering]
  - **5** **Shadow** required :label[By scheme]{tone="info"} :label[Layering]
- **Link** required :label[Readability] :label[Reach]
  - **6** **Link** required :label[By scheme]{tone="info"} :label[Readability] :label[Reach]
  - **7** **Current link** state :label[By scheme]{tone="info"} :label[Meaning] :label[Emphasis]
  - **8** **Hover fill** state :label[By scheme]{tone="info"} :label[Feedback]
  - **9** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
  - **Link icon** optional · not in this example :label[By scheme]{tone="info"} :label[Meaning]
- **Indicator** optional · not in this example :label[By scheme]{tone="info"} :label[Affordance]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-3" title="Trigger" note="Parts 1, 3"}
![Trigger: 1, 3](/anatomy/content-first/navigation-menu/card-1.png)

:label[Readability] :label[Affordance] :label[Reach]

- **Answer** Typography · How large is body text? → Large

  Large body text is easy on the eyes.

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Many readers are on phones.

- **Token** `type.body.font-size` → `trigger.font-size` 1.125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.18

- **Token** `type.label.font-weight` → `trigger.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600

- **Token** `space.inset.container` → `trigger.padding-x` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `component-spacing-map.x2` → `trigger.padding-y` 0.5rem

  - **Pick** space.8

- **Token** `space.gap.tight` → `trigger.icon-gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8
:::

:::panel{id="part-2" title="Open trigger" note="Parts 2"}
![Open trigger: 2](/anatomy/content-first/navigation-menu/card-2.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed gets its own value for touch.

- **Token** `color.surface.highlight` → `trigger.background.open` #F6F2EA · dark #2E2A24 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-4-5" title="Panel surface and shadow" note="Parts 4, 5"}
![Panel surface and shadow: 4, 5](/anatomy/content-first/navigation-menu/card-3.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Only what floats

  Only menus and dialogs float.

- **Answer** Elevation · How soft are shadows? → Soft

  Soft shadows suit warm paper.

- **Rule** For a menu or dialog, use elevation.overlay and a dimmed page. Don't use no shadow.

  The dimmed page focuses the reader on the dialog.

- **Token** `color.surface.raised` → `viewport.background` #FFFFFF · dark #1F1B16 :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `color.border.default` → `viewport.border` #E4DDD0 · dark #4A4339 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.33:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.76:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `radius.container` → `viewport.radius` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** radius.12: Rounded corners feel friendly.

- **Token** `elevation.overlay` → `viewport.shadow` 0px 12px 32px, #1F1B1629 · dark 0px 12px 32px, #00000080 :label[By scheme]{tone="info"}

  - **Pick** shadow.overlay: Soft shadows suit warm paper.
  - **Dark** shadow.overlay-dark: Soft shadows suit warm paper.
:::

:::panel{id="part-6" title="Link" note="Parts 6"}
![Link: 6](/anatomy/content-first/navigation-menu/card-4.png)

:label[Readability] :label[Reach]

- **Answer** Typography · How large is body text? → Large

  Large body text is easy on the eyes.

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Rule** For a link, use color.text.link, underlined. Don't use color without underline.

  Readers expect links to be underlined inside text.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Many readers are on phones.

- **Token** `type.body.font-size` → `link.font-size` 1.125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.18

- **Token** `component-spacing-map.x2` → `link.padding` 0.5rem

  - **Pick** space.8

- **Token** `radius.option` → `link.radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: the panel's 12px corner less its 4px padding, so an option's corner nests inside the menu's.
:::

:::panel{id="part-7" title="Current link" note="Parts 7"}
![Current link: 7](/anatomy/content-first/navigation-menu/card-5.png)

:label[Meaning] :label[Emphasis]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Reading needs few color roles.

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Status is rare; color and a word are enough.

- **Rule** For a selected row or item, use color.surface.selected. Don't use bold text only.

  A tint shows the choice clearly on warm paper.

- **Token** `color.surface.selected` → `link.background.current` #E0E9F5 · dark #202B3B :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** navy.light.100: a tint of the brand, 1.22:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** navy.dark.100: a tint of the brand, 1.2:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.

- **Token** `color.border.selected` → `link.edge.current` #1E3A5F · dark #8FA6C4 :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** navy.light.600: the edge beside a selected fill, so selection is never color alone, 11.5:1 on surface.default, above the 3:1 floor.
  - **Dark** navy.dark.600: the edge beside a selected fill, so selection is never color alone, 6.86:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `border-width.focus` → `link.edge-width.current` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2
:::

:::panel{id="part-8" title="Hover fill" note="Parts 8"}
![Hover fill: 8](/anatomy/content-first/navigation-menu/card-6.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed gets its own value for touch.

- **Rule** For hover and press feedback, use motion.duration.feedback (moderate). Don't use a fast flash.

  Moderate speed feels calm in a slow reading flow. A fast flash feels jumpy.

- **Token** `color.surface.highlight` → `link.background.hover` #F6F2EA · dark #2E2A24 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.
:::

:::panel{id="part-9" title="Focus ring" note="Parts 9"}
![Focus ring: 9](/anatomy/content-first/navigation-menu/card-7.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA contrast, with large text helping further.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Keyboard users must always see where they are.

- **Token** `color.border.focus` → `link.focus-ring-focus` #1E3A5F · dark #8FA6C4 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** navy.light.600: the focus ring, so the keyboard's place is never lost, 11.5:1 on surface.default, above the 3:1 floor.
  - **Dark** navy.dark.600: the focus ring, so the keyboard's place is never lost, 6.86:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `link.focus-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `border-width.focus-offset` → `link.focus-offset` 2px

  - **Pick** border-width.2
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `navigation-menu`.
- **From a terminal:** `npx open-ds anatomy content-first navigation-menu`
