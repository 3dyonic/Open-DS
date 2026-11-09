---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 13.5
slug: "card/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Card in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the card apart to show how design decisions become the parts you see. You don't need it to use the card: [its own page](../card) has everything you need to build.

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

![Card, every part numbered](/anatomy/dense-data/card/stage.png)

*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Card** required :label[Containment] :label[Grouping]
  - **1** **Surface** required :label[By scheme]{tone="info"} :label[Containment] :label[Grouping]
  - **2** **Border** required :label[By scheme]{tone="info"} :label[Containment]
  - **3** **Shadow** required :label[By scheme]{tone="info"} :label[Layering]
- **Header** optional :label[Hierarchy]
  - **4** **Title** optional :label[By scheme]{tone="info"} :label[Hierarchy] :label[Readability]
  - **5** **Description** optional :label[By scheme]{tone="info"} :label[Readability]
- **6** **Content** optional :label[By scheme]{tone="info"} :label[Grouping]
- **Status** optional · shown by Badge :label[Meaning]
- **7** **Footer** optional :label[By scheme]{tone="info"} :label[Grouping] :label[Affordance]
- **Actions** optional · shown by Button :label[Affordance]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2-3" title="Surface, border and shadow" note="Parts 1, 2, 3"}
![Surface, border and shadow: 1, 2, 3](/anatomy/dense-data/card/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Only what floats

  Only menus and dialogs float; cards use lines.

- **Answer** Elevation · What separates groups on the page? → Lines

  Thin lines guide the eye along rows.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Rule** For a card on the page, use A hairline border, no shadow. Don't use a shadow.

  On a busy grid, lines separate. Shadows blur the edges.

- **Token** `color.surface.default` → `background` #FFFFFF · dark #161B23 :label[By scheme]{tone="info"}

  The base fill for content.

  - **Pick** neutral.0: the base for content; body text reads 17.28:1 on it, above the 4.5:1 floor.
  - **Dark** neutral.50: the base for content; body text reads 16.26:1 on it, above the 4.5:1 floor.
  - **Shares the step with** surface.raised, action.secondary. Changing this pick moves only what reads color.surface.default.

- **Token** `radius.container` → `radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Small corners keep dense rows straight.

- **Token** `space.inset.container` → `padding` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16

- **Token** `color.border.default` → `border` #DDE2EA · dark #3D4655 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.22:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.82:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `border-width.default` → `border-width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1

- **Token** `elevation.card` → `shadow` 0px 0px 0px, #00000000 :label[By scheme]{tone="info"}

  - **Pick** shadow.none: Only menus and dialogs float; cards use lines.
:::

:::panel{id="part-4-5" title="Header" note="Parts 4, 5"}
![Header: 4, 5](/anatomy/dense-data/card/card-2.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Answer** Typography · How large is body text? → Small

  Small body text fits more rows on the screen.

- **Token** `type.heading.font-family` → `title.font-family` "IBM Plex Sans", system-ui, sans-serif :label[By scheme]{tone="info"}

  - **Pick** ibm-plex-sans for heading text: IBM Plex Sans for every text role and IBM Plex Mono for data: exact and quiet, so the numbers stay the hero.

- **Token** `type.heading.font-size` → `title.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `type.heading.font-weight` → `title.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600

- **Token** `space.gap.tight` → `header.gap` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** space.4

- **Token** `color.text.secondary` → `description.label` #3D4655 · dark #C4CBD6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 9.52:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 10.58:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.body.font-size` → `description.font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14
:::

:::panel{id="part-6-7" title="Content and footer" note="Parts 6, 7"}
![Content and footer: 6, 7](/anatomy/dense-data/card/card-3.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For items that belong together, use space.gap.tight. Don't use space.gap.group.

  Things that belong together sit close.

- **Token** `space.gap.default` → `gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8

- **Token** `space.gap.default` → `content.gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8

- **Token** `space.gap.default` → `footer.gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `card`.
- **From a terminal:** `npx open-ds anatomy dense-data card`
