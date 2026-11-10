---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 36.5
slug: "label/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Label in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the label apart to show how design decisions become the parts you see. You don't need it to use the label: [its own page](../label) has everything you need to build.

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

![Label, every part numbered](/anatomy/dense-data/label/stage.png)

*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Label text** required :label[By scheme]{tone="info"} :label[Readability] :label[Hierarchy]
- **2** **Gap to its mark** optional :label[By scheme]{tone="info"} :label[Grouping]
- **Field** required · shown by Input :label[Affordance]
- **Checkbox** optional · shown by Checkbox :label[Affordance]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Label text" note="Parts 1"}
![Label text: 1](/anatomy/dense-data/label/card-1.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · How large is body text? → Small

  Small body text fits more rows on the screen.

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Rule** For field label or column header, use type.label. Don't use type.heading.

  Headers repeat on every column; a heavy style would compete with the data.

- **Token** `type.label.font-size` → `font-size` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** font.size.12

- **Token** `type.label.font-weight` → `font-weight` 500 :label[By scheme]{tone="info"}

  - **Pick** font.weight.500

- **Token** `type.label.font-family` → `font-family` "IBM Plex Sans", system-ui, sans-serif :label[By scheme]{tone="info"}

  - **Pick** ibm-plex-sans for label text: IBM Plex Sans for every text role and IBM Plex Mono for data: exact and quiet, so the numbers stay the hero.

- **Token** `type.label.line-height` → `line-height` 1.2 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_2
:::

:::panel{id="part-1" title="Text color" note="Parts 1"}
![Text color: 1](/anatomy/dense-data/label/card-2.png)

:label[Readability]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA contrast for every text.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Rule** For field label or column header, use type.label. Don't use type.heading.

  Headers repeat on every column; a heavy style would compete with the data.

- **Token** `color.text.primary` → `label` #161B23 · dark #F7F8FA :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.28:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.26:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.
:::

:::panel{id="part-2" title="Gap to its mark" note="Parts 2"}
![Gap to its mark: 2](/anatomy/dense-data/label/card-3.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For items that belong together, use space.gap.tight. Don't use space.gap.group.

  Things that belong together sit close.

- **Token** `space.gap.default` → `gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `label`.
- **From a terminal:** `npx open-ds anatomy dense-data label`
