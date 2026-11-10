---
composite_data: "./item-anatomy.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 33.5
slug: "item/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Item in Content first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the item apart to show how design decisions become the parts you see. You don't need it to use the item: [its own page](../item) has everything you need to build.

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
![Item, every part numbered](/anatomy/content-first/item/stage.png)
*Content first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

::anatomy-legend{id="item"}
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Row" note="Parts 1" media="side"}
![Row: 1](/anatomy/content-first/item/card-1.png)

:label[Containment] :label[Reach]

::anatomy-steps{id="item/card-1"}
:::

:::panel{id="part-2" title="Media" note="Parts 2" media="side"}
![Media: 2](/anatomy/content-first/item/card-2.png)

:label[Meaning] :label[Hierarchy]

::anatomy-steps{id="item/card-2"}
:::

:::panel{id="part-3" title="Title" note="Parts 3" media="side"}
![Title: 3](/anatomy/content-first/item/card-3.png)

:label[Readability] :label[Hierarchy]

::anatomy-steps{id="item/card-3"}
:::

:::panel{id="part-4" title="Description" note="Parts 4" media="side"}
![Description: 4](/anatomy/content-first/item/card-4.png)

:label[Readability]

::anatomy-steps{id="item/card-4"}
:::

:::panel{id="part-5" title="Actions" note="Parts 5" media="side"}
![Actions: 5](/anatomy/content-first/item/card-5.png)

:label[Affordance] :label[Reach]

::anatomy-steps{id="item/card-5"}
:::

:::panel{id="part-6" title="Focus ring" note="Parts 6" media="side"}
![Focus ring: 6](/anatomy/content-first/item/card-6.png)

:label[Focus]

::anatomy-steps{id="item/card-6"}
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `item`.
- **From a terminal:** `npx open-ds anatomy content-first item`
