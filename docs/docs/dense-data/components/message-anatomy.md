---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 39.5
slug: "message/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Message in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the message apart to show how design decisions become the parts you see. You don't need it to use the message: [its own page](../message) has everything you need to build.

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

![Message, every part numbered](/anatomy/dense-data/message/stage.png)

*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Message** required :label[Grouping]
  - **Avatar** optional · shown by Avatar :label[Meaning]
  - **1** **Author** required :label[By scheme]{tone="info"} :label[Hierarchy] :label[Emphasis]
  - **2** **Time** optional :label[By scheme]{tone="info"} :label[Readability]
  - **3** **Body** required :label[By scheme]{tone="info"} :label[Readability]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Author" note="Parts 1"}
![Author: 1](/anatomy/dense-data/message/card-1.png)

:label[Hierarchy] :label[Emphasis]

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Answer** Typography · How many steps does the type scale take? → Only the steps the screens need

  A screen full of records stays calm with only the sizes it needs.

- **Token** `type.label.font-weight` → `author.font-weight` 500 :label[By scheme]{tone="info"}

  - **Pick** font.weight.500
:::

:::panel{id="part-2" title="Time" note="Parts 2"}
![Time: 2](/anatomy/dense-data/message/card-2.png)

:label[Readability]

- **Answer** Typography · How large is body text? → Small

  Small body text fits more rows on the screen.

- **Answer** Color · How saturated is the palette? → Muted

  Muted color keeps attention on the data.

- **Token** `color.text.muted` → `time.label` #535D6D · dark #969FAD :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.66:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.47:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.caption.font-size` → `time.font-size` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** font.size.12

- **Token** `type.caption.line-height` → `time.line-height` 1.45 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_45
:::

:::panel{id="part-3" title="Body" note="Parts 3"}
![Body: 3](/anatomy/dense-data/message/card-3.png)

:label[Readability]

- **Answer** Typography · How large is body text? → Small

  Small body text fits more rows on the screen.

- **Rule** For paragraph or help text, use type.body. Don't use type.label.

  Help text is a sentence read in passing. Body size reads quickly; the label style is made for short names, not sentences.

- **Token** `type.body.font-size` → `font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `type.body.line-height` → `line-height` 1.45 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_45
:::

:::panel{id="part-1-2-3" title="Header and body" note="Parts 1, 2, 3"}
![Header and body: 1, 2, 3](/anatomy/dense-data/message/card-4.png)

:label[Grouping]

- **Answer** Spacing · Which spacing roles does it need? → Gaps, insets and row heights

  Row height is a decision of its own in a table product.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For items that belong together, use space.gap.tight. Don't use space.gap.group.

  Things that belong together sit close.

- **Token** `component-spacing-map.x3` → `gap` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12

- **Token** `space.gap.tight` → `content.gap` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** space.4

- **Token** `space.gap.default` → `header.gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `message`.
- **From a terminal:** `npx open-ds anatomy dense-data message`
