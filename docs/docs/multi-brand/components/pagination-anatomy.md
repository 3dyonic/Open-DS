---
composite_data: "./pagination-anatomy.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 43.5
slug: "pagination/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Pagination in Multi-brand."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the pagination apart to show how design decisions become the parts you see. You don't need it to use the pagination: [its own page](../pagination) has everything you need to build.

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
![Pagination, every part numbered](/anatomy/multi-brand/pagination/stage.png)
*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

::anatomy-legend{id="pagination"}
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-6" title="Previous and next" note="Parts 1, 6" media="side"}
![Previous and next: 1, 6](/anatomy/multi-brand/pagination/card-1.png)

:label[Affordance] :label[Reach]

::anatomy-steps{id="pagination/card-1"}
:::

:::panel{id="part-2-3" title="Pages" note="Parts 2, 3" media="side"}
![Pages: 2, 3](/anatomy/multi-brand/pagination/card-2.png)

:label[Affordance] :label[Meaning]

::anatomy-steps{id="pagination/card-2"}
:::

:::panel{id="part-4-5" title="Ellipsis and gap" note="Parts 4, 5" media="side"}
![Ellipsis and gap: 4, 5](/anatomy/multi-brand/pagination/card-3.png)

:label[Grouping]

::anatomy-steps{id="pagination/card-3"}
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `pagination`.
- **From a terminal:** `npx open-ds anatomy multi-brand pagination`
