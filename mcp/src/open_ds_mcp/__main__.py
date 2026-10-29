"""Run the MCP server on stdio, or on streamable HTTP with --http."""

from __future__ import annotations

import sys

from open_ds_mcp.server import mcp


def main() -> None:
    if "--http" in sys.argv:
        mcp.run(transport="http", host="127.0.0.1", port=8765)
        return
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
