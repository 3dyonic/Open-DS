---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 14.5
slug: "carousel/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Carousel in Multi-brand."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the carousel apart to show how design decisions become the parts you see. You don't need it to use the carousel: [its own page](../carousel) has everything you need to build.

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
![Carousel, every part numbered](/anatomy/multi-brand/carousel/stage.png)
*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Viewport** required :label[By scheme]{tone="info"} :label[Containment]
- **2** **Slide** required :label[By scheme]{tone="info"} :label[Grouping]
- **Slide content** required · shown by Card :label[Containment]
- **Controls** optional :label[Affordance] :label[Reach]
  - **3** **Previous button** optional :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
  - **4** **Next button** optional :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
  - **Disabled control** state · shown by Button :label[Feedback]
  - **Focus ring** state · shown by Button :label[Focus]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Slides" note="Parts 1, 2" media="side"}
![Slides: 1, 2](/anatomy/multi-brand/carousel/card-1.png)

:label[Containment] :label[Grouping]

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Rule** For items that belong together, use space.gap.default. Don't use brand-specific spacing.

  Spacing is shared across brands.

- **Token** `component-spacing-map.x4` → `item.padding-left` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `component-spacing-map.x4` → `item.padding-top` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-3-4" title="Previous and next" note="Parts 3, 4" media="side"}
![Previous and next: 3, 4](/anatomy/multi-brand/carousel/card-2.png)

:label[Affordance] :label[Reach]

- **Answer** Accessibility · What is the smallest target? → Touch size

  Customers sign up on phones.

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Customers are often on phones.

- **Rule** For an icon with no label, use Not used: always add a word; a popover explains a fee. Don't use an icon button with a hover hint.

  On touch screens hover hints never show; a word says what will happen.

- **Token** `size.control.default` → `previous.size` 2.75rem :label[By scheme]{tone="info"}

  - **Pick** size.44

- **Token** `radius.round` → `previous.radius` 50%

  - **Pick** radius.round

- **Token** `size.control.default` → `next.size` 2.75rem :label[By scheme]{tone="info"}

  - **Pick** size.44

- **Token** `radius.round` → `next.radius` 50%

  - **Pick** radius.round
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `carousel`.
- **From a terminal:** `npx open-ds anatomy multi-brand carousel`
