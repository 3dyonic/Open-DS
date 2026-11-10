---
composite_data: "./separator.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 49
title: "Separator"
description: "Separator in Accessible first."
---

# Separator

A line between groups.

:label[In Accessible first]{tone="info"}

## See it live

::preview{robot="slumber" id="separator/live"}

## When to use it

**In Accessible first:** Breaks between groups of questions.

- **Use it when:** Separating groups that spacing alone does not separate.
- **Not when:** Decoration between every item: spacing is quieter.

Instead:

- [Card](./card.md): A container, when groups need a boundary.

::card-grid{id="anatomy-link/separator"}

## How Accessible first uses it

::::grid{columns="2"}
:::panel{title="Between page sections"}
**Use** space.gap.section

**Not** A thin line

Space is easy to see; thin lines are not.
:::
::::

## Words

- Use common words. Explain any term you must use.
- One idea per sentence. Put the action first.
- Never blame the person.
- Use: Continue, Change, Start, You. Avoid: Invalid, Utilise, Submit, Error code.

The labels components use, from the voice tokens:

- `content.action.commit`: Continue
- `content.action.cancel`: Go back
- `content.action.destroy`: Delete
- `content.action.retry`: Try again
- `content.action.empty-action`: Start a new application

See [Voice and tone](../voice.md) for the whole voice.

## Use it in code

```bash
npx open-ds add separator
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Separator reads 2 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Separator's tokens to change Separator alone.

::token-table{component="separator"}
