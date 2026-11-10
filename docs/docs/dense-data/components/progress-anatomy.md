---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 45.5
slug: "progress/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Progress in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the progress bar apart to show how design decisions become the parts you see. You don't need it to use the progress bar: [its own page](../progress) has everything you need to build.

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

![Progress, every part numbered](/anatomy/dense-data/progress/stage.png)

*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Track** required :label[By scheme]{tone="info"} :label[Containment]
- **2** **Indicator** required :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
- **Label and value** optional · shown by the page, beside the bar :label[Readability]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Track" note="Parts 1"}
![Track: 1](/anatomy/dense-data/progress/card-1.png)

:label[Containment]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Token** `color.surface.sunken` → `background` #EEF1F5 · dark #262D38 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.13:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.25:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, surface.pressed, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.
:::

:::panel{id="part-1" title="Corner" note="Parts 1"}
![Corner: 1](/anatomy/dense-data/progress/card-2.png)

:label[Containment]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Token** `radius.round` → `radius` 9999px

  - **Pick** radius.full
:::

:::panel{id="part-2" title="Indicator" note="Parts 2"}
![Indicator: 2](/anatomy/dense-data/progress/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Answer** Motion · How fast does feedback feel? → Fast

  Fast feedback keeps up with experts.

- **Rule** For someone asked for less motion, use No motion. Don't use a shorter version of the motion.

  A shorter motion still moves. When people ask for less motion, nothing moves.

- **Token** `color.action.primary` → `indicator.background` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** violet.light.600: the primary action's fill; its label reads, 6.97:1, above the 4.5:1 floor.
  - **Dark** violet.dark.600: the primary action's fill; its label reads, 7.62:1, above the 4.5:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `progress`.
- **From a terminal:** `npx open-ds anatomy dense-data progress`
