---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 28.5
slug: "form/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Form in Multi-brand."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the form field apart to show how design decisions become the parts you see. You don't need it to use the form field: [its own page](../form) has everything you need to build.

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
![Form, every part numbered](/anatomy/multi-brand/form/stage.png)
*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Item** required :label[By scheme]{tone="info"} :label[Grouping]
- **Label** required · shown by Label :label[Readability]
- **Control** required · shown by Input :label[Affordance]
- **2** **Description** optional :label[By scheme]{tone="info"} :label[Readability] :label[Hierarchy]
- **3** **Label in error** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
- **4** **Error message** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Item" note="Parts 1" media="side"}
![Item: 1](/anatomy/multi-brand/form/card-1.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Rule** For items that belong together, use space.gap.default. Don't use brand-specific spacing.

  Spacing is shared across brands.

- **Token** `space.gap.default` → `item.gap` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12
:::

:::panel{id="part-2" title="Description" note="Parts 2" media="side"}
![Description: 2](/anatomy/multi-brand/form/card-2.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · How large is body text? → Regular

  Regular body size suits all brands.

- **Rule** For paragraph or help text, use type.body. Don't use type.caption.

  Regular body size suits every brand.

- **Token** `type.body.font-size` → `description.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `type.body.line-height` → `description.line-height` 1.5 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_5

- **Token** `color.text.muted` → `description.label` #4B5A6F · dark #96A3B5 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.97:1 on surface.default, above the 4.5:1 floor.
:::

:::panel{id="part-3" title="Label in error" note="Parts 3" media="side"}
![Label in error: 3](/anatomy/multi-brand/form/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Brand colors vary, so meaning needs a word.

- **Rule** For an error message, use color.status.danger and a sentence. Don't use the brand color.

  Status colors are shared, never branded.

- **Token** `color.status.danger` → `label.label` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.52:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

:::panel{id="part-4" title="Error message" note="Parts 4" media="side"}
![Error message: 4](/anatomy/multi-brand/form/card-4.png)

:label[Meaning] :label[Feedback]

- **Answer** Accessibility · How many signals carry each meaning? → Two: color and word

  Brand colors vary, so meaning needs a word.

- **Answer** Voice and tone · How does it sound? → Plain and direct

  The shared core is plain and direct.

- **Rule** For an error message, use color.status.danger and a sentence. Don't use the brand color.

  Status colors are shared, never branded.

- **Rule** For the words of an error, use Shared across brands: plain and specific. Don't use brand tone in errors.

  Errors read the same in every brand, so support can help anyone.

- **Token** `type.body.font-size` → `message.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `type.body.line-height` → `message.line-height` 1.5 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_5

- **Token** `color.status.danger` → `message.label` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.52:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `form`.
- **From a terminal:** `npx open-ds anatomy multi-brand form`
