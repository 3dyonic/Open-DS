# Harness

The harness proves the MVP is done the way Yonatan asked. It reads two lists and runs a check for every line.

| File                | What it holds                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `instructions.json` | Yonatan's instructions, in his words.                                                          |
| `specs.json`        | The ticket specs (OD-109 to OD-121): what each delivers and how it is checked.                 |
| `checks.mjs`        | One named check per proof.                                                                     |
| `evidence.json`     | Process proof: one entry per feature merged into RC1 (PR, sub-agent, skills, Jira, Orchestra). |

## Run it

```bash
pnpm harness        # fast checks
pnpm harness:full   # also builds the site, Storybook and docs, and runs the test suites
```

It writes `harness/report.md`. Each line is one of:

- pass
- fail: the layer exists and is wrong
- not built: the layer does not exist yet
- skipped: a slow build; run `--full`

The exit code is 1 only when something fails.

## Add a check

1. Add a function to `CHECKS` in `checks.mjs`. List what it needs in `requires`.
2. Name it in an instruction or a spec.
3. `pnpm --dir harness test` fails if a name has no check.
