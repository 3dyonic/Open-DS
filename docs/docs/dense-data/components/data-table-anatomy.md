---
composite_data: "./data-table-anatomy.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 21.5
slug: "data-table/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Data table in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the data table apart to show how design decisions become the parts you see. You don't need it to use the data table: [its own page](../data-table) has everything you need to build.

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
![Data table, every part numbered](/anatomy/dense-data/data-table/stage.png)
*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

::anatomy-legend{id="data-table"}
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2-3-4-5" title="Toolbar" note="Parts 1, 2, 3, 4, 5" media="side"}
![Toolbar: 1, 2, 3, 4, 5](/anatomy/dense-data/data-table/card-1.png)

:label[Affordance] :label[Feedback]

::anatomy-steps{id="data-table/card-1"}
:::

:::panel{id="part-6-7-8" title="Header" note="Parts 6, 7, 8" media="side"}
![Header: 6, 7, 8](/anatomy/dense-data/data-table/card-2.png)

:label[Hierarchy] :label[Grouping] :label[Affordance]

::anatomy-steps{id="data-table/card-2"}
:::

:::panel{id="part-9-10" title="Row" note="Parts 9, 10" media="side"}
![Row: 9, 10](/anatomy/dense-data/data-table/card-3.png)

:label[Readability] :label[Reach]

::anatomy-steps{id="data-table/card-3"}
:::

:::panel{id="part-11" title="Highlight row" note="Parts 11" media="side"}
![Highlight row: 11](/anatomy/dense-data/data-table/card-4.png)

:label[Feedback]

::anatomy-steps{id="data-table/card-4"}
:::

:::panel{id="part-12-13" title="Selected row" note="Parts 12, 13" media="side"}
![Selected row: 12, 13](/anatomy/dense-data/data-table/card-5.png)

:label[Meaning] :label[Feedback]

::anatomy-steps{id="data-table/card-5"}
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `data-table`.
- **From a terminal:** `npx open-ds anatomy dense-data data-table`
