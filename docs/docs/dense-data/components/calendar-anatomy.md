---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 12.5
slug: "calendar/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Calendar in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the calendar apart to show how design decisions become the parts you see. You don't need it to use the calendar: [its own page](../calendar) has everything you need to build.

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
![Calendar, every part numbered](/anatomy/dense-data/calendar/stage.png)
*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Surface** required :label[By scheme]{tone="info"} :label[Containment]
- **2** **Month caption** required :label[By scheme]{tone="info"} :label[Hierarchy] :label[Readability]
- **Month buttons** required :label[Affordance] :label[Reach]
  - **3** **Previous month** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
  - **4** **Next month** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
- **5** **Weekday** required :label[By scheme]{tone="info"} :label[Readability] :label[Hierarchy]
- **Day** required :label[Reach] :label[Readability] :label[Affordance]
  - **6** **Day** required :label[By scheme]{tone="info"} :label[Reach] :label[Readability]
  - **7** **Today** state :label[By scheme]{tone="info"} :label[Meaning]
  - **8** **Selected day** state :label[By scheme]{tone="info"} :label[Meaning] :label[Emphasis]
  - **9** **Selected range** state :label[By scheme]{tone="info"} :label[Meaning] :label[Grouping]
  - **10** **Day of another month** optional · no token yet :label[Hierarchy]
  - **11** **Day that cannot be picked** state :label[By scheme]{tone="info"} :label[Feedback]
  - **12** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Surface" note="Parts 1" media="side"}
![Surface: 1](/anatomy/dense-data/calendar/card-1.png)

:label[Containment]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Token** `color.surface.canvas` → `background` #F7F8FA · dark #0D1117 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.06:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.1:1 from surface.default, so cards and panels stand forward.

- **Token** `component-spacing-map.x3` → `padding` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12
:::

:::panel{id="part-2-3-4" title="Caption and month buttons" note="Parts 2, 3, 4" media="side"}
![Caption and month buttons: 2, 3, 4](/anatomy/dense-data/calendar/card-2.png)

:label[Hierarchy] :label[Affordance]

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the label so they do not outweigh it.

- **Rule** For an icon with no label, use Icon button with a tooltip. Don't use a bare icon.

  Experts learn icons; the tooltip covers the first uses.

- **Token** `type.body.font-size` → `font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `type.label.font-weight` → `font-weight` 500 :label[By scheme]{tone="info"}

  - **Pick** font.weight.500

- **Token** `size.icon` → `icon-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16
:::

:::panel{id="part-5" title="Weekdays" note="Parts 5" media="side"}
![Weekdays: 5](/anatomy/dense-data/calendar/card-3.png)

:label[Readability] :label[Hierarchy]

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Rule** For field label or column header, use type.label. Don't use type.heading.

  Headers repeat on every column; a heavy style would compete with the data.

- **Token** `color.text.muted` → `label` #535D6D · dark #969FAD :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.66:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.47:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.body.font-weight` → `font-weight-2` 400

  - **Pick** font.weight.400
:::

:::panel{id="part-6" title="Day" note="Parts 6" media="side"}
![Day: 6](/anatomy/dense-data/calendar/card-4.png)

:label[Reach] :label[Readability]

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For the smallest clickable thing, use size.control.compact. Don't use anything smaller.

  Compact still fits a mouse. Touch is not this product's input.

- **Rule** For corners of buttons and inputs, use radius.control. Don't use radius.round.

  Small corners keep dense rows straight.

- **Token** `radius.control` → `radius` 0.125rem :label[By scheme]{tone="info"}

  - **Pick** radius.2: Small corners keep dense rows straight.

- **Token** `component-spacing-map.x2` → `week.margin-top` 0.5rem

  - **Pick** space.8
:::

:::panel{id="part-7-8" title="Today and the selected day" note="Parts 7, 8" media="side"}
![Today and the selected day: 7, 8](/anatomy/dense-data/calendar/card-5.png)

