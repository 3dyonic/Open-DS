"""Recipe and pack checks. No color math and no token build."""

from __future__ import annotations

import re
from pathlib import Path

import jsonschema

from open_ds_validator.fingerprint import fingerprint_recipe
from open_ds_validator.load import load_schema, read_json, repo_root, validator_for
from open_ds_validator.resolve import all_questions, questions_for

SEVERITY_ORDER = {"error": 0, "warning": 1, "info": 2}


def finding(fid: str, severity: str, message: str, question: str = "", option: str = "", **extra: str) -> dict:
    row = {"id": fid, "severity": severity, "message": message}
    if question:
        row["question"] = question
    if option:
        row["option"] = option
    for key, value in extra.items():
        if value:
            row[key] = value
    return row


def _sort(findings: list[dict]) -> list[dict]:
    return sorted(
        findings,
        key=lambda item: (
            SEVERITY_ORDER[item["severity"]],
            item["id"],
            item.get("question", ""),
            item.get("option", ""),
        ),
    )


def _result(findings: list[dict], recipe: dict | None = None) -> dict:
    ordered = _sort(findings)
    if any(item["severity"] == "error" for item in ordered):
        return {"ok": False, "findings": ordered}
    if recipe is None:
        return {"ok": True, "findings": ordered}
    return {"ok": True, "findings": ordered, "fingerprint": fingerprint_recipe(recipe)}


def _words(text: str) -> int:
    return len(text.split())


def _effect_targets(effect: dict) -> list[str]:
    if "options" in effect:
        return list(effect["options"])
    if "option" in effect:
        return [effect["option"]]
    return []


def _option_index(questions: list[dict]) -> dict[str, dict[str, dict]]:
    index: dict[str, dict[str, dict]] = {}
    for question in questions:
        index[question["id"]] = {option["id"]: option for option in question.get("options", [])}
    return index


def validate_packs(packs: dict[str, dict], root: Path | None = None) -> dict:
    schema = load_schema("pack.schema.json", root)
    checker = validator_for(schema)
    findings: list[dict] = []
    for pack in packs.values():
        for error in checker.iter_errors(pack):
            findings.append(finding("pack-schema", "error", error.message, question=pack["id"]))
        for question in pack["questions"]:
            options = list(question.get("options", [])) + list(question.get("overrides", []))
            for option in options:
                why = option.get("why", "")
                when = option.get("when_to_choose", "")
                if _words(why) > 35:
                    findings.append(
                        finding("voice-why", "error", "why is longer than 35 words.", question["id"], option["id"])
                    )
                if not (when.startswith("Choose this if") or when.startswith("Choose this when")):
                    findings.append(
                        finding(
                            "voice-when",
                            "error",
                            "when_to_choose must start with Choose this if or Choose this when.",
                            question["id"],
                            option["id"],
                        )
                    )
                elif _words(when) > 25:
                    findings.append(
                        finding(
                            "voice-when",
                            "error",
                            "when_to_choose is longer than 25 words.",
                            question["id"],
                            option["id"],
                        )
                    )
                for cost in option.get("trade_offs", []):
                    if _words(cost) > 15:
                        findings.append(
                            finding(
                                "voice-cost",
                                "error",
                                "A trade-off is longer than 15 words.",
                                question["id"],
                                option["id"],
                            )
                        )
    questions = all_questions(packs)
    index = _option_index(questions)
    for pack in packs.values():
        for question in pack["questions"]:
            options = list(question.get("options", [])) + list(question.get("overrides", []))
            for option in options:
                for key in ("depends_on", "conflicts_with", "recommends", "discourages", "requires"):
                    for effect in option.get(key, []):
                        target = effect.get("question", "")
                        if target not in index:
                            findings.append(
                                finding(
                                    "broken-effect",
                                    "error",
                                    f"{key} points at an unknown question.",
                                    question["id"],
                                    option["id"],
                                )
                            )
                            continue
                        for option_id in _effect_targets(effect):
                            if option_id not in index[target]:
                                findings.append(
                                    finding(
                                        "broken-effect",
                                        "error",
                                        f"{key} points at an unknown option.",
                                        question["id"],
                                        option["id"],
                                    )
                                )
                        if "option" not in effect and "options" not in effect:
                            findings.append(
                                finding("broken-effect", "error", f"{key} has no option.", question["id"], option["id"])
                            )
    _check_question_meta(questions, index, root, findings)
    return _result(findings)


