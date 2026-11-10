---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 62.5
slug: "tooltip/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Tooltip in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the tooltip apart to show how design decisions become the parts you see. You don't need it to use the tooltip: [its own page](../tooltip) has everything you need to build.

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
![Tooltip, every part numbered](/anatomy/dense-data/tooltip/stage.png)
*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Trigger** required · shown by Button :label[Affordance]
- **1** **Surface** required :label[By scheme]{tone="info"} :label[Containment] :label[Layering]
- **2** **Hint** required :label[By scheme]{tone="info"} :label[Readability] :label[Meaning]
- **3** **Offset** required :label[By scheme]{tone="info"} :label[Grouping]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Surface" note="Parts 1" media="side"}
![Surface: 1](/anatomy/dense-data/tooltip/card-1.png)

:label[Containment] :label[Layering]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For shape of a status badge, use radius.badge (rectangle). Don't use a pill.

  Rectangles line up in a column.

- **Token** `color.surface.inverse` → `content.background` #161B23 · dark #F7F8FA :label[By scheme]{tone="info"}

  A reversed fill for small, short-lived messages.

  - **Pick** neutral.900: the reverse of content for short messages; its text reads, 17.28:1 on surface.inverse, above the 4.5:1 floor.
  - **Dark** neutral.900: the reverse of content for short messages; its text reads, 16.26:1 on surface.inverse, above the 4.5:1 floor.
  - **Shares the step with** text.primary. Changing this pick moves only what reads color.surface.inverse.

- **Token** `radius.badge` → `content.radius` 0rem :label[By scheme]{tone="info"}

  - **Pick** radius.0: Small corners keep dense rows straight.

- **Token** `component-spacing-map.x2` → `content.padding-x` 0.5rem

  - **Pick** space.8

- **Token** `component-spacing-map.x1` → `content.padding-y` 0.25rem

  - **Pick** space.4
:::

:::panel{id="part-2" title="Hint" note="Parts 2" media="side"}
![Hint: 2](/anatomy/dense-data/tooltip/card-2.png)

:label[Readability] :label[Meaning]

- **Answer** Typography · How large is body text? → Small

  Small body text fits more rows on the screen.

- **Answer** Iconography · What do icons do? → Actions and status

  Icons mark row actions and status.

- **Rule** For an icon with no label, use Icon button with a tooltip. Don't use a bare icon.

  Experts learn icons; the tooltip covers the first uses.

- **Token** `color.text.inverse` → `content.label` #FFFFFF · dark #161B23 :label[By scheme]{tone="info"}

  Text on an inverse fill.

  - **Pick** text.on-dark: the text its fill's tone picks, 17.28:1 on surface.inverse, above the 4.5:1 floor.
  - **Dark** text.on-light: the text its fill's tone picks, 16.26:1 on surface.inverse, above the 4.5:1 floor.
  - **Shares the step with** text.on-action, text.on-danger. Changing this pick moves only what reads color.text.inverse.

- **Token** `type.caption.font-size` → `content.font-size` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** font.size.12

- **Token** `type.caption.font-family` → `content.font-family` "IBM Plex Sans", system-ui, sans-serif :label[By scheme]{tone="info"}

  - **Pick** ibm-plex-sans for caption text: IBM Plex Sans for every text role and IBM Plex Mono for data: exact and quiet, so the numbers stay the hero.
:::

:::panel{id="part-3" title="Offset" note="Parts 3" media="side"}
![Offset: 3](/anatomy/dense-data/tooltip/card-3.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For items that belong together, use space.gap.tight. Don't use space.gap.group.

  Things that belong together sit close.

- **Token** `space.gap.tight` → `overlay.offset` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** space.4
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `tooltip`.
- **From a terminal:** `npx open-ds anatomy dense-data tooltip`
