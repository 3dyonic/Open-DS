"""Four tools: list_scopes, get_questions, get_option, check_recipe."""

from __future__ import annotations

from fastmcp import FastMCP

from open_ds_validator.check import check_recipe as run_check
from open_ds_validator.load import load_packs
from open_ds_validator.resolve import materialize

mcp = FastMCP("open-ds")


def _packs() -> dict:
    return load_packs()


def _public_option(option: dict) -> dict:
    return {
        "id": option["id"],
        "label": option["label"],
        "summary": option["summary"],
        "why": option["why"],
        "when_to_choose": option["when_to_choose"],
        "trade_offs": option["trade_offs"],
        "sources": option["sources"],
        "formula": option.get("formula", ""),
        "parameters": option.get("parameters", []),
        "depends_on": option.get("depends_on", []),
        "conflicts_with": option.get("conflicts_with", []),
        "recommends": option.get("recommends", []),
        "discourages": option.get("discourages", []),
        "requires": option.get("requires", []),
    }


def _public_question(question: dict, pack_id: str) -> dict:
    return {
        "id": question["id"],
        "pack": pack_id,
        "prompt": question["prompt"],
        "summary": question["summary"],
        "required": question.get("required", True),
        "ref": question.get("ref", ""),
        "options": [_public_option(option) for option in question.get("options", [])],
    }


@mcp.tool
def list_scopes() -> list[dict]:
    """List scopes in the decision dictionary."""
    rows = []
    for pack in sorted(_packs().values(), key=lambda item: item["order"]):
        rows.append(
            {
                "id": pack["id"],
                "title": pack["title"],
                "summary": pack["summary"],
                "scope": pack["scope"],
                "order": pack["order"],
                "questions": [question["id"] for question in pack["questions"]],
            }
        )
    return rows


@mcp.tool
def get_questions(scope: str) -> dict:
    """Return the questions and cited options for one scope."""
    packs = _packs()
    if scope not in packs:
        return {"ok": False, "findings": [{"id": "unknown-pack", "severity": "error", "message": "Unknown scope."}]}
    questions = []
    for raw in packs[scope]["questions"]:
        resolved = materialize(raw, packs) if "ref" in raw else raw
        questions.append(_public_question(resolved, scope))
    return {"ok": True, "scope": scope, "questions": questions}


@mcp.tool
def get_option(scope: str, question: str, option: str) -> dict:
    """Return one option with its reason, cost, and sources."""
    payload = get_questions(scope)
    if not payload.get("ok", False):
        return payload
    for item in payload["questions"]:
        if item["id"] != question:
            continue
        for choice in item["options"]:
            if choice["id"] == option:
                return {"ok": True, "scope": scope, "question": question, "option": choice}
    return {
        "ok": False,
        "findings": [{"id": "unknown-option", "severity": "error", "message": "That option is not in this question."}],
    }


@mcp.tool
def check_recipe(recipe: dict) -> dict:
    """Check a recipe. An error returns findings and no fingerprint."""
    return run_check(recipe, _packs())
