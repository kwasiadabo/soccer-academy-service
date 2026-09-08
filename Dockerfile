# Build context must be the monorepo root, since this workspace installs via npm workspaces:
#   docker build -f apps/api/Dockerfile -t soccer-academy-api .
#
# Requires (at container runtime, e.g. via `docker run -e` or compose `environment:`):
#   DATABASE_URL, JWT_ACCESS_SECRET (16+ chars), JWT_REFRESH_SECRET (16+ chars)
# — the app throws on boot without them (see src/config/env.validation.ts).
# Run `npx prisma migrate deploy` against the target database before first boot;
# this image does not run migrations itself.

FROM node:20-alpine AS deps
# Prisma's query engine binary is dynamically linked against libssl — without this,
# it fails at runtime with "Unable to require ...libquery_engine...node" on Alpine.
RUN apk add --no-cache openssl
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/api/prisma apps/api/prisma
RUN npm ci

FROM deps AS build
COPY apps/api apps/api
RUN npm run build --workspace=apps/api
RUN npm prune --omit=dev

FROM node:20-alpine AS runtime
RUN apk add --no-cache openssl tini
WORKDIR /repo/apps/api
ENV NODE_ENV=production
COPY --from=build /repo/node_modules /repo/node_modules
COPY --from=build /repo/apps/api/node_modules ./node_modules
COPY --from=build /repo/apps/api/package.json ./package.json
COPY --from=build /repo/apps/api/dist ./dist
COPY --from=build /repo/apps/api/prisma ./prisma
RUN mkdir -p uploads && chown -R node:node .
USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/docs').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# tini forwards signals (SIGTERM) and reaps zombies — plain `node` as PID 1 does neither.
ENTRYPOINT ["/sbin/tini", "--"]
# tsc has no `rootDir`, so it infers the common ancestor of src/ and prisma/seed.ts
# as the project root — the compiled entrypoint lands at dist/src/main.js, not dist/main.js.
CMD ["node", "dist/src/main"]
