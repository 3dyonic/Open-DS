"""AI-ready init output. Pack data is copied. Nothing is stamped at run time."""

from __future__ import annotations

import argparse
import copy
import json
import re
import zipfile
from pathlib import Path

from open_ds_validator.floors import MSG_TARGET, TARGET_PX
from open_ds_validator.load import load_packs, read_json, repo_root
from open_ds_validator.resolve import all_questions

LINK_TYPES = ("requires", "discourages", "recommends")
LINK_FIELDS = ("basis", "from", "id", "sources", "to", "type")
BASIS = frozenset({"sourced", "floor", "your-pick"})
TARGET_PARTS = ("primitive", "target", "min")
ZIP_TIME = (1980, 1, 1, 0, 0, 0)
CHECKED = re.compile(r"^\d{4}-\d{2}-\d{2}$")


class ContractError(RuntimeError):
    pass


def dump(value: object) -> str:
    return json.dumps(value, indent=2, sort_keys=True, ensure_ascii=False) + "\n"


def answer_id(question: str, option: str) -> str:
    return f"{question}/{option}"


def output_source(source: dict) -> dict:
    """Copy url, and quote/checked when the pack has them. Do not invent either."""
    row = {"url": source["url"]}
    if source.get("quote"):
        row["quote"] = source["quote"]
    if source.get("checked"):
        row["checked"] = source["checked"]
    return row


def _effect_options(effect: dict) -> list[str]:
    if isinstance(effect.get("options"), list) and effect["options"]:
        return [str(item) for item in effect["options"]]
    if effect.get("option"):
        return [str(effect["option"])]
    return []


def _link_sources(effect: dict, option: dict) -> list[dict]:
    raw = effect.get("sources") or option.get("sources") or []
    return [output_source(item) for item in raw if isinstance(item, dict) and item.get("url")]


def _link_basis(effect: dict, option: dict, sources: list[dict]) -> str:
    if effect.get("sources"):
        return "sourced" if sources else "your-pick"
    if option.get("evidence_limited") is True:
        return "your-pick"
    if sources:
        return "sourced"
    return "your-pick"


def collect_links(packs: dict[str, dict]) -> tuple[list[dict], list[str]]:
    """One row per option-to-option link. Question targets are left out.

    A row with no source is an error. Init must fail instead of writing it.
    """
    rows: list[dict] = []
    errors: list[str] = []
    seen: set[str] = set()
    for question in all_questions(packs):
        qid = question["id"]
        for option in question.get("options") or []:
            origin = answer_id(qid, option["id"])
            for kind in LINK_TYPES:
                for effect in option.get(kind) or []:
                    targets = _effect_options(effect)
                    if not targets:
                        continue
                    sources = _link_sources(effect, option)
                    basis = _link_basis(effect, option, sources)
                    for target in targets:
                        to = answer_id(str(effect.get("question") or ""), target)
                        row_id = f"{origin}|{kind}|{to}"
                        if row_id in seen:
                            continue
                        seen.add(row_id)
                        if not sources:
                            errors.append(row_id)
                            continue
                        rows.append(
                            {
                                "id": row_id,
                                "from": origin,
                                "to": to,
                                "type": kind,
                                "basis": basis,
                                "sources": sources,
                                "reason": effect.get("reason") or "",
                            }
                        )
    rows.sort(key=lambda item: item["id"])
    return rows, errors


def links_document(rows: list[dict]) -> list[dict]:
    return [{key: row[key] for key in LINK_FIELDS} for row in rows]


def _option_index(packs: dict[str, dict]) -> dict[str, dict[str, dict]]:
    index: dict[str, dict[str, dict]] = {}
    for question in all_questions(packs):
        index[question["id"]] = {option["id"]: option for option in question.get("options") or []}
    return index


def extension_for(
    option: dict,
    decision: str,
    context: list[str],
    link: str,
    sources: list[dict] | None = None,
) -> dict:
    owned = [output_source(item) for item in option.get("sources") or [] if item.get("url")]
    used = sources if sources is not None else owned
    if option.get("evidence_limited") is True or not used:
        basis = "your-pick"
    else:
        basis = "sourced"
    row = {
        "basis": basis,
        "context": sorted(set(context)),
        "decision": decision,
        "link": link,
        "sources": used,
        "when": option.get("when_to_choose") or "",
    }
    if basis != "your-pick":
        row["why"] = option.get("why") or ""
    return row


def floor_target_extension() -> dict:
    return {
        "basis": "floor",
        "context": [],
        "decision": "floor-target-size",
        "link": "",
        "sources": [],
        "when": "",
        "why": MSG_TARGET,
    }


def base_extension() -> dict:
    return {
        "basis": "your-pick",
        "context": [],
        "decision": "base",
        "link": "",
        "sources": [],
        "when": "",
    }


