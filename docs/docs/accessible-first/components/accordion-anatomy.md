---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 1.5
slug: "accordion/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Accordion in Accessible first."
---

:::intro{robot="anatomy" title="Look closer, when you want to"}
This page takes the accordion apart to show how design decisions become the parts you see. You don't need it to use the accordion: [its own page](../accordion) has everything you need to build.

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
![Accordion, every part numbered](/anatomy/accessible-first/accordion/stage.png)
*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **Item** required :label[Grouping]
  - **1** **Item and its divider** required :label[By scheme]{tone="info"} :label[Grouping]
  - **2** **Trigger** required :label[By scheme]{tone="info"} :label[Affordance] :label[Hierarchy] :label[Reach]
  - **3** **Chevron** required :label[By scheme]{tone="info"} :label[Affordance] :label[Feedback]
  - **4** **Open item** state :label[By scheme]{tone="info"} :label[Feedback] :label[Meaning]
  - **5** **Content** required :label[By scheme]{tone="info"} :label[Readability]
  - **6** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
  - **7** **Disabled trigger** state :label[By scheme]{tone="info"} :label[Feedback]
:::

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Item and divider" note="Parts 1" media="side"}
![Item and divider: 1](/anatomy/accessible-first/accordion/card-1.png)

:label[Grouping]

- **Answer** Color · Which color roles does it need? → Surface, text, action and status

  Few color roles, each with one clear meaning.

- **Answer** Shape · What should control corners say? → Slightly rounded

  Clear, slightly rounded controls.

- **Rule** For between page sections, use space.gap.section. Don't use a thin line.

  Space is easy to see; thin lines are not.

- **Token** `border-width.default` → `item.divider.width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2
:::

:::panel{id="part-2" title="Trigger" note="Parts 2" media="side"}
![Trigger: 2](/anatomy/accessible-first/accordion/card-2.png)

:label[Affordance] :label[Hierarchy] :label[Reach]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size.

  Large targets help people with motor needs.

- **Token** `color.text.primary` → `trigger.label` #141414 · dark #F7F7F7 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.42:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.2:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `type.label.font-weight` → `trigger.font-weight` 700 :label[By scheme]{tone="info"}

  - **Pick** font.weight.700

- **Token** `space.inset.container` → `trigger.padding-y` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `space.gap.group` → `trigger.gap` 2rem :label[By scheme]{tone="info"}

  - **Pick** space.32
:::

:::panel{id="part-3-4" title="Chevron and open item" note="Parts 3, 4" media="side"}
![Chevron and open item: 3, 4](/anatomy/accessible-first/accordion/card-3.png)

:label[Affordance] :label[Feedback]

- **Answer** Iconography · How big are icons next to text? → Larger than the text

  Larger icons are easier to see.

- **Answer** Motion · How fast does feedback feel? → Moderate

  Moderate speed is easy to follow.

- **Rule** For someone asked for less motion, use No motion. Don't use reduced motion.

  A shorter motion still moves. When people ask for less motion, nothing moves.

- **Token** `size.icon` → `icon.size` 1.25rem :label[By scheme]{tone="info"}

  - **Pick** size.20

- **Token** `motion.duration.feedback` → `icon.duration` 200ms :label[By scheme]{tone="info"}

  - **Pick** duration.moderate
:::

:::panel{id="part-5" title="Content" note="Parts 5" media="side"}
![Content: 5](/anatomy/accessible-first/accordion/card-4.png)

:label[Readability]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For paragraph or help text, use type.body, short sentences. Don't use type.caption.

  Large text and short lines lower effort.

- **Token** `type.body.font-size` → `content.font-size` 1.1875rem :label[By scheme]{tone="info"}

  - **Pick** font.size.19

- **Token** `space.inset.container` → `content.padding-bottom` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-6" title="Focus ring" note="Parts 6" media="side"}
![Focus ring: 6](/anatomy/accessible-first/accordion/card-5.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AAA for text

  AAA contrast for text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus, with an offset. Don't use a thin or faint outline.

  Focus must be seen by everyone.

- **Token** `border-width.focus` → `trigger.focus-ring.width` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3

- **Token** `border-width.focus-offset` → `trigger.focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `trigger.focus-ring-offset-focus` #F7F7F7 · dark #0A0A0A :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.07:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.07:1 from surface.default, so cards and panels stand forward.
:::

:::panel{id="part-7" title="Disabled trigger" note="Parts 7" media="side"}
![Disabled trigger: 7](/anatomy/accessible-first/accordion/card-6.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Token** `opacity.disabled` → `trigger.disabled.opacity` 0.5 :label[By scheme]{tone="info"}

  - **Pick** opacity.50
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `accordion`.
- **From a terminal:** `npx open-ds anatomy accessible-first accordion`
