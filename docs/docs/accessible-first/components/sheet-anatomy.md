---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 50.5
slug: "sheet/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Sheet in Accessible first."
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
![Sheet, every part numbered](/anatomy/accessible-first/sheet/stage.png)
*Accessible first, light, drawn in Figma from the scheme's tokens.*

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
![Panel and scrim: 1, 2](/anatomy/accessible-first/sheet/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Nothing

  Flat is easier to read at high zoom.

- **Answer** Elevation · How soft are shadows? → No shadows

  No shadows; borders do the work.

- **Rule** For a menu or dialog, use A strong border and a dimmed page. Don't use a shadow only.

  The dimmed page makes the dialog obvious.

- **Token** `color.surface.scrim` → `overlay.background` #0000008C · dark #000000B3

  The see-through layer behind a modal.

  - **Pick** black.light.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on.
  - **Dark** black.dark.scrim: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on.

- **Token** `color.surface.canvas` → `content.background` #F7F7F7 · dark #0A0A0A :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.07:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.07:1 from surface.default, so cards and panels stand forward.

- **Token** `elevation.overlay` → `content.shadow` 0px 0px 0px, #00000000 :label[By scheme]{tone="info"}

  - **Pick** shadow.none: No shadows; borders do the work.
  - **Shares the step with** elevation.card. Changing this pick moves only what reads elevation.overlay.

- **Token** `color.border.default` → `content.border` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.
:::

:::panel{id="part-2-3-6" title="Room inside the panel" note="Parts 2, 3, 6" media="side"}
![Room inside the panel: 2, 3, 6](/anatomy/accessible-first/sheet/card-2.png)

:label[Containment] :label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Generous space lowers mis-taps.

- **Token** `space.gap.group` → `content.gap` 2rem :label[By scheme]{tone="info"}

  - **Pick** space.32

- **Token** `space.inset.container` → `header.padding` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `space.inset.container` → `footer.padding` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-4-5" title="Title and description" note="Parts 4, 5" media="side"}
![Title and description: 4, 5](/anatomy/accessible-first/sheet/card-3.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Rule** For paragraph or help text, use type.body, short sentences. Don't use type.caption.

  Large text and short lines lower effort.

- **Token** `type.heading.font-family` → `title.font-family` "Atkinson Hyperlegible", Verdana, sans-serif :label[By scheme]{tone="info"}

  - **Pick** atkinson-hyperlegible for heading text: Atkinson Hyperlegible for everything: it was drawn so letters can't be mistaken, and nobody is left out.

- **Token** `type.heading.font-size` → `title.font-size` 1.375rem :label[By scheme]{tone="info"}

  - **Pick** font.size.22

- **Token** `type.heading.font-weight` → `title.font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700

- **Token** `color.text.primary` → `title.label` #141414 · dark #F7F7F7 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.42:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.2:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `type.body.font-size` → `description.font-size` 1.1875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.19

- **Token** `color.text.secondary` → `description.label` #333333 · dark #D6D6D6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 12.63:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.700: supporting text, 12.68:1 on surface.default, above the 7:1 floor.

- **Token** `component-spacing-map.x2` → `header.gap` 0.5rem

  - **Pick** space.8
:::

:::panel{id="part-6" title="Footer" note="Parts 6" media="side"}
![Footer: 6](/anatomy/accessible-first/sheet/card-4.png)

:label[Grouping] :label[Reach]

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For the action that completes the task, use Button primary, one per page. Don't use two primaries.

  One clear next step. Two primaries make people stop and compare, which adds effort.

- **Rule** For an alternative or cancel, use Button secondary. Don't use a text link.

  Every action looks like a button people can find.

- **Token** `space.gap.default` → `footer.gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16

- **Token** `space.inset.container` → `footer.padding` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-7-8-9" title="Close button" note="Parts 7, 8, 9" media="side"}
![Close button: 7, 8, 9](/anatomy/accessible-first/sheet/card-5.png)

:label[Affordance] :label[Reach] :label[Feedback] :label[Focus]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Clear, slightly rounded controls.

- **Answer** Iconography · How big are icons next to text? → Larger than the text

  Larger icons are easier to see.

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Rule** For an icon with no label, use Not used: always add a word. Don't use an icon button.

  Icons alone are guesswork.

- **Rule** For hover and press feedback, use motion.duration.feedback (moderate). Don't use fast flicker.

  Moderate speed is easy to follow.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus, with an offset. Don't use a thin or faint outline.

  Focus must be seen by everyone.

- **Token** `radius.control` → `close.radius` 0.375rem :label[By scheme]{tone="info"}

  - **Pick** radius.6: Clear, slightly rounded controls.

- **Token** `size.icon` → `close.icon-size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20

- **Token** `color.text.secondary` → `close.label` #333333 · dark #D6D6D6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 12.63:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.700: supporting text, 12.68:1 on surface.default, above the 7:1 floor.

- **Token** `color.surface.highlight` → `close.background.hover` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.

  - **Pick** neutral.100, two steps darker than the surfaces it sits on (neutral.0), so the item under the pointer or the keyboard reads as a band without lifting off the page. It skips neutral.50, the page canvas, so a menu item never matches the page behind it.
  - **Dark** neutral.100, one step lighter than the surfaces it sits on (neutral.50), so the item under the pointer or the keyboard reads as a band on the menu and on cards.
  - **Shares the step with** surface.sunken, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.highlight.

- **Token** `color.border.focus` → `close.focus-ring.color` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** blue.light.600: the focus ring, so the keyboard's place is never lost, 7.26:1 on surface.default, above the 3:1 floor.
  - **Dark** blue.dark.600: the focus ring, so the keyboard's place is never lost, 8.74:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `close.focus-ring.width` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3

- **Token** `border-width.focus-offset` → `close.focus-offset` 2px

  - **Pick** border-width.2
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `sheet`.
- **From a terminal:** `npx open-ds anatomy accessible-first sheet`