def _feed_backed(question: dict, target: str) -> bool:
    for option in question.get("options", []):
        for key in ("requires", "discourages", "recommends"):
            for effect in option.get(key, []):
                if effect.get("question") == target:
                    return True
    return False


def _check_question_meta(
    questions: list[dict], index: dict[str, dict], root: Path | None, findings: list[dict]
) -> None:
    fragment_root = repo_root(root) / "fragments"
    for question in questions:
        why_care = question.get("why_care")
        if isinstance(why_care, str) and _words(why_care) > 25:
            findings.append(finding("why-care-length", "error", "why_care is longer than 25 words.", question["id"]))
        if "affects" in question and not question.get("affects"):
            findings.append(finding("empty-affects", "warning", "affects is empty.", question["id"]))
        for target in question.get("feeds_into") or []:
            if target not in index:
                findings.append(
                    finding("unknown-feed", "error", "feeds_into names an unknown question.", question["id"])
                )
                continue
            if not _feed_backed(question, target):
                findings.append(
                    finding(
                        "unbacked-feed",
                        "error",
                        "feeds_into is not backed by a requires, discourages, or recommends rule.",
                        question["id"],
                    )
                )
        for option in question.get("options", []):
            fragment = option.get("fragment")
            if fragment and not (fragment_root / fragment).is_file():
                findings.append(
                    finding(
                        "missing-fragment",
                        "error",
                        f"Fragment file {fragment} does not exist.",
                        question["id"],
                        option["id"],
                    )
                )


def _selected(picks: dict[str, dict], effect: dict) -> bool:
    pick = picks.get(effect.get("question", ""))
    if not pick:
        return False
    if "options" in effect:
        return pick["option"] in effect["options"]
    return pick["option"] == effect.get("option")


def _check_param(spec: dict, value: object, question: str, option: str) -> list[dict]:
    findings: list[dict] = []
    kind = spec["type"]
    if kind == "string":
        if not isinstance(value, str):
            return [finding("param-type", "error", f"{spec['id']} must be a string.", question, option)]
        pattern = spec.get("pattern")
        if pattern and re.fullmatch(pattern, value) is None:
            findings.append(
                finding("param-pattern", "error", f"{spec['id']} does not match the pattern.", question, option)
            )
    elif kind == "integer":
        if isinstance(value, bool) or not isinstance(value, int):
            return [finding("param-type", "error", f"{spec['id']} must be an integer.", question, option)]
    elif kind == "number":
        if isinstance(value, bool) or not isinstance(value, int | float):
            return [finding("param-type", "error", f"{spec['id']} must be a number.", question, option)]
    else:
        return [finding("param-type", "error", f"{spec['id']} has an unknown type.", question, option)]
    if "minimum" in spec and value < spec["minimum"]:
        findings.append(finding("param-range", "error", f"{spec['id']} is below the minimum.", question, option))
    if "maximum" in spec and value > spec["maximum"]:
        findings.append(finding("param-range", "error", f"{spec['id']} is above the maximum.", question, option))
    return findings


