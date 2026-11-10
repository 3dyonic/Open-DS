---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 27.5
slug: "field/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Field in Accessible first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the field apart to show how design decisions become the parts you see. You don't need it to use the field: [its own page](../field) has everything you need to build.

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
![Field, every part numbered](/anatomy/accessible-first/field/stage.png)
*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Field** required :label[Grouping]
  - **1** **Label** required :label[By scheme]{tone="info"} :label[Readability] :label[Hierarchy]
  - **Control** required · shown by Input :label[Affordance]
  - **2** **Description** optional :label[By scheme]{tone="info"} :label[Readability] :label[Hierarchy]
  - **3** **Error message** optional :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
  - **4** **Invalid field** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
- **Choice card** optional :label[Containment] :label[Affordance]
  - **5** **Choice card** optional :label[By scheme]{tone="info"} :label[Containment] :label[Reach]
  - **Checkbox or radio** required · shown by Checkbox :label[Affordance]
  - **6** **Checked choice card** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
- **7** **Separator** optional :label[Grouping]
- **Separator line** optional · shown by Separator :label[Grouping]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Label" note="Parts 1" media="side"}
![Label: 1](/anatomy/accessible-first/field/card-1.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Rule** For field label or column header, use type.label, above the field, always visible. Don't use a placeholder as the label.

  Labels must stay visible while typing.

- **Token** `type.label.font-size` → `label.font-size` 1.125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.18

- **Token** `type.label.font-weight` → `label.font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700
:::

:::panel{id="part-2" title="Description" note="Parts 2" media="side"}
![Description: 2](/anatomy/accessible-first/field/card-2.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For paragraph or help text, use type.body, short sentences. Don't use type.caption.

  Large text and short lines lower effort.

- **Token** `type.body.font-size` → `description.font-size` 1.1875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.19

- **Token** `color.text.muted` → `description.label` #595959 · dark #B4B4B4 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** border.strong, category.5, disabled.text. Changing this pick moves only what reads color.text.muted.

- **Token** `component-spacing-map.x1` → `description.margin-top` 0.25rem

  - **Pick** space.4
:::

:::panel{id="part-3" title="Error message" note="Parts 3" media="side"}
![Error message: 3](/anatomy/accessible-first/field/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Rule** For an error message, use color.status.danger, an icon and a sentence next to the field. Don't use color alone.

  People must know what went wrong and where.

- **Rule** For the words of an error, use Say what is wrong, where, and exactly how to fix it. Don't use "Invalid input".

  People must be able to fix the error without help.

- **Token** `color.status.danger` → `error.label` #981519 · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.700: danger reads as text and icons, 8.55:1 on surface.default, above the 7:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.76:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.

- **Token** `type.body.font-weight` → `error.font-weight` 400

  - **Pick** font.weight.400
:::

:::panel{id="part-4" title="Invalid field" note="Parts 4" media="side"}
![Invalid field: 4](/anatomy/accessible-first/field/card-4.png)

:label[Meaning] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Rule** For an error message, use color.status.danger, an icon and a sentence next to the field. Don't use color alone.

  People must know what went wrong and where.

- **Token** `color.status.danger` → `input.border.invalid` #981519 · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.700: danger reads as text and icons, 8.55:1 on surface.default, above the 7:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.76:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

:::panel{id="part-5" title="Choice card" note="Parts 5" media="side"}
![Choice card: 5](/anatomy/accessible-first/field/card-5.png)

:label[Containment] :label[Reach]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Clear, slightly rounded controls.

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For corners of buttons and inputs, use radius.control. Don't use a pill.

  Clear rectangles read as fields and buttons.

- **Rule** For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size.

  Large targets help people with motor needs.

- **Token** `radius.control` → `label.radius` 0.375rem :label[By scheme]{tone="info"}

  - **Pick** radius.6: Clear, slightly rounded controls.

- **Token** `component-spacing-map.x4` → `label.padding` 1.75rem :label[By scheme]{tone="info"}

  - **Pick** space.28

- **Token** `border-width.default` → `label.border-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2
:::

:::panel{id="part-6" title="Checked choice card" note="Parts 6" media="side"}
![Checked choice card: 6](/anatomy/accessible-first/field/card-6.png)

:label[Meaning] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Rule** For a selected row or item, use color.surface.selected and a check icon. Don't use color alone.

  Selection never relies on color alone.

- **Token** `color.border.selected` → `label.border.checked` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** blue.light.600: the edge beside a selected fill, so selection is never color alone, 7.26:1 on surface.default, above the 3:1 floor.
  - **Dark** blue.dark.600: the edge beside a selected fill, so selection is never color alone, 8.74:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `color.surface.selected` → `label.background.checked` #E2EDFF · dark #102547 :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** blue.light.100: a tint of the brand, 1.18:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** blue.dark.100: a tint of the brand, 1.21:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.
:::

:::panel{id="part-7" title="Separator" note="Parts 7" media="side"}
![Separator: 7](/anatomy/accessible-first/field/card-7.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For between page sections, use space.gap.section. Don't use a thin line.

  Space is easy to see; thin lines are not.

- **Token** `component-spacing-map.x2` → `separator.margin-y` 0.5rem

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `field`.
- **From a terminal:** `npx open-ds anatomy accessible-first field`
