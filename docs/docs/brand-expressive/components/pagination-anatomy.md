---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 43.5
slug: "pagination/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Pagination in Brand expressive."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the pagination apart to show how design decisions become the parts you see. You don't need it to use the pagination: [its own page](../pagination) has everything you need to build.

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

![Pagination, every part numbered](/anatomy/brand-expressive/pagination/stage.png)

*Brand expressive, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Previous** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
- **Pages** required :label[Grouping]
  - **2** **Page** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
  - **3** **Current page** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
  - **4** **Ellipsis** optional :label[By scheme]{tone="info"} :label[Grouping]
  - **5** **Gap** required :label[By scheme]{tone="info"} :label[Grouping] :label[Reach]
- **6** **Next** required :label[By scheme]{tone="info"} :label[Affordance] :label[Reach]
- **Page links** required · shown by Button :label[Affordance]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1-6" title="Previous and next" note="Parts 1, 6"}
![Previous and next: 1, 6](/anatomy/brand-expressive/pagination/card-1.png)

:label[Affordance] :label[Reach]

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Answer** Accessibility · What is the smallest target? → Touch size

  Visitors come from social posts on phones.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Most visitors arrive on phones, and a compact control is too small for a thumb.

- **Token** `space.gap.tight` → `link.gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8

- **Token** `component-spacing-map.x3` → `link.padding-x` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `component-spacing-map.x3` → `previous.padding-left` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `component-spacing-map.x3` → `next.padding-right` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-2-3" title="Pages" note="Parts 2, 3"}
![Pages: 2, 3](/anatomy/brand-expressive/pagination/card-2.png)

:label[Affordance] :label[Meaning]

- **Answer** Accessibility · What is the smallest target? → Touch size

  Visitors come from social posts on phones.

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Brand accents are part of the message.

- **Rule** For an alternative or cancel, use Button ghost. Don't use a second primary.

  The alternative must not compete.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Most visitors arrive on phones, and a compact control is too small for a thumb.

- **Token** `color.text.link` → `button.ghost.label` #A6025B · dark #FBB4D8 :label[By scheme]{tone="info"}

  Links in running text.

  - **Pick** pink.light.700: a link, set apart by its hue, 7.55:1 on surface.default, above the 4.5:1 floor.
  - **Dark** pink.dark.700: a link, set apart by its hue, 10.82:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** action.primary.hover. Changing this pick moves only what reads color.text.link.

- **Token** `color.border.strong` → `button.secondary.border` #8A6F63 · dark #B5988A :label[By scheme]{tone="info"}

  The edge of a control people must find.

  - **Pick** neutral.500: the edge of a control people must find, 4.63:1 on surface.default, above the 3:1 floor.
  - **Dark** neutral.400: the edge of a control people must find, 6.71:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** category.5, disabled.text. Changing this pick moves only what reads color.border.strong.

- **Token** `size.control.default` → `button.height` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52
:::

:::panel{id="part-4-5" title="Ellipsis and gap" note="Parts 4, 5"}
![Ellipsis and gap: 4, 5](/anatomy/brand-expressive/pagination/card-3.png)

:label[Grouping]

- **Answer** Iconography · How big are icons next to text? → Larger than the text

  Larger icons hold their own next to big type.

- **Answer** Spacing · How dense is the layout? → Spacious

  Big space makes big moments.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Air keeps big type readable.

- **Token** `size.icon` → `ellipsis.icon-size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20

- **Token** `space.gap.tight` → `content.gap` 0.5rem :label[By scheme]{tone="info"}

  - **Pick** space.8
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `pagination`.
- **From a terminal:** `npx open-ds anatomy brand-expressive pagination`
