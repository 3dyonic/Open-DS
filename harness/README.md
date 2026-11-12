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

## Counts that may only go down

- `gaps-only-go-down`: the gap ledger's count per scheme and kind. After a fix, run `node scripts/gaps.mjs --baseline`.
- `decisions-cover-values`: the semantic values per scheme that rest on no decision. A value is linked when its theme pick, or a usage rule that names it, cites an answer. After a fix, run `node scripts/coverage.mjs --baseline`.
- `scheme-quality`: the scheme quality gate (OD-298). Each criterion in `quality-baseline.json` has a value on `origin/master` and a direction: down, up or report (not gated). A gated criterion that moves the wrong way fails. Refresh the baseline on purpose: `open-ds compare --base origin/master --write-baseline`.

## The scheme quality gate

`open-ds compare --base origin/master [--candidate <ref>]` measures a scheme change before it merges. The candidate defaults to the working tree.

1. Each ref is checked out in a temporary git worktree. Its own `tokens/build.mjs` builds its CSS.
2. A child process loads its schemes with its own `cli/src/schemes.mjs` and `cli/src/tokens.mjs`, so a ref in an older shape reads correctly.
3. `cli/src/quality/` measures both snapshots with one set of pure functions. It writes `scorecard.json` and `scorecard.md` to `build/quality/`.

| Family          | What it counts                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| traceability    | Values that reach an answer; weak reasons by kind (`reasonOf`, `weakReasons` in `cli/src/trace.mjs`).                                  |
| derived         | Values from a relation, an alias or a scale step, against raw literals; new literals with no recorded reason; raw hex, px and ms in `ui/src`. |
| invariants      | Recorded relations (spacing map, generated color scales) and the minimum ones: focus ring, compact step, nested radius, dark surface ladder.  |
| blast-radius    | One answer or one anchor changes; tokens the trace expects to move that do not (orphans), and tokens that move with no trace (hidden).  |
| accessibility   | WCAG pairs, APCA 0.0.98G-4g Lc warnings, hit areas (24px, 44px touch-first), text sizes in rem.                                        |
| motion          | Transforms under `prefers-reduced-motion: reduce`; durations over their cap (feedback 150ms, panels 300ms, expressive 500ms).        |
| repetition      | Extra copies of a sentence across reasons, token names taken out.                                                                     |
| size            | Token count and CSS bytes (shown); semantic tokens nothing reads (gated).                                                             |
