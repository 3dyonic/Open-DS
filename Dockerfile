# The hosted Open DS: the website and the MCP server, in one small Node image.
# Stage 1 builds the site and packs the CLI the way npm users get it.
FROM node:22-slim AS build
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate
COPY . .
RUN pnpm install --frozen-lockfile
# The site build runs the tokens build first.
RUN pnpm --dir site build
# npm pack runs the CLI's prepack, which bundles schemes, tokens, components and skills.
RUN mkdir /pkg && cd cli && npm pack --pack-destination /pkg

# Stage 2: only the packed CLI, the server and the built site.
FROM node:22-slim
ENV NODE_ENV=production PORT=8080 HOST=0.0.0.0 SITE_DIR=/srv/site
WORKDIR /srv
COPY --from=build /pkg/ /pkg/
RUN echo '{"name":"open-ds-host","private":true,"type":"module"}' > package.json \
  && npm install --omit=dev --no-audit --no-fund /pkg/*.tgz \
  && rm -rf /pkg
COPY mcp/server.mjs ./server.mjs
COPY --from=build /repo/site/out ./site
EXPOSE 8080
USER node
CMD ["node", "server.mjs"]
