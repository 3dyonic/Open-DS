"""Output contract: extensions, links, catalog, floors, and determinism."""

from __future__ import annotations

import copy
import json
from pathlib import Path

import pytest

from open_ds_validator.contract import (
    ContractError,
    apply_fragment_tokens,
    apply_output,
    build_catalog,
    collect_links,
    deterministic_zip,
    dump,
    extension_for,
    force_css_target,
    force_target_floor,
    links_document,
    load_token_paths,
    stamp_tokens,
    validate_tokens,
    write_catalog,
)
from open_ds_validator.floors import MSG_ERROR_PREVENTION, floor_findings
from open_ds_validator.load import load_packs, read_json, repo_root

ROOT = repo_root(Path(__file__))
PACKS = load_packs(ROOT)


def _floors(**components: object) -> dict:
    return {
        "contrast": {"text": 4.5, "nonText": 3},
        "resize": {"textResizePercent": 200, "contentLost": False},
        "textSpacing": {"lineHeight": 1.5, "paragraphSpacing": 2, "letterSpacing": 0.12, "wordSpacing": 0.16},
        "targetSize": {"minPx": 24, "sufficientSpacing": False},
        "components": list(components.get("components") or []),
    }


def test_error_prevention_text_source_and_methods() -> None:
    flagged = {"id": "pay-now", "flags": ["payment"], "prevention": "confirmed"}
    failed = floor_findings(_floors(components=[flagged]), require_complete=True)
    row = next(item for item in failed if item["id"] == "floor-error-prevention")
    assert row["message"] == MSG_ERROR_PREVENTION
    assert row["message"] == "Payments, deletes and legal steps can be undone, checked or confirmed."
    assert row["source"]["criterion"] == "WCAG 2.2 3.3.4"
    assert (
        row["source"]["url"] == "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html"
    )
    for key in ("reversible", "checked", "confirmed"):
        component = {**flagged, key: True}
        result = floor_findings(_floors(components=[component]), require_complete=True)
        assert "floor-error-prevention" not in {item["id"] for item in result}


def test_question_targets_are_left_out_and_a_sourceless_row_fails() -> None:
    packs = {
        "purpose": {
            "id": "purpose",
            "order": 1,
            "questions": [
                {
                    "id": "goal",
                    "options": [
                        {
                            "id": "yes",
                            "evidence_limited": False,
                            "why": "Because the fixture says so.",
                            "when_to_choose": "Choose this if the fixture needs it.",
                            "sources": [],
                            "requires": [{"question": "other"}],
                            "recommends": [{"question": "other", "option": "no", "reason": "Needs a source."}],
                        }
                    ],
                }
            ],
        },
        "global": {
            "id": "global",
            "order": 2,
            "questions": [{"id": "other", "options": [{"id": "no", "sources": []}]}],
        },
    }
    rows, errors = collect_links(packs)
    assert rows == []
    assert errors == ["goal/yes|recommends|other/no"]
    with pytest.raises(ContractError, match="no source"):
        build_catalog(packs, ROOT)


def test_material_48_is_sourced_at_every_density_and_does_not_replace_24() -> None:
    rows, errors = collect_links(PACKS)
    assert errors == []
    touches = [row for row in rows if row["to"] == "target-size/material-48"]
    assert [row["from"] for row in touches] == ["density/comfortable", "density/compact", "density/spacious"]
    for row in touches:
        assert row["type"] == "recommends"
        assert row["basis"] == "sourced"
        assert row["reason"] == "No matter the density, all touch targets should be at least 48 px."
        assert "when" not in row
        source = row["sources"][0]
        assert source["url"] == "https://m3.material.io/blog/material-density-web"
        assert source["quote"] == "No matter the density, all touch targets should be at least 48px in size."
        assert source["checked"] == "2026-10-29"
    tokens = {"primitive": {"target": {"min": {"$type": "dimension", "$value": {"unit": "px", "value": 48}}}}}
    force_target_floor(tokens)
    assert tokens["primitive"]["target"]["min"]["$value"] == {"unit": "px", "value": 24}
    assert tokens["primitive"]["target"]["min"]["$extensions"]["openDs"]["basis"] == "floor"
    css = force_css_target("--target-min: 48px; /* decision: density */")
    assert css == "--target-min: 24px; /* decision: density */"


def test_your_pick_has_no_why_and_checked_is_copied() -> None:
    option = {
        "evidence_limited": True,
        "why": "This why must not ship.",
        "when_to_choose": "Choose this if you are guessing.",
        "sources": [{"url": "https://example.com/note", "quote": "A line.", "checked": "2020-01-02"}],
    }
    row = extension_for(option, "radius-progression", ["radius-progression/geometric"], "")
    assert "why" not in row
    assert row["basis"] == "your-pick"
    assert row["sources"] == [{"url": "https://example.com/note", "quote": "A line.", "checked": "2020-01-02"}]
    assert "date.today" not in Path(extension_for.__code__.co_filename).read_text(encoding="utf-8")
    bare = {"primitive": {"space": {"1": {"$type": "dimension", "$value": {"unit": "px", "value": 4}}}}}
    assert validate_tokens(bare)
    force_target_floor(bare)
    stamp = validate_tokens(stamp_tokens(copy.deepcopy(bare), None, PACKS, []))
    assert stamp == []


