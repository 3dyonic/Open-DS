---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 1.5
slug: "accordion/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Accordion in Multi-brand."
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

![Accordion, every part numbered](/anatomy/multi-brand/accordion/stage.png)

*Multi-brand, light, drawn in Figma from the scheme's tokens.*

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

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Item and divider" note="Parts 1"}
![Item and divider: 1](/anatomy/multi-brand/accordion/card-1.png)

:label[Grouping]

- **Answer** Color · Which color roles does it need? → Those and brand accents

  Each brand brings its own accent ramp.

- **Answer** Shape · What should control corners say? → Rounded

  Rounded by default; each brand sets its own corner.

- **Rule** For between page sections, use space.gap.section and cards. Don't use lines.

  Cards hold each offer together, so customers compare offers as units in every brand. Lines would split an offer apart.

- **Token** `border-width.default` → `item.divider.width` 1px :label[By scheme]{tone="info"}

  - **Pick** border-width.1
:::

:::panel{id="part-2" title="Trigger" note="Parts 2"}
![Trigger: 2](/anatomy/multi-brand/accordion/card-2.png)

:label[Affordance] :label[Hierarchy] :label[Reach]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  One set of roles across brands.

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Rule** For the smallest clickable thing, use size.control.default (touch). Don't use a compact control.

  Customers are often on phones.

- **Token** `color.text.primary` → `trigger.label` #0F172A · dark #F8FAFC :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 17.85:1 on surface.default, above the 4.5:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.06:1 on surface.default, above the 4.5:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `type.label.font-weight` → `trigger.font-weight` 600 :label[By scheme]{tone="info"}

  - **Pick** font.weight.600

- **Token** `space.inset.container` → `trigger.padding-y` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `space.gap.group` → `trigger.gap` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-3-4" title="Chevron and open item" note="Parts 3, 4"}
![Chevron and open item: 3, 4](/anatomy/multi-brand/accordion/card-3.png)

:label[Affordance] :label[Feedback]

- **Answer** Iconography · How big are icons next to text? → Match the text

  Icons match the text.

- **Answer** Motion · How fast does feedback feel? → Moderate

  Moderate speed across brands.

- **Rule** For someone asked for less motion, use Reduced motion. Don't use full motion.

  Motion is reduced, not removed: a fade keeps the change visible, and nothing slides.

- **Token** `size.icon` → `icon.size` 1rem :label[By scheme]{tone="info"}

  - **Pick** size.16

- **Token** `motion.duration.feedback` → `icon.duration` 200ms :label[By scheme]{tone="info"}

  - **Pick** duration.moderate
:::

:::panel{id="part-5" title="Content" note="Parts 5"}
![Content: 5](/anatomy/multi-brand/accordion/card-4.png)

:label[Readability]

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  One set of roles across brands.

- **Answer** Spacing · How dense is the layout? → Comfortable

  Comfortable spacing in every brand.

- **Rule** For paragraph or help text, use type.body. Don't use type.caption.

  Regular body size suits every brand.

- **Token** `type.body.font-size` → `content.font-size` 1rem :label[By scheme]{tone="info"}

  - **Pick** font.size.16

- **Token** `space.inset.container` → `content.padding-bottom` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24
:::

:::panel{id="part-6" title="Focus ring" note="Parts 6"}
![Focus ring: 6](/anatomy/multi-brand/accordion/card-5.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AA

  AA in every brand and mode.

- **Rule** For keyboard focus, use button/focus-ring (from the brand). Don't use removing the outline.

  Focus follows the brand but always shows.

- **Token** `border-width.focus` → `trigger.focus-ring.width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2

- **Token** `border-width.focus-offset` → `trigger.focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `trigger.focus-ring-offset-focus` #F8FAFC · dark #020617 :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.05:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.13:1 from surface.default, so cards and panels stand forward.
:::

:::panel{id="part-7" title="Disabled trigger" note="Parts 7"}
![Disabled trigger: 7](/anatomy/multi-brand/accordion/card-6.png)

:label[Feedback]

- **Answer** Accessibility · Which states get their own visible value? → Those and pressed

  Pressed for touch.

- **Token** `opacity.disabled` → `trigger.disabled.opacity` 0.4 :label[By scheme]{tone="info"}

  - **Pick** opacity.40
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `accordion`.
- **From a terminal:** `npx open-ds anatomy multi-brand accordion`
