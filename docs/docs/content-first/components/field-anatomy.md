---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 27.5
slug: "field/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Field in Content first."
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
![Field, every part numbered](/anatomy/content-first/field/stage.png)
*Content first, light, drawn in Figma from the scheme's tokens.*

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
![Label: 1](/anatomy/content-first/field/card-1.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · Which text roles does it need? → Core and editorial display

  A lead and a display role open articles.

- **Rule** For field label or column header, use type.label. Don't use type.caption.

  Caption is too faint for a label people must read.

- **Token** `type.label.font-size` → `label.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `type.label.font-weight` → `label.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600
:::

:::panel{id="part-2" title="Description" note="Parts 2" media="side"}
![Description: 2](/anatomy/content-first/field/card-2.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · Which text roles does it need? → Core and editorial display

  A lead and a display role open articles.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Reading needs few color roles.

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Rule** For paragraph or help text, use type.body, at most 65 characters a line. Don't use type.caption.

  A large size and short lines make long text easy on the eyes.

- **Token** `type.body.font-size` → `description.font-size` 1.125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.18

- **Token** `color.text.muted` → `description.label` #61594D · dark #A39A8B :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.9:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.16:1 on surface.default, above the 4.5:1 floor.

- **Token** `component-spacing-map.x1` → `description.margin-top` 0.25rem

  - **Pick** space.4
:::

:::panel{id="part-3" title="Error message" note="Parts 3" media="side"}
![Error message: 3](/anatomy/content-first/field/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Reading needs few color roles.

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed gets its own value for touch.

- **Rule** For an error message, use color.status.danger and a plain sentence. Don't use color alone.

  The sentence says what to fix; color only draws the eye.

- **Rule** For the words of an error, use Calm and helpful. Take the blame, offer the way forward.. Don't use blaming the reader.

  A calm error keeps the reader's trust.

- **Token** `color.status.danger` → `error.label` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.21:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.

- **Token** `type.body.font-weight` → `error.font-weight` 400

  - **Pick** font.weight.400
:::

:::panel{id="part-4" title="Invalid field" note="Parts 4" media="side"}
![Invalid field: 4](/anatomy/content-first/field/card-4.png)

:label[Meaning] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Reading needs few color roles.

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed gets its own value for touch.

- **Rule** For an error message, use color.status.danger and a plain sentence. Don't use color alone.

  The sentence says what to fix; color only draws the eye.

- **Token** `color.status.danger` → `input.border.invalid` #C42B2B · dark #F28B8B :label[By scheme]{tone="info"}

  Real risk: errors, failed checks, actions that cannot be undone. The top of the urgency order. Overuse wears it out.

  - **Pick** red.light.600: danger reads as text and icons, 5.63:1 on surface.default, above the 4.5:1 floor.
  - **Dark** red.dark.600: danger reads as text and icons, 7.21:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.danger. Changing this pick moves only what reads color.status.danger.
:::

:::panel{id="part-5" title="Choice card" note="Parts 5" media="side"}
![Choice card: 5](/anatomy/content-first/field/card-5.png)

:label[Containment] :label[Reach]

- **Answer** Shape · What should control corners say? → Rounded

  Rounded corners feel friendly.

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Rule** For corners of buttons and inputs, use radius.control (rounded). Don't use sharp corners.

  Rounded corners match the warm reading tone. Sharp corners feel technical next to long text.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Many readers are on phones.

- **Token** `radius.control` → `label.radius` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** radius.8: Rounded corners feel friendly.

- **Token** `component-spacing-map.x4` → `label.padding` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `border-width.default` → `label.border-width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1
:::

:::panel{id="part-6" title="Checked choice card" note="Parts 6" media="side"}
![Checked choice card: 6](/anatomy/content-first/field/card-6.png)

:label[Meaning] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Reading needs few color roles.

- **Rule** For a selected row or item, use color.surface.selected. Don't use bold text only.

  A tint shows the choice clearly on warm paper.

- **Token** `color.border.selected` → `label.border.checked` #1E3A5F · dark #8FA6C4 :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** navy.light.600: the edge beside a selected fill, so selection is never color alone, 11.5:1 on surface.default, above the 3:1 floor.
  - **Dark** navy.dark.600: the edge beside a selected fill, so selection is never color alone, 6.86:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `color.surface.selected` → `label.background.checked` #E0E9F5 · dark #202B3B :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** navy.light.100: a tint of the brand, 1.22:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** navy.dark.100: a tint of the brand, 1.2:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.
:::

:::panel{id="part-7" title="Separator" note="Parts 7" media="side"}
![Separator: 7](/anatomy/content-first/field/card-7.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Room around the text helps reading.

- **Rule** For between page sections, use space.gap.section, no line. Don't use a divider line.

  Space alone separates sections; lines add noise.

- **Token** `component-spacing-map.x2` → `separator.margin-y` 0.5rem

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `field`.
- **From a terminal:** `npx open-ds anatomy content-first field`
