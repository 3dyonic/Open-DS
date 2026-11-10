---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 8.5
slug: "breadcrumb/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Breadcrumb in Dense data."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the breadcrumb apart to show how design decisions become the parts you see. You don't need it to use the breadcrumb: [its own page](../breadcrumb) has everything you need to build.

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
![Breadcrumb, every part numbered](/anatomy/dense-data/breadcrumb/stage.png)
*Dense data, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **List** required :label[Grouping]
  - **1** **Link** required :label[By scheme]{tone="info"} :label[Affordance] :label[Readability]
  - **2** **Separator** required :label[By scheme]{tone="info"} :label[Grouping]
  - **3** **Ellipsis** optional :label[By scheme]{tone="info"} :label[Grouping]
  - **4** **Current page** required :label[By scheme]{tone="info"} :label[Hierarchy] :label[Meaning]
- **5** **Link under the pointer** state :label[By scheme]{tone="info"} :label[Feedback]
- **6** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-5" title="Link" note="Parts 1, 5" media="side"}
![Link: 1, 5](/anatomy/dense-data/breadcrumb/card-1.png)

:label[Affordance] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Answer** Motion · How fast does feedback feel? → Fast

  Fast feedback keeps up with experts.

- **Rule** For a link, use color.text.link. Don't use color.action.primary.

  Links and buttons look different, so people know which one navigates.

- **Rule** For hover and press feedback, use motion.duration.feedback (fast). Don't use no transition.

  Fast feedback confirms the pointer without slowing experts.

- **Token** `color.text.muted` → `list.label` #535D6D · dark #969FAD :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.600: the quietest text that still reads, 6.66:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.400: the quietest text that still reads, 6.47:1 on surface.default, above the 4.5:1 floor.

- **Token** `type.body.font-size` → `list.font-size` 0.875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.14

- **Token** `color.text.primary` → `link.label-hover` #161B23 · dark #F7F8FA :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.28:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.26:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `motion.duration.feedback` → `link.duration` 120ms :label[By scheme]{tone="info"}

  - **Pick** duration.fast

- **Token** `motion.easing.standard` → `link.easing` [0.2,0,0,1] :label[By scheme]{tone="info"}

  - **Pick** easing.standard
:::

:::panel{id="part-2-3" title="Separator and ellipsis" note="Parts 2, 3" media="side"}
![Separator and ellipsis: 2, 3](/anatomy/dense-data/breadcrumb/card-2.png)

:label[Grouping]

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the label so they do not outweigh it.

- **Answer** Spacing · How dense is the layout? → Compact

  Compact spacing shows more records.

- **Rule** For items that belong together, use space.gap.tight. Don't use space.gap.group.

  Things that belong together sit close.

- **Token** `size.icon` → `separator.icon-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `size.icon` → `ellipsis.icon-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `component-spacing-map.x2` → `list.gap` 0.5rem

  - **Pick** space.8

- **Token** `component-spacing-map.x3` → `list.wide.gap` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12

- **Token** `component-spacing-map.x2` → `item.gap` 0.5rem

  - **Pick** space.8
:::

:::panel{id="part-4" title="Current page" note="Parts 4" media="side"}
![Current page: 4](/anatomy/dense-data/breadcrumb/card-3.png)

:label[Hierarchy] :label[Meaning]

- **Answer** Typography · Which text roles does it need? → Core and data

  A data role keeps numbers in aligned columns.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Surface, text, action and status cover an operations tool.

- **Token** `color.text.primary` → `page.label` #161B23 · dark #F7F8FA :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.28:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 16.26:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `type.body.font-weight` → `page.font-weight` 400

  - **Pick** font.weight.400
:::

:::panel{id="part-6" title="Focus ring" note="Parts 6" media="side"}
![Focus ring: 6](/anatomy/dense-data/breadcrumb/card-4.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA contrast for every text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus. Don't use removing the outline.

  Keyboard users must always see where they are.

- **Token** `color.border.focus` → `link.focus-ring-focus` #4B3FD9 · dark #A9A3F6 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** violet.light.600: the focus ring, so the keyboard's place is never lost, 6.97:1 on surface.default, above the 3:1 floor.
  - **Dark** violet.dark.600: the focus ring, so the keyboard's place is never lost, 7.62:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `link.focus-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `border-width.focus-offset` → `link.focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `link.focus-ring-offset-focus` #F7F8FA · dark #0D1117 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.06:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.1:1 from surface.default, so cards and panels stand forward.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `breadcrumb`.
- **From a terminal:** `npx open-ds anatomy dense-data breadcrumb`
