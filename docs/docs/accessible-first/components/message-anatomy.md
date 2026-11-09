---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 38.5
slug: "message/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Message in Accessible first."
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

![Message, every part numbered](/anatomy/accessible-first/message/stage.png)

*Accessible first, light, drawn in Figma from the scheme's tokens.*

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
![Author: 1](/anatomy/accessible-first/message/card-1.png)

:label[Hierarchy] :label[Emphasis]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Answer** Typography · How many steps does the type scale take? → Only the steps the screens need

  Only the sizes the screens need, each clearly different.

- **Token** `type.label.font-weight` → `author.font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700
:::

:::panel{id="part-2" title="Time" note="Parts 2"}
![Time: 2](/anatomy/accessible-first/message/card-2.png)

:label[Readability]

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Answer** Color · How saturated is the palette? → Balanced

  Strong but not loud color.

- **Token** `color.text.muted` → `time.label` #595959 · dark #B4B4B4 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** border.strong, category.5, disabled.text. Changing this pick moves only what reads color.text.muted.

- **Token** `type.caption.font-size` → `time.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `type.caption.line-height` → `time.line-height` 1.6 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_6
:::

:::panel{id="part-3" title="Body" note="Parts 3"}
![Body: 3](/anatomy/accessible-first/message/card-3.png)

:label[Readability]

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Rule** For paragraph or help text, use type.body, short sentences. Don't use type.caption.

  Large text and short lines lower effort.

- **Token** `type.body.font-size` → `font-size` 1.1875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.19

- **Token** `type.body.line-height` → `line-height` 1.6 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_6
:::

:::panel{id="part-1-2-3" title="Header and body" note="Parts 1, 2, 3"}
![Header and body: 1, 2, 3](/anatomy/accessible-first/message/card-4.png)

:label[Grouping]

- **Answer** Spacing · Which spacing roles does it need? → Gaps, insets and row heights

  Large rows matter for touch and zoom.

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Generous space lowers mis-taps.

- **Token** `component-spacing-map.x3` → `gap` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** space.20

- **Token** `space.gap.tight` → `content.gap` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12

- **Token** `space.gap.default` → `header.gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `message`.
- **From a terminal:** `npx open-ds anatomy accessible-first message`
