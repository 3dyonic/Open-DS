---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 9.5
slug: "bubble/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Bubble in Multi-brand."
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
![Bubble, every part numbered](/anatomy/multi-brand/bubble/stage.png)
*Multi-brand, light, drawn in Figma from the scheme's tokens.*

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
![Byline: 1](/anatomy/multi-brand/bubble/card-1.png)

:label[Hierarchy] :label[Readability]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  One set of roles across brands.

- **Answer** Typography · How large is body text? → Regular

  Regular body size suits all brands.

- **Rule** For items that belong together, use space.gap.default. Don't use brand-specific spacing.

  Spacing is shared across brands.

- **Token** `color.text.muted` → `byline.label` #4B5A6F · dark #96A3B5 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 7.02:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.97:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.caption.font-size` → `byline.font-size` 0.8125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.13

- **Token** `type.caption.line-height` → `byline.line-height` 1.5 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_5

- **Token** `space.gap.tight` → `gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8
:::

:::panel{id="part-2" title="Their message" note="Parts 2" media="side"}
![Their message: 2](/anatomy/multi-brand/bubble/card-2.png)

:label[Containment] :label[Meaning]

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Each brand brings its own accent ramp.

- **Answer** Shape · Which shape roles does it need? → Controls, badges and containers

  Each brand sets three corners.

- **Token** `color.surface.sunken` → `body.them.background` #F1F5F9 · dark #1E293B :label[By scheme]{tone="info"}

  A recessed fill, a step below content.

  - **Pick** neutral.100, a step below content (1.1:1 on surface.default), so table headers and wells read as recessed.
  - **Dark** neutral.100, a step below content (1.22:1 on surface.default), so table headers and wells read as recessed.
  - **Shares the step with** surface.highlight, action.secondary.hover, disabled.surface. Changing this pick moves only what reads color.surface.sunken.

- **Token** `color.text.primary` → `body.them.label` #0F172A · dark #F8FAFC :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.85:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.06:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `radius.surface` → `body.radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Rounded by default; each brand sets its own corner.
:::

:::panel{id="part-3" title="Your message" note="Parts 3" media="side"}
![Your message: 3](/anatomy/multi-brand/bubble/card-3.png)

:label[Meaning] :label[Emphasis]

- **Answer** Color · How many emphasis levels do actions need? → Three

  Primary, secondary and ghost in every brand.

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA in every brand and mode.

- **Token** `color.action.primary` → `body.me.background` #0F766E · dark #7FCFC6 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** teal.light.600: the primary action's fill; its label reads, 5.47:1, above the 4.5:1 floor.
  - **Dark** teal.dark.600: the primary action's fill; its label reads, 9.9:1, above the 4.5:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.

- **Token** `color.text.on-action` → `body.me.label` #FFFFFF · dark #0F172A :label[By scheme]{tone="info"}

  Text and icons on the main action's fill.

  - **Pick** text.on-dark: the text its fill's tone picks, 5.47:1 on action.primary, above the 4.5:1 floor.
  - **Dark** text.on-light: the text its fill's tone picks, 9.9:1 on action.primary, above the 4.5:1 floor.
  - **Shares the step with** text.inverse, text.on-danger. Changing this pick moves only what reads color.text.on-action.
:::

:::panel{id="part-4" title="Message text" note="Parts 4" media="side"}
![Message text: 4](/anatomy/multi-brand/bubble/card-4.png)

:label[Readability]

- **Answer** Typography · How large is body text? → Regular

  Regular body size suits all brands.

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Rule** For paragraph or help text, use type.body. Don't use type.caption.

  Regular body size suits every brand.

- **Token** `type.body.font-size` → `body.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `type.body.line-height` → `body.line-height` 1.5 :label[By scheme]{tone="info"}

  - **Pick** font.line-height.1_5

- **Token** `component-spacing-map.x3` → `body.padding-x` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** space.20

- **Token** `component-spacing-map.x2` → `body.padding-y` 0.5rem

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `bubble`.
- **From a terminal:** `npx open-ds anatomy multi-brand bubble`
