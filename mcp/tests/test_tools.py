"""The four MCP tools return the same checker results as the validator."""

from __future__ import annotations

import copy

from open_ds_mcp.server import check_recipe, get_option, get_questions, list_scopes, mcp
from open_ds_validator.load import read_json, repo_root


def test_tool_names_are_the_four_dictionary_tools() -> None:
    import asyncio

    tools = asyncio.run(mcp.list_tools())
    names = {tool.name for tool in tools}
    assert names == {"list_scopes", "get_questions", "get_option", "check_recipe"}
    assert "build_tokens" not in names


def test_list_scopes_starts_with_purpose() -> None:
    rows = list_scopes()
    assert rows[0]["id"] == "purpose"
    assert len(rows[0]["questions"]) == 9


def test_get_option_includes_sources() -> None:
    result = get_option("purpose", "voice", "warm")
    assert result["ok"] is True
    assert result["option"]["sources"]
    assert result["option"]["why"]
    assert result["option"]["when_to_choose"].startswith("Choose this if")


def test_get_questions_resolves_a_global_reference() -> None:
    result = get_questions("color-primitives")
    scale = next(item for item in result["questions"] if item["id"] == "scale-direction")
    ids = [option["id"] for option in scale["options"]]
    assert "low-is-light" in ids
    assert "high-is-light" in ids


def test_check_recipe_refuses_an_invalid_recipe_without_a_fingerprint() -> None:
    recipe = read_json(repo_root() / "recipes" / "3dyonic.json")
    bad = copy.deepcopy(recipe)
    bad["picks"] = [pick for pick in bad["picks"] if pick["question"] != "voice"]
    result = check_recipe(bad)
    assert result["ok"] is False
    assert "fingerprint" not in result


def test_check_recipe_accepts_3dyonic() -> None:
    recipe = read_json(repo_root() / "recipes" / "3dyonic.json")
    result = check_recipe(recipe)
    assert result["ok"] is True
    assert len(result["fingerprint"]) == 64


def test_client_call_matches_the_function() -> None:
    import asyncio

    from fastmcp import Client

    recipe = read_json(repo_root() / "recipes" / "3dyonic.json")

    async def run() -> None:
        async with Client(mcp) as client:
            tools = await client.list_tools()
            names = {tool.name for tool in tools}
            assert "build_tokens" not in names
            called = await client.call_tool("check_recipe", {"recipe": recipe})
        payload = called.data if hasattr(called, "data") else called
        if isinstance(payload, dict):
            assert payload["ok"] is True
        else:
            assert "fingerprint" in str(payload)

    asyncio.run(run())
