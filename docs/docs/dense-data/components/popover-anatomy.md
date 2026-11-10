---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 43.5
slug: "popover/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Popover in Dense data."
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
![Popover, every part numbered](/anatomy/dense-data/popover/stage.png)
*Dense data, light, drawn in Figma from the scheme's tokens.*

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
![Surface, border and shadow: 1, 2, 3](/anatomy/dense-data/popover/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Only what floats

  Only menus and dialogs float; cards use lines.

- **Answer** Elevation · How soft are shadows? → Subtle

  Subtle shadows keep the grid crisp.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Rule** For a menu or dialog, use elevation.overlay and a dimmed page for dialogs. Don't use a border only.

  Floating things need a shadow so they read as on top.

- **Token** `color.surface.raised` → `content.background` #FFFFFF · dark #161B23 :label[By scheme]{tone="info"}

  Fills that float above content.

  - **Pick** neutral.0, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill.
  - **Dark** neutral.50, the same as content (surface.default): a menu stands out by its edge and its one shadow, not by its fill, as in light.
  - **Shares the step with** surface.default, action.secondary. Changing this pick moves only what reads color.surface.raised.

- **Token** `radius.surface` → `content.radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Small corners keep dense rows straight.

- **Token** `color.border.default` → `content.border` #DDE2EA · dark #3D4655 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.22:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.82:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `border-width.default` → `content.border-width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1

- **Token** `elevation.overlay` → `content.shadow` 0px 8px 24px, #0D111729 · dark 0px 8px 24px, #00000080 :label[By scheme]{tone="info"}

  - **Pick** shadow.overlay: Subtle shadows keep the grid crisp.
  - **Dark** shadow.overlay-dark: Subtle shadows keep the grid crisp.

- **Token** `space.inset.container` → `content.padding` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

:::panel{id="part-4-5" title="Header" note="Parts 4, 5" media="side"}
![Header: 4, 5](/anatomy/dense-data/popover/card-2.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Answer** Typography · How large is body text? → Small

  Small body text fits more rows on the screen.

- **Rule** For paragraph or help text, use type.body. Don't use type.label.

  Help text is a sentence read in passing. Body size reads quickly; the label style is made for short names, not sentences.

- **Token** `type.body.font-size` → `header.font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `type.body.line-height` → `header.line-height` 1.45 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_45

- **Token** `space.gap.tight` → `header.gap` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** space.4

- **Token** `type.label.font-weight` → `title.font-weight` 500 :label[By scheme]{tone="info"}

  - **Pick** font.weight.500

- **Token** `color.text.muted` → `description.label` #535D6D · dark #969FAD :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.66:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.47:1 on surface.default, above the 4.5:1 floor.
:::

:::panel{id="part-6" title="Offset" note="Parts 6" media="side"}
![Offset: 6](/anatomy/dense-data/popover/card-3.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For items that belong together, use space.gap.tight. Don't use space.gap.group.

  Things that belong together sit close.

- **Token** `space.gap.tight` → `overlay.offset` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** space.4
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `popover`.
- **From a terminal:** `npx open-ds anatomy dense-data popover`
