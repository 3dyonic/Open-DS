"""Pass, reject, and lie cases for the validator."""

from __future__ import annotations

import copy
import json
from pathlib import Path

import pytest

from open_ds_validator.check import check_boilerplate, check_recipe, validate_packs
from open_ds_validator.fingerprint import fingerprint_recipe, recipe_from_share, share_code
from open_ds_validator.load import load_packs, read_json, repo_root
from open_ds_validator.resolve import materialize

ROOT = repo_root(Path(__file__))
PACKS = load_packs(ROOT)
RECIPE = read_json(ROOT / "recipes" / "3dyonic.json")


def _ids(result: dict, severity: str | None = None) -> list[str]:
    return [item["id"] for item in result["findings"] if severity is None or item["severity"] == severity]


def _clone(**changes) -> dict:
    recipe = copy.deepcopy(RECIPE)
    recipe.update(changes)
    return recipe


def _set(question: str, option: str, rationale: str = "Changed for the test.", params: dict | None = None) -> dict:
    recipe = copy.deepcopy(RECIPE)
    found = False
    for pick in recipe["picks"]:
        if pick["question"] == question:
            pick["option"] = option
            pick["rationale"] = rationale
            if params is None:
                pick.pop("params", None)
            else:
                pick["params"] = params
            found = True
    if not found:
        row = {"question": question, "option": option, "rationale": rationale}
        if params:
            row["params"] = params
        recipe["picks"].append(row)
    return recipe


def test_shipped_packs_pass_schema_and_voice() -> None:
    result = validate_packs(PACKS, ROOT)
    assert result["ok"], result["findings"]


def test_3dyonic_recipe_passes() -> None:
    result = check_recipe(RECIPE, PACKS, ROOT)
    assert result["ok"], result["findings"]
    assert result["fingerprint"] == fingerprint_recipe(RECIPE)
    assert len(result["fingerprint"]) == 64


def test_fingerprint_ignores_key_order() -> None:
    swapped = json.loads(json.dumps(RECIPE))
    swapped = {key: swapped[key] for key in reversed(list(swapped))}
    assert fingerprint_recipe(swapped) == fingerprint_recipe(RECIPE)


def test_two_checks_are_deterministic() -> None:
    first = check_recipe(RECIPE, PACKS, ROOT)
    second = check_recipe(copy.deepcopy(RECIPE), PACKS, ROOT)
    assert first == second


def test_missing_rationale_rejects_with_no_fingerprint() -> None:
    recipe = _set("voice", "warm", rationale="   ")
    result = check_recipe(recipe, PACKS, ROOT)
    assert result["ok"] is False
    assert "missing-rationale" in _ids(result, "error")
    assert "fingerprint" not in result


def test_long_rationale_rejects() -> None:
    recipe = _set("voice", "warm", rationale="x" * 281)
    result = check_recipe(recipe, PACKS, ROOT)
    assert result["ok"] is False
    assert "recipe-schema" in _ids(result) or "rationale-length" in _ids(result)
    assert "fingerprint" not in result


def test_unknown_option_rejects() -> None:
    result = check_recipe(_set("voice", "sarcastic"), PACKS, ROOT)
    assert result["ok"] is False
    assert "unknown-option" in _ids(result)
    assert "fingerprint" not in result


def test_unknown_question_rejects() -> None:
    recipe = _clone()
    recipe["picks"].append({"question": "not-real", "option": "content", "rationale": "This question is a lie."})
    result = check_recipe(recipe, PACKS, ROOT)
    assert "unknown-question" in _ids(result)
    assert result["ok"] is False


def test_missing_question_rejects() -> None:
    recipe = _clone()
    recipe["picks"] = [pick for pick in recipe["picks"] if pick["question"] != "voice"]
    result = check_recipe(recipe, PACKS, ROOT)
    assert "missing-question" in _ids(result)
    assert result["ok"] is False


def test_no_purpose_picks_is_an_error() -> None:
    recipe = _clone()
    purpose_ids = {question["id"] for question in PACKS["purpose"]["questions"]}
    recipe["picks"] = [pick for pick in recipe["picks"] if pick["question"] not in purpose_ids]
    recipe["packs"] = [pid for pid in recipe["packs"] if pid != "purpose"]
    result = check_recipe(recipe, PACKS, ROOT)
    assert "missing-purpose" in _ids(result)
    assert result["ok"] is False
    assert "fingerprint" not in result


def test_param_above_maximum_rejects() -> None:
    result = check_recipe(_set("step-count", "custom", params={"count": 99}), PACKS, ROOT)
    assert "param-range" in _ids(result)
    assert result["ok"] is False


def test_bad_hex_pattern_rejects() -> None:
    result = check_recipe(_set("seed-input", "hex", params={"seed": "terracotta"}), PACKS, ROOT)
    assert "param-pattern" in _ids(result)


