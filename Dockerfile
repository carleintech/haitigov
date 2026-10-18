# syntax=docker/dockerfile:1.8

FROM node:26.12.0-bookworm-slim@sha256:298992629d69bbd5b2b03ad57094d8e4fcb3a8eeb7c4e25d29de656519568913 AS foundation

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
