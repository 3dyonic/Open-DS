# Test Open DS locally

This guide takes you from a clean checkout to every part running on your machine: the CLI, the MCP server with your AI, the site, Storybook and the docs.

## 1. What you need

- Node.js 22 or later
- pnpm 10 (`corepack enable` gives it to you)
- Claude Code, to try the MCP server with an AI

## 2. Get the code

```bash
git clone https://github.com/3dyonic/Open-DS.git
```

```bash
cd Open-DS && git checkout RC1
```

```bash
pnpm install
```

pnpm may print a warning about ignored build scripts ("approve-builds"). It is safe to ignore; nothing in Open DS needs them.

## 3. Run everything at once

```bash
pnpm e2e
```

It builds the tokens, uses the CLI, deploys Dense data into a real Vite app and builds that app, deploys Multi-brand through the MCP server over stdio, then builds the site, runs the package test (below), and builds Storybook and the docs. Each step prints ✓ or ✗. `pnpm e2e:quick` skips the builds and the package test.

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

### The package, as a user gets it

This is how to test the published CLI before it is published. It packs the CLI with `npm pack` (the exact file npm would publish), copies the blank test app (`e2e/app`) to a temporary folder outside the repository, and runs the packed CLI there with `npx`, the way a user runs `npx open-ds init`. Then it type-checks and builds the app.

```bash
pnpm test:package
```

Each step prints ✓ or ✗. To keep the app and see it in a browser:

```bash
pnpm test:package --keep
```

It prints the app's folder. Then:

```bash
cd /tmp/open-ds-package-XXXX/app && npx vite
```

Use the folder it printed. Open the address Vite prints: you see the scheme's components (a card, a badge, a field, two buttons) in its tokens. In the same folder, read `AGENTS.md` (what an agent gets), `src/styles/open-ds.css` (every token), `src/components/ui/` (the components) and `docs/` (the design system's docs pages).

Try another scheme or brand:

```bash
pnpm test:package --keep --scheme multi-brand --brand coral
```

### MCP server with Claude Code

```bash
claude mcp add --scope user open-ds -- node "$(pwd)/cli/bin/open-ds.js" mcp
```

This runs `open-ds mcp` over stdio from your checkout (after publishing: `npx -y open-ds mcp`). For the hosted shape, run `pnpm --dir mcp start` and add `--transport http open-ds http://localhost:8787/mcp` instead. `--scope user` makes the server available in every folder, not only in Open-DS. Check it with `claude mcp list`. Then open Claude Code in any empty project folder and ask:

- "Which Open DS scheme fits an order management tool, and why?"
- "Take it into this project." (it answers with the `npx open-ds` command to run)
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

### Docs of a delivered design system

Docusaurus documents the design system a team gets when it takes a scheme: its reasons, voice and tone, a page per scope, the components, the themes and the agent layer. It builds one scheme at a time and wears that scheme's own fonts and colors.

```bash
pnpm --dir docs start
```

```bash
OPEN_DS_SCHEME=multi-brand pnpm --dir docs start
```

Open http://localhost:3000. If the site is still running on that port, Docusaurus asks whether to use another port: answer y. `/llms.txt` is the index for agents. The same pages land in a project with `open-ds init <scheme> --docs`.

The guide for Open DS itself (product, business, brand, CLI, MCP, contributing) is plain Markdown in `guide/`.

### The deployed app

```bash
pnpm --dir e2e/app dev
```

After `pnpm e2e`, this app runs with the Dense data scheme that the CLI deployed into it.

## 5. What is still a draft

All answers in the five schemes are drafts until you curate them. Nothing is published: no npm package and no public site.
