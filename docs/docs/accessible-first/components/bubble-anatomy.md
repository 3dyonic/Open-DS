---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 9.5
slug: "bubble/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Bubble in Accessible first."
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

:::panel{media="wide"}
![Bubble, every part numbered](/anatomy/accessible-first/bubble/stage.png)
*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Bubble** required :label[Grouping]
  - **1** **Byline** required :label[By scheme]{tone="info"} :label[Hierarchy] :label[Readability]
  - **2** **Their message** required :label[By scheme]{tone="info"} :label[Containment] :label[Meaning]
  - **3** **Your message** required :label[By scheme]{tone="info"} :label[Containment] :label[Meaning] :label[Emphasis]
  - **4** **Message text** required :label[By scheme]{tone="info"} :label[Readability]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Byline" note="Parts 1" media="side"}
![Byline: 1](/anatomy/accessible-first/bubble/card-1.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Generous space lowers mis-taps.

- **Token** `color.text.muted` → `byline.label` #595959 · dark #B4B4B4 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** border.strong, category.5, disabled.text. Changing this pick moves only what reads color.text.muted.

- **Token** `type.caption.font-size` → `byline.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `type.caption.line-height` → `byline.line-height` 1.6 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_6

- **Token** `space.gap.tight` → `gap` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12
:::

:::panel{id="part-2" title="Their message" note="Parts 2" media="side"}
![Their message: 2](/anatomy/accessible-first/bubble/card-2.png)

:label[Containment] :label[Meaning]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Answer** Shape · Which shape roles does it need? → Controls, badges and containers

  Badges keep a clear rectangle.

- **Token** `color.surface.sunken` → `body.them.background` #EDEDED · dark #222222 :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.17:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.16:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, category.5.subtle, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.text.primary` → `body.them.label` #141414 · dark #F7F7F7 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.42:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.2:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `radius.surface` → `body.radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Clear, slightly rounded controls.
:::

:::panel{id="part-3" title="Your message" note="Parts 3" media="side"}
![Your message: 3](/anatomy/accessible-first/bubble/card-3.png)

:label[Meaning] :label[Emphasis]

- **Answer** Color · How many emphasis levels do actions need? → Two

  Primary and secondary only; fewer choices, fewer errors.

- **Answer** Accessibility · What contrast floor do we hold? → AAA for text

  AAA contrast for text.

- **Token** `color.action.primary` → `body.me.background` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** blue.light.600: the primary action's fill; its label reads, 7.26:1, above the 7:1 floor.
  - **Dark** blue.dark.600: the primary action's fill; its label reads, 8.74:1, above the 7:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.

- **Token** `color.text.on-action` → `body.me.label` #FFFFFF · dark #141414 :label[By scheme]{tone="info"}

  Text and icons on the main action's fill.

  - **Pick** text.on-dark: the text its fill's tone picks, 7.26:1 on action.primary, above the 7:1 floor.
  - **Dark** text.on-light: the text its fill's tone picks, 8.74:1 on action.primary, above the 7:1 floor.
  - **Shares the step with** text.inverse, text.on-danger. Changing this pick moves only what reads color.text.on-action.
:::

:::panel{id="part-4" title="Message text" note="Parts 4" media="side"}
![Message text: 4](/anatomy/accessible-first/bubble/card-4.png)

:label[Readability]

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For paragraph or help text, use type.body, short sentences. Don't use type.caption.

  Large text and short lines lower effort.

- **Token** `type.body.font-size` → `body.font-size` 1.1875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.19

- **Token** `type.body.line-height` → `body.line-height` 1.6 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_6

- **Token** `component-spacing-map.x3` → `body.padding-x` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** space.20

- **Token** `component-spacing-map.x2` → `body.padding-y` 0.5rem

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `bubble`.
- **From a terminal:** `npx open-ds anatomy accessible-first bubble`
