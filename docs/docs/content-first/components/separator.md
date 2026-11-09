---
composite_data: "./separator.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 49
title: "Separator"
description: "Separator in Content first."
---

# Separator

A line between groups.

:label[In Content first]{tone="info"}

## See it live

::preview{id="separator/live"}

## When to use it

**In Content first:** Breaks between parts of a page.

- **Use it when:** Separating groups that spacing alone does not separate.
- **Not when:** Decoration between every item: spacing is quieter.

Instead:

- [Card](./card.md): A container, when groups need a boundary.

::card-grid{id="anatomy-link/separator"}

## How Content first uses it

::::grid{columns="2"}
:::panel{title="Between page sections"}
**Use** space.gap.section, no line

**Not** A divider line

Space alone separates sections; lines add noise.
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

## Use it in code

```bash
npx open-ds add separator
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Separator reads 2 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Separator's tokens to change Separator alone.

::token-table{component="separator"}
