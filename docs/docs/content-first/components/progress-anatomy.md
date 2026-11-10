---
composite_data: "./progress-anatomy.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 44.5
slug: "progress/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Progress in Content first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the progress bar apart to show how design decisions become the parts you see. You don't need it to use the progress bar: [its own page](../progress) has everything you need to build.

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
![Progress, every part numbered](/anatomy/content-first/progress/stage.png)
*Content first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

::anatomy-legend{id="progress"}
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Track" note="Parts 1" media="side"}
![Track: 1](/anatomy/content-first/progress/card-1.png)

:label[Containment]

::anatomy-steps{id="progress/card-1"}
:::

:::panel{id="part-1" title="Corner" note="Parts 1" media="side"}
![Corner: 1](/anatomy/content-first/progress/card-2.png)

:label[Containment]

::anatomy-steps{id="progress/card-2"}
:::

:::panel{id="part-2" title="Indicator" note="Parts 2" media="side"}
![Indicator: 2](/anatomy/content-first/progress/card-3.png)

:label[Meaning] :label[Feedback]

::anatomy-steps{id="progress/card-3"}
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `progress`.
- **From a terminal:** `npx open-ds anatomy content-first progress`
