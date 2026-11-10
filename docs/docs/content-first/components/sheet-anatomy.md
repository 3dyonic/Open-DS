---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 50.5
slug: "sheet/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Sheet in Content first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the sheet apart to show how design decisions become the parts you see. You don't need it to use the sheet: [its own page](../sheet) has everything you need to build.

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
![Sheet, every part numbered](/anatomy/content-first/sheet/stage.png)
*Content first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Trigger** required · shown by Button :label[Affordance]
- **1** **Scrim** required :label[Layering]
- **2** **Panel** required :label[By scheme]{tone="info"} :label[Containment] :label[Layering]
- **3** **Header** required :label[By scheme]{tone="info"} :label[Grouping] :label[Hierarchy]
  - **4** **Title** required :label[By scheme]{tone="info"} :label[Hierarchy] :label[Readability]
  - **5** **Description** optional :label[By scheme]{tone="info"} :label[Readability]
- **6** **Footer** optional :label[By scheme]{tone="info"} :label[Grouping]
  - **Actions** optional · shown by Button :label[Affordance] :label[Emphasis]
- **7** **Close button** optional :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
- **8** **Close hover fill** state :label[By scheme]{tone="info"} :label[Feedback]
- **9** **Close focus ring** state :label[By scheme]{tone="info"} :label[Focus]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Panel and scrim" note="Parts 1, 2" media="side"}
![Panel and scrim: 1, 2](/anatomy/content-first/sheet/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Only what floats

  Only menus and dialogs float.

- **Answer** Elevation · How soft are shadows? → Soft

  Soft shadows suit warm paper.

- **Rule** For a menu or dialog, use elevation.overlay and a dimmed page. Don't use no shadow.

  The dimmed page focuses the reader on the dialog.

- **Token** `color.surface.scrim` → `overlay.background` #0000008C · dark #000000B3

  The see-through layer behind a modal.

  - **Pick** black.light.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on.
  - **Dark** black.dark.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on.

- **Token** `color.surface.canvas` → `content.background` #FFFDF8 · dark #14110D :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.02:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.1:1 from surface.default, so cards and panels stand forward.

- **Token** `elevation.overlay` → `content.shadow` 0px 12px 32px, #1F1B1629 · dark 0px 12px 32px, #00000080 :label[By scheme]{tone="info"}

  - **Pick** shadow.overlay: Soft shadows suit warm paper.
  - **Dark** shadow.overlay-dark: Soft shadows suit warm paper.

- **Token** `color.border.default` → `content.border` #E4DDD0 · dark #4A4339 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.33:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.76:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.
:::

:::panel{id="part-2-3-6" title="Room inside the panel" note="Parts 2, 3, 6" media="side"}
![Room inside the panel: 2, 3, 6](/anatomy/content-first/sheet/card-2.png)

:label[Containment] :label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Text needs air even inside a group.

- **Token** `space.gap.group` → `content.gap` 2rem :label[By scheme]{tone="info"}

  - **Pick** space.32

- **Token** `space.inset.container` → `header.padding` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `space.inset.container` → `footer.padding` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-4-5" title="Title and description" note="Parts 4, 5" media="side"}
![Title and description: 4, 5](/anatomy/content-first/sheet/card-3.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and editorial display

  A lead and a display role open articles.

- **Answer** Typography · How large is body text? → Large

  Large body text is easy on the eyes.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Reading needs few color roles.

- **Rule** For paragraph or help text, use type.body, at most 65 characters a line. Don't use type.caption.

  A large size and short lines make long text easy on the eyes.

- **Token** `type.heading.font-family` → `title.font-family` "Source Serif 4", Georgia, serif :label[By scheme]{tone="info"}

  - **Pick** source-serif-4 for heading text: Source Serif 4 for reading and headings, Inter for labels and captions: a good magazine's text with a quiet interface.

- **Token** `type.heading.font-size` → `title.font-size` 1.75rem :label[By scheme]{tone="info"}

  - **Pick** font.size.28

- **Token** `type.heading.font-weight` → `title.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600

- **Token** `color.text.primary` → `title.label` #1F1B16 · dark #FFFDF8 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.12:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.84:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `type.body.font-size` → `description.font-size` 1.125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.18

- **Token** `color.text.secondary` → `description.label` #4A4339 · dark #CFC6B6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 9.75:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 10.11:1 on surface.default, above the 4.5:1 floor.

- **Token** `component-spacing-map.x2` → `header.gap` 0.5rem

  - **Pick** space.8
:::

:::panel{id="part-6" title="Footer" note="Parts 6" media="side"}
![Footer: 6](/anatomy/content-first/sheet/card-4.png)

:label[Grouping] :label[Reach]

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Rule** For the action that completes the task, use Button primary, one per section. Don't use two primaries side by side.

  One clear action per section. Two primaries make the reader choose before they have read.

- **Rule** For an alternative or cancel, use Button ghost as a text link. Don't use a second boxed button.

  A link feels lighter and does not compete.

- **Token** `space.gap.default` → `footer.gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16

- **Token** `space.inset.container` → `footer.padding` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-7-8-9" title="Close button" note="Parts 7, 8, 9" media="side"}
![Close button: 7, 8, 9](/anatomy/content-first/sheet/card-5.png)

:label[Affordance] :label[Reach] :label[Feedback] :label[Focus]

- **Answer** Shape · What should control corners say? → Rounded

  Rounded corners feel friendly.

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the text size.

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed gets its own value for touch.

- **Rule** For an icon with no label, use Not used: always add a word. Don't use an icon button.

  Occasional visitors do not know icons.

- **Rule** For hover and press feedback, use motion.duration.feedback (moderate). Don't use a fast flash.

  Moderate speed feels calm in a slow reading flow. A fast flash feels jumpy.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Keyboard users must always see where they are.

- **Token** `radius.control` → `close.radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Rounded corners feel friendly.

- **Token** `size.icon` → `close.icon-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `color.text.secondary` → `close.label` #4A4339 · dark #CFC6B6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 9.75:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 10.11:1 on surface.default, above the 4.5:1 floor.

- **Token** `color.surface.highlight` → `close.background.hover` #F6F2EA · dark #2E2A24 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.

- **Token** `color.border.focus` → `close.focus-ring.color` #1E3A5F · dark #8FA6C4 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** navy.light.600: the focus ring, so the keyboard's place is never lost, 11.5:1 on surface.default, above the 3:1 floor.
  - **Dark** navy.dark.600: the focus ring, so the keyboard's place is never lost, 6.86:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `close.focus-ring.width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `border-width.focus-offset` → `close.focus-offset` 2px

  - **Pick** border-width.2
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `sheet`.
- **From a terminal:** `npx open-ds anatomy content-first sheet`
