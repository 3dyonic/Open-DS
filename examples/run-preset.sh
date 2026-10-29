#!/usr/bin/env bash
# Copy one stance bundle, or all five, from open-ds init.
# Usage:
#   bash examples/run-preset.sh <stance> [destination]
#   bash examples/run-preset.sh --all [destination-root]
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
stances=(accessible-first dense-data multi-brand content-first brand-expressive)

run_one() {
  local stance="$1"
  local dest="$2"
  local recipe="$root/recipes/${stance}.json"
  if [[ ! -f "$recipe" ]]; then
    echo "No recipe for stance: $stance" >&2
    exit 1
  fi
  local work
  work="$(mktemp -d)"
  node "$root/cli/bin/open-ds.js" init "$recipe" --out "$work"
  mkdir -p "$dest"
  cp "$work/recipe.json" "$dest/recipe.json"
  cp "$work/theme/tokens.json" "$dest/tokens.json"
  cp "$work/AGENTS.md" "$dest/AGENTS.md"
  cp "$work/links.json" "$dest/links.json"
  rm -rf "$work"
}

if [[ $# -lt 1 ]]; then
  echo "Usage: bash examples/run-preset.sh <stance> [destination]" >&2
  echo "       bash examples/run-preset.sh --all [destination-root]" >&2
  exit 1
fi

if [[ "$1" == "--all" ]]; then
  dest_root="${2:-$root/examples}"
  for stance in "${stances[@]}"; do
    run_one "$stance" "$dest_root/$stance"
  done
else
  run_one "$1" "${2:-$root/examples/$1}"
fi
