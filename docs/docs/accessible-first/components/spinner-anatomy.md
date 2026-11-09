---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 54.5
slug: "spinner/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Spinner in Accessible first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the spinner apart to show how design decisions become the parts you see. You don't need it to use the spinner: [its own page](../spinner) has everything you need to build.

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

![Spinner, every part numbered](/anatomy/accessible-first/spinner/stage.png)

*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Spinner** required :label[By scheme]{tone="info"} :label[Feedback]
- **2** **Spin** state · no token yet :label[Feedback]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Size" note="Parts 1"}
![Size: 1](/anatomy/accessible-first/spinner/card-1.png)

:label[Feedback]

- **Answer** Iconography · How big are icons next to text? → Larger than the text

  Larger icons are easier to see.

- **Answer** Iconography · What icon style? → Filled

  Filled icons stay visible at low vision.

- **Rule** For an icon with no label, use Not used: always add a word. Don't use an icon button.

  Icons alone are guesswork.

- **Token** `size.icon` → `icon-size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20
:::

:::panel{id="part-1" title="Color" note="Parts 1"}
![Color: 1](/anatomy/accessible-first/spinner/card-2.png)

:label[Readability]

- **Answer** Iconography · How big are icons next to text? → Larger than the text

  Larger icons are easier to see.
:::

:::panel{id="part-2" title="Spin" note="Parts 2"}
![Spin: 2](/anatomy/accessible-first/spinner/card-3.png)

:label[Feedback]

- **Answer** Motion · How fast does feedback feel? → Moderate

  Moderate speed is easy to follow.

- **Rule** For someone asked for less motion, use No motion. Don't use reduced motion.

  A shorter motion still moves. When people ask for less motion, nothing moves.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `spinner`.
- **From a terminal:** `npx open-ds anatomy accessible-first spinner`
