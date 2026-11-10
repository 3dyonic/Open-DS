---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 22.5
slug: "date-picker/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Date picker in Accessible first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the date picker apart to show how design decisions become the parts you see. You don't need it to use the date picker: [its own page](../date-picker) has everything you need to build.

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
![Date picker, every part numbered](/anatomy/accessible-first/date-picker/stage.png)
*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Trigger** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
- **2** **Calendar icon** required :label[By scheme]{tone="info"} :label[Meaning]
- **3** **Date** required :label[Readability]
- **4** **Placeholder** state :label[By scheme]{tone="info"} :label[Readability] :label[Feedback]
- **Calendar** required · shown by Calendar :label[Affordance]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-2" title="Trigger" note="Parts 1, 2" media="side"}
![Trigger: 1, 2](/anatomy/accessible-first/date-picker/card-1.png)

:label[Affordance] :label[Reach] :label[Meaning]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Clear, slightly rounded controls.

- **Answer** Accessibility · What is the smallest target? → Large

  Large targets for tremor and touch.

- **Rule** For corners of buttons and inputs, use radius.control. Don't use a pill.

  Clear rectangles read as fields and buttons.

- **Rule** For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size.

  Large targets help people with motor needs.

- **Token** `size.control.default` → `button.height` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `radius.control` → `button.radius` 0.375rem :label[By scheme]{tone="info"}

  - **Pick** radius.6: Clear, slightly rounded controls.

- **Token** `color.border.strong` → `button.secondary.border` #595959 · dark #949494 :label[By scheme]{tone="info"}

  The edge of a control people must find.

  - **Pick** neutral.500: the edge of a control people must find, 7.0:1 on surface.default, above the 3:1 floor.
  - **Dark** neutral.500: the edge of a control people must find, 6.07:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** text.muted, category.5, disabled.text. Changing this pick moves only what reads color.border.strong.

- **Token** `size.icon` → `button.icon-size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20
:::

:::panel{id="part-3" title="Date" note="Parts 3" media="side"}
![Date: 3](/anatomy/accessible-first/date-picker/card-2.png)

:label[Readability]

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Rule** For field label or column header, use type.label, above the field, always visible. Don't use a placeholder as the label.

  Labels must stay visible while typing.

- **Token** `type.body.font-weight` → `font-weight` 400

  - **Pick** font.weight.400
:::

:::panel{id="part-4" title="Placeholder" note="Parts 4" media="side"}
![Placeholder: 4](/anatomy/accessible-first/date-picker/card-3.png)

:label[Readability] :label[Feedback]

- **Answer** Typography · How large is body text? → Large

  Large text is readable for more people.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Rule** For an empty state, use Explain what will appear here and how to start. Don't use a blank page.

  A blank page leaves people unsure if something failed.

- **Token** `color.text.muted` → `label` #595959 · dark #B4B4B4 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** border.strong, category.5, disabled.text. Changing this pick moves only what reads color.text.muted.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `date-picker`.
- **From a terminal:** `npx open-ds anatomy accessible-first date-picker`
