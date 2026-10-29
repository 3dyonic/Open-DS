.PHONY: install install-pip test lint site-test site-build cli-test

install:
	uv sync --frozen --all-packages --group dev

install-pip:
	pip install -e validator -e "mcp"

test:
	uv run ruff check validator mcp
	uv run ruff format --check validator mcp
	uv run pytest -q

lint: test

site-test:
	pnpm --dir site test

site-build:
	pnpm --dir site build

cli-test:
	pnpm --dir cli test