def test_conflict_rejects_even_if_the_rationale_denies_it() -> None:
    recipe = _set("color-space", "srgb", rationale="There is no conflict with deltaE2000.")
    recipe = _set_on(recipe, "step-distance", "deltae2000", "The rationale claims this is fine.")
    result = check_recipe(recipe, PACKS, ROOT)
    assert "conflict" in _ids(result) or "missing-dependency" in _ids(result)
    assert result["ok"] is False
    assert "fingerprint" not in result


def test_missing_dependency_rejects() -> None:
    recipe = _set("color-space", "hsl")
    result = check_recipe(recipe, PACKS, ROOT)
    assert "missing-dependency" in _ids(result)
    assert result["ok"] is False


def test_multi_brand_recommends_separation_without_blocking() -> None:
    brand = next(question for question in PACKS["purpose"]["questions"] if question["id"] == "brand-variance")
    multi = next(option for option in brand["options"] if option["id"] == "multi-brand")
    assert "requires" not in multi
    assert multi["recommends"][0]["question"] == "structure-theme-separation"
    recipe = _set("brand-variance", "multi-brand")
    recipe = _set_on(recipe, "structure-theme-separation", "combined", "Keep values in the components.")
    result = check_recipe(recipe, PACKS, ROOT)
    assert result["ok"], result["findings"]
    assert "required-option" not in _ids(result)
    assert "recommend" not in _ids(result)
    assert "fingerprint" in result


def test_required_option_names_the_missing_option_and_the_pack_reason() -> None:
    case = json.loads((ROOT / "fixtures" / "recipes" / "required-option.json").read_text(encoding="utf-8"))
    result = check_recipe(case["recipe"], case["packs"], ROOT)
    required = next(item for item in result["findings"] if item["id"] == "required-option")
    assert required["because"] == "Ship"
    assert required["targetLabel"] == "Calm"
    assert required["targetOption"] == "calm"
    assert required["targetQuestion"] == "tone"
    assert required["reason"] == "This fixture requires a calm tone."
    assert required["message"] == "Ship needs Calm (tone). This fixture requires a calm tone."


def test_discouraged_pick_is_a_warning_and_still_ok() -> None:
    recipe = _set("product-type", "calm", rationale="The product should feel quiet.")
    recipe = _set_on(recipe, "density", "compact", "Still compact for the test.")
    result = check_recipe(recipe, PACKS, ROOT)
    assert result["ok"], result["findings"]
    assert "discourage" in _ids(result, "warning")
    assert "fingerprint" in result


def test_open_ds_validate_matches_the_node_lines(tmp_path: Path, capsys: pytest.CaptureFixture[str]) -> None:
    from open_ds_validator.cli import validate_main

    recipe = copy.deepcopy(RECIPE)
    recipe["picks"] = [pick for pick in recipe["picks"] if pick["question"] != "voice"]
    path = tmp_path / "recipe.json"
    path.write_text(json.dumps(recipe), encoding="utf-8")
    code = validate_main([str(path)])
    text = capsys.readouterr().out
    assert code == 1
    assert "error missing-question: voice has no answer yet." in text
    assert "Fix: pick an answer on /build, then run open-ds init <recipe.json>." in text


def test_open_ds_validate_prints_the_fingerprint(capsys: pytest.CaptureFixture[str]) -> None:
    from open_ds_validator.cli import validate_main

    code = validate_main([str(ROOT / "recipes" / "3dyonic.json")])
    assert code == 0
    assert capsys.readouterr().out.strip() == fingerprint_recipe(RECIPE)


def test_missed_recommendation_is_silent() -> None:
    result = check_recipe(_set("line-height", "tight"), PACKS, ROOT)
    assert result["ok"], result["findings"]
    assert "recommend" not in _ids(result)
    assert "prefills" not in result


def test_duplicate_question_rejects() -> None:
    recipe = _clone()
    recipe["picks"].append({"question": "voice", "option": "plain", "rationale": "A second answer."})
    result = check_recipe(recipe, PACKS, ROOT)
    assert "duplicate-question" in _ids(result)


def test_broken_effect_on_a_lie_pack() -> None:
    packs = copy.deepcopy(PACKS)
    packs["purpose"]["questions"][0]["options"][0]["requires"] = [
        {"question": "voice", "option": "not-an-option", "reason": "This points at an option that does not exist."}
    ]
    result = validate_packs(packs, ROOT)
    assert "broken-effect" in _ids(result)
    assert result["ok"] is False


def test_share_roundtrip_and_garbage() -> None:
    code = share_code(RECIPE)
    assert recipe_from_share(code)["id"] == "3dyonic"
    with pytest.raises(ValueError):
        recipe_from_share("%%%")