def check_recipe(recipe: dict, packs: dict[str, dict], root: Path | None = None) -> dict:
    findings: list[dict] = []
    schema = load_schema("recipe.schema.json", root)
    for error in validator_for(schema).iter_errors(recipe):
        findings.append(finding("recipe-schema", "error", error.message))
    if findings:
        return _result(findings)

    pack_findings = validate_packs(packs, root)
    if not pack_findings["ok"]:
        return pack_findings

    missing_packs = [pid for pid in recipe["packs"] if pid not in packs]
    for pid in missing_packs:
        findings.append(finding("unknown-pack", "error", f"Unknown pack {pid}."))
    if missing_packs:
        return _result(findings)

    questions = questions_for(packs, recipe["packs"])
    by_id = {question["id"]: question for question in questions}
    purpose_ids = {question["id"] for question in packs["purpose"]["questions"]}
    picks_list = recipe["picks"]
    seen: set[str] = set()
    picks: dict[str, dict] = {}
    for pick in picks_list:
        qid = pick["question"]
        if qid in seen:
            findings.append(finding("duplicate-question", "error", "This question is answered twice.", qid))
            continue
        seen.add(qid)
        picks[qid] = pick

    if not any(qid in purpose_ids for qid in picks):
        findings.append(finding("missing-purpose", "error", "A recipe with no Purpose picks is not accepted."))

    for question in questions:
        if question.get("required", True) and question["id"] not in picks:
            findings.append(
                finding("missing-question", "error", "This required question has no answer.", question["id"])
            )

    for qid, pick in picks.items():
        question = by_id.get(qid)
        if question is None:
            findings.append(finding("unknown-question", "error", "This question is not in the selected packs.", qid))
            continue
        options = {option["id"]: option for option in question.get("options", [])}
        option = options.get(pick["option"])
        if option is None:
            findings.append(
                finding("unknown-option", "error", "This option is not a cited answer.", qid, pick["option"])
            )
            continue
        rationale = str(pick.get("rationale", "")).strip()
        if not rationale:
            findings.append(
                finding("missing-rationale", "error", "Write a rationale in your own words.", qid, option["id"])
            )
        elif len(rationale) > 280:
            findings.append(
                finding("rationale-length", "error", "The rationale must be 1 to 280 characters.", qid, option["id"])
            )
        params = pick.get("params") or {}
        specs = {spec["id"]: spec for spec in option.get("parameters", [])}
        for spec in option.get("parameters", []):
            if spec.get("required") and spec["id"] not in params:
                findings.append(
                    finding("missing-param", "error", f"Missing parameter {spec['id']}.", qid, option["id"])
                )
        for key, value in params.items():
            if key not in specs:
                findings.append(finding("unknown-param", "error", f"Unknown parameter {key}.", qid, option["id"]))
                continue
            findings.extend(_check_param(specs[key], value, qid, option["id"]))
        for effect in option.get("depends_on", []):
            if not _selected(picks, effect):
                findings.append(
                    finding("missing-dependency", "error", "A required dependency is not selected.", qid, option["id"])
                )
        for effect in option.get("conflicts_with", []):
            if _selected(picks, effect):
                findings.append(
                    finding("conflict", "error", "This answer conflicts with another pick.", qid, option["id"])
                )
        for effect in option.get("requires", []):
            if not _selected(picks, effect):
                findings.append(
                    finding(
                        "required-option",
                        "error",
                        "This answer requires another option.",
                        qid,
                        option["id"],
                        targetQuestion=effect.get("question", ""),
                        targetOption=effect.get("option", ""),
                        reason=effect.get("reason", ""),
                        because=option["label"],
                    )
                )
        for effect in option.get("recommends", []):
            if not _selected(picks, effect):
                findings.append(
                    finding(
                        "recommend",
                        "info",
                        "A recommended option was not selected.",
                        qid,
                        option["id"],
                        targetQuestion=effect.get("question", ""),
                        targetOption=effect.get("option", ""),
                        reason=effect.get("reason", ""),
                        because=option["label"],
                    )
                )
        for effect in option.get("discourages", []):
            if _selected(picks, effect):
                findings.append(
                    finding(
                        "discourage",
                        "warning",
                        "A discouraged option was selected.",
                        qid,
                        option["id"],
                        targetQuestion=effect.get("question", ""),
                        targetOption=effect.get("option", ""),
                        reason=effect.get("reason", ""),
                        because=option["label"],
                    )
                )

    _check_chain(recipe, picks, by_id, findings)
    return _result(findings, recipe)


