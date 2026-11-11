---
composite_data: "./select-anatomy.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 49.5
slug: "select/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Select in Brand expressive."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the select apart to show how design decisions become the parts you see. You don't need it to use the select: [its own page](../select) has everything you need to build.

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
![Select, every part numbered](/anatomy/brand-expressive/select/stage.png)
*Brand expressive, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

::anatomy-legend{id="select"}
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2-3" title="Trigger" note="Parts 1, 2, 3" media="side"}
![Trigger: 1, 2, 3](/anatomy/brand-expressive/select/card-1.png)

:label[Containment] :label[Affordance] :label[Readability]

::anatomy-steps{id="select/card-1"}
:::

:::panel{id="part-4" title="Focus ring" note="Parts 4" media="side"}
![Focus ring: 4](/anatomy/brand-expressive/select/card-2.png)

:label[Focus]

::anatomy-steps{id="select/card-2"}
:::

:::panel{id="part-5" title="Invalid border" note="Parts 5" media="side"}
![Invalid border: 5](/anatomy/brand-expressive/select/card-3.png)

:label[Meaning] :label[Feedback]

::anatomy-steps{id="select/card-3"}
:::

:::panel{id="part-6" title="Disabled trigger" note="Parts 6" media="side"}
![Disabled trigger: 6](/anatomy/brand-expressive/select/card-4.png)

:label[Feedback]

::anatomy-steps{id="select/card-4"}
:::

:::panel{id="part-7-8" title="List surface and shadow" note="Parts 7, 8" media="side"}
![List surface and shadow: 7, 8](/anatomy/brand-expressive/select/card-5.png)

:label[Containment] :label[Layering]

::anatomy-steps{id="select/card-5"}
:::

:::panel{id="part-9-11" title="Option" note="Parts 9, 11" media="side"}
![Option: 9, 11](/anatomy/brand-expressive/select/card-6.png)

:label[Readability] :label[Reach] :label[Meaning]

::anatomy-steps{id="select/card-6"}
:::

:::panel{id="part-10" title="Highlight fill" note="Parts 10" media="side"}
![Highlight fill: 10](/anatomy/brand-expressive/select/card-7.png)

:label[Feedback] :label[Focus]

::anatomy-steps{id="select/card-7"}
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `select`.
- **From a terminal:** `npx open-ds anatomy brand-expressive select`
