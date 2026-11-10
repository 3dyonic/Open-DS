---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 43.5
slug: "popover/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Popover in Brand expressive."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the popover apart to show how design decisions become the parts you see. You don't need it to use the popover: [its own page](../popover) has everything you need to build.

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

![Popover, every part numbered](/anatomy/brand-expressive/popover/stage.png)

*Brand expressive, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Trigger** required · shown by Button :label[Affordance]
- **Panel** required :label[Containment]
  - **1** **Surface** required :label[By scheme]{tone="info"} :label[Containment] :label[Layering]
  - **2** **Border** required :label[By scheme]{tone="info"} :label[Containment]
  - **3** **Shadow** required :label[By scheme]{tone="info"} :label[Layering]
- **Header** optional :label[Hierarchy]
  - **4** **Title** optional :label[By scheme]{tone="info"} :label[Hierarchy] :label[Readability]
  - **5** **Description** optional :label[By scheme]{tone="info"} :label[Readability]
- **6** **Offset** required :label[By scheme]{tone="info"} :label[Grouping]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2-3" title="Surface, border and shadow" note="Parts 1, 2, 3"}
![Surface, border and shadow: 1, 2, 3](/anatomy/brand-expressive/popover/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Cards too

  Cards lift to feel like objects.

- **Answer** Elevation · How soft are shadows? → Pronounced

  Pronounced shadows add depth.

- **Answer** Shape · What should control corners say? → Pill

  Pill controls feel playful.

- **Rule** For a menu or dialog, use elevation.overlay and a dimmed page. Don't use no shadow.

  Strong depth shows a menu or dialog sits above vivid sections. Without a shadow it blends into the color blocks.

- **Token** `color.surface.raised` → `content.background` #FFFFFF · dark #1F1411 :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `radius.surface` → `content.radius` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.24: Pill controls feel playful.

- **Token** `color.border.default` → `content.border` #F2DCCF · dark #4D3A33 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.26:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.69:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `border-width.default` → `content.border-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `elevation.overlay` → `content.shadow` 0px 24px 48px, #1F141133 · dark 0px 24px 48px, #00000099 :label[By scheme]{tone="info"}

  - **Pick** shadow.overlay: Pronounced shadows add depth.
  - **Dark** shadow.overlay-dark: Pronounced shadows add depth.

- **Token** `space.inset.container` → `content.padding` 2rem :label[By scheme]{tone="info"}

  - **Pick** space.32
:::

:::panel{id="part-4-5" title="Header" note="Parts 4, 5"}
![Header: 4, 5](/anatomy/brand-expressive/popover/card-2.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and expressive display

  A big expressive display role carries the brand.

- **Answer** Typography · How large is body text? → Regular

  Regular body; the display does the shouting.

- **Rule** For paragraph or help text, use type.body, short. Don't use long paragraphs.

  Short copy keeps the energy.

- **Token** `type.body.font-size` → `header.font-size` 1.0625rem :label[By scheme]{tone="info"}

  - **Pick** font.size.17

- **Token** `type.body.line-height` → `header.line-height` 1.55 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_55

- **Token** `space.gap.tight` → `header.gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8

- **Token** `type.label.font-weight` → `title.font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700

- **Token** `color.text.muted` → `description.label` #6B544A · dark #B5988A :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.71:1 on surface.default, above the 4.5:1 floor.
:::

:::panel{id="part-6" title="Offset" note="Parts 6"}
![Offset: 6](/anatomy/brand-expressive/popover/card-3.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Air keeps big type readable.

- **Token** `space.gap.tight` → `overlay.offset` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `popover`.
- **From a terminal:** `npx open-ds anatomy brand-expressive popover`
