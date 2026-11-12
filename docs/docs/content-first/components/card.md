---
composite_data: "./card.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 13
title: "Card"
description: "Card in Content first."
---

# Card

A bordered container for one item or group, with its title, content and actions.

:label[In Content first]{tone="info"}

## See it live

::preview{id="card/live"}

## When to use it

**In Content first:** Article previews.

- **Use it when:** A repeating unit of title, media and one destination or action.
- **Not when:** Records people compare cell by cell (a table), or a whole card as one big link that screen readers read as one.

Instead:

- [Table](./table.md): Records compared across rows.
- [Item](./item.md): A compact row in a list.

::card-grid{id="anatomy-link/card"}

## How Content first uses it

::::grid{columns="2"}
:::panel{title="A card on the page"}
**Use** A border, no shadow

**Not** A strong shadow

Cards stay flat on the page; shadows are for floating things.
:::
::::

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

Test before you ship:

- [ ] One inner link or button names the destination; the rest is not one big link. undefined

## Use it in code

```bash
npx open-ds add card
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Card reads 17 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Card's tokens to change Card alone.

::token-table{component="card"}
