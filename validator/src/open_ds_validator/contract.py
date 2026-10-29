"""AI-ready init output and catalog. Pack data is copied. Nothing is stamped at run time."""

from __future__ import annotations

import argparse
import copy
import json
import re
import zipfile
from pathlib import Path

from open_ds_validator.floors import MSG_TARGET, TARGET_PX, fragment_path
from open_ds_validator.load import load_packs, read_json, repo_root
from open_ds_validator.resolve import all_questions

LINK_TYPES = ("requires", "discourages", "recommends")
LINK_FIELDS = ("basis", "from", "id", "sources", "to", "type")
BASIS = frozenset({"sourced", "floor", "your-pick"})
TARGET_PARTS = ("primitive", "target", "min")
ZIP_TIME = (1980, 1, 1, 0, 0, 0)
CHECKED = re.compile(r"^\d{4}-\d{2}-\d{2}$")
TOKEN_NAME = re.compile(r"^[a-z0-9-]+/[a-z0-9-]+/[a-z0-9-]+$")
FORM_CONTROL_KEEP_BASE = "Default spacing is used for most use cases, compact for tables."


class ContractError(RuntimeError):
    pass


def dump(value: object) -> str:
    return json.dumps(value, indent=2, sort_keys=True, ensure_ascii=False) + "\n"


def answer_id(question: str, option: str) -> str:
    return f"{question}/{option}"


def token_scopes(packs: dict[str, dict]) -> list[str]:
    found: list[str] = []
    ordered = sorted(packs.values(), key=lambda item: (item.get("order", 0), item.get("id", "")))
    for pack in ordered:
        for name in pack.get("tokenScopes") or []:
            if name not in found:
                found.append(name)
    return found


def scope_of(name: str) -> str:
    return name.split("/")[1]


def semantic_names_in(data: object) -> list[str]:
    if not isinstance(data, dict):
        return []
    tokens = data.get("tokens")
    if not isinstance(tokens, dict):
        return []
    return [key for key in tokens if isinstance(key, str) and TOKEN_NAME.fullmatch(key)]


def read_fragment_data(root: Path, fragment: str) -> object:
    path = fragment_path(root, fragment)
    if path is None or not path.is_file():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None


def unknown_scope_rows(packs: dict[str, dict], root: Path | None = None) -> list[tuple[str, str, str]]:
    scopes = set(token_scopes(packs))
    if not scopes:
        return []
    base = repo_root(root)
    rows: list[tuple[str, str, str]] = []
    for pack in packs.values():
        for question in pack.get("questions") or []:
            options = list(question.get("options") or []) + list(question.get("overrides") or [])
            for option in options:
                names = [str(key) for key in (option.get("tokens") or {}) if TOKEN_NAME.fullmatch(str(key))]
                fragment = option.get("fragment")
                if fragment:
                    names.extend(semantic_names_in(read_fragment_data(base, fragment)))
                for name in names:
                    if scope_of(name) not in scopes:
                        rows.append((name, question.get("id", ""), option.get("id", "")))
        for mapping in pack.get("scopeMappings") or []:
            name = str(mapping.get("name") or "")
            if TOKEN_NAME.fullmatch(name) and scope_of(name) not in scopes:
                rows.append((name, pack.get("id", ""), ""))
    return rows


def missing_basis_names(packs: dict[str, dict]) -> list[str]:
    names: list[str] = []
    for pack in packs.values():
        for mapping in pack.get("scopeMappings") or []:
            if mapping.get("basis") not in BASIS:
                names.append(str(mapping.get("name") or "token"))
    return names


def caution_complete(item: object) -> bool:
    if not isinstance(item, dict):
        return False
    url = item.get("url")
    quote = item.get("quote")
    checked = item.get("checked")
    return (
        isinstance(url, str)
        and bool(url.strip())
        and isinstance(quote, str)
        and bool(quote.strip())
        and isinstance(checked, str)
        and CHECKED.fullmatch(checked) is not None
    )


