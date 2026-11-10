---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 13.5
slug: "card/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Card in Content first."
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

:::panel{media="wide"}
![Card, every part numbered](/anatomy/content-first/card/stage.png)
*Content first, light, drawn in Figma from the scheme's tokens.*

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
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2-3" title="Surface, border and shadow" note="Parts 1, 2, 3" media="side"}
![Surface, border and shadow: 1, 2, 3](/anatomy/content-first/card/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Elevation · What rises above the page? → Only what floats

  Only menus and dialogs float.

- **Answer** Elevation · What separates groups on the page? → Space

  Space separates groups; lines would interrupt reading.

- **Answer** Shape · What should control corners say? → Rounded

  Rounded corners feel friendly.

- **Rule** For a card on the page, use A border, no shadow. Don't use a strong shadow.

  Cards stay flat on the page; shadows are for floating things.

- **Token** `color.surface.default` → `background` #FFFFFF · dark #1F1B16 :label[By scheme]{tone="info"}

  The base fill for content.

  - **Pick** neutral.0: the base for content; body text reads 17.12:1 on it, above the 4.5:1 floor.
  - **Dark** neutral.50: the base for content; body text reads 16.84:1 on it, above the 4.5:1 floor.
  - **Shares the step with** surface.raised, action.secondary. Changing this pick moves only what reads color.surface.default.

- **Token** `radius.surface` → `radius` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** radius.12: Rounded corners feel friendly.

- **Token** `space.inset.container` → `padding` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `color.border.default` → `border` #E4DDD0 · dark #4A4339 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.33:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.76:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `border-width.default` → `border-width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1

- **Token** `elevation.card` → `shadow` 0px 0px 0px, #00000000 :label[By scheme]{tone="info"}

  - **Pick** shadow.none: Only menus and dialogs float.
:::

:::panel{id="part-4-5" title="Header" note="Parts 4, 5" media="side"}
![Header: 4, 5](/anatomy/content-first/card/card-2.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and editorial display

  A lead and a display role open articles.

- **Answer** Typography · How large is body text? → Large

  Large body text is easy on the eyes.

- **Token** `type.heading.font-family` → `title.font-family` "Source Serif 4", Georgia, serif :label[By scheme]{tone="info"}

  - **Pick** source-serif-4 for heading text: Source Serif 4 for reading and headings, Inter for labels and captions: a good magazine's text with a quiet interface.

- **Token** `type.heading.font-size` → `title.font-size` 1.75rem :label[By scheme]{tone="info"}

  - **Pick** font.size.28

- **Token** `type.heading.font-weight` → `title.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600

- **Token** `space.gap.tight` → `header.gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8

- **Token** `color.text.secondary` → `description.label` #4A4339 · dark #CFC6B6 :label[By scheme]{tone="info"}

  Supporting text.

  - **Pick** neutral.700: supporting text, 9.75:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.500: supporting text, 10.11:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.body.font-size` → `description.font-size` 1.125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.18
:::

:::panel{id="part-6-7" title="Content and footer" note="Parts 6, 7" media="side"}
![Content and footer: 6, 7](/anatomy/content-first/card/card-3.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Text needs air even inside a group.

- **Token** `space.gap.default` → `gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16

- **Token** `space.gap.default` → `content.gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16

- **Token** `space.gap.default` → `footer.gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `card`.
- **From a terminal:** `npx open-ds anatomy content-first card`