:label[Meaning] :label[Emphasis]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Rule** For a selected row or item, use color.surface.selected. Don't use color.action.primary as a fill.

  A light tint shows selection without hiding the data.

- **Token** `color.surface.selected` → `day.today.background` #E8ECFF · dark #2A244F :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** violet.light.100: a tint of the brand, 1.17:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** violet.dark.100: a tint of the brand, 1.2:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.

- **Token** `color.action.primary` → `day.selected.background` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** violet.light.600: the primary action's fill; its label reads, 6.97:1, above the 4.5:1 floor.
  - **Dark** violet.dark.600: the primary action's fill; its label reads, 7.62:1, above the 4.5:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.

- **Token** `color.text.on-action` → `day.selected.label` #FFFFFF · dark #161B23 :label[By scheme]{tone="info"}

  Text and icons on the main action's fill.

  - **Pick** text.on-dark: the text its fill's tone picks, 6.97:1 on action.primary, above the 4.5:1 floor.
  - **Dark** text.on-light: the text its fill's tone picks, 7.62:1 on action.primary, above the 4.5:1 floor.
  - **Shares the step with** text.inverse, text.on-danger. Changing this pick moves only what reads color.text.on-action.
:::

:::panel{id="part-9" title="Selected range" note="Parts 9" media="side"}
![Selected range: 9](/anatomy/dense-data/calendar/card-6.png)

:label[Meaning] :label[Grouping]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Small corners keep dense rows straight.

- **Rule** For a selected row or item, use color.surface.selected. Don't use color.action.primary as a fill.

  A light tint shows selection without hiding the data.

- **Token** `color.surface.selected` → `day.range.background` #E8ECFF · dark #2A244F :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** violet.light.100: a tint of the brand, 1.17:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** violet.dark.100: a tint of the brand, 1.2:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.

- **Token** `color.text.primary` → `day.range.label` #161B23 · dark #F7F8FA :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.28:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.26:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `color.action.primary` → `day.range-ends.background` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The one main action in a view.

  - **Pick** violet.light.600: the primary action's fill; its label reads, 6.97:1, above the 4.5:1 floor.
  - **Dark** violet.dark.600: the primary action's fill; its label reads, 7.62:1, above the 4.5:1 floor.
  - **Shares the step with** border.focus, border.selected, category.1. Changing this pick moves only what reads color.action.primary.

- **Token** `color.text.on-action` → `day.range-ends.label` #FFFFFF · dark #161B23 :label[By scheme]{tone="info"}

  Text and icons on the main action's fill.

  - **Pick** text.on-dark: the text its fill's tone picks, 6.97:1 on action.primary, above the 4.5:1 floor.
  - **Dark** text.on-light: the text its fill's tone picks, 7.62:1 on action.primary, above the 4.5:1 floor.
  - **Shares the step with** text.inverse, text.on-danger. Changing this pick moves only what reads color.text.on-action.
:::

:::panel{id="part-11" title="Day that cannot be picked" note="Parts 11" media="side"}
![Day that cannot be picked: 11](/anatomy/dense-data/calendar/card-7.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Hover, focus, disabled

  Pressed reuses hover; experts do not need more.

- **Token** `opacity.disabled` → `day.disabled-opacity` 0.4 :label[By scheme]{tone="info"}

  - **Pick** opacity.40
:::

:::panel{id="part-12" title="Focus ring" note="Parts 12" media="side"}
![Focus ring: 12](/anatomy/dense-data/calendar/card-8.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA contrast for every text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Keyboard users must always see where they are.

- **Token** `border-width.focus` → `focus` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `color.border.focus` → `focus-ring` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** violet.light.600: the focus ring, so the keyboard's place is never lost, 6.97:1 on surface.default, above the 3:1 floor.
  - **Dark** violet.dark.600: the focus ring, so the keyboard's place is never lost, 7.62:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus-offset` → `focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `focus-ring-offset` #F7F8FA · dark #0D1117 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.06:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.1:1 from surface.default, so cards and panels stand forward.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `calendar`.
- **From a terminal:** `npx open-ds anatomy dense-data calendar`
