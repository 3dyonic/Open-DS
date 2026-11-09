---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 44.5
slug: "progress/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Progress in Multi-brand."
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

![Progress, every part numbered](/anatomy/multi-brand/progress/stage.png)

*Multi-brand, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Track** required :label[By scheme]{tone="info"} :label[Containment]
- **2** **Indicator** required :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
- **Label and value** optional · shown by the page, beside the bar :label[Readability]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Track" note="Parts 1"}
![Track: 1](/anatomy/multi-brand/progress/card-1.png)

:label[Containment]

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Each brand brings its own accent ramp.

- **Token** `color.surface.sunken` → `background` #F1F5F9 · dark #1E293B :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.1:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.22:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, disabled.surface. Changing this pick moves only what reads color.surface.sunken.
:::

:::panel{id="part-1" title="Corner" note="Parts 1"}
![Corner: 1](/anatomy/multi-brand/progress/card-2.png)

:label[Containment]

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Token** `radius.round` → `radius` 9999px

  - **Pick** radius.full
:::

:::panel{id="part-2" title="Indicator" note="Parts 2"}
![Indicator: 2](/anatomy/multi-brand/progress/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Each brand brings its own accent ramp.

- **Answer** Motion · How fast does feedback feel? → Moderate

  Moderate speed across brands.

- **Rule** For someone asked for less motion, use Reduced motion. Don't use full motion.

  Motion is reduced, not removed: a fade keeps the change visible, and nothing slides.

- **Token** `color.action.primary` → `indicator.background` #0F766E · dark #7FCFC6 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** teal.light.600: the primary action's fill; its label reads, 5.47:1, above the 4.5:1 floor.
  - **Dark** teal.dark.600: the primary action's fill; its label reads, 9.9:1, above the 4.5:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `progress`.
- **From a terminal:** `npx open-ds anatomy multi-brand progress`