def output_caution(item: dict) -> dict:
    return {"checked": item["checked"], "quote": item["quote"], "url": item["url"]}


def complete_cautions(raw: object) -> list[dict]:
    if not isinstance(raw, list):
        return []
    return [output_caution(item) for item in raw if caution_complete(item)]


def caution_rows(data: object) -> list[object]:
    rows: list[object] = []
    if not isinstance(data, dict):
        return rows
    if isinstance(data.get("cautions"), list):
        rows.extend(data["cautions"])
    tokens = data.get("tokens")
    if isinstance(tokens, dict):
        for node in tokens.values():
            if isinstance(node, dict) and isinstance(node.get("cautions"), list):
                rows.extend(node["cautions"])
    return rows


def incomplete_caution_rows(packs: dict[str, dict], root: Path | None = None) -> list[tuple[str, str]]:
    base = repo_root(root)
    found: list[tuple[str, str]] = []
    for pack in packs.values():
        for question in pack.get("questions") or []:
            options = list(question.get("options") or []) + list(question.get("overrides") or [])
            for option in options:
                rows = list(option.get("cautions") or [])
                fragment = option.get("fragment")
                if fragment:
                    rows.extend(caution_rows(read_fragment_data(base, fragment)))
                if rows and any(not caution_complete(item) for item in rows):
                    found.append((question.get("id", ""), option.get("id", "")))
    return found


def form_control_keep_base(packs: dict[str, dict]) -> dict | None:
    """Sourced recommends that form-control keep the base. Absent when the pack has no such link."""
    for question in all_questions(packs):
        for option in question.get("options") or []:
            for effect in option.get("recommends") or []:
                texts = [str(effect.get("reason") or "")]
                for source in list(effect.get("sources") or []) + list(option.get("sources") or []):
                    if isinstance(source, dict):
                        texts.append(str(source.get("quote") or ""))
                if any(FORM_CONTROL_KEEP_BASE in text for text in texts):
                    return {
                        "from": answer_id(question["id"], option["id"]),
                        "effect": effect,
                        "option": option,
                    }
    return None


def source_complete(item: object) -> bool:
    return caution_complete(item)


def bibliography_only(item: object) -> bool:
    """A name, title, and url with no quote and no checked date. Not a contract source."""
    if not isinstance(item, dict):
        return False
    if item.get("quote") or item.get("checked"):
        return False
    name = item.get("name")
    title = item.get("title")
    url = item.get("url")
    return (
        isinstance(name, str)
        and bool(name.strip())
        and isinstance(title, str)
        and bool(title.strip())
        and isinstance(url, str)
        and bool(url.strip())
    )


def output_source(source: dict) -> dict:
    """Copy url, quote, and checked from a complete pack source. Do not invent any of them."""
    return {"checked": source["checked"], "quote": source["quote"], "url": source["url"]}


def _raw_sources(effect: dict, option: dict) -> list:
    raw = effect.get("sources") or option.get("sources") or []
    return raw if isinstance(raw, list) else []


def incomplete_source_rows(packs: dict[str, dict], root: Path | None = None) -> list[tuple[str, str]]:
    base = repo_root(root)
    found: list[tuple[str, str]] = []
    for pack in packs.values():
        for question in pack.get("questions") or []:
            options = list(question.get("options") or []) + list(question.get("overrides") or [])
            for option in options:
                rows = list(option.get("sources") or [])
                for kind in LINK_TYPES:
                    for effect in option.get(kind) or []:
                        rows.extend(effect.get("sources") or [])
                fragment = option.get("fragment")
                if fragment:
                    data = read_fragment_data(base, fragment)
                    if isinstance(data, dict) and isinstance(data.get("tokens"), dict):
                        for node in data["tokens"].values():
                            if isinstance(node, dict) and isinstance(node.get("sources"), list):
                                rows.extend(node["sources"])
                broken = [
                    item
                    for item in rows
                    if isinstance(item, dict) and not source_complete(item) and not bibliography_only(item)
                ]
                if broken:
                    found.append((question.get("id", ""), option.get("id", "")))
    return found


