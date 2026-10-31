"""Scheme data and the bridge to the open-ds CLI.

The MCP tools read schemes/ directly for simple lookups. For why, when and
deploy they run the same CLI a person runs, so both paths give the same
answer. Set OPEN_DS_ROOT to point at a checkout, or OPEN_DS_CLI at a bin file.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
from pathlib import Path


def root() -> Path:
    env = os.environ.get("OPEN_DS_ROOT")
    # mcp/src/open_ds_mcp/schemes.py sits three folders below the repository root.
    return Path(env).resolve() if env else Path(__file__).resolve().parents[3]


def cli_bin() -> Path:
    env = os.environ.get("OPEN_DS_CLI")
    return Path(env).resolve() if env else root() / "cli" / "bin" / "open-ds.js"


def scheme_ids() -> list[str]:
    folder = root() / "schemes"
    return sorted(p.stem for p in folder.glob("*.json") if p.stem != "grammar")


def load_scheme(scheme_id: str) -> dict:
    path = root() / "schemes" / f"{scheme_id}.json"
    if scheme_id not in scheme_ids():
        raise ValueError(f"No scheme called '{scheme_id}'. Schemes: {', '.join(scheme_ids())}.")
    return json.loads(path.read_text(encoding="utf-8"))


def grammar() -> dict:
    return json.loads((root() / "schemes" / "grammar.json").read_text(encoding="utf-8"))


def questions() -> dict[str, dict]:
    out: dict[str, dict] = {}
    for group in [*grammar()["reasons"], *grammar()["scopes"]]:
        for q in group["questions"]:
            out[q["id"]] = {**q, "group": group["id"], "kind": group["kind"]}
    return out


def run_cli(*args: str) -> dict:
    """Run the open-ds CLI with --json and return its output, or raise with its message."""
    node = shutil.which("node")
    if not node:
        raise RuntimeError("Node.js 22 or later is needed to run the open-ds CLI.")
    try:
        result = subprocess.run(
            [node, str(cli_bin()), *args, "--json"],
            capture_output=True,
            text=True,
            timeout=120,
            check=False,
        )
    except subprocess.TimeoutExpired as error:
        raise RuntimeError("The open-ds CLI did not finish within 120 seconds.") from error
    if result.returncode != 0:
        try:
            message = json.loads(result.stdout)["error"]
        except (ValueError, KeyError):
            message = result.stdout.strip() or result.stderr.strip()
        raise ValueError(message)
    try:
        return json.loads(result.stdout)
    except ValueError as error:
        raise RuntimeError(f"The open-ds CLI returned output that is not JSON: {result.stdout[:200]}") from error
