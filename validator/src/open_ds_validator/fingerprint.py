"""Canonical recipe JSON and its sha256 fingerprint."""

from __future__ import annotations

import hashlib
import json


def canonical_json(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def normalize_recipe(recipe: dict) -> dict:
    picks = []
    for pick in sorted(recipe.get("picks", []), key=lambda item: item.get("question", "")):
        row = {
            "option": pick.get("option", ""),
            "params": pick.get("params") or {},
            "question": pick.get("question", ""),
            "rationale": str(pick.get("rationale", "")).strip(),
        }
        picks.append(row)
    return {
        "id": recipe.get("id", ""),
        "name": recipe.get("name", ""),
        "packs": list(recipe.get("packs", [])),
        "picks": picks,
        "provisional": bool(recipe.get("provisional", False)),
        "serves": str(recipe.get("serves", "")).strip(),
        "summary": str(recipe.get("summary", "")).strip(),
        "version": recipe.get("version", ""),
    }


def canonical_recipe(recipe: dict) -> str:
    return canonical_json(normalize_recipe(recipe))


def fingerprint_recipe(recipe: dict) -> str:
    return hashlib.sha256(canonical_recipe(recipe).encode("utf-8")).hexdigest()


def share_code(recipe: dict) -> str:
    import base64

    raw = canonical_recipe(recipe).encode("utf-8")
    return base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")


def recipe_from_share(code: str) -> dict:
    import base64

    padded = code + ("=" * (-len(code) % 4))
    data = base64.urlsafe_b64decode(padded.encode("ascii"))
    return json.loads(data.decode("utf-8"))