def _effect_options(effect: dict) -> list[str]:
    if isinstance(effect.get("options"), list) and effect["options"]:
        return [str(item) for item in effect["options"]]
    if effect.get("option"):
        return [str(effect["option"])]
    return []


def _link_sources(effect: dict, option: dict) -> list[dict]:
    return [output_source(item) for item in _raw_sources(effect, option) if source_complete(item)]


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
                    raw = _raw_sources(effect, option)
                    sources = _link_sources(effect, option)
                    basis = _link_basis(effect, option, sources)
                    has_url = any(isinstance(item, dict) and item.get("url") for item in raw)
                    for target in targets:
                        to = answer_id(str(effect.get("question") or ""), target)
                        row_id = f"{origin}|{kind}|{to}"
                        if row_id in seen:
                            continue
                        seen.add(row_id)
                        if not has_url:
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
    cautions: list[dict] | None = None,
) -> dict:
    owned = [output_source(item) for item in option.get("sources") or [] if source_complete(item)]
    if sources is None:
        used = owned
    else:
        used = [item for item in sources if source_complete(item)]
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
    copied = cautions if cautions is not None else complete_cautions(option.get("cautions"))
    if copied:
        row["cautions"] = copied
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
        cautions = ext.get("cautions")
        if cautions is not None and (
            not isinstance(cautions, list) or any(not caution_complete(item) for item in cautions)
        ):
            errors.append(f"{label} has a caution with no url, quote, or checked date")
        sources = ext.get("sources")
        if not isinstance(sources, list):
            errors.append(f"{label} sources must be a list")
            continue
        for source in sources:
            if not source_complete(source):
                errors.append(f"{label} has a source with no url, quote, or checked date")
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


def _base_tokens(root: Path) -> dict:
    tokens = read_json(root / "boilerplates" / "3dyonic" / "theme" / "tokens.json")
    force_target_floor(tokens)
    return tokens


def _component_names(css: str, props: set[str]) -> list[str]:
    if not props:
        return []
    names: set[str] = set()
    for match in re.finditer(r"([^{}]+)\{([^{}]*)\}", css):
        body = match.group(2)
        if not any(f"var({prop})" in body for prop in props):
            continue
        for sel in match.group(1).split(","):
            found = re.search(r"\.ods-([a-z0-9-]+)", sel)
            if found:
                names.add(found.group(1))
    return sorted(names)


def _reference_graph(tokens: dict) -> dict[str, set[str]]:
    """token path -> paths whose $value references it, one step."""
    incoming: dict[str, set[str]] = {}
    for path, node in _walk_values(tokens):
        value = node.get("$value")
        if isinstance(value, str) and value.startswith("{") and value.endswith("}"):
            target = value[1:-1]
            incoming.setdefault(target, set()).add(".".join(path))
    return incoming


def components_for(paths: list[str], tokens: dict, css: str, var_by_path: dict[str, str]) -> list[str]:
    graph = _reference_graph(tokens)
    seen = set(paths)
    queue = list(paths)
    while queue:
        current = queue.pop()
        for nxt in graph.get(current, ()):
            if nxt in seen:
                continue
            seen.add(nxt)
            queue.append(nxt)
    names: set[str] = set()
    for path in seen:
        parts = path.split(".")
        if len(parts) >= 2 and parts[0] == "component":
            names.add(parts[1])
    props = {var_by_path[path] for path in seen if path in var_by_path}
    names.update(_component_names(css, props))
    return sorted(names)


