"""End-to-end check of the MCP server over stdio, the way an AI client connects to it.

Usage: uv run python scripts/e2e_mcp.py <absolute project dir>
Starts `uv run open-ds-mcp` as a subprocess, lists the tools, reads a scheme,
asks when_to_use, and deploys a scheme into the folder. Prints one JSON line.
"""

from __future__ import annotations

import asyncio
import json
import sys

from fastmcp import Client


async def main(project_dir: str) -> dict:
    config = {"mcpServers": {"open-ds": {"command": "uv", "args": ["run", "open-ds-mcp"]}}}
    async with Client(config) as client:
        tools = sorted(t.name for t in await client.list_tools())
        schemes = (await client.call_tool("list_schemes", {})).data
        rule = (
            await client.call_tool("when_to_use", {"scheme_id": "dense-data", "situation": "number in a table"})
        ).data
        deployed = (
            await client.call_tool(
                "deploy", {"scheme_id": "multi-brand", "project_dir": project_dir, "brand": "coral", "overwrite": True}
            )
        ).data
    return {
        "tools": tools,
        "schemes": [s["id"] for s in schemes],
        "rule": rule["use"],
        "deployed": deployed["scheme"],
        "brand": deployed["brand"],
    }


if __name__ == "__main__":
    print(json.dumps(asyncio.run(main(sys.argv[1]))))
