"""Three tools: list_questions, get_question, check_recipe.

Purpose, plus the core decisions that exist in the packs. Later decisions
(cognitive patterns, and the voice options that are not in the packs yet)
are not invented here. Open DS does not calculate. Option text is copied
from the packs.
"""

from __future__ import annotations

import copy

from fastmcp import FastMCP

from open_ds_validator.check import check_recipe as validate_recipe
from open_ds_validator.load import load_packs
from open_ds_validator.resolve import questions_for

mcp = FastMCP("open-ds")

# Asked once, in this order. Density and voice live in the Purpose pack.
# The other ids are the visual core decisions present on master.
CORE_QUESTION_IDS: tuple[str, ...] = (
    "product-type",
    "users-and-context",
    "accessibility-target",
    "platforms",
    "team",
    "brand-variance",
    "usage-data",
    "density",
    "voice",
    "color-space",
    "contrast-metric",
    "scale-direction",
    "type-scale-ratio",
    "spacing-base",
    "radius-base",
    "theme-shape",
    "token-tiers",
    "on-color-pairing",
)


def _questions() -> dict[str, dict]:
    packs = load_packs()
    resolved = questions_for(packs, list(packs))
    return {question["id"]: question for question in resolved}


def _core_questions() -> list[dict]:
    by_id = _questions()
    return [by_id[qid] for qid in CORE_QUESTION_IDS if qid in by_id]


def _title(question: dict) -> str:
    return question["prompt"]


def _affects(question: dict) -> list[str]:
    affects = question.get("affects")
    if not affects:
        return []
    return list(affects)


def _unknown(question_id: str) -> dict:
    return {
        "ok": False,
        "findings": [
            {
                "id": "unknown-question",
                "severity": "error",
                "message": f"Unknown question id '{question_id}'.",
            }
        ],
    }


@mcp.tool
def list_questions() -> list[dict]:
    """List Purpose and the core decisions. Each row has id, title, and affects."""
    rows = []
    for question in _core_questions():
        rows.append(
            {
                "id": question["id"],
                "title": _title(question),
                "affects": _affects(question),
            }
        )
    return rows


@mcp.tool
def get_question(question_id: str) -> dict:
    """Return one core question. Options, reasons, and sources are copied from the packs."""
    question = _questions().get(question_id)
    if question is None or question_id not in CORE_QUESTION_IDS:
        return _unknown(question_id)
    payload = {
        "ok": True,
        "id": question["id"],
        "title": _title(question),
        "affects": _affects(question),
        "options": copy.deepcopy(question.get("options") or []),
    }
    if "why_care" in question:
        payload["why_care"] = question["why_care"]
    if "summary" in question:
        payload["summary"] = question["summary"]
    return payload


@mcp.tool
def check_recipe(recipe: dict) -> dict:
    """Check a recipe with the same Python validator the CLI uses."""
    return validate_recipe(recipe, load_packs())
