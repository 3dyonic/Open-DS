---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 36.5
slug: "label/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Label in Brand expressive."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the label apart to show how design decisions become the parts you see. You don't need it to use the label: [its own page](../label) has everything you need to build.

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

![Label, every part numbered](/anatomy/brand-expressive/label/stage.png)

*Brand expressive, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Label text** required :label[By scheme]{tone="info"} :label[Readability] :label[Hierarchy]
- **2** **Gap to its mark** optional :label[By scheme]{tone="info"} :label[Grouping]
- **Field** required · shown by Input :label[Affordance]
- **Checkbox** optional · shown by Checkbox :label[Affordance]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Label text" note="Parts 1"}
![Label text: 1](/anatomy/brand-expressive/label/card-1.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · How large is body text? → Regular

  Regular body; the display does the shouting.

- **Answer** Typography · Which text roles does it need? → Core and expressive display

  A big expressive display role carries the brand.

- **Rule** For field label or column header, use type.label. Don't use type.caption.

  Labels stay readable on vivid color.

- **Token** `type.label.font-size` → `font-size` 0.9375rem :label[By scheme]{tone="info"}

  - **Pick** font.size.15

- **Token** `type.label.font-weight` → `font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700

- **Token** `type.label.font-family` → `font-family` "DM Sans", system-ui, sans-serif :label[By scheme]{tone="info"}

  - **Pick** dm-sans for label text: Bricolage Grotesque for display and headings, DM Sans for text: loud where the brand speaks, easy where people read.

- **Token** `type.label.line-height` → `line-height` 1.1 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_1
:::

:::panel{id="part-1" title="Text color" note="Parts 1"}
![Text color: 1](/anatomy/brand-expressive/label/card-2.png)

:label[Readability]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA, checked on every vivid color.

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Brand accents are part of the message.

- **Rule** For field label or column header, use type.label. Don't use type.caption.

  Labels stay readable on vivid color.

- **Token** `color.text.primary` → `label` #1F1411 · dark #FFF8F3 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.0:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.12:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.
:::

:::panel{id="part-2" title="Gap to its mark" note="Parts 2"}
![Gap to its mark: 2](/anatomy/brand-expressive/label/card-3.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Air keeps big type readable.

- **Token** `space.gap.default` → `gap` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `label`.
- **From a terminal:** `npx open-ds anatomy brand-expressive label`
