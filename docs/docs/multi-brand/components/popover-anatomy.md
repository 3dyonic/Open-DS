---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 43.5
slug: "popover/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Popover in Multi-brand."
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

:::panel{media="wide"}
![Popover, every part numbered](/anatomy/multi-brand/popover/stage.png)
*Multi-brand, light, drawn in Figma from the scheme's tokens.*

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
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2-3" title="Surface, border and shadow" note="Parts 1, 2, 3" media="side"}
![Surface, border and shadow: 1, 2, 3](/anatomy/multi-brand/popover/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Cards too

  Cards lift slightly to group offers.

- **Answer** Elevation · How soft are shadows? → Soft

  Soft shadows fit every brand.

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Rule** For a menu or dialog, use elevation.overlay and a dimmed page. Don't use no shadow.

  The shadow shows a menu or dialog floats above the page. Without it, it blends into the cards.

- **Token** `color.surface.raised` → `content.background` #FFFFFF · dark #0F172A :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `radius.surface` → `content.radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Rounded by default; each brand sets its own corner.

- **Token** `color.border.default` → `content.border` #E2E8F0 · dark #334155 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.18:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.72:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `border-width.default` → `content.border-width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1

- **Token** `elevation.overlay` → `content.shadow` 0px 12px 32px, #0F172A29 · dark 0px 12px 32px, #00000080 :label[By scheme]{tone="info"}

  - **Pick** shadow.overlay: Soft shadows fit every brand.
  - **Dark** shadow.overlay-dark: Soft shadows fit every brand.

- **Token** `space.inset.container` → `content.padding` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-4-5" title="Header" note="Parts 4, 5" media="side"}
![Header: 4, 5](/anatomy/multi-brand/popover/card-2.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  One set of roles across brands.

- **Answer** Typography · How large is body text? → Regular

  Regular body size suits all brands.

- **Rule** For paragraph or help text, use type.body. Don't use type.caption.

  Regular body size suits every brand.

- **Token** `type.body.font-size` → `header.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `type.body.line-height` → `header.line-height` 1.5 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_5

- **Token** `space.gap.tight` → `header.gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8

- **Token** `type.label.font-weight` → `title.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600

- **Token** `color.text.muted` → `description.label` #4B5A6F · dark #96A3B5 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.97:1 on surface.default, above the 4.5:1 floor.
:::

:::panel{id="part-6" title="Offset" note="Parts 6" media="side"}
![Offset: 6](/anatomy/multi-brand/popover/card-3.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Rule** For items that belong together, use space.gap.default. Don't use brand-specific spacing.

  Spacing is shared across brands.

- **Token** `space.gap.tight` → `overlay.offset` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `popover`.
- **From a terminal:** `npx open-ds anatomy multi-brand popover`
