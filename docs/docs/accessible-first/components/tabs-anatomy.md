---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 58.5
slug: "tabs/anatomy"
sidebar_label: "Anatomy reference"
sidebar_class_name: "ods-anatomy"
hide_table_of_contents: true
title: "Anatomy reference"
description: "How the design decisions reach each part of Tabs in Accessible first."
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

![Tabs, every part numbered](/anatomy/accessible-first/tabs/stage.png)

*Accessible first, light, drawn in Figma from the scheme's tokens.*

Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.

:label[By scheme]{tone="info"} Its value changes by scheme. The part is the same in every scheme.

- **1** **Tab list** required :label[By scheme]{tone="info"} :label[Grouping]
- **Tab** required :label[Reach] :label[Affordance] :label[Readability]
  - **2** **Tab label** required :label[By scheme]{tone="info"} :label[Readability]
  - **3** **Current tab** state :label[By scheme]{tone="info"} :label[Meaning] :label[Feedback]
  - **4** **Focus ring** state :label[By scheme]{tone="info"} :label[Focus]
- **5** **Panel** required :label[By scheme]{tone="info"} :label[Containment]

## How the decisions reach each part

Each part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.

:::panel{id="part-1" title="Tab list" note="Parts 1"}
![Tab list: 1](/anatomy/accessible-first/tabs/card-1.png)

:label[Grouping]

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Generous space lowers mis-taps.

- **Token** `space.gap.tight` → `list.gap` 0.75rem :label[By scheme]{tone="info"}

  - **Pick** space.12

- **Token** `color.border.default` → `list.border` #D6D6D6 · dark #333333 :label[By scheme]{tone="info"}

  Quiet edges and dividers. Decorative, so it has no contrast minimum.

  - **Pick** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.36:1, on surface.canvas). It decorates, so it holds no contrast minimum.
  - **Dark** neutral.200: a quiet line that stays visible on every surface it meets (lowest 1.46:1, on surface.default). It decorates, so it holds no contrast minimum.
  - **Shares the step with** surface.pressed, disabled.border. Changing this pick moves only what reads color.border.default.

- **Token** `border-width.default` → `list.border-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2
:::

:::panel{id="part-2" title="Tab" note="Parts 2"}
![Tab: 2](/anatomy/accessible-first/tabs/card-2.png)

:label[Reach] :label[Readability]

- **Answer** Accessibility · What is the smallest target? → Large

  Large targets for tremor and touch.

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Answer** Typography · Which text roles does it need? → Core: heading, body, label

  Few roles keep pages predictable.

- **Rule** For the smallest clickable thing, use size.control.default (large). Don't use touch-minimum size.

  Large targets help people with motor needs.

- **Token** `size.control.default` → `trigger.height` 3.25rem :label[By scheme]{tone="info"}

  - **Pick** size.52

- **Token** `space.inset.control-x` → `trigger.padding-x` 1.5rem :label[By scheme]{tone="info"}

  - **Pick** space.24

- **Token** `color.text.primary` → `trigger.label` #141414 · dark #F7F7F7 :label[By scheme]{tone="info"}

  Body text and headings.

  - **Pick** neutral.900: the strongest text step, 18.42:1 on surface.default, above the 7:1 floor.
  - **Dark** neutral.900: the strongest text step, 17.2:1 on surface.default, above the 7:1 floor.
  - **Shares the step with** surface.inverse. Changing this pick moves only what reads color.text.primary.

- **Token** `type.label.font-size` → `trigger.font-size` 1.125rem :label[By scheme]{tone="info"}

  - **Pick** font.size.18
:::

:::panel{id="part-3" title="Current tab" note="Parts 3"}
![Current tab: 3](/anatomy/accessible-first/tabs/card-3.png)

:label[Meaning] :label[Feedback]

- **Answer** Accessibility · How many signals carry each meaning? → Three: color, icon and word

  Never color alone.

- **Answer** Accessibility · Which states get their own visible value? → All, including loading

  Every state, including loading, gets its own value.

- **Rule** For a selected row or item, use color.surface.selected and a check icon. Don't use color alone.

  Selection never relies on color alone.

- **Token** `color.surface.selected` → `trigger.background.current` #E2EDFF · dark #102547 :label[By scheme]{tone="info"}

  The fill of a selected or current item, or a toggle that is on.

  - **Pick** blue.light.100: a tint of the brand, 1.18:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Dark** blue.dark.100: a tint of the brand, 1.21:1 from content, always beside its edge (border.selected), so selection is never color alone.
  - **Shares the step with** category.1.subtle. Changing this pick moves only what reads color.surface.selected.

- **Token** `color.border.selected` → `trigger.edge.current` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The edge that marks a selected item, beside its fill, so selection is never color alone.

  - **Pick** blue.light.600: the edge beside a selected fill, so selection is never color alone, 7.26:1 on surface.default, above the 3:1 floor.
  - **Dark** blue.dark.600: the edge beside a selected fill, so selection is never color alone, 8.74:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.focus, action.primary, category.1. Changing this pick moves only what reads color.border.selected.

- **Token** `border-width.default` → `trigger.edge-width` 2px :label[By scheme]{tone="info"}

  - **Pick** border-width.2
:::

:::panel{id="part-4" title="Focus ring" note="Parts 4"}
![Focus ring: 4](/anatomy/accessible-first/tabs/card-4.png)

:label[Focus]

- **Answer** Accessibility · What contrast floor do we hold? → AAA for text

  AAA contrast for text.

- **Rule** For keyboard focus, use button/focus-ring at border-width.focus, with an offset. Don't use a thin or faint outline.

  Focus must be seen by everyone.

- **Token** `color.border.focus` → `trigger.focus-ring` #0B4FC0 · dark #8AB4F8 :label[By scheme]{tone="info"}

  The focus ring.

  - **Pick** blue.light.600: the focus ring, so the keyboard's place is never lost, 7.26:1 on surface.default, above the 3:1 floor.
  - **Dark** blue.dark.600: the focus ring, so the keyboard's place is never lost, 8.74:1 on surface.default, above the 3:1 floor.
  - **Shares the step with** border.selected, action.primary, category.1. Changing this pick moves only what reads color.border.focus.

- **Token** `border-width.focus` → `trigger.focus-width` 3px :label[By scheme]{tone="info"}

  - **Pick** border-width.3

- **Token** `border-width.focus-offset` → `trigger.focus-offset` 2px

  - **Pick** border-width.2

- **Token** `color.surface.canvas` → `trigger.focus-ring-offset` #F7F7F7 · dark #0A0A0A :label[By scheme]{tone="info"}

  The page background behind everything.

  - **Pick** neutral.50, under content: 1.07:1 from surface.default, so cards and panels stand forward.
  - **Dark** neutral.0, under content: 1.07:1 from surface.default, so cards and panels stand forward.
:::

:::panel{id="part-5" title="Panel" note="Parts 5"}
![Panel: 5](/anatomy/accessible-first/tabs/card-5.png)

:label[Containment]

- **Answer** Spacing · How dense is the layout? → Spacious

  Space lowers effort and mis-taps.

- **Rule** For items that belong together, use space.gap.default. Don't use space.gap.tight.

  Generous space lowers mis-taps.

- **Token** `space.gap.default` → `content.padding-top` 1rem :label[By scheme]{tone="info"}

  - **Pick** space.16
:::

## For agents

Agents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.

- **From an AI agent:** call the `get_anatomy` tool on the Open DS MCP server, with this scheme and `tabs`.
- **From a terminal:** `npx open-ds anatomy accessible-first tabs`