def _catalog_base(name: str, packs: dict[str, dict], base_tokens: dict) -> dict | None:
    """The pack's base token for this name, when it has one."""
    for pack in packs.values():
        for mapping in pack.get("scopeMappings") or []:
            if str(mapping.get("name") or "") != name or "value" not in mapping:
                continue
            if mapping.get("basis") not in BASIS:
                continue
            ext = {
                "basis": mapping["basis"],
                "context": [],
                "decision": "scope-mapping",
                "link": "",
                "sources": [],
                "when": "",
            }
            if mapping["basis"] != "your-pick" and mapping.get("why"):
                ext["why"] = mapping["why"]
            return {
                "$extensions": {"openDs": ext},
                "$type": "other",
                "$value": copy.deepcopy(mapping["value"]),
            }
    semantic = base_tokens.get("semantic") if isinstance(base_tokens, dict) else None
    node = semantic.get(name) if isinstance(semantic, dict) else None
    if isinstance(node, dict) and "$value" in node:
        return copy.deepcopy(node)
    return None


def build_catalog(packs: dict[str, dict], root: Path | None = None) -> dict:
    root = repo_root(root)
    rows, errors = collect_links(packs)
    if errors:
        raise ContractError("links with no source: " + ", ".join(errors))
    by_from: dict[str, list[dict]] = {}
    for row in rows:
        by_from.setdefault(row["from"], []).append(row)
    paths = load_token_paths(root)
    var_by_path = {".".join(parts): prop for prop, parts in paths.items()}
    base = _base_tokens(root)
    css_path = root / "boilerplates" / "3dyonic" / "structure" / "components.css"
    css = css_path.read_text(encoding="utf-8") if css_path.is_file() else ""
    catalog: dict[str, dict] = {}
    for question in all_questions(packs):
        for option in question.get("options") or []:
            key = answer_id(question["id"], option["id"])
            link_rows = []
            for row in by_from.get(key, []):
                link_rows.append(
                    {
                        "basis": row["basis"],
                        "from": row["from"],
                        "id": row["id"],
                        "reason": row["reason"],
                        "sources": row["sources"],
                        "to": row["to"],
                        "type": row["type"],
                    }
                )
            grouped: dict[str, list] = {}
            used_paths: list[str] = []
            fragment = option.get("fragment") or ""
            fragment_file = root / fragment if fragment else None
            data = None
            if fragment_file is not None and fragment_file.is_file() and ".." not in Path(fragment).parts:
                text = fragment_file.read_text(encoding="utf-8")
                changed = apply_fragment_tokens({}, text, paths)
                used_paths = list(changed)
                try:
                    data = json.loads(text)
                except json.JSONDecodeError:
                    data = None
            names = semantic_names_in(data)
            if "scopes" in option:
                names = [name for name in names if scope_of(name) in set(option.get("scopes") or [])]
            context = [key]
            link = _link_for(rows, key, {key})
            sources = [output_source(item) for item in option.get("sources") or [] if source_complete(item)]
            option_cautions = complete_cautions(option.get("cautions"))
            allowed = token_scopes(packs)
            if "scopes" in option:
                for scope in allowed:
                    grouped.setdefault(scope, [])
            for name in names:
                scope = scope_of(name)
                if allowed and scope not in allowed:
                    continue
                raw = (data or {}).get("tokens", {}).get(name) if isinstance(data, dict) else None
                after = copy.deepcopy(raw) if isinstance(raw, dict) else {"$value": raw}
                copied = complete_cautions(raw.get("cautions") if isinstance(raw, dict) else None)
                copied.extend(option_cautions)
                ext = extension_for(option, question["id"], context, link, sources, copied or None)
                if isinstance(after, dict):
                    after.pop("cautions", None)
                    after["$extensions"] = {"openDs": ext}
                entry = {"after": after, "name": name, "state": "set"}
                before = _catalog_base(name, packs, base)
                if before is not None:
                    entry["before"] = before
                grouped.setdefault(scope, []).append(entry)
            if "scopes" in option:
                for scope in allowed:
                    if grouped.get(scope):
                        continue
                    placeholder = f"space/{scope}/density"
                    before = _catalog_base(placeholder, packs, base)
                    if before is None:
                        grouped[scope] = [{"name": placeholder, "state": "no-source-yet"}]
                    else:
                        grouped[scope] = [
                            {
                                "after": copy.deepcopy(before),
                                "before": before,
                                "name": placeholder,
                                "state": "unchanged",
                            }
                        ]
            axis = question.get("axis") or question["id"]
            catalog.setdefault(axis, {})[key] = {
                "components": components_for(used_paths, base, css, var_by_path),
                "links": link_rows,
                "tokens": grouped,
            }
    return catalog


