# open-ds-validator

Check packs and recipes. The package name is a placeholder until the product name is decided.

The display name lives in `brand.json` at the repo root.

This package does not calculate colors or tokens.

```bash
uv run open-ds-validator check recipes/3dyonic.json
uv run open-ds-validate recipes/3dyonic.json
uv run open-ds-validator boilerplate boilerplates/3dyonic
```

`open-ds-validate` prints `error <id>: ...` and `Fix: ...` lines, and exits non-zero when any finding is an error. `--json` prints the same result object as `open-ds-validator check`. `open-ds check` keeps drift and installed-file checks, and spawns this command for recipe rules.

## Question fields

A question may carry:

- `affects`: list of strings. Leave it off until you know. An empty list warns (`empty-affects`).
- `feeds_into`: list of question ids. Each id must exist (`unknown-feeds-into`). Some option on the source question must `require`, `discourage`, or `recommend` that question (`unbacked-feeds-into`).
- `why_care`: one sentence, 25 words or fewer (`why-care-length`).

An option may carry `fragment`: a path relative to the repo root. A missing file is `missing-fragment`.

## Recipe rules

`requires` is an error (`required-option`) when the other option is not selected. `discourages` is a warning (`discourage`) when it is selected. `recommends` never raises a finding.

`recommends` and `discourages` may set `when` to a list of `{question, option}` clauses. The list is AND.

- Every clause matches: a `recommends` entry prefills that option and still raises no finding. A `discourages` entry warns if that option is selected.
- Every clause's question is answered, but the AND fails: a `recommends` entry discourages its option instead (the same `discourage` warning if that option is selected). No prefill.
- Any clause's question has no answer: the rule is quiet. No finding and no prefill, even when the option it would recommend is already selected.

Example: recommend `density=compact` only when `usage-data=tables`. Numbers, and batch work with no tables, do not prefill and do not raise a finding. Long text does not recommend comfortable density. That choice is the reader's own pick.

## Floors

The pack with id `global` is the base pack. Its `floors` block applies to every recipe, including recipes that do not list `global` and that do not reach it through `feeds_into`. The checker compares declared numbers with the WCAG 2.2 floors below. It does not measure contrast, pixels, or text.

A selected option's `fragment` is also checked when the whole file is a JSON object with a `floors` key. Fragment floors are partial: only keys that are present are checked. A fragment that is not JSON is a hand-written file and is not a floor input. The website checker reads fragment JSON only when a caller passes `readFragment`; the Python validator always reads the file.

| Key | Declared value | Error when |
| --- | --- | --- |
| `contrast.text` | ratio | below 4.5 (`floor-contrast`, WCAG 2.2 1.4.3) |
| `contrast.nonText` | ratio | below 3 (`floor-contrast`, WCAG 2.2 1.4.11) |
| `resize.textResizePercent` | percent | below 200 (`floor-resize`, WCAG 2.2 1.4.4) |
| `resize.contentLost` | boolean | `true` (`floor-resize`) |
| `textSpacing.lineHeight` | multiple of font size | below 1.5 (`floor-text-spacing`, WCAG 2.2 1.4.12) |
| `textSpacing.paragraphSpacing` | multiple of font size | below 2 |
| `textSpacing.letterSpacing` | multiple of font size | below 0.12 |
| `textSpacing.wordSpacing` | multiple of font size | below 0.16 |
| `targetSize.minPx` | CSS pixels | below 24, unless `sufficientSpacing` is true (`floor-target-size`, WCAG 2.2 2.5.8) |
| `targetSize.sufficientSpacing` | boolean | author claims the 2.5.8 spacing exception |

On the global pack, a missing contrast, resize, text spacing, or target-size block is the same as failing that floor. The global pack must state the claim.

`floors.components` lists claims about UI, on the global pack or inside a fragment:

```json
{
  "id": "accept-terms",
  "flags": ["legal-commitment"],
  "confirmed": true,
  "prevention": "confirmed",
  "critical": true,
  "hiddenBy": "visible"
}
```

`flags` may include `destructive`, `payment`, and `legal-commitment`. The floor passes when any one of `reversible`, `checked`, or `confirmed` is true. Which of the three a component uses is that component's default (`prevention`). The floor does not read `prevention`. If a flagged component has none of the three, the error is `floor-error-prevention` (WCAG 2.2 3.3.4, https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html). The message is `Payments, deletes and legal steps can be undone, checked or confirmed.` If `critical` is true and `hiddenBy` is `hover` or `accordion`, the error is `coga.critical-not-hidden`. `hiddenBy` may also be `visible`.

The target-size floor is 24px (WCAG 2.2 2.5.8). Material's 48px size is a `recommends` link with basis `sourced` on every density. It does not replace the floor.

Shared cases live in `fixtures/recipes/*.json`. Each file has `expected_errors`. Python and Node both run them.
