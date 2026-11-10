---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 62.5
slug: "toggle-group/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Toggle group in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the toggle group apart to show how design decisions become the parts you see. You don't need it to use the toggle group: [its own page](../toggle-group) has everything you need to build.

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

![Toggle group, every part numbered](/anatomy/dense-data/toggle-group/stage.png)

*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Group** required :label[By scheme]{tone="info"} :label[Grouping]
- **2** **Item** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
- **3** **End corners** required :label[By scheme]{tone="info"} :label[Grouping] :label[Containment]
- **On, hover and focus of an item** state · shown by Toggle :label[Meaning] :label[Feedback] :label[Focus]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Group" note="Parts 1"}
![Group: 1](/anatomy/dense-data/toggle-group/card-1.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For items that belong together, use space.gap.tight. Don't use space.gap.group.

  Things that belong together sit close.

- **Token** `radius.control` → `radius` 0.125rem :label[By scheme]{tone="info"}

  - **Pick** radius.2: Small corners keep dense rows straight.
:::

:::panel{id="part-2" title="Item" note="Parts 2"}
![Item: 2](/anatomy/dense-data/toggle-group/card-2.png)

:label[Affordance] :label[Reach]

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Answer** Accessibility · What is the smallest target? → Compact, for a pointer

  Mouse and keyboard; compact targets are enough.

- **Rule** For the smallest clickable thing, use size.control.compact. Don't use anything smaller.

  Compact still fits a mouse. Touch is not this product's input.

- **Token** `space.inset.control-x` → `item.padding-x` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12
:::

:::panel{id="part-3" title="End corners" note="Parts 3"}
![End corners: 3](/anatomy/dense-data/toggle-group/card-3.png)

:label[Grouping] :label[Containment]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Rule** For corners of buttons and inputs, use radius.control. Don't use radius.round.

  Small corners keep dense rows straight.

- **Token** `radius.control` → `item.radius` 0.125rem :label[By scheme]{tone="info"}

  - **Pick** radius.2: Small corners keep dense rows straight.

- **Token** `border-width.default` → `item.border-width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `toggle-group`.
- **From a terminal:** `npx open-ds anatomy dense-data toggle-group`
