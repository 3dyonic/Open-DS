---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 36.5
slug: "marker/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Marker in Accessible first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the marker apart to show how design decisions become the parts you see. You don't need it to use the marker: [its own page](../marker) has everything you need to build.

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
![Marker, every part numbered](/anatomy/accessible-first/marker/stage.png)
*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Line** required :label[By scheme]{tone="info"} :label[Grouping]
- **2** **Label** required :label[By scheme]{tone="info"} :label[Readability] :label[Hierarchy]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Line" note="Parts 1" media="side"}
![Line: 1](/anatomy/accessible-first/marker/card-1.png)

:label[Grouping]

- **Answer** Elevation · What separates groups on the page? → Lines

  Strong borders separate groups at any zoom.

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For between page sections, use space.gap.section. Don't use a thin line.

  Space is easy to see; thin lines are not.

- **Token** `border-width.default` → `line.thickness` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `color.border.default` → `line.background` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `component-spacing-map.x3` → `gap` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** space.20
:::

:::panel{id="part-2" title="Label" note="Parts 2" media="side"}
![Label: 2](/anatomy/accessible-first/marker/card-2.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Answer** Accessibility · What contrast floor do we hold? → AAA for text

  AAA contrast for text.

- **Token** `color.text.muted` → `label` #595959 · dark #B4B4B4 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** border.strong, category.5, disabled.text. Changing this pick moves only what reads color.text.muted.

- **Token** `type.caption.font-size` → `font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `type.caption.line-height` → `line-height` 1.6 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_6
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `marker`.
- **From a terminal:** `npx open-ds anatomy accessible-first marker`
