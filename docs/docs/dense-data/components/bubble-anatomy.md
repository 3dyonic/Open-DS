---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 9.5
slug: "bubble/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Bubble in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the bubble apart to show how design decisions become the parts you see. You don't need it to use the bubble: [its own page](../bubble) has everything you need to build.

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

![Bubble, every part numbered](/anatomy/dense-data/bubble/stage.png)

*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Bubble** required :label[Grouping]
  - **1** **Byline** required :label[By scheme]{tone="info"} :label[Hierarchy] :label[Readability]
  - **2** **Their message** required :label[By scheme]{tone="info"} :label[Containment] :label[Meaning]
  - **3** **Your message** required :label[By scheme]{tone="info"} :label[Containment] :label[Meaning] :label[Emphasis]
  - **4** **Message text** required :label[By scheme]{tone="info"} :label[Readability]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Byline" note="Parts 1"}
![Byline: 1](/anatomy/dense-data/bubble/card-1.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Answer** Typography · How large is body text? → Small

  Small body text fits more rows on the screen.

- **Rule** For items that belong together, use space.gap.tight. Don't use space.gap.group.

  Things that belong together sit close.

- **Token** `color.text.muted` → `byline.label` #535D6D · dark #969FAD :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.66:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.47:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.caption.font-size` → `byline.font-size` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** font.size.12

- **Token** `type.caption.line-height` → `byline.line-height` 1.45 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_45

- **Token** `space.gap.tight` → `gap` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** space.4
:::

:::panel{id="part-2" title="Their message" note="Parts 2"}
![Their message: 2](/anatomy/dense-data/bubble/card-2.png)

:label[Containment] :label[Meaning]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Answer** Shape · Which shape roles does it need? → Controls, badges and containers

  Badges sit in columns and need their own corner.

- **Token** `color.surface.sunken` → `body.them.background` #EEF1F5 · dark #262D38 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.13:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.25:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, surface.pressed, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.text.primary` → `body.them.label` #161B23 · dark #F7F8FA :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.28:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.26:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `radius.container` → `body.radius` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** radius.4: Small corners keep dense rows straight.
:::

:::panel{id="part-3" title="Your message" note="Parts 3"}
![Your message: 3](/anatomy/dense-data/bubble/card-3.png)

:label[Meaning] :label[Emphasis]

- **Answer** Color · How many emphasis levels do actions need? → Three

  One primary per view; the rest step back.

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA contrast for every text.

- **Token** `color.action.primary` → `body.me.background` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** violet.light.600: the primary action's fill; its label reads, 6.97:1, above the 4.5:1 floor.
  - **Dark** violet.dark.600: the primary action's fill; its label reads, 7.62:1, above the 4.5:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.

- **Token** `color.text.on-action` → `body.me.label` #FFFFFF · dark #161B23 :label[By scheme]{tone="info"}

  Text and icons on the main action's fill.

  - **Pick** text.on-dark: the text its fill's tone picks, 6.97:1 on action.primary, above the 4.5:1 floor.
  - **Dark** text.on-light: the text its fill's tone picks, 7.62:1 on action.primary, above the 4.5:1 floor.
  - **Shares the step with** text.inverse, text.on-danger. Changing this pick moves only what reads color.text.on-action.
:::

:::panel{id="part-4" title="Message text" note="Parts 4"}
![Message text: 4](/anatomy/dense-data/bubble/card-4.png)

:label[Readability]

- **Answer** Typography · How large is body text? → Small

  Small body text fits more rows on the screen.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For paragraph or help text, use type.body. Don't use type.label.

  Help text is a sentence read in passing. Body size reads quickly; the label style is made for short names, not sentences.

- **Token** `type.body.font-size` → `body.font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `type.body.line-height` → `body.line-height` 1.45 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_45

- **Token** `component-spacing-map.x3` → `body.padding-x` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12

- **Token** `component-spacing-map.x2` → `body.padding-y` 0.5rem

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `bubble`.
- **From a terminal:** `npx open-ds anatomy dense-data bubble`
