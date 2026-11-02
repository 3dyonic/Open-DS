---
name: open-ds-write
description: Write interface copy in the voice of an Open DS scheme. Use when you write labels, errors, success or empty messages, confirmations or hints.
tools:
  - get_context
  - when_to_use
  - get_component
  - check_copy
---

# Write in the scheme's voice

## Why

The voice is part of the design system. Words that follow it make every screen sound like one product.

## When

- You write a button label, an error, a success message or an empty state.
- You write a confirmation or a first-visit hint.

## Input

- The scheme id and the message to write.
- The product's own objects and numbers.

## Run

1. Call `get_context` with target `write`, or run `open-ds context <scheme> write`.
2. It holds the voice, the words to use and avoid, and each writing situation with its rule.
3. Find the situation with `when_to_use`: button-label, error-words, success-words, empty-words, confirm-words or first-visit.
4. Match the shape of the rule's example. Use the product's own objects and numbers.
5. For words inside a component, read its rules with `get_component`.
6. Write a button as one verb: the action itself.
7. Write an error as what happened, then what to do.
8. Write an empty state as why it is empty, then the next step.
9. Write a confirmation that names the object and the consequence.
10. Check each message with `check_copy`, or run `open-ds copy <scheme> <kind> <text>`.
11. Fix each finding, then check the message again.

## Done

- `check_copy` passes for each message.
- The copy has no word from the avoid list.
- Each message has at most two sentences. The first says what happened.
- Each message follows the rule of its situation.
