---
sidebar_position: 2
title: "Context in the JSON"
description: "Which fields in the grammar and scheme JSON exist for agents, and how to use them."
---

# Context in the JSON

| Where   | Field                                                               | Use it to                                                                        |
| ------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Grammar | `ai.use_when`, `ai.how_to_read`                                     | Know when to read the grammar and how answers link.                              |
| Grammar | `description` on every group, question, situation and component key | Understand an id without other files.                                            |
| Scheme  | `ai.use_when`, `ai.avoid_when`, `ai.example_products`               | Pick the right scheme.                                                           |
| Scheme  | `answers[].why`, `answers[].because`                                | Explain a decision and trace it back.                                            |
| Scheme  | `usage[]` (`use`, `not`, `why`)                                     | Choose what to use in a situation.                                               |
| Scheme  | `voice`                                                             | Write copy that fits.                                                            |
| Grammar | `semantics.keys[]` (`intent`, `use_for`, `not_for`, `pairs`)        | Know what a colour is for, what not to use it for and which fills it may sit on. |
| Grammar | `semantics.urgency`                                                 | Pick a status level that matches the real risk.                                  |
| Tokens  | `$description`                                                      | Know what a token is for. Semantic ones come from the grammar's `intent`.        |
| Schemas | `title`, `description`, `examples` on every property                | Validate and generate correct JSON.                                              |
