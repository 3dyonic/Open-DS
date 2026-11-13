# Definition of Done

A change is done only when every line below is true. One false line means it is not done. Say which line is false, and why.

## 1. Scope

- The ticket names its work type, its In list and its Out list.
- Each In item maps to a commit in the PR. The PR body lists the map.
- Work beyond the ticket goes to a new ticket, not into this PR.

## 2. One source, one writer

- A decision lives in the repo as data the code reads, on the day it is made. A doc or a board is a view of it, never the only copy.
- The grammar is written only with `saveGrammar`, the schemes only with `saveScheme`, and the schemas only with `formatGrammar`. Nobody formats JSON by hand.
- Each fact has one store. A change that adds a store also removes one. When a change touches the reasoning (roles, rules, connections, reasons), the PR body counts the stores before and after.

## 3. Every value traces

- Every semantic token traces as data: purpose → role → job → property → the answer that creates or shapes it → rule → connections → value.
- A value that breaks its rule is reported to the owner and kept in a baseline that may only go down. Nobody changes a value only to make a check pass.

## 4. Proof

- `node --test cli/test/*.test.mjs`: 0 fail.
- `node harness/run.mjs`: 0 fail.
- Each new or changed check fails on a defect planted on purpose, then passes after the restore. The PR body shows both outputs.
- A changed test has its reason in the PR body. Nobody skips, disables or weakens a test to get green.
- A change the reader can see (a page, a card, a component) has a screenshot from a real build, in the PR.
- A change to the build or to generated output builds from a fresh clone with the documented commands only.

## 5. Merge

- CI is green on the PR's last commit, and the PR has no merge conflict.
- The PR merges into `RC1`. Nothing goes to `master`, a release or a deploy without the owner's go.
- A branch takes its base with a merge commit. Nobody rewrites history on a shared branch.

## 6. Close

- Before the ticket goes to Done, compare its In list with the merged PR, line by line. Each item that did not ship goes to a new ticket, linked from the old one.
- The ticket gets a comment with the merge commit and the proof.
- An Orchestra event records the merge commit, what changed and what is still open.

## 7. Words

- Every text a person or an agent reads is in Simplified Technical English: short sentences, active voice, plain words, no invented names or numbers.
