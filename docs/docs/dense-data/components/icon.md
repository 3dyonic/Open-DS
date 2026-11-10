---
composite_data: "./icon.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 30
title: "Icon"
description: "Icon in Dense data."
---

# Icon

One small picture that marks an action or a status, beside its word. Open DS draws every icon with one open-source set, Lucide; the scheme sets its size and stroke.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="icon/live"}

## When to use it

**In Dense data:** Row actions and status, beside their words.

- **Use it when:** An icon in content or new UI: beside a word, in an icon button with a label, at the large size, or in a contained shape.
- **Not when:** Inside a component that already draws its icon, such as Select or Accordion: those draw Lucide directly and follow the same tokens.

Instead:

- [Badge](./badge.md): A status label, with a word.
- [Button](./button.md): Something to press; it can hold an Icon.

## Variants

What each variant is for in any design system, then what Dense data decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="size" label="Used in Dense data" tone="success"}
::preview{robot="slumber" id="icon/size/default"}

**What it is for**

The size of the text the icon sits beside.

- ✓ Almost always: beside a word, in a row or a toolbar.
- ✕ A feature that leads a section, where the scheme has a large size.

**In Dense data**

16px, the size of the small text in rows and toolbars.

**Because**

- [How many icon sizes exist? **One**](#why-iconography-count) · `iconography.count`
- [How big are icons next to text? **Match the text**](#why-iconography-values) · `iconography.values`
:::

:::panel{title="large" note="size" label="Not used in Dense data" tone="neutral"}
::preview{robot="slumber" id="icon/size/large"}

**What it is for**

A larger step, for schemes that answer two icon sizes.

- ✓ An icon that leads a card or a section on its own.
- ✕ Beside running text or in a row.

**In Dense data**

Dense data has one icon size.

**Because**

- [How many icon sizes exist? **One**](#why-iconography-count) · `iconography.count`
:::

:::panel{title="plain" note="variant" label="Used in Dense data" tone="success"}
::preview{robot="slumber" id="icon/variant/plain"}

**What it is for**

The icon alone, in the color of the text beside it.

- ✓ Every icon by default.
- ✕ The scheme's style answer asks for a contained look.

**In Dense data**

Every icon: outline at a 1.5px stroke.

**Because**

- [What icon style and stroke? **Outline**](#why-iconography-definition) · `iconography.definition`
:::

:::panel{title="contained-tint" note="variant" label="Not used in Dense data" tone="neutral"}
::preview{robot="slumber" id="icon/variant/contained-tint"}

**What it is for**

The icon in a tinted shape.

- ✓ The scheme answers a contained style: a feature or a list item that leads with its icon.
- ✕ Beside running text, or many times in one row.

**In Dense data**

Outline icons stay light next to dense text; a shape would add weight to every row.

**Because**

- [What icon style and stroke? **Outline**](#why-iconography-definition) · `iconography.definition`
:::

:::panel{title="contained-solid" note="variant" label="Not used in Dense data" tone="neutral"}
::preview{robot="slumber" id="icon/variant/contained-solid"}

**What it is for**

The icon on a solid fill, in the on-action color.

- ✓ One strong mark per view, where the scheme answers a contained style.
- ✕ More than once in a view: it competes with the primary action.

**In Dense data**

Outline icons stay light next to dense text.

**Because**

- [What icon style and stroke? **Outline**](#why-iconography-definition) · `iconography.definition`
:::

::card-grid{id="anatomy-link/icon"}

## How Dense data uses it

::::grid{columns="2"}
:::panel{title="An icon with no label"}
**Use** Icon button with a tooltip

**Not** A bare icon

Experts learn icons; the tooltip covers the first uses.
:::
:::panel{title="An action on one row or item"}
**Use** Icon button, ghost, compact

**Not** Button secondary in every row

Rows repeat dozens of times; a quiet icon keeps the table readable.
:::
::::

## Why it works this way

Icon looks the way it does because of 3 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Icon, and what would move if it changed.

::reason-chain{id="icon/iconography.count"}

::reason-chain{id="icon/iconography.values"}

::reason-chain{id="icon/iconography.definition"}

## Words

- Lead with the object, then the state: "Alert 2041 contained."
- Use numbers, not words for numbers.
- One verb per button. No "please", no exclamation marks.
- Use: Investigate, Filter, Assign, Escalated, Resolved. Avoid: Oops, Awesome, Please, Simply.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Cancel
- `content.action.destroy`: Delete
- `content.action.retry`: Retry
- `content.action.empty-action`: Change filters

See [Voice and tone](../voice.md) for the whole voice.

## Accessibility and keyboard

Test before you ship:

- [ ] Hidden from screen readers by default: the word beside it carries the meaning. undefined
- [ ] With no word on screen, the label is its accessible name. undefined

## Use it in code

```bash
npx open-ds add icon
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Icon reads 8 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Icon's tokens to change Icon alone.

::token-table{component="icon"}
