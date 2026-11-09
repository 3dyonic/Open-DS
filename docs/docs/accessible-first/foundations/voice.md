---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 11
title: "Voice and tone"
description: "Accessible first: How the product speaks: the words in every component."
---

# Voice and tone

How the product speaks: the words in every component.

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which kinds of copy does it need? | Labels, messages and help | Hints and help text carry people through each step. |
| How many tones does it use? | One | One plain tone everywhere; no surprises. |
| How is the voice defined? | Rules and a word list | A word list of common words, with terms to avoid. |
| How does it sound? | Plain and direct | Every sentence is easy to read on the first try. |
| Where do the words matter most? | Form steps and errors | Words decide whether a form gets finished. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `content.action.commit` |  |
| `content.action.cancel` |  |
| `content.action.destroy` |  |
| `content.action.retry` |  |
| `content.action.empty-action` |  |

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| A button label | A common verb that says what happens next | "Submit" or "Proceed" | Common words are understood by the most people. Example: “Continue” |
| The words of an error | Say what is wrong, where, and exactly how to fix it | "Invalid input" | People must be able to fix the error without help. Example: “Enter your date of birth. For example, 27 3 1980.” |
| A success message | Confirm what happened and what comes next | A confirmation with no next step | People need to know the task is finished and what happens now. Example: “We have your application. We will email you within 5 working days.” |
| An empty state | Explain what will appear here and how to start | A blank page | A blank page leaves people unsure if something failed. Example: “You have no saved applications. Start a new one below.” |
| A confirmation question | Say what will happen in plain words, and offer a way back | A double negative | Plain words prevent a choice people did not mean. Example: “Do you want to cancel your application? Your answers will be deleted.” |
| A first visit | Say how many steps there are and how long it takes | Marketing copy | Knowing the length lowers effort and anxiety. Example: “This takes about 10 minutes. There are 4 steps.” |
