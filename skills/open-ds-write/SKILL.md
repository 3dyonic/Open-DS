---
name: open-ds-write
description: Write interface copy in the voice of an Open DS scheme. Use for button labels, errors, success and empty messages, confirmations and first-visit hints.
---

# Write in the scheme's voice

1. Read the voice: `npx open-ds show <scheme>` or `get_scheme` with part `voice`. Note its summary, principles and the words to use and avoid.
2. For each message, find its situation with `when_to_use`: button-label, error-words, success-words, empty-words, confirm-words or first-visit. Each rule gives the tone, a rule and an example.
3. Match the example's shape, not its words. Use the product's own objects and numbers.
4. Buttons: one verb, the action itself. Errors: what happened, then what to do. Empty states: why it is empty, then the next step. Confirmations: name the object and the consequence.
5. Never use the words the voice says to avoid.
6. Keep it short. If a message needs two sentences, the first says what happened.
