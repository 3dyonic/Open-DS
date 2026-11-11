---
composite_data: "./menubar-anatomy.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 38.5
slug: "menubar/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Menubar in Brand expressive."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the menubar apart to show how design decisions become the parts you see. You don't need it to use the menubar: [its own page](../menubar) has everything you need to build.

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
![Menubar, every part numbered](/anatomy/brand-expressive/menubar/stage.png)
*Brand expressive, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

::anatomy-legend{id="menubar"}
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Bar" note="Parts 1, 2" media="side"}
![Bar: 1, 2](/anatomy/brand-expressive/menubar/card-1.png)

:label[Containment] :label[Grouping] :label[Readability]

::anatomy-steps{id="menubar/card-1"}
:::

:::panel{id="part-3" title="Open trigger" note="Parts 3" media="side"}
![Open trigger: 3](/anatomy/brand-expressive/menubar/card-2.png)

:label[Feedback]

::anatomy-steps{id="menubar/card-2"}
:::

:::panel{id="part-4-5" title="Surface and shadow" note="Parts 4, 5" media="side"}
![Surface and shadow: 4, 5](/anatomy/brand-expressive/menubar/card-3.png)

:label[Containment] :label[Layering]

::anatomy-steps{id="menubar/card-3"}
:::

:::panel{id="part-6-7" title="Item" note="Parts 6, 7" media="side"}
![Item: 6, 7](/anatomy/brand-expressive/menubar/card-4.png)

:label[Readability] :label[Reach] :label[Meaning]

::anatomy-steps{id="menubar/card-4"}
:::

:::panel{id="part-8" title="Highlight fill" note="Parts 8" media="side"}
![Highlight fill: 8](/anatomy/brand-expressive/menubar/card-5.png)

:label[Feedback] :label[Focus]

::anatomy-steps{id="menubar/card-5"}
:::

:::panel{id="part-9" title="Destructive item" note="Parts 9" media="side"}
![Destructive item: 9](/anatomy/brand-expressive/menubar/card-6.png)

:label[Meaning] :label[Emphasis]

::anatomy-steps{id="menubar/card-6"}
:::

:::panel{id="part-10" title="Separator" note="Parts 10" media="side"}
![Separator: 10](/anatomy/brand-expressive/menubar/card-7.png)

:label[Grouping]

::anatomy-steps{id="menubar/card-7"}
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `menubar`.
- **From a terminal:** `npx open-ds anatomy brand-expressive menubar`
