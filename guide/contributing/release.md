---
sidebar_position: 2
title: "Test, release and deploy"
description: "The GitHub Actions that test every change and publish the CLI on a release, and how open-ds.dev is deployed from the private open-ds-ops repository."
---

# Test, release and deploy

## The flow

1. Work on a feature branch from `RC1`. Open a PR into `RC1`.
2. `test` runs on the PR. Merge only when it is green.
3. When `RC1` is ready, open a PR from `RC1` into `master` and merge it the same way.
4. A push to `master` runs `test` again. When it passes, `notify-ops` asks the private `open-ds-ops` repository to redeploy open-ds.dev.
5. To publish the CLI, run `pnpm release <patch|minor|major>` in a release PR, merge it to master, then publish a GitHub release tagged `v<version>`. `publish` sends it to npmjs and GitHub Packages.

## Versions

The version follows the public surface: what users and agents can notice.

- **Public surface:** each scheme's CSS variables, the component key ids, the scheme and brand ids, the CLI commands and the MCP tool names.
- **Major:** something is removed or renamed. While the major is 0, this is a minor.
- **Minor:** something is added and nothing breaks. While the major is 0, this is a patch.
- **Patch:** the same surface, with better behaviour: fixes, values, docs.

`cli/surface.json` holds the surface of the last release. Never change the version by hand:

```bash
pnpm release status
```

This shows what changed and the smallest bump it needs.

```bash
pnpm release patch
```

This bumps `cli/package.json` and updates the snapshot together; use `minor` or `major` the same way. It refuses a bump that is too small. Commit both files in one release PR. The harness (`release-surface`) and `publish` fail if they disagree.

## Workflows

| Workflow     | Runs on                                        | What it does                                                                                                                                                                                                                                                                  |
| ------------ | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `test`       | Every PR; pushes to `RC1` and `master`         | Four jobs: `node` (lint, typecheck, `pnpm test`, the MCP host, the site build), `suites` (tokens, components, `pnpm harness`), `builds` (Storybook, docs), `package` (the packed CLI, `test:package`, `test:create`).                                                         |
| `publish`    | A published release, or by hand with `dry_run` | Checks that the tag matches `cli/package.json`, tests, then publishes `open-ds` to npmjs (with provenance) and `@3dyonic/open-ds` to GitHub Packages. It builds the Figma kits plugin and attaches `open-ds-kits-plugin.zip` to the release (and keeps it as a run artifact). |
| `notify-ops` | `test` passing on a push to `master`           | Sends a `repository_dispatch` to `3dyonic/open-ds-ops`, which builds and deploys open-ds.dev from this commit.                                                                                                                                                                |

## Hosting lives in open-ds-ops

The open project holds the product; the private project holds private things. open-ds.dev (the website and the hosted MCP at `/mcp`) is deployed from the private `3dyonic/open-ds-ops` repository. It also holds the Fly config, the domain setup, and the private hosted parts: keys, key requests, admin and telemetry. Its image builds this repository's site and packed engine at a ref, so the product stays here.

To self-host the MCP with no key, run `npx open-ds mcp`, or `mcp/server.mjs` from a checkout.

## Secrets

Add these in the repository settings, under Secrets and variables, then Actions.

| Secret               | Used by                       | How to get it                                                                                                                                             |
| -------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NPM_TOKEN`          | `publish`, first version only | A short-lived npm granular token, only to create the package. After that, npm Trusted Publishing needs no token: delete it.                               |
| `OPS_DISPATCH_TOKEN` | `notify-ops`                  | A fine-grained GitHub token with access to `3dyonic/open-ds-ops` only, permission Contents: read and write. Without it, `notify-ops` skips with a notice. |

GitHub Packages needs no secret: `publish` uses `GITHUB_TOKEN` with `packages: write`.

npmjs uses Trusted Publishing: on npmjs.com, open the `open-ds` package, then Settings, Trusted Publisher, GitHub Actions, with `3dyonic`, `Open-DS` and the workflow `publish.yml`. npm then trusts this workflow, so no token is stored and every version gets provenance. Trusted Publishing can only be added to a package that exists, so the first version needs `NPM_TOKEN` once.
