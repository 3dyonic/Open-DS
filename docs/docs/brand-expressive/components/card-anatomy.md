---
composite_data: "./card-anatomy.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 13.5
slug: "card/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Card in Brand expressive."
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
![Card, every part numbered](/anatomy/brand-expressive/card/stage.png)
*Brand expressive, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

::anatomy-legend{id="card"}
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2-3" title="Surface, border and shadow" note="Parts 1, 2, 3" media="side"}
![Surface, border and shadow: 1, 2, 3](/anatomy/brand-expressive/card/card-1.png)

:label[Containment] :label[Layering]

::anatomy-steps{id="card/card-1"}
:::

:::panel{id="part-4-5" title="Header" note="Parts 4, 5" media="side"}
![Header: 4, 5](/anatomy/brand-expressive/card/card-2.png)

:label[Hierarchy] :label[Readability]

::anatomy-steps{id="card/card-2"}
:::

:::panel{id="part-6-7" title="Content and footer" note="Parts 6, 7" media="side"}
![Content and footer: 6, 7](/anatomy/brand-expressive/card/card-3.png)

:label[Grouping]

::anatomy-steps{id="card/card-3"}
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `card`.
- **From a terminal:** `npx open-ds anatomy brand-expressive card`