def _walk_values(node: object, path: tuple[str, ...] = ()):
    if not isinstance(node, dict):
        return
    if "$value" in node:
        yield path, node
        return
    for key in sorted(node):
        if key.startswith("$"):
            continue
        yield from _walk_values(node[key], (*path, key))


def _set_path(root: dict, parts: tuple[str, ...] | list[str], value: object) -> None:
    cursor = root
    for part in list(parts)[:-1]:
        nxt = cursor.get(part)
        if not isinstance(nxt, dict):
            nxt = {}
            cursor[part] = nxt
        cursor = nxt
    cursor[parts[-1]] = value


def _get_path(root: dict, parts: tuple[str, ...] | list[str]) -> object:
    cursor: object = root
    for part in parts:
        if not isinstance(cursor, dict) or part not in cursor:
            return None
        cursor = cursor[part]
    return cursor


def force_target_floor(tokens: dict) -> None:
    """WCAG 2.5.8 is 24px. A 48px recommendation must not replace it."""
    _set_path(
        tokens,
        TARGET_PARTS,
        {
            "$extensions": {"openDs": floor_target_extension()},
            "$type": "dimension",
            "$value": {"unit": "px", "value": TARGET_PX},
        },
    )


def force_css_target(css: str) -> str:
    if "--target-min" not in css:
        return css
    return re.sub(r"(--target-min\s*:\s*)([^;]+)(;)", r"\g<1>24px\3", css)


def _selected_context(recipe: dict | None, decision: str) -> list[str]:
    if not recipe:
        return []
    found = []
    for pick in recipe.get("picks") or []:
        if pick.get("question") == decision and pick.get("option"):
            found.append(answer_id(decision, pick["option"]))
    return found


def _link_for(rows: list[dict], target: str, selected: set[str]) -> str:
    matches = [row["id"] for row in rows if row["to"] == target and row["from"] in selected]
    return sorted(matches)[0] if matches else ""


def stamp_tokens(tokens: dict, recipe: dict | None, packs: dict[str, dict], rows: list[dict]) -> dict:
    options = _option_index(packs)
    selected = {answer_id(pick["question"], pick["option"]) for pick in (recipe or {}).get("picks") or []}
    for _path, node in _walk_values(tokens):
        description = str(node.get("$description") or "")
        match = re.fullmatch(r"decision:\s*([a-z0-9-]+)", description)
        if match:
            decision = match.group(1)
            context = set(_selected_context(recipe, decision))
            option = None
            for pick in (recipe or {}).get("picks") or []:
                if pick.get("question") == decision:
                    option = options.get(decision, {}).get(pick.get("option", ""))
                    break
            if option is None:
                node["$extensions"] = {"openDs": base_extension()}
                continue
            target = next(iter(context), "")
            for row in rows:
                if target and row["to"] == target and row["from"] in selected:
                    context.add(row["from"])
            node["$extensions"] = {
                "openDs": extension_for(option, decision, sorted(context), _link_for(rows, target, selected))
            }
            continue
        if "$extensions" not in node or "openDs" not in node.get("$extensions", {}):
            node["$extensions"] = {"openDs": base_extension()}
    force_target_floor(tokens)
    return tokens


def validate_tokens(tokens: dict) -> list[str]:
    errors: list[str] = []
    for path, node in _walk_values(tokens):
        label = ".".join(path) or "(root)"
        ext = (node.get("$extensions") or {}).get("openDs")
        if not isinstance(ext, dict):
            errors.append(f"{label} is missing $extensions.openDs")
            continue
        for key in ("basis", "context", "decision", "link", "sources", "when"):
            if key not in ext:
                errors.append(f"{label} is missing {key}")
        basis = ext.get("basis")
        if basis not in BASIS:
            errors.append(f"{label} has basis {basis!r}")
        if basis == "your-pick" and "why" in ext:
            errors.append(f"{label} is your-pick and must not carry why")
        if basis in {"sourced", "floor"} and not str(ext.get("why") or "").strip():
            errors.append(f"{label} is missing why")
        if basis == "sourced" and not str(ext.get("when") or "").strip():
            errors.append(f"{label} is missing when")
        if not isinstance(ext.get("decision"), str) or not ext.get("decision"):
            errors.append(f"{label} is missing a decision id")
        if not isinstance(ext.get("link"), str):
            errors.append(f"{label} is missing a link id")
        context = ext.get("context")
        if not isinstance(context, list) or context != sorted(context):
            errors.append(f"{label} context must be a sorted list")
        sources = ext.get("sources")
        if not isinstance(sources, list):
            errors.append(f"{label} sources must be a list")
            continue
        for source in sources:
            if not isinstance(source, dict) or not source.get("url"):
                errors.append(f"{label} has a source with no url")
                continue
            checked = source.get("checked")
            if checked is not None and (not isinstance(checked, str) or CHECKED.fullmatch(checked) is None):
                errors.append(f"{label} has a checked date that is not YYYY-MM-DD")
    return errors


def load_token_paths(root: Path) -> dict[str, list[str]]:
    return read_json(root / "schema" / "token-paths.json")


