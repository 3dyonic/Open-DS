"""Command line for the validator. It does not build tokens."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from open_ds_validator.check import check_boilerplate, check_recipe, render_decision_block
from open_ds_validator.fingerprint import fingerprint_recipe, share_code
from open_ds_validator.load import load_packs, read_json


def _print(result: dict) -> int:
    json.dump(result, sys.stdout, indent=2)
    sys.stdout.write("\n")
    return 0 if result.get("ok") else 1


FIX_BY_ID = {
    "missing-question": "pick an answer on /build, then run open-ds init <recipe.json>.",
    "uv-missing": "install uv (https://docs.astral.sh/uv/), then rerun open-ds check.",
    "missing-purpose": "run open-ds build and answer a Purpose question.",
    "recipe-schema": "correct the recipe JSON so it matches the recipe schema.",
    "fingerprint-mismatch": "run open-ds init again so open-ds.json matches the recipe.",
    "drift-changed": "restore the changed file so it matches the boilerplate.",
    "drift-missing": "restore the missing file from the boilerplate.",
    "locked-mismatch": "restore the locked fields so they match the manifest.",
    "missing-item": "run open-ds init again so the missing item is installed.",
    "missing-boilerplate": "use a recipe that has an authored boilerplate. Open DS does not generate one.",
    "no-install": "run open-ds init, or pass --dir <folder init created>.",
    "missing-rationale": "write a rationale in your own words.",
    "rationale-length": "keep the rationale between 1 and 280 characters.",
    "unknown-question": "remove the question that is not in the selected packs.",
    "unknown-option": "pick an option that the question cites.",
    "unknown-pack": "use a pack id that exists in packs/.",
    "duplicate-question": "keep one answer for that question.",
    "missing-param": "set the required parameter.",
    "unknown-param": "remove the unknown parameter.",
    "param-type": "use the parameter type the question asks for.",
    "param-pattern": "make the parameter match the expected pattern.",
    "param-range": "keep the parameter inside the allowed range.",
    "missing-dependency": "select the required dependency.",
    "conflict": "change one of the conflicting answers.",
    "required-option": "select the option your purpose needs.",
    "recommend": "consider the recommended option.",
    "discourage": "reconsider this pick. It is worth a second look.",
    "unknown-feeds-into": "point feeds_into at a question id that exists.",
    "unbacked-feeds-into": "add a requires, discourages, or recommends rule that points at that question.",
    "missing-fragment": "add the fragment file or remove the fragment path.",
    "why-care-length": "keep why_care to 25 words or fewer.",
    "empty-affects": "list what this question affects, or remove the empty list.",
    "floor-contrast": "declare text contrast of at least 4.5:1 and non-text contrast of at least 3:1.",
    "floor-resize": "declare that text can resize to 200% without losing content.",
    "floor-text-spacing": ("declare line height 1.5, paragraph spacing 2, letter spacing 0.12, and word spacing 0.16."),
    "floor-target-size": (
        "declare a 24px target or sufficient spacing. A 48px recommendation does not replace this floor."
    ),
    "floor-error-prevention": "make the step reversible, checked, or confirmed.",
    "unknown-scope": "use a scope from the pack allowlist, or add the scope to the pack.",
    "incomplete-caution": "give the caution a url, a quote, and a checked date copied from the pack.",
    "missing-basis": "set basis to sourced, floor, or your-pick. Do not leave it blank.",
    "coga.critical-not-hidden": "keep a critical component out of hover and accordions.",
    "voice-why": "shorten why to 35 words or fewer.",
    "voice-when": "start when_to_choose with Choose this if or Choose this when, in 25 words or fewer.",
    "voice-cost": "shorten the trade-off to 15 words or fewer.",
    "broken-effect": "point the effect at a question and an option that exist.",
    "pack-schema": "correct the pack JSON so it matches the pack schema.",
}


def format_check_failure(item: dict) -> list[str]:
    """Same lines as the Node CLI: `error <id>: ...` and `Fix: ...`."""
    raw = item.get("severity")
    severity = "error" if not raw or raw == "error" else raw
    if item.get("id") == "required-option":
        label = item.get("targetLabel") or "the required option"
        message = item.get("message") or ""
        return [
            f"{severity} required-option: {message}",
            f"Fix: Add {label} to finish your recipe, then run open-ds check again.",
        ]
    message = item.get("message") or ""
    if item.get("id") == "missing-question":
        message = f"{item.get('question')} has no answer yet."
    else:
        scheme = item.get("scheme") or ""
        question = item.get("question") or ""
        name = f"{scheme}/{question}" if scheme and question else question
        if name and name not in message:
            message = f"{name}: {message}"
    fix = FIX_BY_ID.get(item.get("id", ""), "fix the reported problem and run open-ds check again.")
    return [f"{severity} {item.get('id')}: {message}", f"Fix: {fix}"]


def validate_main(argv: list[str] | None = None) -> int:
    """`open-ds-validate recipe.json`. Human lines by default, JSON with --json."""
    parser = argparse.ArgumentParser(prog="open-ds-validate")
    parser.add_argument("recipe", help="Path to a recipe JSON file.")
    parser.add_argument("--json", action="store_true", help="Print the check result as JSON.")
    args = parser.parse_args(argv)
    packs = load_packs()
    recipe = read_json(Path(args.recipe))
    result = check_recipe(recipe, packs)
    if args.json:
        return _print(result)
    if not result.get("ok"):
        for item in result["findings"]:
            for line in format_check_failure(item):
                sys.stdout.write(line + "\n")
        return 1
    if result.get("fingerprint"):
        sys.stdout.write(result["fingerprint"] + "\n")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="open-ds-validator")
    sub = parser.add_subparsers(dest="cmd", required=True)
    check = sub.add_parser("check", help="Check a recipe file.")
    check.add_argument("recipe")
    finger = sub.add_parser("fingerprint", help="Print the recipe fingerprint.")
    finger.add_argument("recipe")
    share = sub.add_parser("share", help="Print the share code for a recipe.")
    share.add_argument("recipe")
    boiler = sub.add_parser("boilerplate", help="Check a boilerplate directory.")
    boiler.add_argument("directory")
    decisions = sub.add_parser("decisions", help="Print a generated decision section.")
    decisions.add_argument("recipe")
    decisions.add_argument("--kind", choices=("readme", "agents"), default="readme")
    args = parser.parse_args(argv)
    packs = load_packs()
    if args.cmd == "boilerplate":
        return _print(check_boilerplate(Path(args.directory), packs))
    recipe = read_json(Path(args.recipe))
    if args.cmd == "fingerprint":
        result = check_recipe(recipe, packs)
        if not result["ok"]:
            return _print(result)
        sys.stdout.write(fingerprint_recipe(recipe) + "\n")
        return 0
    if args.cmd == "share":
        result = check_recipe(recipe, packs)
        if not result["ok"]:
            return _print(result)
        sys.stdout.write(share_code(recipe) + "\n")
        return 0
    if args.cmd == "decisions":
        result = check_recipe(recipe, packs)
        if not result["ok"]:
            return _print(result)
        sys.stdout.write(render_decision_block(recipe, packs, args.kind) + "\n")
        return 0
    return _print(check_recipe(recipe, packs))


if __name__ == "__main__":
    raise SystemExit(main())
