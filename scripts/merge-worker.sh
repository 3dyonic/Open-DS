#!/usr/bin/env bash
# Merge a parallel worker's gap work (OD-243, OD-247): replay its key operations on the shared grammar
# and schemes, then take its component sources and stories from its commit. Its parts layers and
# drawings merge separately, once their Figma images exist (scripts/apply-anatomy.mjs).
#
#   scripts/merge-worker.sh <worker commit> <ops.jsonl> [base commit]
set -euo pipefail
cd "$(dirname "$0")/.."
commit=$1
ops=$2
base=${3:-d745d6d}
node scripts/apply-ops.mjs "$ops" | tail -1
files=$(git diff --name-only "$base" "$commit" | grep -E '^(ui/src/components|storybook/stories|harness/component-api-fixed\.json)' || true)
[ -n "$files" ] && git checkout "$commit" -- $files
echo "$files" | sed 's/^/  took /'
docs/node_modules/.bin/prettier --write schemes/grammar.json >/dev/null
