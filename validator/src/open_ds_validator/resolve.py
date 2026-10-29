"""Resolve global references and scoped overrides."""

from __future__ import annotations

import copy


def _index_global(packs: dict[str, dict]) -> dict[str, dict]:
    global_pack = packs["global"]
    return {question["id"]: question for question in global_pack["questions"]}


def materialize(raw: dict, packs: dict[str, dict]) -> dict:
    if "ref" not in raw:
        return copy.deepcopy(raw)
    gid = raw["ref"].split(":", 1)[1]
    base = _index_global(packs)[gid]
    merged = copy.deepcopy(base)
    merged["id"] = raw["id"]
    merged["prompt"] = raw.get("prompt", base["prompt"])
    merged["summary"] = raw.get("summary", base["summary"])
    merged["required"] = raw.get("required", base.get("required", True))
    merged["ref"] = raw["ref"]
    merged["packScope"] = "scoped"
    for key in ("why_care", "affects", "feeds_into"):
        if key in raw:
            merged[key] = copy.deepcopy(raw[key])
    options = {item["id"]: item for item in merged["options"]}
    order = [item["id"] for item in merged["options"]]
    for override in raw.get("overrides", []):
        if override["id"] in options:
            options[override["id"]] = copy.deepcopy(override)
        else:
            order.append(override["id"])
            options[override["id"]] = copy.deepcopy(override)
    merged["options"] = [options[item_id] for item_id in order]
    return merged


def questions_for(packs: dict[str, dict], pack_ids: list[str]) -> list[dict]:
    """Return resolved questions in pack order. The same id appears once."""
    seen: dict[str, dict] = {}
    order: list[str] = []
    ordered_ids = sorted(pack_ids, key=lambda pid: (0 if pid == "purpose" else 1, packs[pid]["order"]))
    for pid in ordered_ids:
        for raw in packs[pid]["questions"]:
            question = materialize(raw, packs)
            question["pack"] = pid
            if question["id"] in seen:
                if raw.get("overrides") or raw.get("ref"):
                    seen[question["id"]] = question
                continue
            seen[question["id"]] = question
            order.append(question["id"])
    return [seen[item_id] for item_id in order]


def all_questions(packs: dict[str, dict]) -> list[dict]:
    ids = sorted(packs, key=lambda pid: packs[pid]["order"])
    return questions_for(packs, ids)
