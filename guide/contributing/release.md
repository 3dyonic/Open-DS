---
sidebar_position: 2
title: "Test, release and deploy"
description: "The GitHub Actions that test every change, publish the CLI on a release, and deploy open-ds.dev to Fly, with the secrets each one needs."
---

# Test, release and deploy

## The flow

1. Work on a feature branch from `RC1`. Open a PR into `RC1`.
2. `test` runs on the PR. Merge only when it is green.
3. When `RC1` is ready, open a PR from `RC1` into `master` and merge it the same way.
4. A push to `master` runs `test` again. When it passes, `deploy` ships open-ds.dev.
5. To publish the CLI, publish a GitHub release tagged `v<version>`. `publish` sends it to npmjs and GitHub Packages.

## Workflows

| Workflow         | Runs on                                          | What it does                                                                                                                                                                                                          |
| ---------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `test`           | Every PR; pushes to `RC1` and `master`           | Four jobs: `node` (lint, typecheck, `pnpm test`, the MCP host, the site build), `suites` (tokens, components, `pnpm harness`), `builds` (Storybook, docs), `package` (the packed CLI, `test:package`, `test:create`). |
| `deploy`         | `test` passing on a push to `master`, or by hand | Builds the Docker image on Fly and deploys the app `open-ds`, then checks `/health` and `/`.                                                                                                                          |
| `publish`        | A published release, or by hand with `dry_run`   | Checks that the tag matches `cli/package.json`, tests, then publishes `open-ds` to npmjs (with provenance) and `@3dyonic/open-ds` to GitHub Packages.                                                                 |
| `connect-domain` | By hand, once                                    | Adds Fly certificates for `open-ds.dev` and `www.open-ds.dev`, and creates the DNS-only CNAME records in Cloudflare.                                                                                                  |

## What runs on Fly

One app serves everything from one image:

- The website: the static export in `site/out`.
- The MCP server, Streamable HTTP, at `/mcp`.
- Health at `/health`.

The image installs the CLI from its own packed file, the way npm users get it. Then `mcp/server.mjs` serves the site and the MCP.

## Secrets

Add these in the repository settings, under Secrets and variables, then Actions.

| Secret                 | Used by                    | How to get it                                                                                                                                         |
| ---------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FLY_API_TOKEN`        | `deploy`, `connect-domain` | `fly tokens create org`. An org token can create the app on the first deploy; after that, a `fly tokens create deploy --app open-ds` token is enough. |
| `NPM_TOKEN`            | `publish`                  | An npmjs automation token from an account that can publish `open-ds`.                                                                                 |
| `CLOUDFLARE_API_TOKEN` | `connect-domain`           | A Cloudflare API token with Zone, DNS, Edit on the `open-ds.dev` zone.                                                                                |
| `CLOUDFLARE_ZONE_ID`   | `connect-domain`           | On the `open-ds.dev` overview page in Cloudflare.                                                                                                     |

GitHub Packages needs no secret: `publish` uses `GITHUB_TOKEN` with `packages: write`.

Without `FLY_API_TOKEN`, `deploy` says so and skips. Without `NPM_TOKEN`, `publish` skips npmjs and still publishes to GitHub Packages.

## The first deploy

1. Add `FLY_API_TOKEN`.
2. Run `deploy` by hand. It creates the Fly app `open-ds` if it does not exist. If that name is taken on Fly, change `app` in `fly.toml` and `APP` in the two workflows.
3. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ZONE_ID`, then run `connect-domain`.
4. When the certificates are issued, open-ds.dev serves the site and `https://open-ds.dev/mcp` the MCP.
