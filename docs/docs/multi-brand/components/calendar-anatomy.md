---
composite_data: "./calendar-anatomy.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 12.5
slug: "calendar/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Calendar in Multi-brand."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the calendar apart to show how design decisions become the parts you see. You don't need it to use the calendar: [its own page](../calendar) has everything you need to build.

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
![Calendar, every part numbered](/anatomy/multi-brand/calendar/stage.png)
*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

::anatomy-legend{id="calendar"}
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Surface" note="Parts 1" media="side"}
![Surface: 1](/anatomy/multi-brand/calendar/card-1.png)

:label[Containment]

::anatomy-steps{id="calendar/card-1"}
:::

:::panel{id="part-2-3-4" title="Caption and month buttons" note="Parts 2, 3, 4" media="side"}
![Caption and month buttons: 2, 3, 4](/anatomy/multi-brand/calendar/card-2.png)

:label[Hierarchy] :label[Affordance]

::anatomy-steps{id="calendar/card-2"}
:::

:::panel{id="part-5" title="Weekdays" note="Parts 5" media="side"}
![Weekdays: 5](/anatomy/multi-brand/calendar/card-3.png)

:label[Readability] :label[Hierarchy]

::anatomy-steps{id="calendar/card-3"}
:::

:::panel{id="part-6" title="Day" note="Parts 6" media="side"}
![Day: 6](/anatomy/multi-brand/calendar/card-4.png)

:label[Reach] :label[Readability]

::anatomy-steps{id="calendar/card-4"}
:::

:::panel{id="part-7-8" title="Today and the selected day" note="Parts 7, 8" media="side"}
![Today and the selected day: 7, 8](/anatomy/multi-brand/calendar/card-5.png)

:label[Meaning] :label[Emphasis]

::anatomy-steps{id="calendar/card-5"}
:::

:::panel{id="part-9" title="Selected range" note="Parts 9" media="side"}
![Selected range: 9](/anatomy/multi-brand/calendar/card-6.png)

:label[Meaning] :label[Grouping]

::anatomy-steps{id="calendar/card-6"}
:::

:::panel{id="part-11" title="Day that cannot be picked" note="Parts 11" media="side"}
![Day that cannot be picked: 11](/anatomy/multi-brand/calendar/card-7.png)

:label[Feedback]

::anatomy-steps{id="calendar/card-7"}
:::

:::panel{id="part-12" title="Focus ring" note="Parts 12" media="side"}
![Focus ring: 12](/anatomy/multi-brand/calendar/card-8.png)

:label[Focus]

::anatomy-steps{id="calendar/card-8"}
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `calendar`.
- **From a terminal:** `npx open-ds anatomy multi-brand calendar`
