"""Output contract: extensions, links, floors, and determinism."""

from __future__ import annotations

import copy
import json
from pathlib import Path

import pytest

from open_ds_validator.contract import (
    ContractError,
    apply_fragment_tokens,
    apply_mappings,
    apply_output,
    build_catalog,
    collect_links,
    deterministic_zip,
    dump,
    extension_for,
    force_css_target,
    force_target_floor,
    form_control_keep_base,
    links_document,
    load_token_paths,
    missing_basis_names,
    stamp_tokens,
    validate_tokens,
    write_catalog,
)
from open_ds_validator.floors import MSG_ERROR_PREVENTION, floor_findings
from open_ds_validator.load import load_packs, read_json, repo_root
from open_ds_validator.resolve import all_questions

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


def test_question_targets_are_left_out_and_a_sourceless_row_fails(tmp_path: Path) -> None:
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
        apply_output(tmp_path, {"picks": []}, packs, ROOT)
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
    expected = []
    for question in all_questions(PACKS):
        axis = question.get("axis") or question["id"]
        for option in question.get("options") or []:
            expected.append((axis, f"{question['id']}/{option['id']}"))
    found = [(axis, key) for axis, rows in first.items() for key in rows]
    assert sorted(found) == sorted(expected)
    compact = first["density"]["density/compact"]
    reasons = [row["reason"] for row in compact["links"]]
    assert "No matter the density, all touch targets should be at least 48 px." in reasons
    assert "A fine 4 px grid fits the tighter spacing of compact screens." in reasons
    table = compact["tokens"]["table-row"][0]
    assert table["name"] == "space/table-row/density"
    assert table["after"]["$value"] == "compact"
    assert "scope" not in table
    assert table["state"] == "set"
    assert "before" not in table
    assert table["after"]["$extensions"]["openDs"]["basis"] == "sourced"
    source = table["after"]["$extensions"]["openDs"]["sources"][0]
    assert source["url"] == "https://carbondesignsystem.com/components/data-table/usage/"
    assert source["quote"].startswith("Use for compact interfaces")
    assert source["checked"] == "2026-10-29"
    form = compact["tokens"]["form-control"][0]
    card = compact["tokens"]["card"][0]
    reading = compact["tokens"]["reading-text"][0]
    assert form["state"] == "unchanged"
    assert form["before"] == form["after"]
    assert form["before"]["$value"] == {"unit": "rem", "value": 0.5}
    form_ext = form["after"]["$extensions"]["openDs"]
    assert form_ext["basis"] == "sourced"
    assert form_ext["context"] == ["usage-data/tables"]
    assert form_ext["sources"][0]["url"] == "https://atlassian.design/components/button/examples"
    assert form_ext["sources"][0]["checked"] == "2026-10-29"
    assert "compact for tables" in form_ext["sources"][0]["quote"]
    assert card["state"] == "unchanged"
    assert card["before"] == card["after"]
    assert card["before"]["$value"] == {"unit": "rem", "value": 1}
    assert card["after"]["$extensions"]["openDs"]["basis"] == "your-pick"
    assert "why" not in card["after"]["$extensions"]["openDs"]
    assert reading["state"] == "unchanged"
    assert reading["before"] == reading["after"]
    assert reading["before"]["$value"] == 1.5
    reading_ext = reading["after"]["$extensions"]["openDs"]
    assert reading_ext["basis"] == "sourced"
    assert reading_ext["context"] == ["density/compact"]
    assert reading_ext["sources"][0]["url"] == "https://designsystem.digital.gov/components/typography/"
    assert reading_ext["sources"][0]["checked"] == "2026-10-29"
    assert "medium density" in reading_ext["sources"][0]["quote"]
    assert card["after"]["$extensions"]["openDs"]["basis"] == "your-pick"
    comfortable = first["density"]["density/comfortable"]["tokens"]
    again = comfortable["reading-text"][0]
    assert again["state"] == "unchanged"
    assert again["before"]["$value"] == 1.5
    assert again["after"]["$extensions"]["openDs"]["basis"] == "sourced"
    assert again["after"]["$extensions"]["openDs"]["context"] == ["density/comfortable"]
    spacious = first["density"]["density/spacious"]["tokens"]["reading-text"][0]
    assert spacious["state"] == "unchanged"
    assert spacious["before"]["$value"] == 1.5
    assert spacious["after"]["$extensions"]["openDs"]["basis"] == "your-pick"
    assert spacious["after"]["$extensions"]["openDs"]["sources"] == []
    assert "why" not in spacious["after"]["$extensions"]["openDs"]
    for density in ("comfortable", "spacious"):
        tokens = first["density"][f"density/{density}"]["tokens"]
        assert tokens["card"][0]["after"]["$extensions"]["openDs"]["basis"] == "your-pick"
        assert tokens["table-row"][0]["state"] == "no-source-yet"
        assert "before" not in tokens["table-row"][0]
    space = first["spacing-base"]["spacing-base/base-4"]
    assert "button" in space["components"]
    assert "input" in space["components"]
    one = tmp_path / "a.json"
    two = tmp_path / "b.json"
    write_catalog(one, PACKS, ROOT)
    write_catalog(two, PACKS, ROOT)
    assert one.read_bytes() == two.read_bytes()


def test_catalog_scope_states() -> None:
    case = json.loads((ROOT / "fixtures" / "catalog" / "scope-states.json").read_text(encoding="utf-8"))
    catalog = build_catalog(case["packs"], ROOT)
    row = catalog["density"]["density/compact"]["tokens"]
    unchanged = row["card"][0]
    assert unchanged["state"] == "unchanged"
    assert unchanged["before"] == unchanged["after"]
    assert unchanged["before"]["$value"] == "roomy"
    assert "null" not in json.dumps(unchanged)
    form = row["form-control"][0]
    assert form["state"] == "unchanged"
    assert form["before"]["$value"] == {"unit": "rem", "value": 0.5}
    missing = row["marker"][0]
    assert missing["state"] == "no-source-yet"
    assert "before" not in missing
    assert "after" not in missing
    assert "scope" not in missing


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


