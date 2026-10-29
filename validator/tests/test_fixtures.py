"""Shared recipe fixtures. Node runs the same files in site/src/lib/fixtures.test.mjs."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from open_ds_validator.check import check_recipe
from open_ds_validator.load import repo_root

ROOT = repo_root(Path(__file__))
FIXTURES = sorted((ROOT / "fixtures" / "recipes").glob("*.json"))


def _ids(result: dict, severity: str) -> list[str]:
    return sorted({item["id"] for item in result["findings"] if item["severity"] == severity})


def _prefills(result: dict) -> list[str]:
    return sorted(f"{item['question']}:{item['option']}" for item in result.get("prefills", []))


@pytest.mark.parametrize("path", FIXTURES, ids=[path.stem for path in FIXTURES])
def test_shared_recipe_fixture(path: Path) -> None:
    case = json.loads(path.read_text(encoding="utf-8"))
    result = check_recipe(case["recipe"], case["packs"], ROOT)
    errors = _ids(result, "error")
    assert errors == sorted(set(case["expected_errors"])), result["findings"]
    if "expected_warnings" in case:
        assert _ids(result, "warning") == sorted(set(case["expected_warnings"])), result["findings"]
    if "expected_prefills" in case:
        assert _prefills(result) == sorted(set(case["expected_prefills"])), result.get("prefills")
    present = {item["id"] for item in result["findings"]}
    for fid in case.get("absent", []):
        assert fid not in present, result["findings"]