def agents_with_status(text: str, recipe: dict) -> str:
    status = recipe.get("status")
    if not status:
        return text
    prefix = f"Status: {status}\n\n"
    if text.startswith(prefix):
        return text
    return prefix + text


def _semantic_bucket(tokens: dict) -> dict:
    semantic = tokens.get("semantic")
    if not isinstance(semantic, dict):
        semantic = {}
        tokens["semantic"] = semantic
    return semantic


def hoist_semantic(tokens: dict) -> None:
    semantic = _semantic_bucket(tokens)
    for key in list(tokens):
        if isinstance(key, str) and TOKEN_NAME.fullmatch(key) and isinstance(tokens[key], dict):
            semantic[key] = tokens.pop(key)


def restrict_to_affected(tokens: dict, recipe: dict, packs: dict[str, dict]) -> None:
    options = _option_index(packs)
    affected: set[str] = set()
    declared = False
    for pick in recipe.get("picks") or []:
        option = options.get(pick.get("question", ""), {}).get(pick.get("option", ""))
        if not option or "scopes" not in option:
            continue
        declared = True
        affected.update(option.get("scopes") or [])
    if not declared:
        return
    semantic = _semantic_bucket(tokens)
    for key in list(semantic):
        if not TOKEN_NAME.fullmatch(str(key)):
            continue
        if str(key).split("/")[2] == "min-target":
            continue
        if scope_of(str(key)) not in affected:
            semantic.pop(key, None)


def annotate_affected(tokens: dict, recipe: dict | None, packs: dict[str, dict], rows: list[dict], root: Path) -> None:
    options = _option_index(packs)
    selected = {answer_id(pick["question"], pick["option"]) for pick in (recipe or {}).get("picks") or []}
    semantic = _semantic_bucket(tokens)
    for pick in (recipe or {}).get("picks") or []:
        option = options.get(pick.get("question", ""), {}).get(pick.get("option", ""))
        if not option or not option.get("scopes"):
            continue
        context = [answer_id(pick["question"], pick["option"])]
        link = _link_for(rows, context[0], selected)
        fragment_tokens: dict = {}
        fragment = option.get("fragment")
        if fragment:
            data = read_fragment_data(root, fragment)
            if isinstance(data, dict) and isinstance(data.get("tokens"), dict):
                fragment_tokens = data["tokens"]
        for name, node in semantic.items():
            if not TOKEN_NAME.fullmatch(str(name)) or not isinstance(node, dict):
                continue
            if scope_of(name) not in option["scopes"] or name.split("/")[2] == "min-target":
                continue
            raw = fragment_tokens.get(name)
            copied = complete_cautions(raw.get("cautions") if isinstance(raw, dict) else None)
            copied.extend(complete_cautions(option.get("cautions")))
            ext = extension_for(option, pick["question"], context, link, cautions=copied or None)
            node.pop("cautions", None)
            node["$extensions"] = {"openDs": ext}


def add_floor_scopes(tokens: dict, packs: dict[str, dict]) -> None:
    semantic = _semantic_bucket(tokens)
    for scope in token_scopes(packs):
        semantic[f"size/{scope}/min-target"] = {
            "$extensions": {"openDs": floor_target_extension()},
            "$type": "dimension",
            "$value": {"unit": "px", "value": TARGET_PX},
        }


