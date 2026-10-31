"""The MCP server exposes exactly the scheme tools."""

from __future__ import annotations

import asyncio

from open_ds_mcp.server import mcp


def test_tool_names_are_the_scheme_tools() -> None:
    names = {tool.name for tool in asyncio.run(mcp.list_tools())}
    assert names == {"list_schemes", "get_scheme", "get_answer", "why", "when_to_use", "deploy"}
