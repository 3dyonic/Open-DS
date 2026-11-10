---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 9.5
slug: "bubble/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Bubble in Content first."
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

![Bubble, every part numbered](/anatomy/content-first/bubble/stage.png)

*Content first, light, drawn in Figma from the scheme's tokens.*

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
![Byline: 1](/anatomy/content-first/bubble/card-1.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core and editorial display

  A lead and a display role open articles.

- **Answer** Typography · How large is body text? → Large

  Large body text is easy on the eyes.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Text needs air even inside a group.

- **Token** `color.text.muted` → `byline.label` #61594D · dark #A39A8B :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.9:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.16:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.caption.font-size` → `byline.font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `type.caption.line-height` → `byline.line-height` 1.45 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_45

- **Token** `space.gap.tight` → `gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8
:::

:::panel{id="part-2" title="Their message" note="Parts 2"}
![Their message: 2](/anatomy/content-first/bubble/card-2.png)

:label[Containment] :label[Meaning]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Reading needs few color roles.

- **Answer** Shape · Which shape roles does it need? → Controls, badges and containers

  Pill badges differ from controls.

- **Token** `color.surface.sunken` → `body.them.background` #F6F2EA · dark #2E2A24 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.12:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.2:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.text.primary` → `body.them.label` #1F1B16 · dark #FFFDF8 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.12:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.84:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `radius.surface` → `body.radius` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** radius.12: Rounded corners feel friendly.
:::

:::panel{id="part-3" title="Your message" note="Parts 3"}
![Your message: 3](/anatomy/content-first/bubble/card-3.png)

:label[Meaning] :label[Emphasis]

- **Answer** Color · How many emphasis levels do actions need? → Three

  Primary, secondary and a text link.

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA contrast, with large text helping further.

- **Token** `color.action.primary` → `body.me.background` #1E3A5F · dark #8FA6C4 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** navy.light.600: the primary action's fill; its label reads, 11.5:1, above the 4.5:1 floor.
  - **Dark** navy.dark.600: the primary action's fill; its label reads, 6.86:1, above the 4.5:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.

- **Token** `color.text.on-action` → `body.me.label` #FFFFFF · dark #1F1B16 :label[By scheme]{tone="info"}

  Text and icons on the main action's fill.

  - **Pick** text.on-dark: the text its fill's tone picks, 11.5:1 on action.primary, above the 4.5:1 floor.
  - **Dark** text.on-light: the text its fill's tone picks, 6.86:1 on action.primary, above the 4.5:1 floor.
  - **Shares the step with** text.inverse, text.on-danger. Changing this pick moves only what reads color.text.on-action.
:::

:::panel{id="part-4" title="Message text" note="Parts 4"}
![Message text: 4](/anatomy/content-first/bubble/card-4.png)

:label[Readability]

- **Answer** Typography · How large is body text? → Large

  Large body text is easy on the eyes.

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Rule** For paragraph or help text, use type.body, at most 65 characters a line. Don't use type.caption.

  A large size and short lines make long text easy on the eyes.

- **Token** `type.body.font-size` → `body.font-size` 1.125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.18

- **Token** `type.body.line-height` → `body.line-height` 1.65 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_65

- **Token** `component-spacing-map.x3` → `body.padding-x` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** space.20

- **Token** `component-spacing-map.x2` → `body.padding-y` 0.5rem

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `bubble`.
- **From a terminal:** `npx open-ds anatomy content-first bubble`
