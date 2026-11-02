# Harness

The harness proves every layer of Open DS is done and works. It runs a named check for every line of the ticket specs, then every check no spec names.

| File         | What it holds                                                                        |
| ------------ | ------------------------------------------------------------------------------------ |
| `specs.json` | The ticket specs: what each Jira ticket delivers (In) and the checks that prove it.  |
| `checks.mjs` | One named check per proof.                                                           |
| `run.mjs`    | The runner and the report. Another harness can pass its own checks and requirements. |

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
2. Name it in a spec. A check no spec names still runs, under "Other checks".
3. `pnpm --dir harness test` fails if a spec names a check that does not exist.