def _literal(css_value: str) -> tuple[str, object]:
    dim = re.fullmatch(r"(-?\d*\.?\d+)(rem|px|ms)", css_value)
    num = re.fullmatch(r"(-?\d*\.?\d+)", css_value)
    if dim:
        number = dim.group(1)
        value = float(number) if "." in number else int(number)
        return "dimension", {"unit": dim.group(2), "value": value}
    if num:
        raw = num.group(1)
        return "number", float(raw) if "." in raw else int(raw)
    return "other", css_value


def _declared_props(text: str) -> dict[str, str]:
    props: dict[str, str] = {}
    for match in re.finditer(r"--([A-Za-z0-9-]+)\s*:\s*([^;]+);", text):
        props[f"--{match.group(1)}"] = match.group(2).strip()
    return props


def apply_fragment_tokens(tokens: dict, text: str, paths: dict[str, list[str]]) -> list[str]:
    """Apply one fragment the way init does. Returns dotted paths it set."""
    changed: list[str] = []
    stripped = text.lstrip()
    if stripped.startswith("{"):
        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            data = None
        if isinstance(data, dict):
            for dotted, value in (data.get("tokens") or {}).items():
                parts = str(dotted).split(".")
                _set_path(tokens, parts, copy.deepcopy(value))
                changed.append(dotted)
            css = data.get("css") or {}
            props: dict[str, str] = {}
            props.update(css.get("both") or {})
            props.update(css.get("light") or {})
            for prop, value in props.items():
                parts = paths.get(prop)
                if not parts:
                    continue
                kind, literal = _literal(str(value))
                _set_path(tokens, parts, {"$type": kind, "$value": literal})
                changed.append(".".join(parts))
            return changed
    for prop, value in _declared_props(text).items():
        parts = paths.get(prop)
        if not parts:
            continue
        kind, literal = _literal(value)
        _set_path(tokens, parts, {"$type": kind, "$value": literal})
        changed.append(".".join(parts))
    return changed


def agents_with_status(text: str, recipe: dict) -> str:
    status = recipe.get("status")
    if not status:
        return text
    prefix = f"Status: {status}\n\n"
    if text.startswith(prefix):
        return text
    return prefix + text


def apply_output(out_dir: Path, recipe: dict, packs: dict[str, dict] | None = None, root: Path | None = None) -> None:
    root = repo_root(root)
    packs = packs if packs is not None else load_packs(root)
    rows, errors = collect_links(packs)
    if errors:
        raise ContractError("init failed: a link has no source: " + ", ".join(errors))
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "recipe.json").write_text(dump(recipe), encoding="utf-8")
    (out_dir / "links.json").write_text(dump(links_document(rows)), encoding="utf-8")
    token_path = out_dir / "theme" / "tokens.json"
    if token_path.is_file():
        tokens = read_json(token_path)
        stamp_tokens(tokens, recipe, packs, rows)
        problems = validate_tokens(tokens)
        if problems:
            raise ContractError("token contract failed: " + "; ".join(problems))
        token_path.write_text(dump(tokens), encoding="utf-8")
    css_path = out_dir / "theme" / "tokens.css"
    if css_path.is_file():
        css_path.write_text(force_css_target(css_path.read_text(encoding="utf-8")), encoding="utf-8")
    agents_path = out_dir / "AGENTS.md"
    if agents_path.is_file():
        agents_path.write_text(agents_with_status(agents_path.read_text(encoding="utf-8"), recipe), encoding="utf-8")


def deterministic_zip(path: Path, members: dict[str, bytes]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(path, "w") as archive:
        for name in sorted(members):
            info = zipfile.ZipInfo(filename=name, date_time=ZIP_TIME)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = (0o644 & 0xFFFF) << 16
            info.create_system = 0
            info.flag_bits |= 0x800
            archive.writestr(info, members[name], compresslevel=9)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="open-ds-contract")
    sub = parser.add_subparsers(dest="cmd", required=True)
    apply = sub.add_parser("apply")
    apply.add_argument("--out", required=True)
    apply.add_argument("--recipe", required=True)
    zipper = sub.add_parser("zip")
    zipper.add_argument("--out", required=True)
    zipper.add_argument("--recipe", required=True)
    zipper.add_argument("--tokens", required=True)
    zipper.add_argument("--links", required=True)
    zipper.add_argument("--agents", required=True)
    args = parser.parse_args(argv)
    try:
        if args.cmd == "apply":
            apply_output(Path(args.out), read_json(Path(args.recipe)))
            return 0
        members = {
            "AGENTS.md": Path(args.agents).read_bytes(),
            "links.json": Path(args.links).read_bytes(),
            "recipe.json": Path(args.recipe).read_bytes(),
            "tokens.json": Path(args.tokens).read_bytes(),
        }
        deterministic_zip(Path(args.out), members)
        return 0
    except ContractError as exc:
        print(str(exc))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
