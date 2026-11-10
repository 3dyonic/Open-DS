---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 57.5
slug: "tabs/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Tabs in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the tabs apart to show how design decisions become the parts you see. You don't need it to use the tabs: [its own page](../tabs) has everything you need to build.

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
![Tabs, every part numbered](/anatomy/dense-data/tabs/stage.png)
*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Tab list** required :label[By scheme]{tone="info"} :label[Grouping]
- **Tab** required :label[Reach] :label[Affordance] :label[Readability]
  - **2** **Tab label** required :label[By scheme]{tone="info"} :label[Readability]
  - **3** **Current tab** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
  - **4** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
- **5** **Panel** required :label[By scheme]{tone="info"} :label[Containment]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Tab list" note="Parts 1" media="side"}
![Tab list: 1](/anatomy/dense-data/tabs/card-1.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For items that belong together, use space.gap.tight. Don't use space.gap.group.

  Things that belong together sit close.

- **Token** `space.gap.tight` → `list.gap` 0.25rem :label[By scheme]{tone="info"}

  - **Pick** space.4

- **Token** `color.border.default` → `list.border` #DDE2EA · dark #3D4655 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.22:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.82:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `border-width.default` → `list.border-width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1
:::

:::panel{id="part-2" title="Tab" note="Parts 2" media="side"}
![Tab: 2](/anatomy/dense-data/tabs/card-2.png)

:label[Reach] :label[Readability]

- **Answer** Accessibility · What is the smallest target? → Compact, for a pointer

  Mouse and keyboard; compact targets are enough.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Rule** For the smallest clickable thing, use size.control.compact. Don't use anything smaller.

  Compact still fits a mouse. Touch is not this product's input.

- **Token** `size.control.default` → `trigger.height` 2rem :label[By scheme]{tone="info"}

  - **Pick** size.32

- **Token** `space.inset.control-x` → `trigger.padding-x` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12

- **Token** `color.text.primary` → `trigger.label` #161B23 · dark #F7F8FA :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.28:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.26:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `type.label.font-size` → `trigger.font-size` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** font.size.12
:::

:::panel{id="part-3" title="Current tab" note="Parts 3" media="side"}
![Current tab: 3](/anatomy/dense-data/tabs/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** Accessibility · How many signals carry each meaning? → Three: color, icon and word

  Many statuses share one table; color alone is not enough.

- **Answer** Accessibility · Which states get their own visible value? → Hover, focus, disabled

  Pressed reuses hover; experts do not need more.

- **Rule** For a selected row or item, use color.surface.selected. Don't use color.action.primary as a fill.

  A light tint shows selection without hiding the data.

- **Token** `color.surface.selected` → `trigger.background.current` #E8ECFF · dark #2A244F :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** violet.light.100: a tint of the brand, 1.17:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** violet.dark.100: a tint of the brand, 1.2:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.

- **Token** `color.border.selected` → `trigger.edge.current` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** violet.light.600: the edge beside a selected fill, so selection is never color alone, 6.97:1 on surface.default, above the 3:1 floor.
  - **Dark** violet.dark.600: the edge beside a selected fill, so selection is never color alone, 7.62:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `border-width.default` → `trigger.edge-width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1
:::

:::panel{id="part-4" title="Focus ring" note="Parts 4" media="side"}
![Focus ring: 4](/anatomy/dense-data/tabs/card-4.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA contrast for every text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Keyboard users must always see where they are.

- **Token** `color.border.focus` → `trigger.focus-ring` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** violet.light.600: the focus ring, so the keyboard's place is never lost, 6.97:1 on surface.default, above the 3:1 floor.
  - **Dark** violet.dark.600: the focus ring, so the keyboard's place is never lost, 7.62:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `trigger.focus-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `border-width.focus-offset` → `trigger.focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `trigger.focus-ring-offset` #F7F8FA · dark #0D1117 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.06:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.1:1 from surface.default, so cards and panels stand forward.
:::

:::panel{id="part-5" title="Panel" note="Parts 5" media="side"}
![Panel: 5](/anatomy/dense-data/tabs/card-5.png)

:label[Containment]

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For items that belong together, use space.gap.tight. Don't use space.gap.group.

  Things that belong together sit close.

- **Token** `space.gap.default` → `content.padding-top` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `tabs`.
- **From a terminal:** `npx open-ds anatomy dense-data tabs`
