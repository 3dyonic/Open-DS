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
