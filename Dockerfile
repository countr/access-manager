FROM node:22-alpine@sha256:b2358485e3e33bc3a33114d2b1bdb18cdbe4df01bd2b257198eb51beb1f026c5 AS base

WORKDIR /app
ENV IS_DOCKER=true


# install prod dependencies

FROM base AS deps

# corepack has had issues with pnpm in earlier versions, and since we only use corepack to download pnpm then we can safely use the latest version
RUN apk --no-cache add g++ make python3 \
    && npm i -g corepack@latest \
    && corepack enable pnpm

COPY package.json pnpm-*.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --prod


# install all dependencies and build typescript

FROM deps AS ts-builder
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY ./src ./src
RUN pnpm run build


# production image

FROM base

COPY --from=deps /app/node_modules ./node_modules
COPY --from=ts-builder /app/build ./build

ENV NODE_ENV=production
COPY package.json .env* ./
ENTRYPOINT [ "npm", "run" ]
CMD [ "start" ]
