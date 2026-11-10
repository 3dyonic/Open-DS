---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 8.5
slug: "breadcrumb/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Breadcrumb in Accessible first."
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
![Breadcrumb, every part numbered](/anatomy/accessible-first/breadcrumb/stage.png)
*Accessible first, light, drawn in Figma from the scheme's tokens.*

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
![Link: 1, 5](/anatomy/accessible-first/breadcrumb/card-1.png)

:label[Affordance] :label[Feedback]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Answer** Motion · How fast does feedback feel? → Moderate

  Moderate speed is easy to follow.

- **Rule** For a link, use color.text.link, underlined. Don't use color only.

  Underline works without color perception.

- **Rule** For hover and press feedback, use motion.duration.feedback (moderate). Don't use fast flicker.

  Moderate speed is easy to follow.

- **Token** `color.text.muted` → `list.label` #595959 · dark #B4B4B4 :label[By scheme]{tone="info"}

  The quietest text.

  - **Pick** neutral.500: the quietest text that still reads, 7.0:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.600: the quietest text that still reads, 8.89:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** border.strong, category.5, disabled.text. Changing this pick moves only what reads color.text.muted.

- **Token** `type.body.font-size` → `list.font-size` 1.1875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.19

- **Token** `color.text.primary` → `link.label-hover` #141414 · dark #F7F7F7 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.42:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.2:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `motion.duration.feedback` → `link.duration` 200ms :label[By scheme]{tone="info"}

  - **Pick** duration.moderate

- **Token** `motion.easing.standard` → `link.easing` [0.2,0,0,1] :label[By scheme]{tone="info"}

  - **Pick** easing.standard
:::

:::panel{id="part-2-3" title="Separator and ellipsis" note="Parts 2, 3" media="side"}
![Separator and ellipsis: 2, 3](/anatomy/accessible-first/breadcrumb/card-2.png)

:label[Grouping]

- **Answer** Iconography · How big are icons next to text? → Larger than the text

  Larger icons are easier to see.

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Generous space lowers mis-taps.

- **Token** `size.icon` → `separator.icon-size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20

- **Token** `size.icon` → `ellipsis.icon-size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20

- **Token** `component-spacing-map.x2` → `list.gap` 0.5rem

  - **Pick** space.8

- **Token** `component-spacing-map.x3` → `list.wide.gap` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** space.20

- **Token** `component-spacing-map.x2` → `item.gap` 0.5rem

  - **Pick** space.8
:::

:::panel{id="part-4" title="Current page" note="Parts 4" media="side"}
![Current page: 4](/anatomy/accessible-first/breadcrumb/card-3.png)

:label[Hierarchy] :label[Meaning]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Token** `color.text.primary` → `page.label` #141414 · dark #F7F7F7 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.42:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.2:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `type.body.font-weight` → `page.font-weight` 400

  - **Pick** font.weight.400
:::

:::panel{id="part-6" title="Focus ring" note="Parts 6" media="side"}
![Focus ring: 6](/anatomy/accessible-first/breadcrumb/card-4.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AAA for text

  AAA contrast for text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus, with an offset. Don't use a thin or faint outline.

  Focus must be seen by everyone.

- **Token** `color.border.focus` → `link.focus-ring-focus` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** blue.light.600: the focus ring, so the keyboard's place is never lost, 7.26:1 on surface.default, above the 3:1 floor.
  - **Dark** blue.dark.600: the focus ring, so the keyboard's place is never lost, 8.74:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `link.focus-width` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3

- **Token** `border-width.focus-offset` → `link.focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `link.focus-ring-offset-focus` #F7F7F7 · dark #0A0A0A :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.07:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.07:1 from surface.default, so cards and panels stand forward.
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `breadcrumb`.
- **From a terminal:** `npx open-ds anatomy accessible-first breadcrumb`
