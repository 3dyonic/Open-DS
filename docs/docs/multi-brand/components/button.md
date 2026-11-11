---
composite_data: "./button.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 10
title: "Button"
description: "Button in Multi-brand."
---

# Button

A control that commits an action on this screen.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{robot="slumber" id="button/live"}

## When to use it

**In Multi-brand:** Every action.

- **Use it when:** The press does something here: save, submit, delete, open a dialog, go to the next step.
- **Not when:** The press only takes people to another page, or flips a setting that should persist.

Instead:

- [Toggle](./toggle.md): An on or off setting that should persist as state.
- Link: Navigation to another page or section.

## Variants

What each variant is for in any design system, then what Multi-brand decided and why. Each sample is the live story with that variant set.

:::panel{title="primary" note="variant" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="button/variant/primary"}

**What it is for**

The one action this view is for.

- ✓ One commit: Submit, Save, Continue, Start, Next.
- ✕ A second equally loud action on the same view.

**In Multi-brand**

One clear action per view.

**Because**

- [Which outcome matters most? **Completion without errors**](#why-outcomes-q1) · `outcomes.q1`
:::

:::panel{title="secondary" note="variant" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="button/variant/secondary"}

**What it is for**

A real action, quieter than the commit.

- ✓ Cancel, Back or Reset next to a primary, or an action with no commit beside it.
- ✕ It is the only action; then it is primary.

**In Multi-brand**

The alternative that steps back, and the first step of a delete.

**Because**

- [How many emphasis levels do actions need? **Three**](#why-color-count) · `color.count`
- [What is a costly mistake? **Looking off-brand**](#why-outcomes-q2) · `outcomes.q2`
:::

:::panel{title="danger" note="variant" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="button/variant/danger"}

**What it is for**

A destructive commit, after a confirm.

- ✓ The confirm step of a delete or remove, with the verb: Delete 40 alerts.
- ✕ The first step of a delete; that is secondary. Anything that does not destroy data.

**In Multi-brand**

The confirm of a delete, the same red in every brand: danger never follows the brand.

**Because**

- [What is a costly mistake? **Looking off-brand**](#why-outcomes-q2) · `outcomes.q2`
:::

:::panel{title="ghost" note="variant" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="button/variant/ghost"}

**What it is for**

The lowest emphasis; it never competes with the commit.

- ✓ A third option, a card or row action, a toast action.
- ✕ The page's main task; that is primary.

**In Multi-brand**

Row actions, with a word.

**Because**

- [How do people recall the interface? **They see it fresh each time**](#why-human-q2) · `human.q2`
:::

:::panel{title="default" note="size" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="button/size/default"}

**What it is for**

The normal size, for ordinary actions in forms, dialogs and page chrome.

**In Multi-brand**

Every button, at touch size: customers are often on phones.

**Because**

- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="compact" note="size" label="Not used in Multi-brand" tone="neutral"}
::preview{robot="slumber" id="button/size/compact"}

**What it is for**

Denser, for toolbars and table rows that sit beside content.

- ✕ The page's main commit, or a control too small to hit.

**In Multi-brand**

Customers are often on phones: no compact controls.

**Because**

- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="icon" note="size" label="Not used in Multi-brand" tone="neutral"}
::preview{robot="slumber" id="button/size/icon"}

**What it is for**

Icon only: the name is not on screen.

- ✓ A repeated, known control in chrome: close, settings, more.
- ✕ A one-off or destructive action with no accessible name.

**In Multi-brand**

Customers use any device and hover hints never show on touch, so every button has a word.

**Because**

- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
- [What do icons do? **Actions, status and navigation**](#why-iconography-roles) · `iconography.roles`
:::

:::panel{title="large" note="size" label="Not used in Multi-brand" tone="neutral"}
::preview{robot="slumber" id="button/size/large"}

**What it is for**

The largest size: the one action that must stand out most.

- ✓ The single main call to action of a section or page.
- ✕ Ordinary actions, or more than one per section.

**In Multi-brand**

One clear action per view, at the normal size, in every brand.

**Because**

- [Which outcome matters most? **Completion without errors**](#why-outcomes-q1) · `outcomes.q1`
:::

:::panel{title="hover" note="state" label="Used in Multi-brand" tone="success"}
**What it is for**

The pointer is over the control: an extra cue, never the only cue.

- ✓ A mouse or trackpad can reach the control.
- ✕ Hover is the only way to tell it is a button; that fails on touch.

**In Multi-brand**

Moderate feedback, shared across brands.

**Because**

- [How fast does feedback feel? **Moderate**](#why-motion-values) · `motion.values`
:::

:::panel{title="focus" note="state" label="Used in Multi-brand" tone="success"}
**What it is for**

Keyboard or assistive tech is on this control. It must stay visible.

- ✓ Tab, Enter, Space, or focus restored after a dialog.
- ✕ The focus outline removed with no replacement.

**In Multi-brand**

Follows the brand, but always shows.

**Because**

- [What accessibility level do we commit to? **AA**](#why-people-q2) · `people.q2`
:::

:::panel{title="disabled" note="state" label="Used in Multi-brand" tone="success"}
**What it is for**

The action is not available. It must stay perceivable and say why.

- ✓ A control that must not run now, with a visible reason.
- ✕ A form's submit that could explain the problem on press instead.

**In Multi-brand**

Only with a visible reason next to it.

**Because**

- [What accessibility level do we commit to? **AA**](#why-people-q2) · `people.q2`
:::

::card-grid{id="anatomy-link/button"}

## How Multi-brand uses it

::::grid{columns="2"}
:::panel{title="An icon with no label"}
**Use** Not used: always add a word; a popover explains a fee

**Not** An icon button with a hover hint

On touch screens hover hints never show; a word says what will happen.
:::
:::panel{title="Keyboard focus"}
**Use** button/focus-ring (from the brand)

**Not** Removing the outline

Focus follows the brand but always shows.
:::
:::panel{title="The action that completes the task"}
**Use** Button primary, one per view

**Not** Two primaries

One clear action per view. Two primaries split attention.
:::
:::panel{title="An alternative or cancel"}
**Use** Button secondary

**Not** A second primary

The alternative steps back, so the one primary stays clear. A second primary would compete with it.
:::
:::panel{title="Delete or remove"}
**Use** Button secondary, then confirm with Button danger

**Not** Button primary

Confirm before destroying data.
:::
:::panel{title="An action on one row or item"}
**Use** Button ghost with a word

**Not** An icon alone

A word says what will happen.
:::
::::

## Why it works this way

Button looks the way it does because of 8 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Button, and what would move if it changed.

::reason-chain{id="button/outcomes.q1"}

::reason-chain{id="button/color.count"}

::reason-chain{id="button/outcomes.q2"}

::reason-chain{id="button/human.q2"}

::reason-chain{id="button/accessibility.values"}

::reason-chain{id="button/iconography.roles"}

::reason-chain{id="button/motion.values"}

::reason-chain{id="button/people.q2"}

## Words

- Shared structure: object, state, next step.
- Brand tone lives in headlines and marketing copy, not in errors.
- Errors and confirmations read the same in every brand.
- Use: Get started, Plan, Order. Avoid: Brand-specific words in errors, Jargon.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Cancel
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Get started

See [Voice and tone](../voice.md) for the whole voice.

## Accessibility and keyboard

| Keyboard | What happens | Not |
| --- | --- | --- |
| Moving through the page or a dialog. | Tab lands on the button in a logical order. | The control is skipped because it used HTML disabled. |
| The button is focused and the person confirms. | Enter runs the same action as a click. | Enter only works on submit buttons. |
| The button is focused. | Space runs the same action as a click. | Space scrolls the page instead. |
| The button opened a dialog, menu or popover that just closed. | After the action closes a surface, focus returns to the button. | Focus dropped on the page body. |

Test before you ship:

- [ ] The control has a name assistive tech can speak. Any button, especially an icon-only one.
- [ ] The focused control stays visible; color alone is not the cue. Keyboard or assistive-tech focus is on the button.
- [ ] Unavailable stays in the tab order and explains why. The action must not run, but focus must not jump away.
- [ ] A button that stays down exposes its pressed state. Pin, follow, or another sticky on or off on a button.
- [ ] A button that opens something exposes open or closed. The press reveals a menu, panel or more content.
- [ ] The hit area stays usable, including at a small size. Touch, pointer, or a compact toolbar button.

## Use it in code

```bash
npx open-ds add button
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Button reads 33 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Button's tokens to change Button alone.

::token-table{component="button"}
