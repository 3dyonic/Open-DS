---
composite_data: "./alert-dialog-anatomy.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 3.5
slug: "alert-dialog/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Alert dialog in Accessible first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the alert dialog apart to show how design decisions become the parts you see. You don't need it to use the alert dialog: [its own page](../alert-dialog) has everything you need to build.

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
![Alert dialog, every part numbered](/anatomy/accessible-first/alert-dialog/stage.png)
*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

::anatomy-legend{id="alert-dialog"}
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Panel and scrim" note="Parts 1, 2" media="side"}
![Panel and scrim: 1, 2](/anatomy/accessible-first/alert-dialog/card-1.png)

:label[Containment] :label[Layering]

::anatomy-steps{id="alert-dialog/card-1"}
:::

:::panel{id="part-2" title="Room inside the panel" note="Parts 2" media="side"}
![Room inside the panel: 2](/anatomy/accessible-first/alert-dialog/card-2.png)

:label[Containment] :label[Grouping]

::anatomy-steps{id="alert-dialog/card-2"}
:::

:::panel{id="part-4" title="Media" note="Parts 4" media="side"}
![Media: 4](/anatomy/accessible-first/alert-dialog/card-3.png)

:label[Meaning] :label[Emphasis]

::anatomy-steps{id="alert-dialog/card-3"}
:::

:::panel{id="part-3-5-6" title="The question" note="Parts 3, 5, 6" media="side"}
![The question: 3, 5, 6](/anatomy/accessible-first/alert-dialog/card-4.png)

:label[Hierarchy] :label[Readability]

::anatomy-steps{id="alert-dialog/card-4"}
:::

:::panel{id="part-7" title="Footer" note="Parts 7" media="side"}
![Footer: 7](/anatomy/accessible-first/alert-dialog/card-5.png)

:label[Grouping]

::anatomy-steps{id="alert-dialog/card-5"}
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `alert-dialog`.
- **From a terminal:** `npx open-ds anatomy accessible-first alert-dialog`
