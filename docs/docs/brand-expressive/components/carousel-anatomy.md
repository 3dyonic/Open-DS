---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 14.5
slug: "carousel/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Carousel in Brand expressive."
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
![Carousel, every part numbered](/anatomy/brand-expressive/carousel/stage.png)
*Brand expressive, light, drawn in Figma from the scheme's tokens.*

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
![Slides: 1, 2](/anatomy/brand-expressive/carousel/card-1.png)

:label[Containment] :label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Air keeps big type readable.

- **Token** `component-spacing-map.x4` → `item.padding-left` 2rem :label[By scheme]{tone="info"}

  - **Pick** space.32

- **Token** `component-spacing-map.x4` → `item.padding-top` 2rem :label[By scheme]{tone="info"}

  - **Pick** space.32
:::

:::panel{id="part-3-4" title="Previous and next" note="Parts 3, 4" media="side"}
![Previous and next: 3, 4](/anatomy/brand-expressive/carousel/card-2.png)

:label[Affordance] :label[Reach]

- **Answer** Accessibility · What is the smallest target? → Touch size

  Visitors come from social posts on phones.

- **Answer** Shape · What should control corners say? → Pill

  Pill controls feel playful.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Most visitors arrive on phones, and a compact control is too small for a thumb.

- **Rule** For an icon with no label, use Not used: always add a word. Don't use an icon button with a hover hint.

  On phones, hover hints never show; a word says what will happen.

- **Token** `size.control.default` → `previous.size` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `radius.round` → `previous.radius` 50%

  - **Pick** radius.round

- **Token** `size.control.default` → `next.size` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `radius.round` → `next.radius` 50%

  - **Pick** radius.round
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `carousel`.
- **From a terminal:** `npx open-ds anatomy brand-expressive carousel`
