---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 61.5
slug: "toggle-group/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Toggle group in Content first."
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

:::panel{media="wide"}
![Toggle group, every part numbered](/anatomy/content-first/toggle-group/stage.png)
*Content first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Group** required :label[By scheme]{tone="info"} :label[Grouping]
- **2** **Item** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
- **3** **End corners** required :label[By scheme]{tone="info"} :label[Grouping] :label[Containment]
- **On, hover and focus of an item** state · shown by Toggle :label[Meaning] :label[Feedback] :label[Focus]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Group" note="Parts 1" media="side"}
![Group: 1](/anatomy/content-first/toggle-group/card-1.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Text needs air even inside a group.

- **Token** `radius.control` → `radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Rounded corners feel friendly.
:::

:::panel{id="part-2" title="Item" note="Parts 2" media="side"}
![Item: 2](/anatomy/content-first/toggle-group/card-2.png)

:label[Affordance] :label[Reach]

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Answer** Accessibility · What is the smallest target? → Touch size

  Readers are often on phones.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Many readers are on phones.

- **Token** `space.inset.control-x` → `item.padding-x` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** space.20
:::

:::panel{id="part-3" title="End corners" note="Parts 3" media="side"}
![End corners: 3](/anatomy/content-first/toggle-group/card-3.png)

:label[Grouping] :label[Containment]

- **Answer** Shape · What should control corners say? → Rounded

  Rounded corners feel friendly.

- **Rule** For corners of buttons and inputs, use radius.control (rounded). Don't use sharp corners.

  Rounded corners match the warm reading tone. Sharp corners feel technical next to long text.

- **Token** `radius.control` → `item.radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Rounded corners feel friendly.

- **Token** `border-width.default` → `item.border-width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `toggle-group`.
- **From a terminal:** `npx open-ds anatomy content-first toggle-group`
