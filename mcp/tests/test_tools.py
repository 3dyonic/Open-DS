"""The three MCP tools: core questions, pack text, and the shared validator."""

from __future__ import annotations

import asyncio
import json

from open_ds_mcp.server import (
    CORE_QUESTION_IDS,
    check_recipe,
    get_question,
    list_questions,
    mcp,
)
from open_ds_validator.check import check_recipe as validate_recipe
from open_ds_validator.load import load_packs, read_json, repo_root
from open_ds_validator.resolve import questions_for

ROOT = repo_root()


def _error_ids(result: dict) -> set[str]:
    return {item["id"] for item in result.get("findings", []) if item.get("severity") == "error"}


def test_tool_names_are_the_three_core_tools() -> None:
    tools = asyncio.run(mcp.list_tools())
    names = {tool.name for tool in tools}
    assert names == {"list_questions", "get_question", "check_recipe"}


def test_list_questions_returns_id_title_and_affects() -> None:
    rows = list_questions()
    assert [row["id"] for row in rows] == list(CORE_QUESTION_IDS)
    assert rows[0]["id"] == "product-type"
    for row in rows:
        assert set(row) == {"id", "title", "affects"}
        assert row["title"]
        assert isinstance(row["affects"], list)

    by_id = {question["id"]: question for question in questions_for(load_packs(), list(load_packs()))}
    product = next(row for row in rows if row["id"] == "product-type")
    assert product["title"] == by_id["product-type"]["prompt"]
    assert product["affects"] == by_id["product-type"]["affects"]
    usage = next(row for row in rows if row["id"] == "users-and-context")
    assert usage["affects"] == []
    assert "step-distance" not in {row["id"] for row in rows}
    assert "font-family" not in {row["id"] for row in rows}


def test_get_question_returns_pack_options_reasons_and_sources() -> None:
    packs = load_packs()
    color = next(question for question in packs["color-primitives"]["questions"] if question["id"] == "color-space")
    result = get_question("color-space")
    assert result["ok"] is True
    assert result["options"] == color["options"]
    oklch = next(option for option in result["options"] if option["id"] == "oklch")
    assert oklch["why"] == color["options"][0]["why"]
    assert oklch["sources"] == color["options"][0]["sources"]
    assert result["why_care"] == next(
        question["why_care"] for question in packs["color-primitives"]["questions"] if question["id"] == "color-space"
    )

    resolved = {question["id"]: question for question in questions_for(packs, list(packs))}
    scale = get_question("scale-direction")
    assert scale["ok"] is True
    assert scale["options"] == resolved["scale-direction"]["options"]
    assert scale["title"] == resolved["scale-direction"]["prompt"]


def test_unknown_question_id_returns_a_clear_error() -> None:
    result = get_question("not-a-question")
    assert result["ok"] is False
    assert "unknown-question" in _error_ids(result)
    assert "not-a-question" in result["findings"][0]["message"]

    hidden = get_question("step-distance")
    assert hidden["ok"] is False
    assert "unknown-question" in _error_ids(hidden)
    assert "step-distance" in hidden["findings"][0]["message"]


def test_pass_recipe_returns_ok() -> None:
    recipe = read_json(ROOT / "recipes" / "dense-data.json")
    result = check_recipe(recipe)
    assert result == validate_recipe(recipe, load_packs())
    assert result["ok"] is True
    assert len(result["fingerprint"]) == 64


def test_shared_fixture_returns_its_expected_error_id(monkeypatch) -> None:
    case = json.loads((ROOT / "fixtures" / "recipes" / "required-option.json").read_text(encoding="utf-8"))
    monkeypatch.setattr("open_ds_mcp.server.load_packs", lambda: case["packs"])
    result = check_recipe(case["recipe"])
    assert "required-option" in _error_ids(result)
    assert set(case["expected_errors"]) <= _error_ids(result)
    assert result["ok"] is False
    assert "fingerprint" not in result
    assert result == validate_recipe(case["recipe"], case["packs"])


def test_dense_data_answers_from_the_tools_pass_check() -> None:
    """Pick the dense-data option from each listed question, then check passes.

    The validator still requires answers that this server does not list.
    Those picks stay as they are in recipes/dense-data.json.
    """
    recipe = read_json(ROOT / "recipes" / "dense-data.json")
    dense = {pick["question"]: pick for pick in recipe["picks"]}
    explanations: list[dict] = []
    chosen: dict[str, dict] = {}
    for row in list_questions():
        detail = get_question(row["id"])
        assert detail["ok"] is True
        assert detail["title"] == row["title"]
        assert detail["affects"] == row["affects"]
        pick = dense.get(row["id"])
        if pick is None:
            continue
        option = next(item for item in detail["options"] if item["id"] == pick["option"])
        assert option["why"]
        assert option["sources"]
        explanations.append({"question": row["id"], "option": option["id"], "why": option["why"]})
        built = {"question": row["id"], "option": option["id"], "rationale": pick["rationale"]}
        if "params" in pick:
            built["params"] = pick["params"]
        chosen[row["id"]] = built

    assert "usage-data" not in chosen
    assert set(chosen) == set(dense) & set(CORE_QUESTION_IDS)
    picks = [chosen[pick["question"]] if pick["question"] in chosen else pick for pick in recipe["picks"]]
    submitted = dict(recipe)
    submitted["picks"] = picks
    result = check_recipe(submitted)
    assert result == validate_recipe(submitted, load_packs())
    assert result["ok"] is True
    assert explanations
    assert all(item["why"] for item in explanations)


def test_client_lists_the_three_tools_and_checks_dense_data() -> None:
    from fastmcp import Client

    recipe = read_json(ROOT / "recipes" / "dense-data.json")

    async def run() -> None:
        async with Client(mcp) as client:
            tools = await client.list_tools()
            names = {tool.name for tool in tools}
            assert names == {"list_questions", "get_question", "check_recipe"}
            listed = await client.call_tool("list_questions", {})
            question = await client.call_tool("get_question", {"question_id": "not-a-question"})
            checked = await client.call_tool("check_recipe", {"recipe": recipe})
        listed_payload = listed.data if hasattr(listed, "data") else listed
        question_payload = question.data if hasattr(question, "data") else question
        checked_payload = checked.data if hasattr(checked, "data") else checked
        assert listed_payload[0]["id"] == "product-type"
        assert "affects" in listed_payload[0]
        assert question_payload["ok"] is False
        assert "not-a-question" in question_payload["findings"][0]["message"]
        assert checked_payload["ok"] is True

    asyncio.run(run())