def test_color_override_replaces_global_option() -> None:
    raw = next(question for question in PACKS["color-primitives"]["questions"] if question["id"] == "scale-direction")
    assert "options" not in raw
    resolved = materialize(raw, PACKS)
    summaries = {option["id"]: option["summary"] for option in resolved["options"]}
    assert summaries["low-is-light"].startswith("Color steps use 50 to 1000")
    assert summaries["high-is-light"].startswith("A high number is a light color")


def test_different_rationale_changes_the_fingerprint() -> None:
    changed = _set("voice", "warm", rationale="A different reason in the reader's words.")
    assert fingerprint_recipe(changed) != fingerprint_recipe(RECIPE)


def test_boilerplate_matches_the_recipe() -> None:
    result = check_boilerplate(ROOT / "boilerplates" / "3dyonic", PACKS, ROOT)
    assert result["ok"], result["findings"]
    assert result["fingerprint"] == fingerprint_recipe(RECIPE)


def test_lie_manifest_fingerprint_rejects() -> None:
    folder = ROOT / "boilerplates" / "3dyonic"
    manifest = read_json(folder / "manifest.json")
    manifest["fingerprint"] = "0" * 64
    target = ROOT / "validator" / "tests" / "_tmp_boilerplate"
    if target.exists():
        import shutil

        shutil.rmtree(target)
    import shutil

    shutil.copytree(folder, target)
    (target / "manifest.json").write_text(json.dumps(manifest), encoding="utf-8")
    result = check_boilerplate(target, PACKS, ROOT)
    shutil.rmtree(target)
    assert result["ok"] is False
    assert "fingerprint-mismatch" in _ids(result)
    assert "fingerprint" not in result


def test_agents_rule_missing_from_manifest_rejects(tmp_path: Path) -> None:
    import shutil

    source = ROOT / "boilerplates" / "3dyonic"
    target = tmp_path / "kit"
    shutil.copytree(source, target)
    agents = (target / "AGENTS.md").read_text(encoding="utf-8")
    agents = agents.replace("<!-- decisions:end -->", "- decision: made-up-rule\n<!-- decisions:end -->")
    (target / "AGENTS.md").write_text(agents, encoding="utf-8")
    result = check_boilerplate(target, PACKS, ROOT)
    assert "agents-decision-id" in _ids(result)
    assert result["ok"] is False


def test_effect_reason_is_required() -> None:
    packs = copy.deepcopy(PACKS)
    effect = packs["purpose"]["questions"][0]["options"][0]["recommends"][0]
    del effect["reason"]
    result = validate_packs(packs, ROOT)
    assert result["ok"] is False
    assert "pack-schema" in _ids(result)


def test_gap_questions_stay_in_the_packs() -> None:
    wanted = {
        "accessibility": "contrast-check",
        "color-primitives": "on-color-pairing",
        "theming": "theme-shape",
        "delivery": "shareable-item",
    }
    for pack_id, question_id in wanted.items():
        ids = [question["id"] for question in PACKS[pack_id]["questions"]]
        assert question_id in ids
    delivery_ids = [question["id"] for question in PACKS["delivery"]["questions"]]
    assert "locked-at-init" in delivery_ids


def test_geometric_radius_keeps_limited_evidence() -> None:
    question = next(item for item in PACKS["radius"]["questions"] if item["id"] == "radius-progression")
    option = next(item for item in question["options"] if item["id"] == "geometric")
    assert option["evidence_limited"] is True
    assert all(cost != "Evidence is limited" for cost in option["trade_offs"])
    result = validate_packs(PACKS, ROOT)
    assert result["ok"], result["findings"]


def test_high_is_light_cites_material_tone_and_mdn() -> None:
    question = next(item for item in PACKS["global"]["questions"] if item["id"] == "scale-direction")
    option = next(item for item in question["options"] if item["id"] == "high-is-light")
    names = [source["name"] for source in option["sources"]]
    titles = [source["title"] for source in option["sources"]]
    assert "Radix" not in names
    assert "Material" in names
    assert "MDN" in names
    assert "hsl()" in titles
    assert any("m3.material.io/styles/color/system" in source["url"] for source in option["sources"])
    assert any("developer.mozilla.org" in source["url"] and source["title"] == "hsl()" for source in option["sources"])


def test_option_without_source_fails_schema() -> None:
    packs = copy.deepcopy(PACKS)
    del packs["global"]["questions"][0]["options"][0]["sources"]
    result = validate_packs(packs, ROOT)
    assert result["ok"] is False
    assert "pack-schema" in _ids(result)


def _set_on(recipe: dict, question: str, option: str, rationale: str) -> dict:
    for pick in recipe["picks"]:
        if pick["question"] == question:
            pick["option"] = option
            pick["rationale"] = rationale
            pick.pop("params", None)
            return recipe
    raise KeyError(question)
