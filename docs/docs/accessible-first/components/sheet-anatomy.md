---
composite_data: "./sheet-anatomy.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 50.5
slug: "sheet/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Sheet in Accessible first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the sheet apart to show how design decisions become the parts you see. You don't need it to use the sheet: [its own page](../sheet) has everything you need to build.

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
![Sheet, every part numbered](/anatomy/accessible-first/sheet/stage.png)
*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

::anatomy-legend{id="sheet"}
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Panel and scrim" note="Parts 1, 2" media="side"}
![Panel and scrim: 1, 2](/anatomy/accessible-first/sheet/card-1.png)

:label[Containment] :label[Layering]

::anatomy-steps{id="sheet/card-1"}
:::

:::panel{id="part-2-3-6" title="Room inside the panel" note="Parts 2, 3, 6" media="side"}
![Room inside the panel: 2, 3, 6](/anatomy/accessible-first/sheet/card-2.png)

:label[Containment] :label[Grouping]

::anatomy-steps{id="sheet/card-2"}
:::

:::panel{id="part-4-5" title="Title and description" note="Parts 4, 5" media="side"}
![Title and description: 4, 5](/anatomy/accessible-first/sheet/card-3.png)

:label[Hierarchy] :label[Readability]

::anatomy-steps{id="sheet/card-3"}
:::

:::panel{id="part-6" title="Footer" note="Parts 6" media="side"}
![Footer: 6](/anatomy/accessible-first/sheet/card-4.png)

:label[Grouping] :label[Reach]

::anatomy-steps{id="sheet/card-4"}
:::

:::panel{id="part-7-8-9" title="Close button" note="Parts 7, 8, 9" media="side"}
![Close button: 7, 8, 9](/anatomy/accessible-first/sheet/card-5.png)

:label[Affordance] :label[Reach] :label[Feedback] :label[Focus]

::anatomy-steps{id="sheet/card-5"}
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `sheet`.
- **From a terminal:** `npx open-ds anatomy accessible-first sheet`