def _check_chain(recipe: dict, picks: dict[str, dict], by_id: dict[str, dict], findings: list[dict]) -> None:
    chain = recipe.get("chain") or []
    if not chain:
        return
    strong = False
    for link in chain:
        rule = link.get("rule", "")
        source = link.get("from", "")
        if rule in ("requires", "discourages"):
            strong = True
        if rule == "states":
            continue
        if rule not in ("requires", "discourages", "recommends"):
            findings.append(finding("chain-rule", "error", "A chain link has an unknown rule.", source))
            continue
        pick = picks.get(source)
        question = by_id.get(source)
        if not pick or not question:
            findings.append(
                finding(
                    "chain-rule", "error", "A chain link starts from a question this recipe does not answer.", source
                )
            )
            continue
        option = next((item for item in question.get("options", []) if item["id"] == pick["option"]), None)
        effects = (option or {}).get(rule, [])
        backed = any(effect.get("question") == link.get("to") for effect in effects)
        if not backed:
            findings.append(
                finding(
                    "chain-rule",
                    "error",
                    "This chain link is not backed by that rule on the picked option.",
                    source,
                    pick["option"],
                )
            )
    if not strong:
        findings.append(
            finding("chain-strength", "error", "A demo chain needs at least one requires or discourages link.")
        )


def decision_ids(text: str) -> list[str]:
    return re.findall(r"decision:\s*([a-z0-9-]+)", text)


def render_decision_block(recipe: dict, packs: dict[str, dict], kind: str) -> str:
    questions = {question["id"]: question for question in questions_for(packs, recipe["packs"])}
    lines = ["<!-- decisions:start -->"]
    if kind == "readme":
        lines.append("## Decisions")
        lines.append("")
    else:
        lines.append("## Decision rules")
        lines.append("")
    for pick in sorted(recipe["picks"], key=lambda item: item["question"]):
        question = questions[pick["question"]]
        option = next(item for item in question["options"] if item["id"] == pick["option"])
        source = option["sources"][0]
        cost = option["trade_offs"][0]
        if kind == "readme":
            lines.extend(
                [
                    f"### {pick['question']}",
                    "",
                    f"- decision: {pick['question']}",
                    f"- Option: `{pick['option']}`",
                    f"- Reason: {pick['rationale'].strip()}",
                    f"- Source: {source['name']}, {source['title']}",
                    f"- Cost: {cost}",
                    "",
                ]
            )
        else:
            lines.extend(
                [
                    f"- decision: {pick['question']}",
                    f"  Do follow option `{pick['option']}`.",
                    f"  Do not drop the reason: {pick['rationale'].strip()}",
                    "",
                ]
            )
    lines.append("<!-- decisions:end -->")
    return "\n".join(lines)


