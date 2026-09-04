# Build context must be the monorepo root, since this workspace installs via npm workspaces:
#   docker build -f apps/api/Dockerfile -t soccer-academy-api .

FROM node:20-alpine AS deps
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
WORKDIR /repo/apps/api
ENV NODE_ENV=production
COPY --from=build /repo/node_modules /repo/node_modules
COPY --from=build /repo/apps/api/node_modules ./node_modules
COPY --from=build /repo/apps/api/package.json ./package.json
COPY --from=build /repo/apps/api/dist ./dist
COPY --from=build /repo/apps/api/prisma ./prisma
RUN mkdir -p uploads

EXPOSE 3000
CMD ["node", "dist/main"]
