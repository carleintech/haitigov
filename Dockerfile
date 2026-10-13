# syntax=docker/dockerfile:1.8

FROM node:26.11.1-bookworm-slim@sha256:86f07bc9c5dce4578cf37e5a418b7bfc7f817cda25cde66e2b66e95ed86c4567 AS foundation

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN apt-get update \
    && apt-get upgrade -y --no-install-recommends \
    && apt-get install -y --no-install-recommends ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*

RUN corepack disable \
    && npm install --global pnpm@12.6.0 \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
    && rm -f /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
    && pnpm --version

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps ./apps
COPY packages ./packages
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --offline

RUN DATABASE_URL=postgresql://haitigov:container-placeholder@127.0.0.1:5432/haitigov_validation \
    pnpm --filter @haitigov/database run db:generate

RUN DATABASE_URL=postgresql://haitigov:container-placeholder@127.0.0.1:5432/haitigov_validation \
    pnpm run build

# checkov:skip=CKV_DOCKER_2:This is a one-shot validation job, not a long-running service.
USER node

CMD ["pnpm", "run", "check"]
