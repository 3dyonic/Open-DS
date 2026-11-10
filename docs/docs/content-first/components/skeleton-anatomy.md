---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 52.5
slug: "skeleton/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Skeleton in Content first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the skeleton apart to show how design decisions become the parts you see. You don't need it to use the skeleton: [its own page](../skeleton) has everything you need to build.

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
![Skeleton, every part numbered](/anatomy/content-first/skeleton/stage.png)
*Content first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Placeholder** required :label[By scheme]{tone="info"} :label[Containment] :label[Feedback]
- **2** **Pulse** state · no token yet :label[Feedback]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Corner" note="Parts 1" media="side"}
![Corner: 1](/anatomy/content-first/skeleton/card-1.png)

:label[Containment]

- **Answer** Shape · Which shape roles does it need? → Controls, badges and containers

  Pill badges differ from controls.

- **Answer** Shape · What should control corners say? → Rounded

  Rounded corners feel friendly.

- **Rule** For corners of buttons and inputs, use radius.control (rounded). Don't use sharp corners.

  Rounded corners match the warm reading tone. Sharp corners feel technical next to long text.

- **Token** `radius.control` → `radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Rounded corners feel friendly.
:::

:::panel{id="part-1" title="Fill" note="Parts 1" media="side"}
![Fill: 1](/anatomy/content-first/skeleton/card-2.png)

:label[Feedback]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Reading needs few color roles.

- **Answer** Color · How saturated is the palette? → Balanced

  A calm, balanced palette.

- **Token** `color.surface.sunken` → `background` #F6F2EA · dark #2E2A24 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.12:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.2:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.
:::

:::panel{id="part-2" title="Pulse" note="Parts 2" media="side"}
![Pulse: 2](/anatomy/content-first/skeleton/card-3.png)

:label[Feedback]

- **Answer** Motion · How fast does feedback feel? → Moderate

  Moderate speed feels calm.

- **Answer** Motion · Where does motion show? → State changes and panels

  State changes and opening panels move.

- **Rule** For someone asked for less motion, use No motion. Don't use reduced motion.

  A shorter motion still moves. When people ask for less motion, nothing moves.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `skeleton`.
- **From a terminal:** `npx open-ds anatomy content-first skeleton`
