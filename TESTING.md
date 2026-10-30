# Test Open DS locally

This guide takes you from a clean checkout to every part running on your machine: the CLI, the MCP server with your AI, the site, Storybook and the docs.

## 1. What you need

- Node.js 22 or later
- pnpm 10 (`corepack enable` gives it to you)
- uv (Python tool): https://docs.astral.sh/uv/
- Claude Code, to try the MCP server with an AI

## 2. Get the code

```bash
git clone https://github.com/3dyonic/Open-DS.git
```

```bash
cd Open-DS && git checkout RC1
```

```bash
pnpm install && uv sync --all-packages --group dev
```

pnpm may print a warning about ignored build scripts ("approve-builds"). It is safe to ignore; nothing in Open DS needs them.

## 3. Run everything at once

```bash
pnpm e2e
```

It builds the tokens, uses the CLI, deploys Dense data into a real Vite app and builds that app, deploys Multi-brand through the MCP server over stdio, then builds the site, Storybook and the docs. Each step prints ✓ or ✗. `pnpm e2e:quick` skips the three builds.

To see every layer checked against your instructions and the ticket specs:

```bash
pnpm harness:full
```

The report is in `harness/report.md`.

## 4. Try each part by hand

### CLI

```bash
node cli/bin/open-ds.js list
```

```bash
node cli/bin/open-ds.js why dense-data typography.definition
```

```bash
node cli/bin/open-ds.js when content-first "a number in a table"
```

```bash
node cli/bin/open-ds.js init multi-brand --dir /tmp/my-app --brand birch --yes
```

Then open `/tmp/my-app/AGENTS.md` to see what an agent gets. `--yes` lets you run it again over the same folder.

### MCP server with Claude Code

```bash
claude mcp add --scope user open-ds -- uv run --directory "$(pwd)" open-ds-mcp
```

`--scope user` makes the server available in every folder, not only in Open-DS. Check it with `claude mcp list`. Then open Claude Code in any empty project folder and ask:

- "Which Open DS scheme fits an order management tool, and why?"
- "Deploy it into this project."
- "In this scheme, what do I use for a number in a table?"
- "Why does this scheme set line height that way?"

### Website

```bash
pnpm --dir site dev
```

Open http://localhost:3000. The pages follow the Figma frames:

- Home: pick a scheme in the panel and watch the reasons, the answers matrix and the live specimen change.
- A scheme page, for example /schemes/multi-brand/: switch the brand and the mode on the applied screen.
- A scope page, for example /schemes/dense-data/voice/: the same five questions as every other scope.
- /schemes/dense-data/moves/: change one answer and see what moves.
- /compare/, /take/, /contribute/ and /questions/.

`pnpm harness:full` also runs the design check (`harness/design/fidelity.cjs`). It compares each page with the Figma reference images in `harness/design/`. It needs Playwright with Chromium.

### Storybook

```bash
pnpm --dir storybook dev
```

Open http://localhost:6006. Use the Scheme and Mode switches in the toolbar.

### Docs

```bash
pnpm --dir docs start
```

Open http://localhost:3000. If the site is still running on that port, Docusaurus asks whether to use another port: answer y. `/llms.txt` is the index for agents.

### The deployed app

```bash
pnpm --dir e2e/app dev
```

After `pnpm e2e`, this app runs with the Dense data scheme that the CLI deployed into it.

## 5. What is still a draft

All answers in the five schemes are drafts until you curate them. Nothing is published: no npm package and no public site.
