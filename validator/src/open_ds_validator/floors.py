"""Accessibility floors. Declarations are checked. Nothing is measured."""

from __future__ import annotations

import json
from pathlib import Path

CONFIRM_FLAGS = ("destructive", "payment", "legal-commitment")
PREVENTION = ("reversible", "checked", "confirmed")
HIDDEN_BY = frozenset({"hover", "accordion"})

TEXT_RATIO = 4.5
NON_TEXT_RATIO = 3.0
RESIZE_PERCENT = 200
LINE_HEIGHT = 1.5
PARAGRAPH_SPACING = 2.0
LETTER_SPACING = 0.12
WORD_SPACING = 0.16
TARGET_PX = 24

MSG_RESIZE = "Text must resize to 200% without loss of content (WCAG 2.2 1.4.4)."
MSG_SPACING = (
    "Text spacing must allow line height 1.5, paragraph spacing 2, "
    "letter spacing 0.12, and word spacing 0.16 (WCAG 2.2 1.4.12)."
)
MSG_TARGET = "Targets must be at least 24px or have sufficient spacing (WCAG 2.2 2.5.8)."
MSG_ERROR_PREVENTION = "Payments, deletes and legal steps can be undone, checked or confirmed."
ERROR_PREVENTION_SOURCE = {
    "criterion": "WCAG 2.2 3.3.4",
    "url": "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html",
}

_MISSING = object()


def _finding(fid: str, message: str, **extra: object) -> dict:
    row: dict = {"id": fid, "severity": "error", "message": message}
    row.update(extra)
    return row


def _number(block: dict | None, key: str) -> object:
    if not isinstance(block, dict) or key not in block:
        return _MISSING
    value = block[key]
    if isinstance(value, bool) or not isinstance(value, int | float):
        return None
    return float(value)


def _below(value: object, minimum: float) -> bool:
    return value is _MISSING or value is None or value < minimum


def _section(floors: dict, key: str, require_complete: bool) -> dict | None:
    if key not in floors:
        return {} if require_complete else None
    block = floors[key]
    return block if isinstance(block, dict) else {}


def floor_findings(floors: dict | None, *, require_complete: bool) -> list[dict]:
    """Check one floors object.

    The global pack must declare every floor (`require_complete=True`).
    A fragment declares only the keys it has (`require_complete=False`).
    """
    if floors is None:
        if not require_complete:
            return []
        floors = {}
    if not isinstance(floors, dict):
        floors = {}
    findings: list[dict] = []
    _contrast(floors, findings, require_complete)
    _resize(floors, findings, require_complete)
    _spacing(floors, findings, require_complete)
    _target(floors, findings, require_complete)
    _components(floors, findings)
    return findings


def _contrast(floors: dict, findings: list[dict], require_complete: bool) -> None:
    block = _section(floors, "contrast", require_complete)
    if block is None:
        return
    problems: list[str] = []
    if _below(_number(block, "text"), TEXT_RATIO):
        problems.append("text contrast is below 4.5:1")
    if _below(_number(block, "nonText"), NON_TEXT_RATIO):
        problems.append("non-text contrast is below 3:1")
    if problems:
        detail = "; ".join(problems)
        findings.append(_finding("floor-contrast", f"{detail} (WCAG 2.2 1.4.3 and 1.4.11)."))


def _resize(floors: dict, findings: list[dict], require_complete: bool) -> None:
    block = _section(floors, "resize", require_complete)
    if block is None:
        return
    percent = _number(block, "textResizePercent")
    lost = bool(block.get("contentLost") is True)
    if _below(percent, RESIZE_PERCENT) or lost:
        findings.append(_finding("floor-resize", MSG_RESIZE))


def _spacing(floors: dict, findings: list[dict], require_complete: bool) -> None:
    block = _section(floors, "textSpacing", require_complete)
    if block is None:
        return
    short = any(
        _below(_number(block, key), minimum)
        for key, minimum in (
            ("lineHeight", LINE_HEIGHT),
            ("paragraphSpacing", PARAGRAPH_SPACING),
            ("letterSpacing", LETTER_SPACING),
            ("wordSpacing", WORD_SPACING),
        )
    )
    if short:
        findings.append(_finding("floor-text-spacing", MSG_SPACING))


def _target(floors: dict, findings: list[dict], require_complete: bool) -> None:
    block = _section(floors, "targetSize", require_complete)
    if block is None:
        return
    min_px = _number(block, "minPx")
    size_ok = min_px is not _MISSING and min_px is not None and min_px >= TARGET_PX
    spacing_ok = block.get("sufficientSpacing") is True
    if not size_ok and not spacing_ok:
        findings.append(_finding("floor-target-size", MSG_TARGET))


def _components(floors: dict, findings: list[dict]) -> None:
    components = floors.get("components")
    if not isinstance(components, list):
        return
    allowed = set(CONFIRM_FLAGS)
    for component in components:
        if not isinstance(component, dict):
            continue
        cid = str(component.get("id") or "component")
        flags = component.get("flags") or []
        flagged = [flag for flag in flags if flag in allowed]
        # `prevention` is the component's own default. The floor does not read it.
        if flagged and not any(component.get(key) is True for key in PREVENTION):
            findings.append(
                _finding(
                    "floor-error-prevention",
                    MSG_ERROR_PREVENTION,
                    source=ERROR_PREVENTION_SOURCE,
                )
            )
        hidden = component.get("hiddenBy")
        if component.get("critical") is True and hidden in HIDDEN_BY:
            findings.append(
                _finding(
                    "coga.critical-not-hidden",
                    f"{cid} is critical and hidden behind {hidden}.",
                )
            )


def base_pack_floor_findings(packs: dict[str, dict]) -> list[dict]:
    """Floors on the global pack apply to every recipe. Other packs are not a back door."""
    base = packs.get("global")
    if base is None:
        return []
    return floor_findings(base.get("floors"), require_complete=True)


def fragment_path(root: Path, fragment: str) -> Path | None:
    if not isinstance(fragment, str) or not fragment:
        return None
    path = Path(fragment)
    if path.is_absolute() or ".." in path.parts:
        return None
    full = (root / path).resolve()
    try:
        full.relative_to(root.resolve())
    except ValueError:
        return None
    return full


def read_fragment_floors(root: Path, fragment: str) -> dict | None:
    """Return floors when the fragment file is a JSON object with a floors key."""
    path = fragment_path(root, fragment)
    if path is None or not path.is_file():
        return None
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None
    if not isinstance(data, dict):
        return None
    floors = data.get("floors")
    if not isinstance(floors, dict):
        return None
    return floors
