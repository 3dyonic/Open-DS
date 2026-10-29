#!/usr/bin/env bash
# Compatibility wrapper. Prefer examples/run-preset.sh.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
exec bash "$root/examples/run-preset.sh" dense-data "${1:-$root/examples/dense-data}"
