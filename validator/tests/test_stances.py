"""Stance recipes, chain rules, and fragment checks."""

from __future__ import annotations

import copy
from pathlib import Path

from open_ds_validator.check import check_recipe, validate_packs
from open_ds_validator.fingerprint import fingerprint_recipe
from open_ds_validator.load import load_packs, read_json, repo_root

ROOT = repo_root(Path(__file__))
PACKS = load_packs(ROOT)
STANCES = ("accessible-first", "dense-data", "multi-brand", "content-first", "brand-expressive")
EXPECTED_FAIL = {
    "accessible-first": "required-option",
    "dense-data": "required-option",
    "content-first": "conflict",
    "brand-expressive": "required-option",
}


def _ids(result: dict, severity: str | None = None) -> list[str]:
    return [item["id"] for item in result["findings"] if severity is None or item["severity"] == severity]


def test_each_stance_recipe_passes() -> None:
    for name in STANCES:
        recipe = read_json(ROOT / "recipes" / f"{name}.json")
        result = check_recipe(recipe, PACKS, ROOT)
        assert result["ok"], (name, result["findings"])
        assert result["fingerprint"] == fingerprint_recipe(recipe)
        assert any(link["rule"] in {"requires", "discourages"} for link in recipe["chain"])


def test_each_stance_fail_fixture_has_its_error() -> None:
    for name, error_id in EXPECTED_FAIL.items():
        recipe = read_json(ROOT / "fixtures" / "stances" / f"{name}-fail.json")
        result = check_recipe(recipe, PACKS, ROOT)
        assert result["ok"] is False
        assert error_id in _ids(result, "error")
        assert "fingerprint" not in result


def test_multi_brand_without_separate_is_not_blocked() -> None:
    recipe = read_json(ROOT / "fixtures" / "stances" / "multi-brand-fail.json")
    separation = next(pick for pick in recipe["picks"] if pick["question"] == "structure-theme-separation")
    assert separation["option"] == "combined"
    result = check_recipe(recipe, PACKS, ROOT)
    assert result["ok"], result["findings"]
    assert "required-option" not in _ids(result)


def test_brand_expressive_chain_has_no_radius_link() -> None:
    recipe = read_json(ROOT / "recipes" / "brand-expressive.json")
    blob = " ".join(link["line"] + link["from"] + link["to"] for link in recipe["chain"]).lower()
    assert "radius" not in blob
    assert [link["to"] for link in recipe["chain"]] == ["theme-shape", "default-theme"]
    assert recipe["chain"][0]["rule"] == "requires"


def test_unknown_feed_and_unbacked_feed_and_empty_affects() -> None:
    packs = copy.deepcopy(PACKS)
    color = next(question for question in packs["color-primitives"]["questions"] if question["id"] == "color-space")
    color["feeds_into"] = ["not-a-real-question"]
    missing = validate_packs(packs, ROOT)
    assert "unknown-feeds-into" in _ids(missing, "error")
    assert missing["ok"] is False

    packs = copy.deepcopy(PACKS)
    color = next(question for question in packs["color-primitives"]["questions"] if question["id"] == "color-space")
    color["feeds_into"] = ["density"]
    unbacked = validate_packs(packs, ROOT)
    assert "unbacked-feeds-into" in _ids(unbacked, "error")

    packs = copy.deepcopy(PACKS)
    color = next(question for question in packs["color-primitives"]["questions"] if question["id"] == "color-space")
    color["affects"] = []
    empty = validate_packs(packs, ROOT)
    assert empty["ok"], empty["findings"]
    assert "empty-affects" in _ids(empty, "warning")


def test_missing_fragment_and_long_why_care() -> None:
    packs = copy.deepcopy(PACKS)
    spacing = next(question for question in packs["spacing"]["questions"] if question["id"] == "spacing-base")
    option = next(item for item in spacing["options"] if item["id"] == "base-4")
    option["fragment"] = "missing/not-there.css"
    missing = validate_packs(packs, ROOT)
    assert "missing-fragment" in _ids(missing, "error")

    packs = copy.deepcopy(PACKS)
    spacing = next(question for question in packs["spacing"]["questions"] if question["id"] == "spacing-base")
    spacing["why_care"] = " ".join(["word"] * 26)
    long = validate_packs(packs, ROOT)
    assert "why-care-length" in _ids(long, "error")


def test_recommends_only_chain_stays_valid() -> None:
    recipe = read_json(ROOT / "recipes" / "dense-data.json")
    recipe["chain"] = [
        {
            "from": "product-type",
            "to": "density",
            "rule": "recommends",
            "line": "A dense product keeps more data in view when space is compact.",
        }
    ]
    result = check_recipe(recipe, PACKS, ROOT)
    assert result["ok"], result["findings"]
    assert "chain-strength" not in _ids(result)
    assert "chain-rule" not in _ids(result)
