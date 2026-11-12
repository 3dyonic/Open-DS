---
composite_data: "./button.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 10
title: "Button"
description: "Button in Content first."
---

# Button

A control that commits an action on this screen.

:label[In Content first]{tone="info"}

## See it live

::preview{id="button/live"}

## When to use it

**In Content first:** Subscribe, share and save.

- **Use it when:** The press does something here: save, submit, delete, open a dialog, go to the next step.
- **Not when:** The press only takes people to another page, or flips a setting that should persist.

Instead:

- [Toggle](./toggle.md): An on or off setting that should persist as state.
- Link: Navigation to another page or section.

## Variants

What each variant is for in any design system, then what Content first decided and why. Each sample is the live story with that variant set.

:::panel{title="primary" note="variant" label="Used in Content first" tone="success"}
::preview{id="button/variant/primary"}

**What it is for**

The one action this view is for.

- ✓ One commit: Submit, Save, Continue, Start, Next.
- ✕ A second equally loud action on the same view.

**In Content first**

One clear action per section.

**Because**

- [How often do people repeat actions? **Rarely**](#why-tasks-q2) · `tasks.q2`
:::

:::panel{title="secondary" note="variant" label="Used in Content first" tone="success"}
::preview{id="button/variant/secondary"}

**What it is for**

A real action, quieter than the commit.

- ✓ Cancel, Back or Reset next to a primary, or an action with no commit beside it.
- ✕ It is the only action; then it is primary.

**In Content first**

The first step of a delete, with the full verb, before the confirm.

**Because**

- [What is a costly mistake? **Losing your place**](#why-outcomes-q2) · `outcomes.q2`
:::

:::panel{title="danger" note="variant" label="Used in Content first" tone="success"}
::preview{id="button/variant/danger"}

**What it is for**

A destructive commit, after a confirm.

- ✓ The confirm step of a delete or remove, with the verb: Delete 40 alerts.
- ✕ The first step of a delete; that is secondary. Anything that does not destroy data.

**In Content first**

The confirm of a delete, with the full verb. Deleting a draft is rare and final.

**Because**

- [What is a costly mistake? **Losing your place**](#why-outcomes-q2) · `outcomes.q2`
:::

:::panel{title="ghost" note="variant" label="Used in Content first" tone="success"}
::preview{id="button/variant/ghost"}

**What it is for**

The lowest emphasis; it never competes with the commit.

- ✓ A third option, a card or row action, a toast action.
- ✕ The page's main task; that is primary.

**In Content first**

Alternatives as a text link, and row actions with a word.

**Because**

- [What should the brand feel like? **Warm**](#why-brand-q1) · `brand.q1`
- [How do people recall the interface? **They see it fresh each time**](#why-human-q2) · `human.q2`
:::

:::panel{title="default" note="size" label="Used in Content first" tone="success"}
::preview{id="button/size/default"}

**What it is for**

The normal size, for ordinary actions in forms, dialogs and page chrome.

**In Content first**

Every button, at touch size: many readers are on phones.

**Because**

- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="compact" note="size" label="Not used in Content first" tone="neutral"}
::preview{id="button/size/compact"}

**What it is for**

Denser, for toolbars and table rows that sit beside content.

- ✕ The page's main commit, or a control too small to hit.

**In Content first**

Many readers are on phones: no compact controls.

**Because**

- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="icon" note="size" label="Not used in Content first" tone="neutral"}
::preview{id="button/size/icon"}

**What it is for**

Icon only: the name is not on screen.

- ✓ A repeated, known control in chrome: close, settings, more.
- ✕ A one-off or destructive action with no accessible name.

**In Content first**

Occasional visitors do not know icons: always add a word.

**Because**

- [What do icons do? **Actions, status and navigation**](#why-iconography-roles) · `iconography.roles`
- [How do people recall the interface? **They see it fresh each time**](#why-human-q2) · `human.q2`
:::

:::panel{title="large" note="size" label="Not used in Content first" tone="neutral"}
::preview{id="button/size/large"}

**What it is for**

The largest size: the one action that must stand out most.

- ✓ The single main call to action of a section or page.
- ✕ Ordinary actions, or more than one per section.

**In Content first**

Attention belongs to the text: one clear action per section, at the normal size.

**Because**

- [What must the interface protect? **Attention on the content**](#why-human-q1) · `human.q1`
- [How often do people repeat actions? **Rarely**](#why-tasks-q2) · `tasks.q2`
:::

:::panel{title="hover" note="state" label="Used in Content first" tone="success"}
**What it is for**

The pointer is over the control: an extra cue, never the only cue.

- ✓ A mouse or trackpad can reach the control.
- ✕ Hover is the only way to tell it is a button; that fails on touch.

**In Content first**

Moderate feedback that feels calm.

**Because**

- [How fast does feedback feel? **Moderate**](#why-motion-values) · `motion.values`
:::

:::panel{title="focus" note="state" label="Used in Content first" tone="success"}
**What it is for**

Keyboard or assistive tech is on this control. It must stay visible.

- ✓ Tab, Enter, Space, or focus restored after a dialog.
- ✕ The focus outline removed with no replacement.

**In Content first**

Always visible.

**Because**

- [What accessibility level do we commit to? **AA**](#why-people-q2) · `people.q2`
:::

:::panel{title="disabled" note="state" label="Not used in Content first" tone="neutral"}
**What it is for**

The action is not available. It must stay perceivable and say why.

- ✓ A control that must not run now, with a visible reason.
- ✕ A form's submit that could explain the problem on press instead.

**In Content first**

Keep it enabled and explain on press: visitors see the interface fresh each time.

**Because**

- [How do people recall the interface? **They see it fresh each time**](#why-human-q2) · `human.q2`
- [What accessibility level do we commit to? **AA**](#why-people-q2) · `people.q2`
:::

::card-grid{id="anatomy-link/button"}

## How Content first uses it

::::grid{columns="2"}
:::panel{title="An icon with no label"}
**Use** Not used: always add a word

**Not** An icon button

Occasional visitors do not know icons.
:::
:::panel{title="Keyboard focus"}
**Use** button/focus-ring at focus.ring.width

**Not** Removing the outline

Keyboard users must always see where they are.
:::
:::panel{title="The action that completes the task"}
**Use** Button primary, one per section

**Not** Two primaries side by side

One clear action per section. Two primaries make the reader choose before they have read.
:::
:::panel{title="An alternative or cancel"}
**Use** Button ghost as a text link

**Not** A second boxed button

A link feels lighter and does not compete.
:::
:::panel{title="Delete or remove"}
**Use** Button secondary with the full verb, then confirm with Button danger

**Not** Button primary

Naming the verb and confirming prevents a mistake.
:::
:::panel{title="An action on one row or item"}
**Use** Button ghost with a word

**Not** An icon on its own

Occasional visitors need the word.
:::
::::

## Why it works this way

Button looks the way it does because of 9 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Button, and what would move if it changed.

::reason-chain{id="button/tasks.q2"}

::reason-chain{id="button/outcomes.q2"}

::reason-chain{id="button/brand.q1"}

::reason-chain{id="button/human.q2"}

::reason-chain{id="button/accessibility.values"}

::reason-chain{id="button/iconography.roles"}

::reason-chain{id="button/human.q1"}

::reason-chain{id="button/motion.values"}

::reason-chain{id="button/people.q2"}

## Words

- Write to one person: "you", not "users".
- Short sentences with room to breathe.
- Explain why before asking for anything.
- Use: Read, Save for later, You, Next issue. Avoid: Click here, Submit, Users, Content.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Not now
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Browse guides

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
