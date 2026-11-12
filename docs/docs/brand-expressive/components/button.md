---
composite_data: "./button.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 10
title: "Button"
description: "Button in Brand expressive."
---

# Button

A control that commits an action on this screen.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{id="button/live"}

## When to use it

**In Brand expressive:** The one action: sign up.

- **Use it when:** The press does something here: save, submit, delete, open a dialog, go to the next step.
- **Not when:** The press only takes people to another page, or flips a setting that should persist.

Instead:

- [Toggle](./toggle.md): An on or off setting that should persist as state.
- Link: Navigation to another page or section.

## Variants

What each variant is for in any design system, then what Brand expressive decided and why. Each sample is the live story with that variant set.

:::panel{title="primary" note="variant" label="Used in Brand expressive" tone="success"}
::preview{id="button/variant/primary"}

**What it is for**

The one action this view is for.

- ✓ One commit: Submit, Save, Continue, Start, Next.
- ✕ A second equally loud action on the same view.

**In Brand expressive**

One loud call to action per section.

**Because**

- [Which outcome matters most? **Engagement**](#why-outcomes-q1) · `outcomes.q1`
:::

:::panel{title="secondary" note="variant" label="Used in Brand expressive" tone="success"}
::preview{id="button/variant/secondary"}

**What it is for**

A real action, quieter than the commit.

- ✓ Cancel, Back or Reset next to a primary, or an action with no commit beside it.
- ✕ It is the only action; then it is primary.

**In Brand expressive**

The first step of a delete, before the confirm.

**Because**

- [What is a costly mistake? **Looking off-brand**](#why-outcomes-q2) · `outcomes.q2`
:::

:::panel{title="danger" note="variant" label="Used in Brand expressive" tone="success"}
::preview{id="button/variant/danger"}

**What it is for**

A destructive commit, after a confirm.

- ✓ The confirm step of a delete or remove, with the verb: Delete 40 alerts.
- ✕ The first step of a delete; that is secondary. Anything that does not destroy data.

**In Brand expressive**

The confirm of a delete. It stays red, apart from the brand's pink.

**Because**

- [What is a costly mistake? **Looking off-brand**](#why-outcomes-q2) · `outcomes.q2`
:::

:::panel{title="ghost" note="variant" label="Used in Brand expressive" tone="success"}
::preview{id="button/variant/ghost"}

**What it is for**

The lowest emphasis; it never competes with the commit.

- ✓ A third option, a card or row action, a toast action.
- ✕ The page's main task; that is primary.

**In Brand expressive**

The alternative next to the primary, and row actions with a word.

**Because**

- [How many emphasis levels do actions need? **Three**](#why-color-count) · `color.count`
- [What do icons do? **Those and decoration**](#why-iconography-roles) · `iconography.roles`
:::

:::panel{title="default" note="size" label="Used in Brand expressive" tone="success"}
::preview{id="button/size/default"}

**What it is for**

The normal size, for ordinary actions in forms, dialogs and page chrome.

**In Brand expressive**

Every button, at touch size: phones first.

**Because**

- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="compact" note="size" label="Not used in Brand expressive" tone="neutral"}
::preview{id="button/size/compact"}

**What it is for**

Denser, for toolbars and table rows that sit beside content.

- ✕ The page's main commit, or a control too small to hit.

**In Brand expressive**

Phones first: no compact controls.

**Because**

- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="icon" note="size" label="Not used in Brand expressive" tone="neutral"}
::preview{id="button/size/icon"}

**What it is for**

Icon only: the name is not on screen.

- ✓ A repeated, known control in chrome: close, settings, more.
- ✕ A one-off or destructive action with no accessible name.

**In Brand expressive**

Phones first: hover hints never show, so every button has a word.

**Because**

- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
- [What do icons do? **Those and decoration**](#why-iconography-roles) · `iconography.roles`
:::

:::panel{title="large" note="size" label="Used in Brand expressive" tone="success"}
::preview{id="button/size/large"}

**What it is for**

The largest size: the one action that must stand out most.

- ✓ The single main call to action of a section or page.
- ✕ Ordinary actions, or more than one per section.

**In Brand expressive**

The one loud call to action per section.

**Because**

- [Which outcome matters most? **Engagement**](#why-outcomes-q1) · `outcomes.q1`
:::

:::panel{title="hover" note="state" label="Used in Brand expressive" tone="success"}
**What it is for**

The pointer is over the control: an extra cue, never the only cue.

- ✓ A mouse or trackpad can reach the control.
- ✕ Hover is the only way to tell it is a button; that fails on touch.

**In Brand expressive**

Relaxed, springy feedback: motion is part of the brand.

**Because**

- [What is motion for? **Feedback and expression**](#why-motion-roles) · `motion.roles`
- [How fast does feedback feel? **Fast**](#why-motion-values) · `motion.values`
:::

:::panel{title="focus" note="state" label="Used in Brand expressive" tone="success"}
**What it is for**

Keyboard or assistive tech is on this control. It must stay visible.

- ✓ Tab, Enter, Space, or focus restored after a dialog.
- ✕ The focus outline removed with no replacement.

**In Brand expressive**

Always shows, even on vivid color.

**Because**

- [What accessibility level do we commit to? **AA**](#why-people-q2) · `people.q2`
:::

:::panel{title="disabled" note="state" label="Used in Brand expressive" tone="success"}
**What it is for**

The action is not available. It must stay perceivable and say why.

- ✓ A control that must not run now, with a visible reason.
- ✕ A form's submit that could explain the problem on press instead.

**In Brand expressive**

Only with a visible reason next to it.

**Because**

- [What accessibility level do we commit to? **AA**](#why-people-q2) · `people.q2`
:::

::card-grid{id="anatomy-link/button"}

## How Brand expressive uses it

::::grid{columns="2"}
:::panel{title="An icon with no label"}
**Use** Not used: always add a word

**Not** An icon button with a hover hint

On phones, hover hints never show; a word says what will happen.
:::
:::panel{title="Keyboard focus"}
**Use** button/focus-ring at focus.ring.width

**Not** Removing the outline

Focus must show on vivid color.
:::
:::panel{title="The action that completes the task"}
**Use** Button primary, large, one per section

**Not** Two primaries

One loud call to action per section.
:::
:::panel{title="An alternative or cancel"}
**Use** Button ghost

**Not** A second primary

The alternative must not compete.
:::
:::panel{title="Delete or remove"}
**Use** Button secondary, then confirm with Button danger

**Not** Button primary

Confirm before destroying data.
:::
:::panel{title="An action on one row or item"}
**Use** Button ghost with a word

**Not** An icon alone

Visitors come rarely, so they never learn an icon. A word says what will happen.
:::
::::

## Why it works this way

Button looks the way it does because of 8 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Button, and what would move if it changed.

::reason-chain{id="button/outcomes.q1"}

::reason-chain{id="button/outcomes.q2"}

::reason-chain{id="button/color.count"}

::reason-chain{id="button/iconography.roles"}

::reason-chain{id="button/accessibility.values"}

::reason-chain{id="button/motion.roles"}

::reason-chain{id="button/motion.values"}

::reason-chain{id="button/people.q2"}

## Words

- Headlines are short and bold. Three to six words.
- Verbs that move: Join, Try, Go.
- Playful in headlines, plain in errors.
- Use: Join, Drop, Go, Love. Avoid: Synergy, Leverage, Kindly.

The labels components use, from the voice tokens:

- `content.action.commit`: Go
- `content.action.cancel`: Not now
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Explore the drop

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
