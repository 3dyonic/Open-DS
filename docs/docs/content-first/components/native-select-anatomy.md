---
composite_data: "./native-select-anatomy.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 41.5
slug: "native-select/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Native select in Content first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the native select apart to show how design decisions become the parts you see. You don't need it to use the native select: [its own page](../native-select) has everything you need to build.

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
![Native select, every part numbered](/anatomy/content-first/native-select/stage.png)
*Content first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

::anatomy-legend{id="native-select"}
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Field" note="Parts 1" media="side"}
![Field: 1](/anatomy/content-first/native-select/card-1.png)

:label[Affordance] :label[Reach]

::anatomy-steps{id="native-select/card-1"}
:::

:::panel{id="part-2" title="Selected value" note="Parts 2" media="side"}
![Selected value: 2](/anatomy/content-first/native-select/card-2.png)

:label[Readability]

::anatomy-steps{id="native-select/card-2"}
:::

:::panel{id="part-3" title="Chevron" note="Parts 3" media="side"}
![Chevron: 3](/anatomy/content-first/native-select/card-3.png)

:label[Affordance]

::anatomy-steps{id="native-select/card-3"}
:::

:::panel{id="part-4" title="Focus ring" note="Parts 4" media="side"}
![Focus ring: 4](/anatomy/content-first/native-select/card-4.png)

:label[Focus]

::anatomy-steps{id="native-select/card-4"}
:::

:::panel{id="part-5" title="Invalid field" note="Parts 5" media="side"}
![Invalid field: 5](/anatomy/content-first/native-select/card-5.png)

:label[Meaning] :label[Feedback]

::anatomy-steps{id="native-select/card-5"}
:::

:::panel{id="part-6" title="Disabled field" note="Parts 6" media="side"}
![Disabled field: 6](/anatomy/content-first/native-select/card-6.png)

:label[Feedback]

::anatomy-steps{id="native-select/card-6"}
:::

:::panel{id="part-7" title="Small select" note="Parts 7" media="side"}
![Small select: 7](/anatomy/content-first/native-select/card-7.png)

:label[Reach]

::anatomy-steps{id="native-select/card-7"}
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `native-select`.
- **From a terminal:** `npx open-ds anatomy content-first native-select`
