#!/usr/bin/env bash
# Run open-ds init for the dense-data preset and copy the bundle files.
# Usage: bash examples/run-dense-data.sh [destination]
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
dest="${1:-$root/examples/dense-data}"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
node "$root/cli/bin/open-ds.js" init "$root/recipes/dense-data.json" --out "$work"
mkdir -p "$dest"
cp "$work/recipe.json" "$dest/recipe.json"
cp "$work/theme/tokens.json" "$dest/tokens.json"
cp "$work/AGENTS.md" "$dest/AGENTS.md"
cp "$work/links.json" "$dest/links.json"