def test_missing_fields_and_context_order() -> None:
    recipe = read_json(ROOT / "recipes" / "dense-data.json")
    recipe["picks"].append({"question": "usage-data", "option": "tables", "rationale": "People scan rows of records."})
    tokens = {
        "primitive": {
            "density": {
                "ui": {"$type": "other", "$value": "compact", "$description": "decision: density"},
            }
        }
    }
    rows, _errors = collect_links(PACKS)
    stamp_tokens(tokens, recipe, PACKS, rows)
    ext = tokens["primitive"]["density"]["ui"]["$extensions"]["openDs"]
    assert ext["context"] == ["density/compact", "usage-data/tables"]
    assert ext["context"] == sorted(ext["context"])
    broken = copy.deepcopy(tokens)
    del broken["primitive"]["density"]["ui"]["$extensions"]["openDs"]["basis"]
    assert any("basis" in item for item in validate_tokens(broken))


def test_catalog_uses_pack_reasons_and_is_deterministic(tmp_path: Path) -> None:
    first = build_catalog(PACKS, ROOT)
    second = build_catalog(PACKS, ROOT)
    assert dump(first) == dump(second)
    compact = first["density/compact"]
    reasons = [row["reason"] for row in compact["links"]]
    assert "No matter the density, all touch targets should be at least 48 px." in reasons
    assert "A fine 4 px grid fits the tighter spacing of compact screens." in reasons
    assert compact["tokens"]
    assert compact["tokens"][0]["path"] == "primitive.density.ui"
    assert "components" in compact
    space = first["spacing-base/base-4"]
    assert "button" in space["components"]
    assert "input" in space["components"]
    one = tmp_path / "a.json"
    two = tmp_path / "b.json"
    write_catalog(one, PACKS, ROOT)
    write_catalog(two, PACKS, ROOT)
    assert one.read_bytes() == two.read_bytes()


def test_fragment_cannot_override_the_target_floor() -> None:
    tokens = {"primitive": {}}
    paths = load_token_paths(ROOT)
    apply_fragment_tokens(tokens, "--target-min: 48px;\n", paths)
    assert tokens["primitive"]["target"]["min"]["$value"]["value"] == 48
    force_target_floor(tokens)
    assert tokens["primitive"]["target"]["min"]["$value"]["value"] == 24
    assert tokens["primitive"]["target"]["min"]["$extensions"]["openDs"]["basis"] == "floor"


def test_zip_bytes_are_stable(tmp_path: Path) -> None:
    members = {"b.txt": b"beta\n", "a.txt": b"alpha\n"}
    first = tmp_path / "one.zip"
    second = tmp_path / "two.zip"
    deterministic_zip(first, members)
    deterministic_zip(second, members)
    assert first.read_bytes() == second.read_bytes()


def test_density_fragments_have_no_placeholder_row_heights() -> None:
    found = {}
    for name in ("compact", "comfortable", "spacious"):
        text = (ROOT / "fragments" / "density" / f"{name}.css").read_text(encoding="utf-8").strip()
        found[name] = text
        for placeholder in ("36", "52", "64"):
            assert placeholder not in text
    assert found == {
        "compact": "--density: compact;",
        "comfortable": "--density: comfortable;",
        "spacious": "--density: spacious;",
    }


def test_apply_output_is_deterministic(tmp_path: Path) -> None:
    recipe = read_json(ROOT / "recipes" / "content-first.json")
    one = tmp_path / "one"
    two = tmp_path / "two"
    for dest in (one, two):
        dest.mkdir()
        (dest / "theme").mkdir()
        (dest / "theme" / "tokens.json").write_text(
            (ROOT / "boilerplates" / "3dyonic" / "theme" / "tokens.json").read_text(encoding="utf-8"),
            encoding="utf-8",
        )
        (dest / "theme" / "tokens.css").write_text("--target-min: 48px;\n", encoding="utf-8")
        (dest / "AGENTS.md").write_text("# Agent rules\n", encoding="utf-8")
        apply_output(dest, recipe, PACKS, ROOT)
    for name in ("recipe.json", "links.json", "AGENTS.md", "theme/tokens.json", "theme/tokens.css"):
        assert (one / name).read_bytes() == (two / name).read_bytes()
    assert (one / "AGENTS.md").read_text(encoding="utf-8").startswith("Status: provisional\n")
    tokens = json.loads((one / "theme" / "tokens.json").read_text(encoding="utf-8"))
    assert tokens["primitive"]["target"]["min"]["$value"]["value"] == 24
    assert "--target-min: 24px;" in (one / "theme" / "tokens.css").read_text(encoding="utf-8")
    links = json.loads((one / "links.json").read_text(encoding="utf-8"))
    assert all(set(row) == {"basis", "from", "id", "sources", "to", "type"} for row in links)
    assert links_document(collect_links(PACKS)[0]) == links
