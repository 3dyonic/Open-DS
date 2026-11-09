---
composite_data: "./toggle.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 60
title: "Toggle"
description: "Toggle in Content first."
sidebar_class_name: "ods-left-out"
---

# Toggle

A button that stays pressed or not.

:label[Left out of Content first]{tone="warning"} Readers need sections, navigation and little else. Toggles format text in a toolbar, and Content first avoids screens with many actions. Use instead: [Button](./button)

## See it live

::preview{id="toggle/live"}

## When to use it

- **Use it when:** Turning a mode or format on and off in a toolbar, such as bold.
- **Not when:** A setting saved at once (switch), or a one-off action (button).

Instead:

- [Switch](./switch.md): A setting.
- [Button](./button.md): A one-off action.
- [Toggle group](./toggle-group.md): Several toggles together.

## Variants

What each variant is for in any design system, then what Content first decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Not decided yet" tone="neutral"}
::preview{id="toggle/variant/default"}

**What it is for**

No border; the pressed state shows as a fill.

- ✓ Toolbars where toggles sit together.
- ✕ A toggle alone on a busy background.

**In Content first**

Not decided yet.

:::

:::panel{title="outline" note="variant" label="Not decided yet" tone="neutral"}
::preview{id="toggle/variant/outline"}

**What it is for**

A border, so the toggle reads as a control at rest.

- ✓ A toggle that stands alone.
- ✕ A dense toolbar of many toggles.

**In Content first**

Not decided yet.

:::

:::panel{title="default" note="size" label="Not decided yet" tone="neutral"}
::preview{id="toggle/size/default"}

**What it is for**

The normal size.

- ✓ Most toolbars.
- ✕ Very dense toolbars.

**In Content first**

Not decided yet.

:::

:::panel{title="sm" note="size" label="Not decided yet" tone="neutral"}
::preview{id="toggle/size/sm"}

**What it is for**

A smaller toggle.

- ✓ Dense toolbars and compact panels.
- ✕ Touch screens.

**In Content first**

Not decided yet.

:::

:::panel{title="lg" note="size" label="Not decided yet" tone="neutral"}
::preview{id="toggle/size/lg"}

**What it is for**

A larger toggle.

- ✓ A few toggles that need to be easy to hit.
- ✕ Dense toolbars.

**In Content first**

Not decided yet.

:::

::card-grid{id="anatomy-link/toggle"}

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
| undefined | Space or Enter presses it. | undefined |

Test before you ship:

- [ ] It says whether it is pressed. undefined

## Use it in code

```bash
npx open-ds add toggle
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Toggle reads 23 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Toggle's tokens to change Toggle alone.

::token-table{component="toggle"}
