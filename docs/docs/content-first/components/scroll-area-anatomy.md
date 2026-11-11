---
composite_data: "./scroll-area-anatomy.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 48.5
slug: "scroll-area/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Scroll area in Content first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the scroll area apart to show how design decisions become the parts you see. You don't need it to use the scroll area: [its own page](../scroll-area) has everything you need to build.

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
![Scroll area, every part numbered](/anatomy/content-first/scroll-area/stage.png)
*Content first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

::anatomy-legend{id="scroll-area"}
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Scrollbar" note="Parts 1, 2" media="side"}
![Scrollbar: 1, 2](/anatomy/content-first/scroll-area/card-1.png)

:label[Reach] :label[Feedback] :label[Affordance]

::anatomy-steps{id="scroll-area/card-1"}
:::

:::panel{id="part-3" title="Focus ring" note="Parts 3" media="side"}
![Focus ring: 3](/anatomy/content-first/scroll-area/card-2.png)

:label[Focus]

::anatomy-steps{id="scroll-area/card-2"}
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `scroll-area`.
- **From a terminal:** `npx open-ds anatomy content-first scroll-area`
