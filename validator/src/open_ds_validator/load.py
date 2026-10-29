"""Load packs, recipes, and JSON Schemas from the repo."""

from __future__ import annotations

import json
from pathlib import Path

import jsonschema

ROOT_MARKERS = ("packs", "schema")


def repo_root(start: Path | None = None) -> Path:
    current = (start or Path(__file__)).resolve()
    for candidate in [current, *current.parents]:
        if all((candidate / name).is_dir() for name in ROOT_MARKERS):
            return candidate
    raise FileNotFoundError("Could not find the Open DS repo root.")


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def load_schema(name: str, root: Path | None = None) -> dict:
    return read_json(repo_root(root) / "schema" / name)


def load_packs(root: Path | None = None) -> dict[str, dict]:
    base = repo_root(root) / "packs"
    packs: dict[str, dict] = {}
    for path in sorted(base.glob("*.json")):
        pack = read_json(path)
        packs[pack["id"]] = pack
    return packs


def validator_for(schema: dict) -> jsonschema.Draft202012Validator:
    return jsonschema.Draft202012Validator(schema)
