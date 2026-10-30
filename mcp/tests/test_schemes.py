"""The scheme tools: list, read, explain, advise and deploy through the CLI."""

from __future__ import annotations

import asyncio
import json
import subprocess
from pathlib import Path

import pytest

from open_ds_mcp import schemes as sch
from open_ds_mcp.server import deploy, get_answer, get_scheme, list_schemes, mcp, when_to_use, why

ROOT = sch.root()


@pytest.fixture(scope="module", autouse=True)
def built_tokens() -> None:
    if not (ROOT / "tokens" / "dist" / "index.json").exists():
        subprocess.run(["node", str(ROOT / "tokens" / "build.mjs")], check=True)


def test_list_schemes_gives_five_with_guidance() -> None:
    items = list_schemes()
    assert [s["id"] for s in items] == [
        "accessible-first",
        "brand-expressive",
        "content-first",
        "dense-data",
        "multi-brand",
    ]
    assert all(s["use_when"] and s["avoid_when"] for s in items)
    assert next(s for s in items if s["id"] == "multi-brand")["brands"] == ["aster", "birch", "coral"]


def test_get_scheme_parts() -> None:
    summary = get_scheme("content-first")
    assert summary["voice"] and summary["scenarios"]
    usage = get_scheme("content-first", "usage")["usage"]
    assert any(u["situation"] == "number-in-table" for u in usage)
    with pytest.raises(ValueError, match="No scheme called"):
        get_scheme("nope")


def test_get_answer_has_why_and_because() -> None:
    a = get_answer("dense-data", "typography.q1")
    assert a["answer"] == "Core and data"
    assert a["why"]
    assert {b["question"] for b in a["because"]} == {"content.q1", "tasks.q1"}
    with pytest.raises(ValueError, match="Unknown question id"):
        get_answer("dense-data", "nope.q1")


def test_why_runs_the_cli_and_follows_the_chain() -> None:
    chain = why("dense-data", "typography.q3")
    assert chain["because"]
    key = why("multi-brand", "button/radius")
    assert key["semantic"] == "radius.control"
    assert key["values"]["aster-light"] != key["values"]["coral-light"]


def test_when_to_use_matches_words() -> None:
    rule = when_to_use("dense-data", "a number in a table")
    assert rule["situation"] == "number-in-table"
    assert rule["use"] == "type.data"


def test_deploy_writes_a_project(tmp_path: Path) -> None:
    result = deploy("multi-brand", str(tmp_path), brand="birch")
    assert result["brand"] == "birch"
    assert (tmp_path / "AGENTS.md").exists()
    assert (tmp_path / ".claude" / "skills" / "open-ds" / "SKILL.md").exists()
    assert (tmp_path / "src" / "components" / "ui" / "button.tsx").exists()
    assert json.loads((tmp_path / "open-ds.json").read_text())["scheme"] == "multi-brand"
    assert any("npm install" in step for step in result["next_steps"])


def test_deploy_reports_the_cli_error(tmp_path: Path) -> None:
    with pytest.raises(ValueError, match="no brand"):
        deploy("multi-brand", str(tmp_path), brand="nope")


def test_every_scheme_tool_has_a_description_for_agents() -> None:
    tools = {t.name: t for t in asyncio.run(mcp.list_tools())}
    for name in ["list_schemes", "get_scheme", "get_answer", "why", "when_to_use", "deploy"]:
        assert len(tools[name].description or "") > 60, name


def test_client_can_deploy(tmp_path: Path) -> None:
    from fastmcp import Client

    async def run() -> dict:
        async with Client(mcp) as client:
            result = await client.call_tool("deploy", {"scheme_id": "dense-data", "project_dir": str(tmp_path)})
            return result.data if hasattr(result, "data") else result

    payload = asyncio.run(run())
    assert payload["scheme"] == "dense-data"
    assert (tmp_path / "src" / "styles" / "open-ds.css").exists()


def test_deploy_refuses_to_overwrite_unless_asked(tmp_path: Path) -> None:
    deploy("dense-data", str(tmp_path))
    with pytest.raises(ValueError, match="--yes to overwrite"):
        deploy("dense-data", str(tmp_path))
    assert deploy("content-first", str(tmp_path), overwrite=True)["scheme"] == "content-first"