def apply_mappings(tokens: dict, packs: dict[str, dict]) -> None:
    """Copy a mapping only when the pack gives a basis and a value. No Proposed."""
    semantic = _semantic_bucket(tokens)
    allowed = set(token_scopes(packs))
    for pack in packs.values():
        for mapping in pack.get("scopeMappings") or []:
            if mapping.get("basis") not in BASIS or "value" not in mapping:
                continue
            name = str(mapping.get("name") or "")
            if not TOKEN_NAME.fullmatch(name) or (allowed and scope_of(name) not in allowed):
                continue
            ext = {
                "basis": mapping["basis"],
                "context": [],
                "decision": "scope-mapping",
                "link": "",
                "sources": [],
                "when": "",
            }
            if mapping["basis"] != "your-pick" and mapping.get("why"):
                ext["why"] = mapping["why"]
            semantic[name] = {"$extensions": {"openDs": ext}, "$type": "other", "$value": mapping["value"]}


def apply_form_control_base(tokens: dict, recipe: dict, packs: dict[str, dict]) -> None:
    """Keep form-control at the base with basis sourced only when the pack has that recommends."""
    found = form_control_keep_base(packs)
    if not found:
        return
    selected = {answer_id(pick["question"], pick["option"]) for pick in recipe.get("picks") or []}
    if found["from"] not in selected:
        return
    effect = found["effect"]
    option = found["option"]
    sources = _link_sources(effect, option)
    semantic = _semantic_bucket(tokens)
    name = "space/form-control/density"
    current = semantic.get(name)
    value = current.get("$value") if isinstance(current, dict) and "$value" in current else None
    if value == "compact":
        value = None
    if value is None:
        return
    ext = extension_for(option, "density", [found["from"]], "", sources)
    ext["basis"] = "sourced"
    semantic[name] = {"$extensions": {"openDs": ext}, "$type": "other", "$value": value}


def apply_output(out_dir: Path, recipe: dict, packs: dict[str, dict] | None = None, root: Path | None = None) -> None:
    root = repo_root(root)
    packs = packs if packs is not None else load_packs(root)
    rows, errors = collect_links(packs)
    if errors:
        raise ContractError("init failed: a link has no source: " + ", ".join(errors))
    out_dir.mkdir(parents=True, exist_ok=True)
    token_path = out_dir / "theme" / "tokens.json"
    tokens = None
    if token_path.is_file():
        tokens = read_json(token_path)
        stamp_tokens(tokens, recipe, packs, rows)
        hoist_semantic(tokens)
        restrict_to_affected(tokens, recipe, packs)
        annotate_affected(tokens, recipe, packs, rows, root)
        apply_form_control_base(tokens, recipe, packs)
        apply_mappings(tokens, packs)
        add_floor_scopes(tokens, packs)
        problems = validate_tokens(tokens)
        if problems:
            raise ContractError("token contract failed: " + "; ".join(problems))
    (out_dir / "recipe.json").write_text(dump(recipe), encoding="utf-8")
    (out_dir / "links.json").write_text(dump(links_document(rows)), encoding="utf-8")
    if tokens is not None:
        token_path.write_text(dump(tokens), encoding="utf-8")
    css_path = out_dir / "theme" / "tokens.css"
    if css_path.is_file():
        css_path.write_text(force_css_target(css_path.read_text(encoding="utf-8")), encoding="utf-8")
    agents_path = out_dir / "AGENTS.md"
    if agents_path.is_file():
        agents_path.write_text(agents_with_status(agents_path.read_text(encoding="utf-8"), recipe), encoding="utf-8")


def write_catalog(path: Path, packs: dict[str, dict] | None = None, root: Path | None = None) -> None:
    root = repo_root(root)
    packs = packs if packs is not None else load_packs(root)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(dump(build_catalog(packs, root)), encoding="utf-8")


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
    catalog = sub.add_parser("catalog")
    catalog.add_argument("--out", required=True)
    args = parser.parse_args(argv)
    try:
        if args.cmd == "apply":
            apply_output(Path(args.out), read_json(Path(args.recipe)))
            return 0
        if args.cmd == "catalog":
            write_catalog(Path(args.out))
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
