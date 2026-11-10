---
composite_data: "./command-anatomy.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 19.5
slug: "command/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Command in Brand expressive."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the command menu apart to show how design decisions become the parts you see. You don't need it to use the command menu: [its own page](../command) has everything you need to build.

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
![Command, every part numbered](/anatomy/brand-expressive/command/stage.png)
*Brand expressive, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

::anatomy-legend{id="command"}
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Panel" note="Parts 1" media="side"}
![Panel: 1](/anatomy/brand-expressive/command/card-1.png)

:label[Containment]

::anatomy-steps{id="command/card-1"}
:::

:::panel{id="part-2-3-4" title="Search field" note="Parts 2, 3, 4" media="side"}
![Search field: 2, 3, 4](/anatomy/brand-expressive/command/card-2.png)

:label[Affordance] :label[Reach] :label[Readability]

::anatomy-steps{id="command/card-2"}
:::

:::panel{id="part-5" title="Group heading" note="Parts 5" media="side"}
![Group heading: 5](/anatomy/brand-expressive/command/card-3.png)

:label[Hierarchy] :label[Grouping]

::anatomy-steps{id="command/card-3"}
:::

:::panel{id="part-6-7" title="Item" note="Parts 6, 7" media="side"}
![Item: 6, 7](/anatomy/brand-expressive/command/card-4.png)

:label[Readability] :label[Reach] :label[Meaning]

::anatomy-steps{id="command/card-4"}
:::

:::panel{id="part-8" title="Highlight fill" note="Parts 8" media="side"}
![Highlight fill: 8](/anatomy/brand-expressive/command/card-5.png)

:label[Feedback] :label[Focus]

::anatomy-steps{id="command/card-5"}
:::

:::panel{id="part-9" title="Separator" note="Parts 9" media="side"}
![Separator: 9](/anatomy/brand-expressive/command/card-6.png)

:label[Grouping]

::anatomy-steps{id="command/card-6"}
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `command`.
- **From a terminal:** `npx open-ds anatomy brand-expressive command`