def check_boilerplate(directory: Path, packs: dict[str, dict], root: Path | None = None) -> dict:
    findings: list[dict] = []
    manifest_path = directory / "manifest.json"
    if not manifest_path.is_file():
        return _result([finding("missing-manifest", "error", "manifest.json is missing.")])
    manifest = read_json(manifest_path)
    schema = load_schema("manifest.schema.json", root)
    for error in validator_for(schema).iter_errors(manifest):
        findings.append(finding("manifest-schema", "error", error.message))
    if any(item["severity"] == "error" for item in findings):
        return _result(findings)

    recipe_path = directory / manifest.get("recipePath", "")
    if not recipe_path.is_file():
        base = repo_root(root) / manifest.get("recipePath", "")
        recipe_path = base
    if not recipe_path.is_file():
        return _result([finding("missing-recipe", "error", "The manifest recipe path does not exist.")])
    recipe = read_json(recipe_path)
    recipe_result = check_recipe(recipe, packs, root)
    if not recipe_result["ok"]:
        return recipe_result
    if manifest["fingerprint"] != recipe_result["fingerprint"]:
        findings.append(finding("fingerprint-mismatch", "error", "The manifest fingerprint does not match the recipe."))
    if manifest["recipeId"] != recipe["id"]:
        findings.append(finding("recipe-id", "error", "The manifest recipe id does not match."))
    if manifest["serves"] != recipe["serves"]:
        findings.append(finding("serves-mismatch", "error", "manifest serves does not match the recipe."))

    declared = {item["id"]: item for item in manifest["decisions"]}
    actual = {pick["question"]: pick for pick in recipe["picks"]}
    if set(declared) != set(actual):
        findings.append(finding("decision-list", "error", "The manifest decision list does not match the recipe."))
    else:
        for qid, pick in actual.items():
            row = declared[qid]
            if row["option"] != pick["option"] or row["rationale"].strip() != pick["rationale"].strip():
                findings.append(
                    finding("decision-list", "error", "A manifest decision does not match the recipe.", qid)
                )

    roles = {item["role"] for item in manifest["items"]}
    for role in ("tokens", "css", "components"):
        if role not in roles:
            findings.append(finding("missing-tier", "error", f"The boilerplate is missing the {role} tier."))
    names = {item["name"] for item in manifest["items"]}
    for item in manifest["items"]:
        for dep in item["deps"]:
            if dep not in names:
                findings.append(finding("broken-dep", "error", f"{item['name']} depends on an unknown item."))
        for rel in item["files"]:
            if not (directory / rel).is_file():
                findings.append(finding("missing-file", "error", f"Missing file {rel}.", option=item["name"]))
        if item["role"] == "css":
            css = ""
            for rel in item["files"]:
                file_path = directory / rel
                if file_path.is_file():
                    css += file_path.read_text(encoding="utf-8")
            for theme in ("light", "dark"):
                for var_name in item["cssVars"][theme]:
                    if f"--{var_name}" not in css:
                        findings.append(
                            finding("missing-css-var", "error", f"--{var_name} is not in the CSS.", option=theme)
                        )

    token_items = [item for item in manifest["items"] if item["role"] == "tokens"]
    for item in token_items:
        for rel in item["files"]:
            path = directory / rel
            if not path.is_file():
                continue
            tokens = read_json(path)
            for tier in ("primitive", "semantic", "component"):
                if tier not in tokens:
                    findings.append(finding("token-tier", "error", f"The token file is missing the {tier} tier."))
            surface = tokens.get("semantic", {}).get("color", {}).get("surface")
            on_surface = tokens.get("semantic", {}).get("color", {}).get("on-surface")
            if surface is None or on_surface is None:
                findings.append(
                    finding("on-color-pair", "error", "semantic color must include surface and on-surface.")
                )

    readme_path = directory / "README.md"
    agents_path = directory / "AGENTS.md"
    if not readme_path.is_file() or not agents_path.is_file():
        findings.append(finding("missing-docs", "error", "README.md and AGENTS.md are required."))
        return _result(findings)
    readme = readme_path.read_text(encoding="utf-8")
    agents = agents_path.read_text(encoding="utf-8")
    if not readme.startswith("# What this design system serves"):
        findings.append(finding("readme-serves", "error", "The README must start with What this design system serves."))
    if manifest["serves"] not in readme:
        findings.append(finding("readme-serves", "error", "The README must include the serves text."))
    expected = render_decision_block(recipe, packs, "readme")
    if expected not in readme:
        findings.append(finding("readme-decisions", "error", "The README decision section does not match the recipe."))
    expected_agents = render_decision_block(recipe, packs, "agents")
    if expected_agents not in agents:
        findings.append(
            finding("agents-decisions", "error", "The AGENTS.md decision section does not match the recipe.")
        )
    for decision_id in decision_ids(agents):
        if decision_id not in declared:
            findings.append(
                finding(
                    "agents-decision-id", "error", "An AGENTS.md decision id is missing from the manifest.", decision_id
                )
            )
        if f"decision: {decision_id}" not in readme:
            findings.append(
                finding(
                    "agents-decision-id", "error", "An AGENTS.md decision id is missing from the README.", decision_id
                )
            )
    if "fingerprint" in recipe_result and recipe_result["fingerprint"] not in agents:
        findings.append(finding("agents-fingerprint", "error", "AGENTS.md must include the recipe fingerprint."))
    return _result(findings, recipe if not any(item["severity"] == "error" for item in findings) else None)


def schema_error_message(error: jsonschema.ValidationError) -> str:
    return error.message
