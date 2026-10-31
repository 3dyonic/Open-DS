.PHONY: install install-pip test lint package-test site-build cli-test harness harness-full

install:
	uv sync --frozen --all-packages --group dev

install-pip:
	pip install -e mcp

test:
	uv run ruff check mcp
	uv run ruff format --check mcp
	uv run pytest -q

lint: test

site-build:
	pnpm --dir site build

cli-test:
	pnpm --dir cli test

harness:
	node harness/run.mjs

harness-full:
	node harness/run.mjs --full

package-test:
	pnpm test:package