def test_your_pick_mapping_ships_without_why_and_a_blank_basis_fails() -> None:
    packs = {
        "global": {
            "id": "global",
            "order": 2,
            "tokenScopes": ["card"],
            "scopeMappings": [
                {"name": "space/card/density", "basis": "your-pick", "value": "base"},
                {"name": "space/card/padding-y"},
            ],
        }
    }
    assert missing_basis_names(packs) == ["space/card/padding-y"]
    tokens: dict = {}
    apply_mappings(tokens, packs)
    written = tokens["semantic"]["space/card/density"]
    assert written["$extensions"]["openDs"]["basis"] == "your-pick"
    assert "why" not in written["$extensions"]["openDs"]
    assert "space/card/padding-y" not in tokens["semantic"]
    assert "Proposed" not in json.dumps(tokens)


def test_output_rejects_a_source_without_quote_or_checked() -> None:
    tokens = {
        "semantic": {
            "space/table-row/density": {
                "$extensions": {
                    "openDs": {
                        "basis": "sourced",
                        "context": ["density/compact"],
                        "decision": "density",
                        "link": "",
                        "sources": [{"url": "https://example.com/note"}],
                        "when": "Choose this if people need many controls in view.",
                        "why": "Because the fixture says so.",
                    }
                },
                "$type": "other",
                "$value": "compact",
            }
        }
    }
    assert any("source" in item for item in validate_tokens(tokens))
    packs = {
        "purpose": {
            "id": "purpose",
            "order": 1,
            "questions": [
                {
                    "id": "density",
                    "options": [
                        {
                            "id": "compact",
                            "sources": [
                                {
                                    "name": "Material",
                                    "title": "Spacing",
                                    "url": "https://m3.material.io/foundations/layout/understanding-layout/spacing",
                                }
                            ],
                            "recommends": [
                                {
                                    "question": "spacing-base",
                                    "option": "base-4",
                                    "reason": "A fine 4 px grid fits the tighter spacing of compact screens.",
                                }
                            ],
                        }
                    ],
                },
                {"id": "spacing-base", "options": [{"id": "base-4", "sources": []}]},
            ],
        }
    }
    rows, errors = collect_links(packs)
    assert errors == []
    assert rows[0]["sources"] == []
    assert rows[0]["basis"] == "your-pick"


def test_form_control_keeps_base_only_when_the_pack_says_so() -> None:
    found = form_control_keep_base(PACKS)
    assert found is not None
    assert found["from"] == "density/compact"
    source = found["effect"]["sources"][0]
    assert source["url"] == "https://atlassian.design/components/button/examples"
    assert source["checked"] == "2026-10-29"
    assert source["quote"] == found["effect"]["reason"]
    rows, errors = collect_links(PACKS)
    assert errors == []
    link = next(row for row in rows if row["id"] == "density/compact|recommends|usage-data/tables")
    assert link["type"] == "recommends"
    assert link["basis"] == "sourced"
    assert link["sources"][0]["quote"] == source["quote"]


def test_caution_is_copied_and_does_not_change_basis() -> None:
    option = {
        "why": "Compact density fits more on a screen. It suits tools and tables.",
        "when_to_choose": "Choose this if people need many controls in view.",
        "sources": [
            {
                "url": "https://carbondesignsystem.com/components/data-table/usage/",
                "quote": "A cited line.",
                "checked": "2026-10-29",
            }
        ],
    }
    cautions = [
        {
            "url": "https://carbondesignsystem.com/components/data-table/style/",
            "quote": "Use consistent component sizes throughout a layout.",
            "checked": "2026-10-29",
        }
    ]
    ext = extension_for(option, "density", ["density/compact"], "", cautions=cautions)
    assert ext["basis"] == "sourced"
    assert ext["why"] == option["why"]
    assert ext["cautions"] == cautions
    bare = extension_for(option, "density", ["density/compact"], "")
    assert "cautions" not in bare
    assert bare["basis"] == ext["basis"]
    assert bare["why"] == ext["why"]


def test_density_fragments_have_no_placeholder_row_heights() -> None:
    compact = json.loads((ROOT / "fragments" / "density" / "compact.json").read_text(encoding="utf-8"))
    assert compact["tokens"]["space/table-row/density"]["$value"] == "compact"
    assert list(compact["tokens"]) == ["space/table-row/density"]
    for name in ("comfortable", "spacious"):
        text = (ROOT / "fragments" / "density" / f"{name}.css").read_text(encoding="utf-8")
        assert f"--density: {name};" in text
        for placeholder in ("36", "52", "64"):
            assert placeholder not in text
    blob = json.dumps(compact)
    for placeholder in ("36", "52", "64"):
        assert placeholder not in blob


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
    semantic = tokens["semantic"]
    for scope in ("table-row", "form-control", "card", "reading-text"):
        floor = semantic[f"size/{scope}/min-target"]
        assert floor["$value"] == {"unit": "px", "value": 24}
        assert floor["$extensions"]["openDs"]["basis"] == "floor"
    assert "space/form-control/density" not in semantic
    assert "--target-min: 24px;" in (one / "theme" / "tokens.css").read_text(encoding="utf-8")
    links = json.loads((one / "links.json").read_text(encoding="utf-8"))
    assert all(set(row) == {"basis", "from", "id", "sources", "to", "type"} for row in links)
    assert links_document(collect_links(PACKS)[0]) == links
